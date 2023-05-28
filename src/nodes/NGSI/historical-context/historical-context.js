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

const buildParams = function (config) {
  const params = new URLSearchParams();

  if (typeof config.entityType !== 'undefined' && config.entityType !== '') {
    params.set('type', config.entityType);
  }

  if (config.dataType === 'raw') {
    if (typeof config.lastN !== 'undefined' && config.lastN !== null) {
      params.set('lastN', config.lastN);
    }

    if (typeof config.hLimit !== 'undefined' && config.hLimit !== null) {
      params.set('hLimit', config.hLimit);
    }

    if (typeof config.hOffset !== 'undefined' && config.hOffset !== null) {
      params.set('hOffset', config.hOffset);
    }

    if (typeof config.count !== 'undefined' && config.count === 'true') {
      params.set('count', config.count);
    }
  } else if (['ave', 'max', 'sum', 'sum2', 'occur'].includes(config.dataType)) {
    params.set('aggrMethod', config.dataType === 'ave' ? 'sum' : config.dataType);
    if (typeof config.aggrPeriod !== 'undefined' && config.aggrPeriod !== '') {
      params.set('aggrPeriod', config.aggrPeriod);
    }
  }

  if (typeof config.dateFrom !== 'undefined' && config.dateFrom !== '') {
    params.set('dateFrom', config.dateFrom);
  }

  if (typeof config.dateTo !== 'undefined' && config.dateTo !== '') {
    params.set('dateTo', config.dateTo);
  }

  return params;
};

const getHistoricalContext = async function (msg, param) {
  const options = {
    method: 'get',
    baseURL: param.host,
    url: param.pathname + '/' + param.config.entityId + '/attrs/' + param.config.attrName,
    headers: await lib.buildHTTPHeader(param),
    params: buildParams(param.config)
  };

  try {
    const res = await lib.http(options);
    msg.payload = lib.decodeNGSI(res.data, param.config.forbidden);
    msg.statusCode = Number(res.status);
    if (res.status === 200) {
      const count = res.headers['fiware-total-count'] ? res.headers['fiware-total-count'] : null;
      return [res.data, count];
    } else {
      this.error(`Error while retrieving historical context: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
      return [null, null];
    }
  } catch (error) {
    this.error(`Exception while retrieving historical context: ${error.message}`);
    msg.payload = { error: error.message };
    msg.statusCode = 500;
    return [null, null];
  }
};

const validateConfig = function (msg, config) {
  if (!Object.keys(config).length) {
    msg.payload = { error: 'Parameter empty' };
    return false;
  }
  if (config.entityId === '') {
    msg.payload = { error: 'Entity Id missing' };
    return false;
  }
  if (config.entityType === '') {
    msg.payload = { error: 'Entity type missing' };
    return false;
  }
  if (config.attrName === '') {
    msg.payload = { error: 'Attribute name missing' };
    return false;
  }
  if (!['raw', 'max', 'sum', 'sum2', 'ave', 'occur'].includes(config.dataType)) {
    msg.payload = { error: 'Data type error: ' + config.dataType };
    return false;
  }
  if (config.dataType === 'raw') {
    if (config.lastN === null && config.hLimit === null && config.hOffset === null) {
      msg.payload = { error: 'lastN or a set of hLimit and hOffset missing' };
      return false;
    }
    if (config.lastN === null && (config.hLimit === null || config.hOffset === null)) {
      msg.payload = { error: 'Must be a set of hLimit and hOffset' };
      return false;
    }
    if (config.lastN !== null && (config.hLimit !== null || config.hOffset !== null)) {
      msg.payload = {
        error: 'Must specify lastN or a set of hLimit and hOffset'
      };
      return false;
    }
    const items = ['lastN', 'hLimit', 'hOffset'];
    for (let i = 0; i < items.length; i++) {
      if (config[items[i]] !== null) {
        if (isNaN(config[items[i]])) {
          msg.payload = { error: config[items[i]] + ' not number' };
          return false;
        }
      }
    }
  } else {
    if (!['month', 'day', 'hour', 'minute', 'second'].includes(config.aggrPeriod)) {
      msg.payload = { error: 'AggrPeriod error: ' + config.aggrPeriod };
      return false;
    }
  }
  return true;
};

const calculateAverage = function (data) {
  data.value.forEach((e) => {
    e.points.forEach((e) => {
      e.ave = e.samples === 0 ? 0 : e.sum / e.samples;
    });
  });
  return data;
};

const createParam = function (msg, config, openAPIsConfig) {
  if (!msg.payload) {
    msg.payload = {};
  } else if (typeof msg.payload === 'string') {
    msg.payload = JSON.parse(msg.payload);
  }

  if (openAPIsConfig.geType !== 'comet') {
    msg.payload = { error: 'FIWARE GE type not Comet' };
    return null;
  }

  const defaultConfig = {
    entityId: config.entityid.trim(),
    attrName: config.attrname.trim(),
    entityType: config.entitytype.trim(),
    dataType: config.datatype.trim(),
    lastN: config.lastn === '' ? null : parseInt(config.lastn.trim(), 10),
    hLimit: config.hlimit === '' ? null : parseInt(config.hlimit.trim(), 10),
    hOffset: config.hoffset === '' ? null : parseInt(config.hoffset.trim(), 10),
    aggrPeriod: config.aggrperiod.trim(),
    dateFrom: config.datefrom.trim(),
    fromUnit: config.fromunit.trim(),
    dateTo: config.dateto.trim(),
    toUnit: config.tounit.trim(),
    outputType: config.outputtype,
    count: config.count === 'true' ? 'true' : 'false',
    forbidden: config.forbidden ? config.forbidden === 'true' : false
  };

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/STH/v2/entities',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    config: Object.assign(defaultConfig, msg.payload)
  };

  const dt = new Date();
  let errmsg;
  [param.config.dateFrom, errmsg] = lib.convertDateTime.call(this, dt, param.config.dateFrom, param.config.fromUnit);
  if (param.config.dateFrom === null) {
    msg.payload = { error: errmsg };
    return null;
  }
  [param.config.dateTo, errmsg] = lib.convertDateTime.call(this, dt, param.config.dateTo, param.config.toUnit);
  if (param.config.dateTo === null) {
    msg.payload = { error: errmsg };
    return null;
  }

  if (!validateConfig(msg, param.config)) {
    return null;
  }

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), config.servicepath.trim());

  return param;
};

module.exports = function (RED) {
  function HistoricalContext(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      const param = createParam.call(node, msg, config, openAPIsConfig);

      if (param) {
        let [historical, count] = await getHistoricalContext.call(node, msg, param);

        if (historical) {
          if (param.config.dataType === 'ave') {
            historical = calculateAverage(historical);
          }
          switch (param.config.outputType) {
            case 'value':
              historical = historical.value;
              break;
            case 'dashboard':
              historical.entityId = param.config.entityId;
              historical.attrName = param.config.attrName;
              historical.entityType = param.config.entityType;
              historical.dataType = param.config.dataType;
              break;
          }
          msg.payload = historical;
          msg = lib.updateContext(msg, param.config.service, param.config.servicepath, count);
        } else {
          delete msg.context;
        }
      } else {
        node.error(msg.payload.error);
        msg.statusCode = 500;
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('Historical Context', HistoricalContext);
};
