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

const timeseriesNode = require('../../src/nodes/NGSI/timeseries/timeseries.js');
const MockRed = require('./helpers/mockred.js');

describe('timeseries.js', () => {
  describe('httpRequest', () => {
    afterEach(() => {
      timeseriesNode.__ResetDependency__('lib');
    });
    it('get timeseries', async () => {
      timeseriesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: [
            {
              'entityId': 'urn:ngsi-ld:WeatherObserved:sensor001',
              'entityType': 'Sensor',
              'index': '2023-02-19T10:37:15.797+00:00'
            }
          ]
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = timeseriesNode.__get__('httpRequest');

      const param = {
        host: 'http://quantumleap:8668',
        pathname: '/v2/entities',
        config: {},
      };

      const msg = {};
      await httpRequest(msg, param);

      const expected = [
        {
          'entityId': 'urn:ngsi-ld:WeatherObserved:sensor001',
          'entityType': 'Sensor',
          'index': '2023-02-19T10:37:15.797+00:00'
        }
      ];
      assert.deepEqual(msg, { payload: expected, statusCode: 200 });
    });
    it('empty respose', async () => {
      timeseriesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 404,
          headers: {},
          data: [],
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = timeseriesNode.__get__('httpRequest');

      const param = {
        host: 'http://quantumleap:8668',
        pathname: '/v2/entities',
        config: {},
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.deepEqual(msg, { payload: [], statusCode: 404 });
    });
    it('should be 400 Bad Request', async () => {
      timeseriesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = timeseriesNode.__get__('httpRequest');

      const param = {
        host: 'http://quantumleap:8668',
        pathname: '/v2/entities',
        config: {},
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Error while retrieving timeseries context: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('should be 400 Bad Request with details', async () => {
      timeseriesNode.__set__('lib', {
        http: async () => Promise.resolve(
          {
            status: 400,
            statusText: 'Bad Request',
            data: { description: 'error' },
          }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = timeseriesNode.__get__('httpRequest');

      const param = {
        host: 'http://quantumleap:8668',
        pathname: '/v2/entities',
        config: {},
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Details: error');
      assert.deepEqual(msg, { payload: { description: 'error' }, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      timeseriesNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = timeseriesNode.__get__('httpRequest');

      const param = {
        host: 'http://quantumleap:8668',
        pathname: '/STH/v2/entities',
        config: {
          entityType: 'T1',
          dataType: 'raw',
          lastN: 5
        }
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Exception while retrieving timeseries context: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('validateConfig', () => {
    it('Entities', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entities',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, true);
      assert.deepEqual(msg, {});
    });
    it('attrName empty', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entities',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: 'sum',
        aggrPeriod: 'day',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, true);
      assert.deepEqual(msg, {});
    });
    it('lastN', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entities',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: 5,
        fromDate: '2023-02-19T02:45:59.044Z',
        fromUnit: '',
        toDate: '2023-02-19T02:45:59.044Z',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, true);
      assert.deepEqual(msg, {});
    });
    it('not String', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entities',
        id: {},
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'id not String' } });
    });
    it('not Number', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entities',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: {},
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'lastN not Number' } });
    });
    it('not Boolean', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entities',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: {},
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'value not Boolean' } });
    });
    it('actionType error', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'create',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'actionType error: create' } });
    });
    it('id required', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entity',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'id required' } });
    });
    it('type required', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'type',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'type required' } });
    });
    it('geometry required if georel is specified', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entity',
        id: 'E',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: 'georel',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'geometry required if georel is specified' } });
    });
    it('', () => {
      const validateConfig = timeseriesNode.__get__('validateConfig');
      const config = {
        actionType: 'entity',
        id: 'E',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: 'georel',
        geometry: 'geo:distance',
        coords: '',
        value: false,
        limit: '',
        offset: '',
      };

      const msg = {};
      const actual = validateConfig(msg, config);

      assert.equal(actual, false);
      assert.deepEqual(msg, { payload: { error: 'coords required if georel is specified' } });
    });
  });
  describe('createParam', () => {
    it('entities - pyaload', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: { actionType: 'entities' } };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'true',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'entities',
          id: '',
          type: '',
          attrName: '',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('param', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: { value: true, aggrMethod: 'sum', aggrPeriod: 'day', lastN: 5 } };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'entities',
        entityId: '',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'entities',
          id: '',
          type: '',
          attrName: 'A',
          aggrMethod: 'sum',
          aggrPeriod: 'day',
          lastN: 5,
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('entities', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'entities',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'entities',
          id: '',
          type: '',
          attrName: '',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('entity', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'entity',
        entityId: 'E',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/entities/E',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'entity',
          id: 'E',
          type: '',
          attrName: '',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('entity attr', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'entity',
        entityId: 'E',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/entities/E/attrs/A',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'entity',
          id: 'E',
          type: '',
          attrName: 'A',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('type', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'type',
        entityId: '',
        entityType: 'T',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/types/T',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'type',
          id: '',
          type: 'T',
          attrName: '',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('type attrs', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'type',
        entityId: '',
        entityType: 'T',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/types/T/attrs/A',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'type',
          id: '',
          type: 'T',
          attrName: 'A',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('attribute', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'attribute',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/attrs',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'attribute',
          id: '',
          type: '',
          attrName: '',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('attribute attrs', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'attribute',
        entityId: '',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/attrs/A',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'attribute',
          id: '',
          type: '',
          attrName: 'A',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('attribute attrs value', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'attribute',
        entityId: '',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'true',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/attrs/A/value',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'attribute',
          id: '',
          type: '',
          attrName: 'A',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '',
          fromUnit: '',
          toDate: '',
          toUnit: '',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('fromDate, toDate', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'attribute',
        entityId: '',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '2023-02-19T10:49:39.647Z',
        fromUnit: 'ISO8601',
        toDate: '2023-02-19T10:49:39.647Z',
        toUnit: 'ISO8601',
        georel: '',
        geometry: '',
        coords: '',
        value: 'true',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      actual.getToken = null;

      const expected = {
        host: 'quantumleap:8668',
        pathname: '/v2/attrs/A/value',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'attribute',
          id: '',
          type: '',
          attrName: 'A',
          aggrMethod: '',
          aggrPeriod: '',
          lastN: '',
          fromDate: '2023-02-19T10:49:39.647Z',
          fromUnit: 'ISO8601',
          toDate: '2023-02-19T10:49:39.647Z',
          toUnit: 'ISO8601',
          georel: '',
          geometry: '',
          coords: '',
          limit: '',
          offset: '',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Quantumleap', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: [] };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Quantumleap' } });
    });
    it('payload not JSON Object', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: [] };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload not JSON Object' } });
    });
    it('actionType not found', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'actionType not found' } });
    });
    it('geometry required if georel is specified', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'entities',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: 'georel',
        geometry: '',
        coords: '',
        value: 'true',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'geometry required if georel is specified' } });
    });
    it('fromDate err', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'attribute',
        entityId: '',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: 'abc',
        fromUnit: 'day',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'true',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'dateTime not Number' } });
    });
    it('toDate err', () => {
      const createParam = timeseriesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'attribute',
        entityId: '',
        entityType: '',
        attribute: 'A',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: 'abc',
        toUnit: 'day',
        georel: '',
        geometry: '',
        coords: '',
        value: 'true',
        limit: '',
        offset: '',
      };
      const openAPIsConfig = { geType: 'quantumleap', apiEndpoint: 'quantumleap:8668', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'dateTime not Number' } });
    });
  });
  describe('NGSI timeseries node', () => {
    afterEach(() => {
      timeseriesNode.__ResetDependency__('httpRequest');
    });
    it('Entities', async () => {
      const red = new MockRed();
      timeseriesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'entities',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: 'false',
        limit: '',
        offset: '',

        openapis: {
          apiEndpoint: 'http://quantumleap:8668',
          service: 'openiot',
          getToken: null,
          geType: 'quantumleap'
        }
      });

      let actual;
      timeseriesNode.__set__('httpRequest', (msg, param) => {
        actual = param;
        msg.payload = [
          {
            'entityId': 'urn:ngsi-ld:WeatherObserved:sensor001',
            'entityType': 'Sensor',
            'index': '2023-02-19T10:37:15.797+00:00'
          }
        ];
        msg.statusCode = 200;
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: [
          {
            'entityId': 'urn:ngsi-ld:WeatherObserved:sensor001',
            'entityType': 'Sensor',
            'index': '2023-02-19T10:37:15.797+00:00'
          }
        ],
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        actionType: 'entities',
        id: '',
        type: '',
        attrName: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        limit: '',
        offset: '',
      });
    });
    it('actionType not found', async () => {
      const red = new MockRed();
      timeseriesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: '',
        attribute: '',
        aggrMethod: '',
        aggrPeriod: '',
        lastN: '',
        fromDate: '',
        fromUnit: '',
        toDate: '',
        toUnit: '',
        georel: '',
        geometry: '',
        coords: '',
        value: false,
        limit: '',
        offset: '',

        openapis: {
          apiEndpoint: 'http://quantumleap:8668',
          service: 'openiot',
          getToken: null,
          geType: 'quantumleap'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'actionType not found');
      assert.deepEqual(red.getOutput(), { payload: { error: 'actionType not found' }, statusCode: 500 });
    });
  });
});
