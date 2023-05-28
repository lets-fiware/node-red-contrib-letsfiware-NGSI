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

/* eslint-env node, mocha */

'use strict';

require('babel-register')({
  plugins: ['babel-plugin-rewire']
});

const { assert } = require('chai');

const historicalNode = require('../../src/nodes/NGSI/historical-context/historical-context.js');
const MockRed = require('./helpers/mockred.js');

describe('historical-context.js', () => {
  describe('buildParams', () => {
    it('Empty param', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = {};
      const actual = buildParams(param);

      assert.equal(actual.toString(), '');
    });
    it('type, dataType, lastN', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = { entityType: 'T1', dataType: 'raw', lastN: 5 };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&lastN=5');
    });
    it('type, dataType, hLimit, hOffset', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = {
        entityType: 'T1',
        dataType: 'raw',
        hLimit: 10,
        hOffset: 0
      };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&hLimit=10&hOffset=0');
    });
    it('type, dataType, count', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = { entityType: 'T1', dataType: 'raw', count: 'true' };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&count=true');
    });
    it('type, dataType, aggrMethod, aggrPeriod', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = { entityType: 'T1', dataType: 'sum', aggrPeriod: 'month' };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&aggrMethod=sum&aggrPeriod=month');
    });
    it('type, dataType, aggrMethod', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = { entityType: 'T1', dataType: 'sum' };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&aggrMethod=sum');
    });
    it('type, dataType, aggrMethod, aggrPeriod', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = { entityType: 'T1', dataType: 'sum2', aggrPeriod: 'day' };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&aggrMethod=sum2&aggrPeriod=day');
    });
    it('type, dataType, aggrMethod, aggrPeriod', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = { entityType: 'T1', dataType: 'ave', aggrPeriod: 'month' };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&aggrMethod=sum&aggrPeriod=month');
    });
    it('type, dataType, dateFrom, dateTo', () => {
      const buildParams = historicalNode.__get__('buildParams');
      const param = {
        entityType: 'T1',
        dataType: 'raw',
        dateFrom: '2023-01-01T12:34:56.000Z',
        dateTo: '2023-01-01T12:34:56.111Z'
      };
      const actual = buildParams(param);

      assert.equal(actual.toString(), 'type=T1&dateFrom=2023-01-01T12%3A34%3A56.000Z&dateTo=2023-01-01T12%3A34%3A56.111Z');
    });
  });
  describe('getHistoricalContext', () => {
    afterEach(() => {
      historicalNode.__ResetDependency__('lib');
    });
    it('get HistoricalContext', async () => {
      historicalNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: {},
            data: { type: 'StructuredValue', value: [] }
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getHistoricalContext = historicalNode.__get__('getHistoricalContext');

      const param = {
        host: 'http://comet:8666',
        pathname: '/STH/v2/entities',
        config: {
          entityType: 'T1',
          dataType: 'raw',
          lastN: 5
        }
      };

      const msg = {};
      const actual = await getHistoricalContext(msg, param);

      assert.deepEqual(actual, [{ type: 'StructuredValue', value: [] }, null]);
      assert.deepEqual(msg, {
        payload: {
          type: 'StructuredValue',
          value: []
        },
        statusCode: 200
      });
    });
    it('get HistoricalContext with count', async () => {
      historicalNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: { 'fiware-total-count': 10 },
            data: { type: 'StructuredValue', value: [] }
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getHistoricalContext = historicalNode.__get__('getHistoricalContext');

      const param = {
        host: 'http://comet:8666',
        pathname: '/STH/v2/entities',
        config: {
          entityType: 'T1',
          dataType: 'raw',
          lastN: 5
        }
      };

      const msg = {};
      const actual = await getHistoricalContext(msg, param);

      assert.deepEqual(actual, [{ type: 'StructuredValue', value: [] }, 10]);
      assert.deepEqual(msg, {
        payload: {
          type: 'StructuredValue',
          value: []
        },
        statusCode: 200
      });
    });
    it('should be 400 Bad Request', async () => {
      historicalNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getHistoricalContext = historicalNode.__get__('getHistoricalContext');

      const param = {
        host: 'http://comet:8666',
        pathname: '/STH/v2/entities',
        config: {
          entityType: 'T1',
          dataType: 'raw',
          lastN: 5
        }
      };

      let errmsg = '';
      const node = {
        msg: '',
        error: (e) => {
          errmsg = e;
        }
      };

      const msg = {};
      const actual = await getHistoricalContext.call(node, msg, param);

      assert.deepEqual(actual, [null, null]);
      assert.equal(errmsg, 'Error while retrieving historical context: 400 Bad Request');
      assert.deepEqual(msg, {
        payload: undefined,
        statusCode: 400
      });
    });
    it('should be 400 Bad Request with description', async () => {
      historicalNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 400,
            statusText: 'Bad Request',
            data: { description: 'error' }
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getHistoricalContext = historicalNode.__get__('getHistoricalContext');

      const param = {
        host: 'http://comet:8666',
        pathname: '/STH/v2/entities',
        config: {
          entityType: 'T1',
          dataType: 'raw',
          lastN: 5
        }
      };

      let errmsg = [];
      const node = {
        msg: '',
        error: (e) => {
          errmsg.push(e);
        }
      };

      const msg = {};
      const actual = await getHistoricalContext.call(node, msg, param);

      assert.deepEqual(actual, [null, null]);
      assert.deepEqual(errmsg, ['Error while retrieving historical context: 400 Bad Request', 'Details: error']);
      assert.deepEqual(msg, {
        payload: {
          description: 'error'
        },
        statusCode: 400
      });
    });
    it('Should be unknown error', async () => {
      historicalNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getHistoricalContext = historicalNode.__get__('getHistoricalContext');

      const param = {
        host: 'http://comet:8666',
        pathname: '/STH/v2/entities',
        config: {
          entityType: 'T1',
          dataType: 'raw',
          lastN: 5
        }
      };

      let errmsg = '';
      const node = {
        msg: '',
        error: (e) => {
          errmsg = e;
        }
      };

      const msg = {};
      const actual = await getHistoricalContext.call(node, msg, param);

      assert.deepEqual(actual, [null, null]);
      assert.equal(errmsg, 'Exception while retrieving historical context: unknown error');
      assert.deepEqual(msg, {
        payload: {
          error: 'unknown error'
        },
        statusCode: 500
      });
    });
  });
  describe('validateConfig', () => {
    it('entityType, dateType, raw', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = {
        entityType: 'T1',
        dataType: 'raw',
        lastN: 5,
        hLimit: null,
        hOffset: null
      };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, true);
      assert.deepEqual(msg, {});
    });
    it('Empty param', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = {};

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'Parameter empty' } });
    });
    it('Entity Id missing', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = { entityId: '' };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'Entity Id missing' } });
    });
    it('Entity type missing', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = { entityType: '' };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'Entity type missing' } });
    });
    it('Attrname missing', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = { attrName: '' };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'Attribute name missing' } });
    });
    it('Data type error', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = { dataType: 'sum3' };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'Data type error: sum3' } });
    });
    it('lastN or a set of hLimit and hOffset missing', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = {
        dataType: 'raw',
        lastN: null,
        hLimit: null,
        hOffset: null
      };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, {
        payload: { error: 'lastN or a set of hLimit and hOffset missing' }
      });
    });
    it('Must be a set of hLimit and hOffset', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = {
        dataType: 'raw',
        lastN: null,
        hLimit: '2',
        hOffset: null
      };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, {
        payload: { error: 'Must be a set of hLimit and hOffset' }
      });
    });
    it('Must specify lastN or a set of hLimit and hOffset', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = { dataType: 'raw', lastN: '1', hLimit: '2', hOffset: '3' };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, {
        payload: { error: 'Must specify lastN or a set of hLimit and hOffset' }
      });
    });
    it('NaN', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = {
        dataType: 'raw',
        lastN: 'a',
        hLimit: null,
        hOffset: null
      };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'a not number' } });
    });
    it('AggrPeriod error', () => {
      const validateConfig = historicalNode.__get__('validateConfig');
      const param = { dataType: 'sum', aggrPeriod: 'year' };

      const msg = {};
      const actual = validateConfig(msg, param);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'AggrPeriod error: year' } });
    });
  });
  describe('calculateAverage', () => {
    it('Empty value', () => {
      const calculateAverage = historicalNode.__get__('calculateAverage');
      const value = {
        type: 'StructuredValue',
        value: [
          {
            _id: {
              attrName: 'temperature',
              origin: '2023-01-01T00:00:00.000Z',
              resolution: 'month'
            },
            points: [
              {
                offset: 1,
                samples: 20,
                sum: 100
              },
              {
                offset: 1,
                samples: 0,
                sum: 0
              }
            ]
          }
        ]
      };

      const actual = calculateAverage(value);

      const expected = {
        type: 'StructuredValue',
        value: [
          {
            _id: {
              attrName: 'temperature',
              origin: '2023-01-01T00:00:00.000Z',
              resolution: 'month'
            },
            points: [
              {
                offset: 1,
                samples: 20,
                sum: 100,
                ave: 5
              },
              {
                offset: 1,
                samples: 0,
                sum: 0,
                ave: 0
              }
            ]
          }
        ]
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('createParam', () => {
    it('raw', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'raw',
        count: 'false'
      };
      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'raw',
        count: 'false',
        forbidden: false
      });
    });
    it('raw with payload null', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'raw',
        count: 'false',
        forbidden: 'false'
      };
      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: () => {
          return '9352111f14465d8cf32d8875c16e2f5991257430';
        },
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'raw',
        count: 'false',
        forbidden: false
      });
    });
    it('raw with payload string', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'raw',
        count: 'false',
        forbidden: 'false'
      };
      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'raw',
        count: 'false',
        forbidden: false
      });
    });
    it('value', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'value',
        count: 'false',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'value',
        count: 'false',
        forbidden: false
      });
    });
    it('ave', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ave',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: 'month',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'value',
        count: 'false',
        forbidden: 'false'
      };
      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'ave',
        aggrPeriod: 'month',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'value',
        count: 'false',
        forbidden: false
      });
    });
    it('dashboard', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'dashboard',
        count: 'false',
        forbidden: false
      });
    });
    it('count', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '',
        hlimit: '3',
        hoffset: '0',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'true',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: null,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: 3,
        hOffset: 0,
        outputType: 'dashboard',
        count: 'true',
        forbidden: false
      });
    });
    it('historical is null', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '',
        hlimit: '3',
        hoffset: '0',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: null,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: 3,
        hOffset: 0,
        outputType: 'dashboard',
        count: 'false',
        forbidden: false
      });
    });
    it('GE Type error', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false'
      };
      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'orion'
      };

      const actual = createParam(msg, config, openapis);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Comet' } });
    });
    it('datefrom not Number', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ngsi',
        lastn: '',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: 'abc',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'dateTime not Number' } });
    });
    it('dateto not Number', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ngsi',
        lastn: '',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: 'abc',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'dateTime not Number' } });
    });
    it('param error', async () => {
      const createParam = historicalNode.__get__('createParam');

      const msg = {};
      const config = {
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ngsi',
        lastn: '',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false'
      };

      const openapis = {
        apiEndpoint: 'http://comet:8666',
        service: 'openiot',
        getToken: null,
        geType: 'comet'
      };

      const actual = createParam(msg, config, openapis);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Data type error: ngsi' } });
    });
  });
  describe('Historical Context node', () => {
    afterEach(() => {
      historicalNode.__ResetDependency__('getHistoricalContext');
    });
    it('raw', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'raw',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        };
        msg.statusCode = 200;

        return [msg.payload, null];
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        },
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: null
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'raw',
        count: 'false',
        forbidden: false
      });
    });
    it('raw with payload null', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'raw',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: () => {
            return '9352111f14465d8cf32d8875c16e2f5991257430';
          },
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        };
        msg.statusCode = 200;
        return [msg.payload, null];
      });

      await red.inputWithAwait({ payload: null });

      const expected = {
        payload: {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        },
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: null
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'raw',
        count: 'false',
        forbidden: false
      });
    });
    it('raw with payload string', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'raw',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        };
        msg.statusCode = 200;
        return [msg.payload, null];
      });

      await red.inputWithAwait({ payload: '{}' });

      const expected = {
        payload: {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        },
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: null
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'raw',
        count: 'false',
        forbidden: false
      });
    });
    it('value', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'value',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        };
        msg.statusCode = 200;
        return [msg.payload, null];
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: [
          {
            _id: '63d115bb5f63eb554d85a13b',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 20.6,
            recvTime: '2023-01-25T11:42:51.143Z'
          },
          {
            _id: '63d115bd5f63eb554d85a141',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 20.6,
            recvTime: '2023-01-25T11:42:53.143Z'
          },
          {
            _id: '63d115bf5f63eb554d85a147',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 20.6,
            recvTime: '2023-01-25T11:42:55.145Z'
          }
        ],
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: null
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'value',
        count: 'false',
        forbidden: false
      });
    });
    it('ave', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ave',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: 'month',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'value',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: {
                attrName: 'temperature',
                origin: '2023-01-01T00:00:00.000Z',
                resolution: 'month'
              },
              points: [
                {
                  offset: 1,
                  samples: 2,
                  sum: 100
                }
              ]
            }
          ]
        };
        msg.statusCode = 200;
        return [msg.payload, null];
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: [
          {
            _id: {
              attrName: 'temperature',
              origin: '2023-01-01T00:00:00.000Z',
              resolution: 'month'
            },
            points: [
              {
                offset: 1,
                samples: 2,
                sum: 100,
                ave: 50
              }
            ]
          }
        ],
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: null
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'ave',
        aggrPeriod: 'month',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'value',
        count: 'false',
        forbidden: false
      });
    });
    it('dashboard', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        };
        msg.statusCode = 200;
        return [msg.payload, null];
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ],
          entityId: 'E',
          attrName: 'A1',
          entityType: 'T1',
          dataType: 'raw'
        },
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: null
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: 3,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: null,
        hOffset: null,
        outputType: 'dashboard',
        count: 'false',
        forbidden: false
      });
    });
    it('count', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '',
        hlimit: '3',
        hoffset: '0',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'true',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ]
        };
        msg.statusCode = 200;
        return [msg.payload, 10];
      });

      await red.inputWithAwait({ payload: {}, context: {} });

      const expected = {
        payload: {
          type: 'StructuredValue',
          value: [
            {
              _id: '63d115bb5f63eb554d85a13b',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:51.143Z'
            },
            {
              _id: '63d115bd5f63eb554d85a141',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:53.143Z'
            },
            {
              _id: '63d115bf5f63eb554d85a147',
              attrName: 'temperature',
              attrType: 'Number',
              attrValue: 20.6,
              recvTime: '2023-01-25T11:42:55.145Z'
            }
          ],
          entityId: 'E',
          attrName: 'A1',
          entityType: 'T1',
          dataType: 'raw'
        },
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: 10
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: null,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: 3,
        hOffset: 0,
        outputType: 'dashboard',
        count: 'true',
        forbidden: false
      });
    });
    it('historical is null', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '',
        hlimit: '3',
        hoffset: '0',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      let actual;
      historicalNode.__set__('getHistoricalContext', (msg, param) => {
        actual = param;
        msg.payload = null;
        msg.statusCode = 400;
        return [null, null];
      });

      await red.inputWithAwait({ payload: {}, context: {} });

      assert.deepEqual(red.getOutput(), { payload: null, statusCode: 400 });
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        entityType: 'T1',
        entityId: 'E',
        attrName: 'A1',
        lastN: null,
        dataType: 'raw',
        aggrPeriod: '',
        dateFrom: '',
        fromUnit: '',
        dateTo: '',
        toUnit: '',
        hLimit: 3,
        hOffset: 0,
        outputType: 'dashboard',
        count: 'false',
        forbidden: false
      });
    });
    it('GE Type error', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'raw',
        lastn: '3',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'FIWARE GE type not Comet');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'FIWARE GE type not Comet' },
        statusCode: 500
      });
    });
    it('datefrom not Number', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ngsi',
        lastn: '',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: 'abc',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'dateTime not Number');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'dateTime not Number' },
        statusCode: 500
      });
    });
    it('dateto not Number', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ngsi',
        lastn: '',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: 'abc',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: false,

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'dateTime not Number');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'dateTime not Number' },
        statusCode: 500
      });
    });
    it('param error', async () => {
      const red = new MockRed();
      historicalNode(red);
      red.createNode({
        servicepath: '/',
        entityid: 'E',
        entitytype: 'T1',
        attrname: 'A1',
        datatype: 'ngsi',
        lastn: '',
        hlimit: '',
        hoffset: '',
        aggrperiod: '',
        datefrom: '',
        fromunit: '',
        dateto: '',
        tounit: '',
        outputtype: 'dashboard',
        count: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:8666',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'Data type error: ngsi');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'Data type error: ngsi' },
        statusCode: 500
      });
    });
  });
});
