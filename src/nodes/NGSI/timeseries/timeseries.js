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
    method: 'get',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  try {
    const res = await lib.http(options);
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 404) {
      return [];
    } else {
      this.error(`Error while retrieving timeseries context: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${JSON.stringify(res.data.description)}`);
      }
      return null;
    }
  } catch (error) {
    this.error(`Exception while retrieving timeseries context: ${error}`);
    return null;
  }
};

const paramsString = ['id', 'type', 'attrName', 'aggrMethod', 'aggrPeriod', 'fromDate', 'fromUnit', 'toDate', 'toUnit', 'georel', 'geometry', 'coords'];
const paramsNumber = ['lastN', 'offset', 'limit'];
const actionTypeList = ['entities', 'entity', 'type', 'attribute'];

const validateConfig = function (config) {
  for (let i = 0; i < paramsString.length; i++) {
    const e = paramsString[i];
    if (typeof config[e] !== 'string') {
      this.error(e + ' not String');
      return false;
    }
  }

  for (let i = 0; i < paramsNumber.length; i++) {
    const e = paramsNumber[i];
    if (config[e] !== '' && isNaN(config[e])) {
      this.error(e + ' not Number');
      return false;
    }
  }

  if (typeof config.value !== 'boolean') {
    this.error('value not Boolean');
    return false;
  }

  if (!actionTypeList.includes(config.actionType)) {
    this.error('actionType error: ' + config.actionType);
    return false;
  }

  if (config.actionType === 'entity' && config.id === '') {
    this.error('id required');
    return false;
  }

  if (config.actionType === 'type' && config.type === '') {
    this.error('type required');
    return false;
  }

  if (config.georel !== '' && config.geometry === '') {
    this.error('geometry required if georel is specified');
    return false;
  }

  if (config.georel !== '' && config.coords === '') {
    this.error('coords required if georel is specified');
    return false;
  }

  if (config.attrName === '') {
    config.aggrMethod = '';
    config.aggrPeriod = '';
  }

  if (config.lastN !== '') {
    config.fromDate = '';
    config.toDate = '';
  }

  return true;
};

const createParam = function (msg, defaultConfig, openAPIsConfig) {
  if (!msg.payload || typeof msg.payload !== 'object' || Array.isArray(msg.payload)) {
    this.error('payload not JSON Object');
    return null;
  }

  if (defaultConfig.actionType === 'payload') {
    if ('actionType' in msg.payload) {
      defaultConfig.actionType = msg.payload.actionType;
    } else {
      this.error('actionType not found');
      return null;
    }
  }

  paramsString.forEach(e => {
    if (msg.payload[e]) {
      defaultConfig[e] = msg.payload[e];
    }
  });

  paramsNumber.forEach(e => {
    if (msg.payload[e]) {
      defaultConfig[e] = msg.payload[e];
    }
  });

  if (msg.payload.value) {
    defaultConfig.value = msg.payload.value;
  }

  if (!validateConfig.call(this, defaultConfig)) {
    return null;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    config: defaultConfig,
  };

  const dt = new Date();
  param.config.fromDate = lib.convertDateTime.call(this, dt, param.config.fromDate, param.config.fromUnit);
  if (param.config.fromDate === null) {
    return null;
  }
  param.config.toDate = lib.convertDateTime.call(this, dt, param.config.toDate, param.config.toUnit);
  if (param.config.toDate === null) {
    return null;
  }

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  switch (param.config.actionType) {
    case 'entities':
      param.pathname += '/entities';
      param.config.value = false;
      break;
    case 'entity':
      param.pathname += '/entities/' + param.config.id;
      if (param.config.attrName !== '') {
        param.pathname += '/attrs/' + param.config.attrName;
      }
      break;
    case 'type':
      param.pathname += '/types/' + param.config.type;
      if (param.config.attrName !== '') {
        param.pathname += '/attrs/' + param.config.attrName;
      }
      break;
    case 'attribute':
      param.pathname += '/attrs';
      if (param.config.attrName !== '') {
        param.pathname += '/' + param.config.attrName;
      }
      break;
  }

  if (param.config.value) {
    param.pathname += '/value';
  }
  delete param.config.value;

  return param;
};

module.exports = function (RED) {
  function NGSITimeseries(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      if (openAPIsConfig.geType !== 'quantumleap') {
        node.error('FIWARE GE type not Quantumleap');
        return;
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        actionType: config.actionType,
        id: config.entityId.trim(),
        type: config.entityType.trim(),
        attrName: config.attribute.trim(),
        aggrMethod: config.aggrMethod.trim(),
        aggrPeriod: config.aggrPeriod.trim(),
        lastN: config.lastN.trim(),
        fromDate: config.fromDate.trim(),
        fromUnit: config.fromUnit.trim(),
        toDate: config.toDate.trim(),
        toUnit: config.toUnit.trim(),
        georel: config.georel.trim(),
        geometry: config.geometry.trim(),
        coords: config.coords.trim(),
        value: config.value === 'true',
        limit: config.limit.trim(),
        offset: config.offset.trim(),
      };

      const param = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      if (param) {
        const result = await httpRequest.call(node, param);
        msg.payload = result;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('NGSI timeseries', NGSITimeseries);
};
