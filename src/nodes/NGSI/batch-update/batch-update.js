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

const opUpdate = async function (msg, param) {
  const options = {
    method: 'post',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: lib.encodeNGSI(param.config.data, param.config.forbidden)
  };

  try {
    const res = await lib.http(options);
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 204) {
      return;
    } else {
      this.error(`Error while updating entities: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
    }
  } catch (error) {
    this.error(`Exception while updating entities: ${error.message}`);
    msg.payload = { error: error.message };
    msg.statusCode = 500;
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
    actionType: config.actionType.trim(),
    data: {},
    keyValues: config.keyValues === 'true',
    overrideMetadata: config.overrideMetadata === 'true',
    forcedUpdate: config.forcedUpdate === 'true',
    flowControl: config.flowControl === 'true',
    forbidden: config.forbidden ? config.forbidden === 'true' : false
  };

  if (!msg.payload || !(typeof msg.payload === 'object')) {
    msg.payload = { error: 'payload not JSON Object' };
    return null;
  }

  if (defaultConfig.actionType === 'payload') {
    if (!('actionType' in msg.payload) || !('entities' in msg.payload)) {
      msg.payload = { error: 'actionType and/or entities missing' };
      return null;
    }
    defaultConfig.data.actionType = msg.payload.actionType;
    defaultConfig.data.entities = msg.payload.entities;
    const options = ['keyValues', 'overrideMetadata', 'forcedUpdate', 'flowControl', 'forbidden'];
    for (let i = 0; i < options.length; i++) {
      const e = options[i];
      if (msg.payload[e]) {
        if (typeof msg.payload[e] === 'boolean') {
          defaultConfig[e] = msg.payload[e];
        } else {
          msg.payload = { error: e + ' not boolean' };
          return null;
        }
      }
    }
  } else {
    if (Array.isArray(msg.payload)) {
      defaultConfig.data = {
        actionType: defaultConfig.actionType,
        entities: msg.payload
      };
    } else {
      defaultConfig.data = {
        actionType: defaultConfig.actionType,
        entities: [msg.payload]
      };
    }
  }

  const actionTypeList = ['append', 'appendStrict', 'update', 'replace', 'delete'];
  if (!actionTypeList.includes(defaultConfig.data.actionType)) {
    msg.payload = {
      error: 'ActionType error: ' + defaultConfig.data.actionType
    };
    return null;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/op/update',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    contentType: 'json',
    config: defaultConfig
  };

  return param;
};

module.exports = function (RED) {
  function NGSIBatchUpdate(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      const param = createParam.call(node, msg, config, openAPIsConfig);

      if (param) {
        await opUpdate.call(node, msg, param);
      } else {
        node.error(msg.payload.error);
        msg.statusCode = 500;
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('NGSI Batch update', NGSIBatchUpdate);
};
