/*
   MIT License

   Copyright 2022-2024 Kazuhito Suda

   This file is part of node-red-contrib-letsfiware-NGSI

   https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
 */

'use strict';

const lib = require('../../../lib.js');

const getEntities = async function (msg, param) {
  let totalCount = 0;
  param.config.count = true;

  do {
    const options = {
      method: 'get',
      baseURL: param.host,
      url: param.pathname,
      headers: await lib.buildHTTPHeader(param),
      params: lib.buildParams(param.config)
    };

    try {
      const res = await lib.http(options);
      if (res.status === 200) {
        param.buffer.send(lib.decodeNGSI(res.data, param.config.forbidden));
        if (res.data.length === 0) {
          break;
        }
        param.config.offset += param.config.limit;
        if (totalCount <= 0) {
          totalCount = Number(res.headers['fiware-total-count']);
          if (totalCount <= 0) {
            break;
          }
        }
      } else {
        this.error(`Error while retrieving entities: ${res.status} ${res.statusText}`);
        if (res.data && res.data.description) {
          this.error(`Details: ${res.data.description}`);
        }
        msg.payload = res.data;
        msg.statusCode = Number(res.status);
        this.send(msg);
        break;
      }
    } catch (error) {
      this.error(`Exception while retrieving entities: ${error.message}`);
      msg.payload = { error: error.message };
      msg.statusCode = 500;
      this.send(msg);
      break;
    }
  } while (param.config.offset < totalCount);

  param.buffer.close();
};

const nobuffering = {
  node: null,
  msg: null,
  open: function (node, msg) {
    this.node = node;
    this.msg = msg;
    return this;
  },
  send: function (entities) {
    const message = Object.assign({}, this.msg);
    message.payload = entities;
    message.statusCode = 200;
    this.node.send(message);
  },
  close: function () {},
  out: function (entities) {
    const message = Object.assign({}, this.msg);
    message.payload = entities;
    message.statusCode = 200;
    this.node.send(message);
  }
};

const buffering = {
  node: null,
  msg: null,
  entities: [],
  open: function (node, msg) {
    this.node = node;
    this.msg = msg;
    this.entities = [];
    return this;
  },
  send: function (entities) {
    this.entities = this.entities.concat(entities);
  },
  close: function () {
    this.msg.payload = this.entities;
    this.msg.statusCode = 200;
    this.node.send(this.msg);
  },
  out: function (entities) {
    this.entities = this.entities.concat(entities);
  }
};

const createParam = function (msg, config, openAPIsConfig) {
  if (openAPIsConfig.geType !== 'orion') {
    msg.payload = { error: 'FIWARE GE type not Orion' };
    return null;
  }

  let defaultConfig = {
    service: openAPIsConfig.service.trim(),
    servicepath: config.servicepath.trim(),
    buffering: config.buffering === 'on',
    keyValues: config.mode !== 'normalized',
    type: config.entitytype.trim(),
    idPattern: config.idpattern.trim(),
    attrs: config.attrs.trim(),
    q: config.query.trim(),
    limit: 100,
    offset: 0,
    forbidden: config.forbidden ? config.forbidden === 'true' : false
  };

  if (!msg.payload) {
    msg.payload = { error: 'payload is null' };
    return null;
  }

  if (typeof msg.payload === 'string') {
    msg.payload = { idPattern: msg.payload.trim() };
  }

  if (typeof msg.payload === 'object' && Array.isArray(msg.payload)) {
    msg.payload = { error: 'payload not string or JSON Object' };
    return null;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/entities',
    buffer: defaultConfig.buffering ? buffering.open(this, msg) : nobuffering.open(this, msg),
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    config: Object.assign(defaultConfig, msg.payload)
  };

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  return param;
};

module.exports = function (RED) {
  function NGSISource(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      const param = createParam.call(node, msg, config, openAPIsConfig);

      if (param) {
        await getEntities.call(node, msg, param);
      } else {
        node.error(msg.payload.error);
        msg.statusCode = 500;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI source', NGSISource);
};
