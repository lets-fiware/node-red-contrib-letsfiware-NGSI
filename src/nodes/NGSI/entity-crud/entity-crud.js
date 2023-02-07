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

const crudEntity = async function (param) {

  const options = {
    method: param.method,
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  if (typeof param.config.data !== 'undefined') {
    options.data = param.config.data;
  }

  try {
    const res = await lib.http(options);
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 201 && param.config.actionType === 'create') {
      return res.status;
    } else if (res.status === 204 && (param.config.actionType === 'upsert' || param.config.actionType === 'delete')) {
      return res.status;
    } else {
      this.error(`Error while managing entity: ${res.status} ${res.statusText}`);
      return null;
    }
  } catch (error) {
    this.error(`Exception while managing entity: ${error}`);
    return null;
  }
};

function createParam(msg, defaultConfig, openAPIsConfig) {
  if (Object.prototype.hasOwnProperty.call(msg.payload, 'actionType')) {
    switch (msg.payload.actionType) {
    case 'create':
    case 'upsert':
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'entity')) {
        defaultConfig.actionType = msg.payload.actionType;
        defaultConfig.data = msg.payload.entity;
        if (Object.prototype.hasOwnProperty.call(msg.payload, 'keyValues')) {
          defaultConfig.keyValues = msg.payload.keyValues;
        }
      } else {
        defaultConfig.data = msg.payload;
      } 
      break;
    case 'read':
    case 'delete':
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'id')) {
        defaultConfig.actionType = msg.payload.actionType;
        defaultConfig.id = msg.payload.id;
      }
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'type')) {
        defaultConfig.type = msg.payload.type;
      }
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'keyValues')) {
        defaultConfig.keyValues = msg.payload.keyValues;
      }
      break;
    }
  } else {
    switch (defaultConfig.actionType) {
    case 'create':
    case 'upsert':
      defaultConfig.data = msg.payload;
      break;
    case 'read':
    case 'delete':
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'id')) {
        defaultConfig.id = msg.payload.id;
      }
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'type')) {
        defaultConfig.type = msg.payload.type;
      }
      if (Object.prototype.hasOwnProperty.call(msg.payload, 'keyValues')) {
        defaultConfig.keyValues = msg.payload.keyValues;
      }
      break;
    }
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
    break;
  case 'read':
    if (param.config.id === '') {
      this.error('Entity id not found');
      return null;
    }
    param.method = 'get';
    param.pathname += '/' + param.config.id;
    break;
  case 'upsert':
    param.method = 'post';
    param.config.upsert = true;
    delete param.config.id;
    delete param.config.type;
    break;
  case 'delete':
    if (param.config.id === '') {
      this.error('Entity id not found');
      return null;
    }
    param.method = 'delete';
    param.pathname += '/' + param.config.id;
    delete param.config.keyValues;
    break;
  default:
    this.error('ActionType error: ' + param.config.actionType);
    return null;
  }

  return param;
}

module.exports = function (RED) {
  function NGSIEntityCRUD(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      if (openAPIsConfig.geType !== 'orion') {
        node.error('FIWARE GE type not Orion');
        return;
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        actionType: config.actiontype,
        id: config.entityid.trim(),
        type: config.entitytype.trim(),
        keyValues: config.mode !== 'normalized',
      };

      if (!msg.payload) {
        node.error('payload is null');
        return;
      }

      if (typeof msg.payload === 'string') {
        defaultConfig.id = msg.payload;
        msg.payload = {};
      } else if (typeof msg.payload !== 'object' || Array.isArray(msg.payload)) {
        node.error('payload not JSON Object');
        return;
      }

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        const result = await crudEntity.call(node, param);
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI Entity CRUD', NGSIEntityCRUD);
};
