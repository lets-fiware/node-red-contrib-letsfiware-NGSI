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

const typeConversion = function (value, forbidden) {
  if (typeof value === 'object') {
    return lib.decodeNGSI(value, forbidden);
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'null') {
    return null;
  }
  if (!isNaN(value)) {
    return Number(value);
  }
  if (typeof value === 'string') {
    return forbidden ? lib.decodeforbiddenChar(value) : value;
  }

  return value;
};

const attrValue = async function (msg, param) {
  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config)
  };

  if (typeof param.config.value !== 'undefined') {
    options.data = lib.encodeNGSI(param.config.value, param.config.forbidden);
  }

  try {
    const res = await lib.http(options);
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 200 && param.config.actionType === 'read') {
      msg.payload = typeConversion(res.data, param.config.forbidden);
    } else if (res.status === 204 && param.config.actionType === 'update') {
      return;
    } else {
      this.error(`Error while managing attribute value: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
    }
  } catch (error) {
    this.error(`Exception while managing attribute value: ${error.message}`);
    msg.payload = { error: error.message };
    msg.statusCode = 500;
  }
};

function createParam(msg, config, openAPIsConfig) {
  if (openAPIsConfig.geType !== 'orion') {
    msg.payload = { error: 'FIWARE GE type not Orion' };
    return null;
  }

  let defaultConfig = {
    service: openAPIsConfig.service.trim(),
    servicepath: config.servicepath.trim(),
    actionType: config.actionType,
    id: config.entityId.trim(),
    type: config.entityType.trim(),
    attrName: config.attrName.trim(),
    skipForwarding: config.skipForwarding === 'true',
    forcedUpdate: config.forcedUpdate === 'true',
    flowControl: config.flowControl === 'true',
    forbidden: config.forbidden ? config.forbidden === 'true' : false
  };

  if (defaultConfig.actionType === 'payload') {
    if (msg.payload !== null && typeof msg.payload === 'object' && !Array.isArray(msg.payload) && 'actionType' in msg.payload) {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    } else {
      msg.payload = { error: 'actionType not found' };
      return null;
    }
  } else {
    if (defaultConfig.actionType === 'read') {
      ['id', 'type', 'attrName', 'skipForwarding'].forEach((e) => {
        if (e in msg.payload) {
          defaultConfig[e] = msg.payload[e];
        }
      });
    } else {
      defaultConfig.value = msg.payload;
    }
  }

  if (defaultConfig.id === '') {
    msg.payload = { error: 'Entity id not found' };
    return null;
  }

  if (defaultConfig.attrName === '') {
    msg.payload = { error: 'Attribute name not found' };
    return null;
  }

  const options = ['skipForwarding', 'forcedUpdate', 'flowControl', 'forbidden'];

  for (let i = 0; i < options.length; i++) {
    if (typeof defaultConfig[options[i]] !== 'boolean') {
      msg.payload = { error: options[i] + ' not boolean' };
      return null;
    }
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/entities/' + defaultConfig.id + '/attrs/' + defaultConfig.attrName + '/value',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig)
  };

  switch (defaultConfig.actionType) {
    case 'read':
      param.method = 'get';
      delete defaultConfig.value;
      delete defaultConfig.forcedUpdate;
      delete defaultConfig.flowControl;
      break;
    case 'update':
      param.method = 'put';
      if (!('value' in defaultConfig)) {
        msg.payload = { error: 'Attribute value not found' };
        return null;
      }
      param.contentType = typeof defaultConfig.value === 'object' || Array.isArray(defaultConfig.value) ? 'application/json' : 'text/plain';
      switch (typeof defaultConfig.value) {
        case 'boolean':
        case 'number':
          defaultConfig.value = '' + defaultConfig.value;
          break;
        case 'string':
          defaultConfig.value = '"' + defaultConfig.value + '"';
          break;
        case 'object':
          if (defaultConfig.value === null) {
            defaultConfig.value = '' + defaultConfig.value;
            param.contentType = 'text/plain';
          }
      }
      delete defaultConfig.skipForwarding;
      break;
    default:
      msg.payload = { error: 'ActionType error: ' + defaultConfig.actionType };
      return null;
  }

  param.config = defaultConfig;

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  return param;
}

module.exports = function (RED) {
  function NGSIAttributeValue(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      const param = createParam(msg, config, openAPIsConfig);

      if (param) {
        await attrValue.call(node, msg, param);
      } else {
        node.error(msg.payload.error);
        msg.statusCode = 500;
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('NGSI Attribute value', NGSIAttributeValue);
};
