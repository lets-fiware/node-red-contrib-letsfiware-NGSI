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

const opUpdate = async function (param, msg) {
  const options = {
    method: 'post',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: param.config.data,
  };

  try {
    const res = await lib.http(options);
    if (res.status === 204) {
      msg.payload = 204;
    } else {
      msg.payload = null;
      this.error(`Error while updating entities: ${res.status} ${res.statusText}`);
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
    }
    this.send(msg);
    return res;
  } catch (error) {
    msg.payload = null;
    this.error(`Exception while updating entities: ${error}`);
    this.send(msg);
    return;
  }
};

module.exports = function (RED) {
  function NGSIBatchUpdate(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      let data = msg.payload;
      if (!data) {
        node.error('payload missing');
        return;
      } else if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      if (typeof data !== 'object') {
        node.error('payload not JSON Object');
        return;
      }

      const actionType = config.actiontype;

      if (Array.isArray(data)) {
        data = {
          actionType: actionType,
          entities: data,
        };
      } else {
        if (data.id && data.type) {
          data = {
            actionType: actionType,
            entities: [data],
          };
        } else if (!data.actionType || !data.entities) {
          node.error('actionType and/or entities missing');
          return;
        }
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        data: data,
      };

      const param = {
        host: openAPIsConfig.apiEndpoint,
        pathname: '/v2/op/update',
        getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
        contentType: 'json',
        config: defaultConfig,
      };

      await opUpdate.call(node, param, msg);
    });
  }
  RED.nodes.registerType('NGSI Batch update', NGSIBatchUpdate);
};
