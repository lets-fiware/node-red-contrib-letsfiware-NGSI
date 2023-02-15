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

const typesNode = require('../../src/nodes/NGSI/types/types.js');
const MockRed = require('./helpers/mockred.js');

describe('types.js', () => {
  describe('httpRequest', () => {
    afterEach(() => {
      typesNode.__ResetDependency__('lib');
    });
    it('types', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 1 },
          data: [{ 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 }],
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = typesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          totalCount: 0,
          limit: 1,
          page: 0,
        },
      };

      const actual = await httpRequest(param);

      const expected = [{ 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 }];

      assert.deepEqual(actual, expected);
    });
    it('types - total count: 2', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 2 },
          data: [
            { 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 },
          ],
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = typesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          totalCount: 0,
          limit: 1,
          page: 0,
        },
      };

      const actual = await httpRequest(param);

      const expected = [
        { 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 },
        { 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 },
      ];

      assert.deepEqual(actual, expected);
    });
    it('empty', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 0 },
          data: [],
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = typesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          totalCount: 0,
          limit: 0,
          page: 0,
        },
      };

      const actual = await httpRequest(param);

      const expected = [];

      assert.deepEqual(actual, expected);
    });
    it('/v2/types/T', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: { 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 },
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = typesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types/T',
        config: {
          totalCount: 0,
          limit: 0,
          page: 0,
        },
      };

      const actual = await httpRequest(param);

      const expected = { 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 };

      assert.deepEqual(actual, expected);
    });
    it('should be 400 Bad Request', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = typesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          actionType: 'read',
        },
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await httpRequest.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Error while managing entity: 400 Bad Request');
    });
    it('Should be unknown error', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = typesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          actionType: 'read',
        },
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await httpRequest.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Exception while managing entity: unknown error');
    });
  });
  describe('createParam', () => {
    it('payload: null', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: null };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          type: '',
          values: false,
          noAttrDetail: false,
          totalCount: 0,
          limit: 100,
          page: 0,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('payload: String', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: 'Sensor' };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types/Sensor',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          type: 'Sensor',
          values: false,
          noAttrDetail: false,
          totalCount: 0,
          limit: 100,
          page: 0,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E', keyValues: false } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      actual.getToken = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          type: '',
          values: false,
          noAttrDetail: false,
          totalCount: 0,
          limit: 100,
          page: 0,
        },
      };

      assert.deepEqual(actual, expected);
    });
  });
  describe('NGSI Types node', () => {
    afterEach(() => {
      typesNode.__ResetDependency__('httpRequest');
    });
    it('types', async () => {
      const red = new MockRed();
      typesNode(red);
      red.createNode({
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      typesNode.__set__('httpRequest', (param) => {
        actual = param;
        return [{ type: 'Sensor', attrs: { TimeInstant: { types: ['DateTime'] }, atmosphericPressure: { types: ['Number'] }, dateObserved: { types: ['DateTime'] }, location: { types: ['geo:json'] }, relativeHumidity: { types: ['Number'] }, temperature: { types: ['Number'] } }, count: 1 }, { type: 'T', attrs: { test: { types: ['Test'] } }, count: 1 }, { type: 'Thing', attrs: { temperature: { types: ['StructuredValue'] } }, count: 1 }];
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: [{ type: 'Sensor', attrs: { TimeInstant: { types: ['DateTime'] }, atmosphericPressure: { types: ['Number'] }, dateObserved: { types: ['DateTime'] }, location: { types: ['geo:json'] }, relativeHumidity: { types: ['Number'] }, temperature: { types: ['Number'] } }, count: 1 }, { type: 'T', attrs: { test: { types: ['Test'] } }, count: 1 }, { type: 'Thing', attrs: { temperature: { types: ['StructuredValue'] } }, count: 1 }],
        context: { fiwareService: 'openiot', fiwareServicePath: '/' }
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,
      });
    });
    it('GE Type error', async () => {
      const red = new MockRed();
      typesNode(red);
      red.createNode({
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,

        openapis: {
          apiEndpoint: 'http://comet:1026',
          service: 'openiot',
          getToken: null,
          geType: 'comet'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'FIWARE GE type not Orion');
    });
    it('error', async () => {
      const red = new MockRed();
      typesNode(red);
      red.createNode({
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      typesNode.__set__('httpRequest', (param) => {
        actual = param;
        return null;
      });

      await red.inputWithAwait({ payload: {} });

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        type: '',
        values: false,
        noAttrDetail: false,
        totalCount: 0,
        limit: 100,
        page: 0,
      });
    });
  });
});
