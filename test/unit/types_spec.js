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
  describe('getTypes', () => {
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
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          limit: 1,
          offset: 0,
        },
      };

      const msg = {};
      await getTypes(msg, param);

      const expected = [{ 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 }];

      assert.deepEqual(msg, { payload: expected, statusCode: 200 });
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
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          limit: 1,
          offset: 0,
        },
      };

      const msg = {};
      await getTypes(msg, param);

      const expected = [
        { 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 },
        { 'type': 'Sensor', 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 }, { 'type': 'T', 'attrs': { 'test': { 'types': ['Test'] } }, 'count': 1 }, { 'type': 'Thing', 'attrs': { 'temperature': { 'types': ['StructuredValue'] } }, 'count': 1 },
      ];

      assert.deepEqual(msg, { payload: expected, statusCode: 200 });
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
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          limit: 0,
          offset: 0,
        },
      };

      const msg = {};
      await getTypes(msg, param);

      assert.deepEqual(msg, { payload: [], statusCode: 200 });
    });
    it('total count 0', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 0 },
          data: [{}],
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          limit: 0,
          offset: 0,
        },
      };

      const msg = {};
      await getTypes(msg, param);

      assert.deepEqual(msg, { payload: [{}], statusCode: 200 });
    });
    it('should be 400 Bad Request', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          actionType: 'read',
        },
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await getTypes.call(node, msg, param);

      assert.equal(errmsg, 'Error while retrieving entity types: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('should be 400 Bad Request with description', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { description: 'error' } }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          actionType: 'read',
        },
      };

      let errmsg = [];
      const node = { msg: '', error: (e) => { errmsg.push(e); } };

      const msg = {};
      await getTypes.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while retrieving entity types: 400 Bad Request', 'Details: error']);
      assert.deepEqual(msg, { payload: { description: 'error' }, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getTypes = typesNode.__get__('getTypes');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types',
        config: {
          actionType: 'read',
        },
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await getTypes.call(node, msg, param);

      assert.equal(errmsg, 'Exception while retrieving entity types: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('getTypes', () => {
    afterEach(() => {
      typesNode.__ResetDependency__('lib');
    });
    it('type', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: { 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 },
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const getType = typesNode.__get__('getType');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/types/T',
        config: {
          limit: 1,
          offset: 0,
        },
      };

      const msg = {};
      await getType(msg, param);

      const expected = { 'attrs': { 'TimeInstant': { 'types': ['DateTime'] }, 'atmosphericPressure': { 'types': ['Number'] }, 'dateObserved': { 'types': ['DateTime'] }, 'location': { 'types': ['geo:json'] }, 'relativeHumidity': { 'types': ['Number'] }, 'temperature': { 'types': ['Number'] } }, 'count': 1 };

      assert.deepEqual(msg, { payload: expected, statusCode: 200 });
    });
    it('should be 400 Bad Request', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const gettype = typesNode.__get__('getType');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/type/T',
        config: {
          actionType: 'read',
        },
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await gettype.call(node, msg, param);

      assert.equal(errmsg, 'Error while retrieving entity type: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      typesNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const gettype = typesNode.__get__('getType');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/v2/type/T',
        config: {
          actionType: 'read',
        },
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await gettype.call(node, msg, param);

      assert.equal(errmsg, 'Exception while retrieving entity type: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('createParam', () => {
    it('payload: null', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'types',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.func, 'function');
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types',
        getToken: null,
        func: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'types',
          type: '',
          values: false,
          noAttrDetail: false,
          limit: 20,
          offset: 0,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('payload: String', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: 'Sensor' };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'type',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.func, 'function');
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types/Sensor',
        getToken: null,
        func: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'type',
          type: 'Sensor',
          values: false,
          noAttrDetail: false,
          limit: 20,
          offset: 0,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('actionType', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: { actionType: 'types' } };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'payload',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.func, 'function');
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types',
        getToken: null,
        func: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'types',
          type: '',
          values: false,
          noAttrDetail: false,
          limit: 20,
          offset: 0,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'types',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',
      };

      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.getToken, 'function');
      actual.getToken = null;

      assert.equal(typeof actual.func, 'function');
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/types',
        getToken: null,
        func: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'types',
          type: '',
          values: false,
          noAttrDetail: false,
          limit: 20,
          offset: 0,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'payload',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion-ld', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      createParam(msg, config, openAPIsConfig);

      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Orion' } });
    });
    it('actionType not found', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'payload',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      createParam(msg, config, openAPIsConfig);

      assert.deepEqual(msg, { payload: { error: 'actionType not found' } });
    });
    it('type not string', () => {
      const createParam = typesNode.__get__('createParam');
      const msg = { payload: { actionType: 'type', type: {} } };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'payload',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',
        limit: 100,
        offset: 0,
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      createParam(msg, config, openAPIsConfig);

      assert.deepEqual(msg, { payload: { error: 'type not string' } });
    });
  });
  describe('NGSI Types node', () => {
    afterEach(() => {
      typesNode.__ResetDependency__('getTypes');
    });
    it('types', async () => {
      const red = new MockRed();
      typesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'types',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      typesNode.__set__('getTypes', (msg, param) => {
        actual = param;
        msg.payload = [{ type: 'Sensor', attrs: { TimeInstant: { types: ['DateTime'] }, atmosphericPressure: { types: ['Number'] }, dateObserved: { types: ['DateTime'] }, location: { types: ['geo:json'] }, relativeHumidity: { types: ['Number'] }, temperature: { types: ['Number'] } }, count: 1 }, { type: 'T', attrs: { test: { types: ['Test'] } }, count: 1 }, { type: 'Thing', attrs: { temperature: { types: ['StructuredValue'] } }, count: 1 }];
        msg.statusCode = 200;
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: [{ type: 'Sensor', attrs: { TimeInstant: { types: ['DateTime'] }, atmosphericPressure: { types: ['Number'] }, dateObserved: { types: ['DateTime'] }, location: { types: ['geo:json'] }, relativeHumidity: { types: ['Number'] }, temperature: { types: ['Number'] } }, count: 1 }, { type: 'T', attrs: { test: { types: ['Test'] } }, count: 1 }, { type: 'Thing', attrs: { temperature: { types: ['StructuredValue'] } }, count: 1 }],
        context: { fiwareService: 'openiot', fiwareServicePath: '/' },
        statusCode: 200,
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        actionType: 'types',
        type: '',
        values: false,
        noAttrDetail: false,
        forbidden: false,
        limit: 20,
        offset: 0,
      });
    });
    it('ActionType error', async () => {
      const red = new MockRed();
      typesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'fiware',
        entityType: '',
        values: 'false',
        noAttrDetail: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'ActionType error: fiware');
      assert.deepEqual(red.getOutput(), { payload: { error: 'ActionType error: fiware' }, statusCode: 500 });
    });
  });
});
