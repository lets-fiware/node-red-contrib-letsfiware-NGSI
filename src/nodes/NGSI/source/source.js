/*
   MIT License

   Copyright 2022 Kazuhito Suda

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

const getEntities = async function (param) {
  let page = param.config.page;
  let count = param.config.count;
  const limit = param.config.limit;

  do {
    const options = {
      method: 'get',
      baseURL: param.host,
      url: param.pathname,
      headers: await lib.buildHTTPHeader(param),
      params: lib.buildSearchParams(param.config),
    };

    try {
      const res = await lib.http(options);
      if (res.status === 200) {
        if (count <= 0) {
          count = Number(res.headers['fiware-total-count']);
          if (count <= 0) {
            break;
          }
        }
        param.buffer.send(res.data);
        page++;
      } else {
        this.error(`Error while retrieving entities: ${res.status} ${res.statusText}`);
        break;
      }
    } catch (error) {
      this.error(`Exception while retrieving entities: ${error}`);
      break;
    }
  } while (page * limit < count);

  param.buffer.close();
};

const nobuffering = {
  node: null,
  open: function (node) {
    this.node = node;
    return this;
  },
  send: function (entities) {
    this.node.send({ payload: entities });
  },
  close: function () {},
  out: function (entities) {
    this.node.send({ payload: entities });
  },
};

const buffering = {
  node: null,
  entities: [],
  open: function (node) {
    this.node = node;
    this.entities = [];
    return this;
  },
  send: function (entities) {
    this.entities = this.entities.concat(entities);
  },
  close: function () {
    if (this.entities.length > 0) {
      this.node.send({ payload: this.entities });
    }
  },
  out: function (entities) {
    this.node.send({ payload: entities });
  },
};

module.exports = function (RED) {
  function NGSISource(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      if (!msg.payload) {
        msg.payload = {};
      } else if (typeof msg.payload === 'string') {
        msg.payload = { idPattern: msg.payload.trim() };
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        keyValues: config.mode !== 'normalized',
        type: config.entitytype.trim(),
        idPattern: config.idpattern.trim(),
        attrs: config.attrs.trim(),
        q: config.query.trim(),
        count: 0,
        limit: 100,
        page: 0,
      };

      const param = {
        host: openAPIsConfig.brokerEndpoint,
        pathname: '/v2/entities',
        buffer: config.buffering === 'off' ? nobuffering.open(node):buffering.open(node),
        getToken: openAPIsConfig.getToken,
        config: Object.assign(defaultConfig, msg.payload),
      };

      await getEntities.call(node, param);
    });
  }
  RED.nodes.registerType('NGSI source', NGSISource);
};
