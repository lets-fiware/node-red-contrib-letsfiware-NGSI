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

const updateAttrs = async function (msg, param) {
  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config)
  };

  options.data = lib.encodeNGSI(param.config.attributes, param.config.forbidden);

  try {
    const res = await lib.http(options);
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 204) {
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

const createParam = function (msg, config, openAPIsConfig) {
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
    keyValues: config.keyValues === 'true',
    overrideMetadata: config.overrideMetadata === 'true',
    forcedUpdate: config.forcedUpdate === 'true',
    flowControl: config.flowControl === 'true',
    forbidden: config.forbidden ? config.forbidden === 'true' : false,
    append: false
  };

  if (!msg.payload) {
    msg.payload = { error: 'payload is empty' };
    return null;
  }

  if (typeof msg.payload !== 'object' || Array.isArray(msg.payload)) {
    msg.payload = { error: 'payload not JSON object' };
    return null;
  }

  if (defaultConfig.actionType === 'payload') {
    if ('actionType' in msg.payload && 'attributes' in msg.payload) {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    } else {
      msg.payload = { error: 'actionType and/or attributes not found' };
      return null;
    }
  } else {
    defaultConfig.attributes = msg.payload;
  }

  if (defaultConfig.id === '') {
    msg.payload = { error: 'Entity id not found' };
    return null;
  }

  const options = ['keyValues', 'overrideMetadata', 'forcedUpdate', 'flowControl', 'forbidden'];

  for (let i = 0; i < options.length; i++) {
    if (typeof defaultConfig[options[i]] !== 'boolean') {
      msg.payload = { error: options[i] + ' not boolean' };
      return null;
    }
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/entities/' + defaultConfig.id + '/attrs',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig)
  };

  switch (defaultConfig.actionType) {
    case 'append':
      param.method = 'post';
      defaultConfig.append = true;
      break;
    case 'upsert':
      param.method = 'post';
      delete defaultConfig.append;
      break;
    case 'update':
      param.method = 'patch';
      delete defaultConfig.append;
      break;
    case 'replace':
      param.method = 'put';
      delete defaultConfig.append;
      break;
    default:
      msg.payload = { error: 'ActionType error: ' + defaultConfig.actionType };
      return null;
  }

  param.config = defaultConfig;

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  return param;
};

module.exports = function (RED) {
  function NGSIAttributes(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      const param = createParam.call(node, msg, config, openAPIsConfig);

      if (param) {
        await updateAttrs.call(node, msg, param);
      } else {
        node.error(msg.payload.error);
        msg.statusCode = 500;
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('NGSI Attributes', NGSIAttributes);
};
