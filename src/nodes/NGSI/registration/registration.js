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

const createRegistration = async function (param) {
  const options = {
    method: 'post',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: param.config.registration,
  };

  try {
    const res = await lib.http(options);
    if (res.status === 201) {
      return res.headers['location'].slice('/v2/registrations/'.length);
    } else {
      this.error(`Error while creating registration: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
    }
  } catch (error) {
    this.error(`Exception while creating registration: ${error}`);
    return null;
  }
  return null;
};

const deleteRegistration = async function (param) {
  const options = {
    method: 'delete',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
  };

  try {
    const res = await lib.http(options);
    if (res.status === 204) {
      return Number(res.status);
    } else {
      this.error(`Error while deleting registration: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
    }
    return null;
  } catch (error) {
    this.error(`Exception while deleting registration: ${error}`);
    return null;
  }
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (defaultConfig.actionType === 'payload') {
    if ('actionType' in msg.payload) {
      defaultConfig.actionType = msg.payload.actionType;
      if ('id' in msg.payload) {
        defaultConfig.id = msg.payload.id;
      }
      if ('registration' in msg.payload) {
        defaultConfig.registration = msg.payload.registration;
      }
    } else {
      this.error('actionType not found');
      return null;
    }
  } else {
    if (defaultConfig.actionType === 'create') {
      if (Array.isArray(msg.payload) || typeof msg.payload !== 'object') {
        this.error('payload not JSON object');
        return null;
      }
      defaultConfig.registration = msg.payload;
    } else if (defaultConfig.actionType === 'delete') {
      if (typeof msg.payload === 'string') {
        defaultConfig.id = msg.payload;
      } else {
        this.error('payload not string');
        return null;
      }
    }
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/registrations',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    contentType: 'json',
    config: defaultConfig,
  };

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  switch (defaultConfig.actionType) {
    case 'create':
      if (Array.isArray(defaultConfig.registration) || typeof defaultConfig.registration !== 'object') {
        this.error('registration not JSON object');
        return null;
      }
      param.func = createRegistration;
      break;
    case 'delete':
      if (typeof defaultConfig.id !== 'string') {
        this.error('registration id not string');
        return null;
      }
      param.func = deleteRegistration;
      param.pathname += '/' + param.config.id;
      delete param.contentType;
      break;
    default:
      this.error('ActionType error: ' + defaultConfig.actionType);
      return null;
  }

  return param;
};

module.exports = function (RED) {
  function NGSIRegistration(config) {
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
        id: config.registrationId.trim(),
        registration: {},
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        msg.payload = await param.func.call(node, param);
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI registration', NGSIRegistration);
};
