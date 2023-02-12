/*
   MIT License

   Copyright 2022-2023 Kazuhito Suda

   This file is part of node-red-contrib-letsfiware-NGSI

   requests://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI

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
  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  if (param.config.actionType === 'update') {
    options.data = param.config.attribute;
  }

  try {
    const res = await lib.http(options);
    if (res.status === 200 && param.config.actionType === 'read') {
      return res.data;
    } else if (res.status === 204 && (param.config.actionType === 'update' || param.config.actionType === 'delete')) {
      return Number(res.status);
    } else {
      this.error(`Error while managing attribute: ${res.status} ${res.statusText}`);
      return null;
    }
  } catch (error) {
    this.error(`Exception while managing attribute: ${error}`);
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
    if ('actionType' in msg.payload) {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    } else {
      this.error('actionType not found');
      return;
    }
  } else {
    if (defaultConfig.actionType === 'update') {
      defaultConfig.attribute = msg.payload;
    } else {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    }
  }

  if (defaultConfig.id === '') {
    this.error('Entity id not found');
    return null;
  }

  if (defaultConfig.attrName === '') {
    this.error('attrName not found');
    return null;
  }

  const options = ['skipForwarding', 'overrideMetadata', 'forcedUpdate', 'flowControl'];

  for (let i = 0; i < options.length; i++) {
    if (typeof defaultConfig[options[i]] !== 'boolean') {
      this.error(options[i] + ' not boolean');
      return null;
    }
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/entities/' + defaultConfig.id + '/attrs/' + defaultConfig.attrName,
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
  };

  switch (defaultConfig.actionType) {
    case 'read':
      param.method = 'get';
      delete defaultConfig.attribute;
      delete defaultConfig.overrideMetadata;
      delete defaultConfig.forcedUpdate;
      delete defaultConfig.flowControl;
      break;
    case 'update':
      param.method = 'put';
      delete defaultConfig.metadata;
      delete defaultConfig.skipForwarding;
      break;
    case 'delete':
      param.method = 'delete';
      delete defaultConfig.metadata;
      delete defaultConfig.skipForwarding;
      delete defaultConfig.overrideMetadata;
      delete defaultConfig.forcedUpdate;
      delete defaultConfig.flowControl;
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
  function NGSIAttribute(config) {
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
        attrName: config.attrName.trim(),
        metadata: config.metadata.trim(),
        skipForwarding: config.skipForwarding === 'true',
        overrideMetadata: config.overrideMetadata === 'true',
        forcedUpdate: config.forcedUpdate === 'true',
        flowControl: config.flowControl === 'true',
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        const result = await httpRequest.call(node, param);
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI Attribute', NGSIAttribute);
};
