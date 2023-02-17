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

const opUpdate = async function (param) {
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
      return Number(res.status);
    } else {
      this.error(`Error while updating entities: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${JSON.stringify(res.data.description)}`);
      }
      return null;
    }
  } catch (error) {
    this.error(`Exception while updating entities: ${error}`);
    return null;
  }
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (!msg.payload || !(typeof msg.payload === 'object')) {
    this.error('payload not JSON Object');
    return null;
  }

  if (defaultConfig.actionType === 'payload') {
    if (!('actionType' in msg.payload) || !('entities' in msg.payload)) {
      this.error('actionType and/or entities missing');
      return null;
    }
    defaultConfig.data.actionType = msg.payload.actionType;
    defaultConfig.data.entities = msg.payload.entities;
    const options = ['keyValues', 'overrideMetadata', 'forcedUpdate', 'flowControl'];
    for (let i = 0; i < options.length; i++) {
      const e = options[i];
      if (msg.payload[e]) {
        if (typeof msg.payload[e] === 'boolean') {
          defaultConfig[e] = msg.payload[e];
        } else {
          this.error(e + ' not boolean');
          return null;
        }
      }
    }
  } else {
    if (Array.isArray(msg.payload)) {
      defaultConfig.data = {
        actionType: defaultConfig.actionType,
        entities: msg.payload,
      };
    } else {
      defaultConfig.data = {
        actionType: defaultConfig.actionType,
        entities: [msg.payload],
      };
    }
  }

  const actionTypeList = ['append', 'appendStrict', 'update', 'replace', 'delete'];
  if (!actionTypeList.includes(defaultConfig.data.actionType)) {
    this.error('ActionType error: ' + defaultConfig.data.actionType);
    return null;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/op/update',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    contentType: 'json',
    config: defaultConfig,
  };

  return param;
};

module.exports = function (RED) {
  function NGSIBatchUpdate(config) {
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
        data: {},
        keyValues: config.keyValues === 'true',
        overrideMetadata: config.overrideMetadata === 'true',
        forcedUpdate: config.forcedUpdate === 'true',
        flowControl: config.flowControl === 'true',
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        const result = await opUpdate.call(node, param);
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI Batch update', NGSIBatchUpdate);
};