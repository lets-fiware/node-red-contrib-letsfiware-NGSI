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

const { get } = require('babel-register/lib/cache.js');
const { assert } = require('chai');

const entityNode = require('../../src/nodes/NGSI/entity/entity.js');
const MockRed = require('./helpers/mockred.js');

describe('entity.js', () => {
  describe('httpRequest', () => {
    afterEach(() => {
      entityNode.__ResetDependency__("lib");
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
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'read',
        },
      };

      const actual = await httpRequest(param);

      assert.deepEqual(actual, { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } });
    });
    it('create entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities',
        config: {
          actionType: 'create',
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        },
      };

      const actual = await httpRequest(param);

      assert.equal(actual, 201);
    });
    it('upsert entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities',
        config: {
          actionType: 'upsert',
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        },
      };

      const actual = await httpRequest(param);

      assert.equal(actual, 204);
    });
    it('delete entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'delete',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'delete',
        },
      };

      const actual = await httpRequest(param);

      assert.equal(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
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
      entityNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = entityNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
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
    it('payload', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: { actionType: 'create', entity: { id: 'I', type: 'E' }, keyValues: true } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'payload',
        id: 'I2',
        type: 'E2',
        attrs: '',
        keyValues: false,
        dateModified: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          keyValues: true,
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
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'create',
        id: '',
        type: '',
        attrs: '',
        keyValues: true,
        dateModified: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          keyValues: true,
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
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        id: 'I',
        type: 'E',
        attrs: '',
        keyValues: false,
        dateModified: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attrs: "dateModified,*",
          metadata: "dateModified,*",
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('read with attr', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        id: 'I',
        type: 'E',
        attrs: 'temperature',
        keyValues: false,
        dateModified: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attrs: "temperature,dateModified",
          metadata: "dateModified,*",
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('read with id', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: 'I' };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        id: '',
        type: 'E',
        attrs: 'temperature',
        keyValues: false,
        dateModified: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attrs: "temperature,dateModified",
          metadata: "dateModified,*",
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('upsert', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E' } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'upsert',
        id: 'I',
        type: 'E',
        attrs: '',
        keyValues: false,
        dateModified: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'delete',
        id: 'I',
        type: 'E',
        attrs: '',
        keyValues: false,
        dateModified: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
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
      const defaultConfig = {
        service: 'orion',
        servicepath: '/',
        actionType: 'read',
        id: '',
        type: '',
        keyValues: true,
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('Entity id not found when reading', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'read',
        id: '',
        type: '',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Entity id not found');
    });
    it('Entity id not found when deleting', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'delete',
        id: '',
        type: '',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Entity id not found');
    });
    it('payload is null', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: null };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'create',
        id: '',
        type: '',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload is null');
    });
    it('payload not JSON Object', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: 123 };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'create',
        id: '',
        type: '',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON Object');
    });
    it('actionType not found', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'payload',
        id: '',
        type: '',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType not found');
    });
    it('ActionType error', () => {
      const createParam = entityNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'new',
        id: '',
        type: '',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: new');
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
        keyValues: false,
        dateModified: false,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      entityNode.__set__('httpRequest', (param) => {
        actual = param;
        return '201';
      });

      await red.inputWithAwait({ payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } } });

      const expected = {
        payload: '201', 'context': { 'fiwareService': 'openiot', 'fiwareServicePath': '/' }
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        'actionType': 'create',
        'entity': { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        'keyValues': false,
        'service': 'openiot',
        'servicepath': '/',
      });
    });
    it('GE Type error', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'create',
        entityId: 'E',
        entityType: 'I',
        attrs: '',
        keyValues: false,
        dateModified: false,

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
    it('create entity', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'append',
        entityId: 'E',
        entityType: 'I',
        attrs: '',
        keyValues: false,
        dateModified: false,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      await red.inputWithAwait({ payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } } });

      assert.equal(red.getMessage(), 'ActionType error: append');
    });
  });
});
