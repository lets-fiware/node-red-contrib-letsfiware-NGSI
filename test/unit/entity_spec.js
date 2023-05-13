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

const entityNode = require('../../src/nodes/NGSI/entity/entity.js');
const MockRed = require('./helpers/mockred.js');

describe('entity.js', () => {
  describe('httpRequest', () => {
    afterEach(() => {
      entityNode.__ResetDependency__('lib');
    });
    it('get entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'read',
          forbidden: false,
        },
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.deepEqual(msg, { payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } }, statusCode: 200 });
    });
    it('create entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities',
        config: {
          actionType: 'create',
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
          forbidden: false,
        },
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.deepEqual(msg, { payload: undefined, statusCode: 201 });
    });
    it('upsert entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities',
        config: {
          actionType: 'upsert',
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
          forbidden: false,
        },
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.deepEqual(msg, { payload: undefined, statusCode: 204 });
    });
    it('delete entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'delete',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'delete',
          forbidden: false,
        },
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.deepEqual(msg, { payload: undefined, statusCode: 204 });
    });
    it('should be 400 Bad Request', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'read',
          forbidden: false,
        },
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Error while managing entity: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('should be 400 Bad Request with description', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { description: 'error' } }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'read',
          forbidden: false,
        },
      };

      let errmsg = [];
      const node = { msg: '', error: (e) => { errmsg.push(e); } };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while managing entity: 400 Bad Request', 'Details: error']);
      assert.deepEqual(msg, { payload: { description: 'error' }, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'read',
          forbidden: false,
        },
      };

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Exception while managing entity: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('createParam', () => {
    it('payload', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: { actionType: 'create', entity: { id: 'I', type: 'E' }, keyValues: true } };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'payload',
        entityId: 'I2',
        entityType: 'E2',
        attrs: '',
        keyValues: 'false',
        dateModified: 'false',
        forbidden: 'true',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          keyValues: true,
          forbidden: true,
          entity: {
            id: 'I',
            type: 'E',
          },
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('create', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: { id: 'E', type: 'T' } };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'create',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          keyValues: true,
          forbidden: false,
          entity: {
            id: 'E',
            type: 'T',
          }
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('read', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        entityId: 'I',
        entityType: 'E',
        attrs: '',
        keyValues: 'false',
        dateModified: 'true',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          id: 'I',
          type: 'E',
          keyValues: false,
          dateModified: true,
          forbidden: false,
          attrs: 'dateModified,*',
          metadata: 'dateModified,*',
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('read with attr', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        entityId: 'I',
        entityType: 'E',
        attrs: 'temperature',
        keyValues: 'false',
        dateModified: 'true',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          id: 'I',
          type: 'E',
          keyValues: false,
          dateModified: true,
          forbidden: false,
          attrs: 'temperature,dateModified',
          metadata: 'dateModified,*',
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('read with id', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: 'I' };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        entityId: '',
        entityType: 'E',
        attrs: 'temperature',
        keyValues: 'false',
        dateModified: 'true',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          id: 'I',
          type: 'E',
          keyValues: false,
          dateModified: true,
          forbidden: false,
          attrs: 'temperature,dateModified',
          metadata: 'dateModified,*',
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('upsert', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E' } };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'upsert',
        entityId: 'I',
        entityType: 'E',
        attrs: '',
        keyValues: 'false',
        dateModified: 'true',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'upsert',
          upsert: true,
          keyValues: false,
          forbidden: false,
          entity: {
            id: 'I',
            type: 'E',
          },
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('delete', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'delete',
        entityId: 'I',
        entityType: 'E',
        attrs: '',
        keyValues: 'false',
        dateModified: 'true',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          forbidden: false,
          id: 'I',
          type: 'E',
        },
        method: 'delete',
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E', keyValues: false } };
      const config = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };

      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      actual.getToken = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          keyValues: false,
          id: 'I',
          type: 'E',
          attrs: '',
          dateModified: false,
          forbidden: false,
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'read',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion-ld', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Orion' } });
    });
    it('Entity id not found when reading', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'read',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Entity id not found' } });
    });
    it('Entity id not found when deleting', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'delete',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Entity id not found' } });
    });
    it('payload is null', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'create',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload is null' } });
    });
    it('payload not JSON Object', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: 123 };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'create',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload not JSON Object' } });
    });
    it('actionType not found', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'payload',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'actionType not found' } });
    });
    it('ActionType error', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'new',
        entityId: '',
        entityType: '',
        attrs: '',
        keyValues: 'true',
        dateModified: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'ActionType error: new' } });
    });
  });
  describe('NGSI Entity node', () => {
    afterEach(() => {
      entityNode.__ResetDependency__('httpRequest');
    });
    it('create entity', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'create',
        entityId: 'E',
        entityType: 'I',
        attrs: '',
        keyValues: 'false',
        dateModified: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      entityNode.__set__('httpRequest', (msg, param) => {
        actual = param;
        msg.payload = undefined;
        msg.statusCode = 201;
      });

      await red.inputWithAwait({ payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } } });

      const expected = {
        payload: undefined, statusCode: 201, 'context': { 'fiwareService': 'openiot', 'fiwareServicePath': '/' }
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        'actionType': 'create',
        'entity': { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        'keyValues': false,
        'service': 'openiot',
        'servicepath': '/',
        forbidden: false,
      });
    });
    it('ActionType error: append', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'append',
        entityId: 'E',
        entityType: 'I',
        attrs: '',
        keyValues: 'false',
        dateModified: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      await red.inputWithAwait({ payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } } });

      assert.equal(red.getMessage(), 'ActionType error: append');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'ActionType error: append' },
        statusCode: 500,
      });
    });
  });
});
