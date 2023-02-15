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

const httpRequest = async function (param) {
  let totalCount = param.config.totalCount;
  const limit = param.config.limit;
  let page = param.config.page;
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
        if (totalCount <= 0) {
          totalCount = Number(res.headers['fiware-total-count']);
          if (isNaN(totalCount)) {
            return res.data;
          }
          if (totalCount <= 0) {
            break;
          }
        }
        types = types.concat(res.data);
        page++;
      } else {
        this.error(`Error while managing entity: ${res.status} ${res.statusText}`);
        return null;
      }
    } catch (error) {
      this.error(`Exception while managing entity: ${error}`);
      return null;
    }
  } while (page * limit < totalCount);

  return types;
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (msg.payload && typeof msg.payload === 'string') {
    defaultConfig.type = msg.payload;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/types/' + defaultConfig.type,
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    config: defaultConfig,
  };

  if (defaultConfig.type === '') {
    param.pathname = param.pathname.slice(0, -1);
  } else {
    defaultConfig.values = false;
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
        type: config.type.trim(),
        values: config.values === 'true',
        noAttrDetail: config.noAttrDetail === 'true',
        totalCount: 0,
        limit: 100,
        page: 0,
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      const result = await httpRequest.call(node, param);
      if (result) {
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI Types', NGSITypes);
};
