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
  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  if (param.config.actionType === 'create' || param.config.actionType === 'upsert') {
    options.data = param.config.entity;
  }

  try {
    const res = await lib.http(options);
    if (res.status === 200 && param.config.actionType === 'read') {
      return res.data;
    } else if (res.status === 201 && param.config.actionType === 'create') {
      return Number(res.status);
    } else if (res.status === 204 && (param.config.actionType === 'upsert' || param.config.actionType === 'delete')) {
      return Number(res.status);
    } else {
      this.error(`Error while managing entity: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
      return null;
    }
  } catch (error) {
    this.error(`Exception while managing entity: ${error}`);
    return null;
  }
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (!msg.payload) {
    this.error('payload is null');
    return;
  }

  if (typeof msg.payload === 'string') {
    defaultConfig.id = msg.payload;
    msg.payload = {};
  } else if (typeof msg.payload !== 'object' || Array.isArray(msg.payload)) {
    this.error('payload not JSON Object');
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
    if (defaultConfig.actionType === 'create' || defaultConfig.actionType === 'upsert') {
      defaultConfig.entity = msg.payload;
    } else {
      defaultConfig = Object.assign(defaultConfig, msg.payload);
    }
  }

  if (defaultConfig.id === '' && (defaultConfig.actionType === 'read' || defaultConfig.actionType === 'delete')) {
    this.error('Entity id not found');
    return null;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/entities',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    config: defaultConfig,
  };

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  switch (param.config.actionType) {
    case 'create':
      param.method = 'post';
      delete param.config.id;
      delete param.config.type;
      delete param.config.attrs;
      delete param.config.dateModified;
      break;
    case 'read':
      param.method = 'get';
      param.pathname += '/' + param.config.id;
      if (param.config.dateModified === true) {
        if (param.config.attrs === '') {
          param.config.attrs = 'dateModified,*';
        } else {
          param.config.attrs += ',dateModified';
        }
        param.config.metadata = 'dateModified,*';
      }
      break;
    case 'upsert':
      param.method = 'post';
      param.config.upsert = true;
      delete param.config.id;
      delete param.config.type;
      delete param.config.attrs;
      delete param.config.dateModified;
      break;
    case 'delete':
      param.method = 'delete';
      param.pathname += '/' + param.config.id;
      delete param.config.attrs;
      delete param.config.keyValues;
      delete param.config.dateModified;
      break;
    default:
      this.error('ActionType error: ' + param.config.actionType);
      return null;
  }



  return param;
};

module.exports = function (RED) {
  function NGSIEntity(config) {
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
        attrs: config.attrs.trim(),
        keyValues: config.keyValues === 'true',
        dateModified: config.dateModified === 'true',
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        const result = await httpRequest.call(node, param);
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI Entity', NGSIEntity);
};
