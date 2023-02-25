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

const updateAttrs = async function (param) {
  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  options.data = param.config.attributes;

  try {
    const res = await lib.http(options);
    if (res.status === 204) {
      return res.status;
    } else {
      this.error(`Error while managing attribute value: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
      return null;
    }
  } catch (error) {
    this.error(`Exception while managing attribute value: ${error}`);
    return null;
  }
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (!msg.payload) {
    this.error('payload is empty');
    return;
  }

  if (typeof msg.payload !== 'object' || Array.isArray(msg.payload)) {
    this.error('payload not JSON object');
    return;
  }

  if (defaultConfig.actionType === 'payload') {
    if ('actionType' in msg.payload && 'attributes' in msg.payload) {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    } else {
      this.error('actionType and/or attributes not found');
      return;
    }
  } else {
    defaultConfig.attributes = msg.payload;
  }

  if (defaultConfig.id === '') {
    this.error('Entity id not found');
    return null;
  }

  const options = ['keyValues', 'overrideMetadata', 'forcedUpdate', 'flowControl'];

  for (let i = 0; i < options.length; i++) {
    if (typeof defaultConfig[options[i]] !== 'boolean') {
      this.error(options[i] + ' not boolean');
      return null;
    }
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/entities/' + defaultConfig.id + '/attrs',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
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
      this.error('ActionType error: ' + defaultConfig.actionType);
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
      if (openAPIsConfig.geType !== 'orion') {
        node.error('FIWARE GE type not Orion');
        return;
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        actionType: config.actionType,
        id: config.entityId.trim(),
        type: config.entityType.trim(),
        keyValues: config.keyValues === 'true',
        overrideMetadata: config.overrideMetadata === 'true',
        forcedUpdate: config.forcedUpdate === 'true',
        flowControl: config.flowControl === 'true',
        append: false,
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        const result = await updateAttrs.call(node, param);
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI Attributes', NGSIAttributes);
};
