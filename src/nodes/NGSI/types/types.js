/*
   MIT License

   Copyright 2022-2023 Kazuhito Suda

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

const getTypes = async function (param) {
  let totalCount = 0;
  param.config.count = true;

  let types = [];

  do {
    const options = {
      method: param.method,
      baseURL: param.host,
      url: param.pathname,
      headers: await lib.buildHTTPHeader(param),
      params: lib.buildParams(param.config),
    };

    try {
      const res = await lib.http(options);
      if (res.status === 200) {
        if (res.data.length === 0) {
          break;
        }
        types = types.concat(res.data);
        param.config.offset += param.config.limit;
        if (totalCount <= 0) {
          totalCount = Number(res.headers['fiware-total-count']);
          if (totalCount <= 0) {
            break;
          }
        }
      } else {
        this.error(`Error while retrieving entity types: ${res.status} ${res.statusText}`);
        if (res.data && res.data.description) {
          this.error(`Details: ${res.data.description}`);
        }
        return null;
      }
    } catch (error) {
      this.error(`Exception while retrieving entity types: ${error}`);
      return null;
    }
  } while (param.config.offset < totalCount);

  return types;
};

const getType = async function (param) {
  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  try {
    const res = await lib.http(options);
    if (res.status === 200) {
      return res.data;
    } else {
      this.error(`Error while retrieving entity type: ${res.status} ${res.statusText}`);
      return null;
    }
  } catch (error) {
    this.error(`Exception while retrieving entity type: ${error}`);
    return null;
  }
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (defaultConfig.actionType === 'payload') {
    if ('actionType' in msg.payload) {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    } else {
      this.error('actionType not found');
      return;
    }
  } else {
    if (defaultConfig.actionType === 'type' && typeof msg.payload === 'string' && msg.payload !== '') {
      defaultConfig.type = msg.payload;
    }
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/types',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    config: defaultConfig,
  };

  if (defaultConfig.actionType === 'types') {
    param.func = getTypes;
  } else if (defaultConfig.actionType === 'type') {
    param.func = getType;
    if (typeof defaultConfig.type !== 'string') {
      this.error('type not string');
      return;
    }
    param.pathname += '/' + defaultConfig.type;
  } else {
    this.error('ActionType error: ' + defaultConfig.actionType);
    return null;
  }

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  return param;
};

module.exports = function (RED) {
  function NGSITypes(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      if (openAPIsConfig.geType !== 'orion') {
        node.error('FIWARE GE type not Orion');
        return;
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        actionType: config.actionType.trim(),
        type: config.entityType.trim(),
        values: config.values === 'true',
        noAttrDetail: config.noAttrDetail === 'true',
        limit: 20,
        offset: 0,
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);
      if (param) {
        const result = await param.func.call(node, param);
        if (result) {
          msg.payload = result;
          node.send(msg);
        }
      }
    });
  }
  RED.nodes.registerType('NGSI Types', NGSITypes);
};
