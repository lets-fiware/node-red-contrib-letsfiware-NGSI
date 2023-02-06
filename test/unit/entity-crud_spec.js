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

const crduEntityNode = require('../../src/nodes/NGSI/entity-crud/entity-crud.js');
const MockRed = require('./helpers/mockred.js');

describe('entity-crud.js', () => {
  describe('crudEntity', () => {
    afterEach(() => {
      crduEntityNode.__ResetDependency__("lib");
    });
    it('get entity', async () => {
      crduEntityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const crudEntity = crduEntityNode.__get__('crudEntity');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'read',
        },
      };

      const actual = await crudEntity(param);

      assert.deepEqual(actual, { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } });
    });
    it('create entity', async () => {
      crduEntityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const crudEntity = crduEntityNode.__get__('crudEntity');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities',
        config: {
          actionType: 'create',
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        },
      };

      const actual = await crudEntity(param);

      assert.equal(actual, 201);
    });
    it('upsert entity', async () => {
      crduEntityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const crudEntity = crduEntityNode.__get__('crudEntity');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities',
        config: {
          actionType: 'upsert',
          data: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        },
      };

      const actual = await crudEntity(param);

      assert.equal(actual, 204);
    });
    it('delete entity', async () => {
      crduEntityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const crudEntity = crduEntityNode.__get__('crudEntity');

      const param = {
        method: 'delete',
        host: 'http://orion:1026',
        pathname: '/entities/I',
        config: {
          actionType: 'delete',
        },
      };

      const actual = await crudEntity(param);

      assert.equal(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      crduEntityNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const crudEntity = crduEntityNode.__get__('crudEntity');

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

      const actual = await crudEntity.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Error while managing entity: 400 Bad Request');
    });
    it('Should be unknown error', async () => {
      crduEntityNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const crudEntity = crduEntityNode.__get__('crudEntity');

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

      const actual = await crudEntity.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Exception while managing entity: unknown error');
    });
  });
  describe('createParam', () => {
    it('msg.payload with create actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { actionType: 'create', entity: { id: 'I', type: 'E' }, keyValues: true } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'upsert',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'create',
          keyValues: true,
          data: {
            id: 'I',
            type: 'E',
          },
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('msg.payload with upsert actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { actionType: 'upsert', id: 'E', type: 'T' } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '',
        actionType: 'upsert',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '',
          actionType: 'upsert',
          keyValues: true,
          upsert: true,
          data: {
            actionType: "upsert",
            id: 'E',
            type: 'T',
          }
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('msg.payload with upsert actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { actionType: 'upsert', entity: { id: 'I', type: 'E' } } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '',
        actionType: 'upsert',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '',
          actionType: 'upsert',
          keyValues: true,
          data: {
            id: 'I',
            type: 'E',
          },
          upsert: true,
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('msg.payload with read actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { actionType: 'read', id: 'I2', type: 'E2', keyValues: true } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'read',
        id: 'I',
        type: 'E',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I2',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'read',
          id: 'I2',
          type: 'E2',
          keyValues: true,
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('msg.payload with delete actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { actionType: 'read', keyValues: true } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'delete',
        id: 'I',
        type: 'E',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'delete',
          id: 'I',
          type: 'E',
        },
        method: 'delete',
      };

      assert.deepEqual(actual, expected);
    });
    it('msg.payload with delete actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { actionType: 'read' } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'delete',
        id: 'I',
        type: 'E',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'delete',
          id: 'I',
          type: 'E',
        },
        method: 'delete',
      };

      assert.deepEqual(actual, expected);
    });
    it('create msg.payload without actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E' } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'create',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'create',
          keyValues: true,
          data: {
            id: 'I',
            type: 'E',
          },
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('upsert msg.payload without actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E' } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'upsert',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'upsert',
          keyValues: true,
          upsert: true,
          data: {
            id: 'I',
            type: 'E',
          },
        },
        method: 'post',
      };

      assert.deepEqual(actual, expected);
    });
    it('read msg.payload without actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E', keyValues: false } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'read',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'read',
          keyValues: false,
          id: 'I',
          type: 'E',
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('delete msg.payload without actionType', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'delete',
        id: 'I2',
        type: 'E2',
        keyValues: true,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/I2',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/#',
          actionType: 'delete',
          id: 'I2',
          type: 'E2',
        },
        method: 'delete',
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = crduEntityNode.__get__('createParam');
      const msg = { payload: { id: 'I', type: 'E', keyValues: false } };
      const defaultConfig = {
        service: 'orion',
        servicepath: '/#',
        actionType: 'read',
        id: 'I2',
        type: 'E2',
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
          servicepath: '/#',
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
      const createParam = crduEntityNode.__get__('createParam');
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
      const createParam = crduEntityNode.__get__('createParam');
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
    it('ActionType error', () => {
      const createParam = crduEntityNode.__get__('createParam');
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
  describe('NGSI Entity CRUD node', () => {
    afterEach(() => {
      crduEntityNode.__ResetDependency__('crudEntity');
    });
    it('create entity', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'create',
        entityid: '',
        entitytype: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      crduEntityNode.__set__('crudEntity', (param) => {
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
        'data': { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        'keyValues': false,
        'service': 'openiot',
        'servicepath': '/',
      });
    });
    it('get entity', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'read',
        entityid: 'I',
        entitytype: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      crduEntityNode.__set__('crudEntity', (param) => {
        actual = param;
        return { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } };
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        context: { 'fiwareService': 'openiot', 'fiwareServicePath': '/' },
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        actionType: 'read',
        id: 'I',
        type: '',
        keyValues: false,
        service: 'openiot',
        servicepath: '/',
      });
    });
    it('get entity with Id', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'read',
        entityid: 'I',
        entitytype: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      crduEntityNode.__set__('crudEntity', (param) => {
        actual = param;
        return { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } };
      });

      await red.inputWithAwait({ payload: 'I2' });

      const expected = {
        payload: { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } },
        context: { 'fiwareService': 'openiot', 'fiwareServicePath': '/' },
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        actionType: 'read',
        id: 'I2',
        type: '',
        keyValues: false,
        service: 'openiot',
        servicepath: '/',
      });
    });
    it('GE Type error', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'read',
        entityid: 'I',
        entitytype: '',
        mode: 'normalized',

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
    it('payload is null', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'read',
        entityid: 'I',
        entitytype: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://comet:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      await red.inputWithAwait({ payload: null });

      assert.equal(red.getMessage(), 'payload is null');
    });
    it('payload is array', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'read',
        entityid: 'I',
        entitytype: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://comet:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      await red.inputWithAwait({ payload: [] });

      assert.equal(red.getMessage(), 'payload not JSON Object');
    });
    it('error: get entity without id', async () => {
      const red = new MockRed();
      crduEntityNode(red);
      red.createNode({
        servicepath: '/',
        actiontype: 'read',
        entityid: '',
        entitytype: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      crduEntityNode.__set__('crudEntity', (param) => {
        actual = param;
        return { 'id': 'I', 'type': 'E', 'temperature': { 'type': 'Number', 'value': 6, metadata: {} } };
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'Entity id not found');
    });
  });
});
