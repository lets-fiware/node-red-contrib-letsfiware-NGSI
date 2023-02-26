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

const attributesNode = require('../../src/nodes/NGSI/attribute/attribute.js');
const MockRed = require('./helpers/mockred.js');

describe('attribute.js', () => {
  describe('httpRequest', () => {
    afterEach(() => {
      attributesNode.__ResetDependency__('lib');
    });
    it('read attribute', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: { 'type': 'Number', 'value': 45, 'metadata': {} },
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read',
        },
      };

      const actual = await httpRequest(param);

      assert.deepEqual(actual, { 'type': 'Number', 'value': 45, 'metadata': {} });
    });
    it('update attribute', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'update',
          attribute: { 'type': 'Number', 'value': 45, 'metadata': {} },
        },
      };

      const actual = await httpRequest(param);

      assert.equal(actual, 204);
    });
    it('delete attribute', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'delete',
        },
      };

      const actual = await httpRequest(param);

      assert.equal(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read',
        },
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await httpRequest.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Error while managing attribute: 400 Bad Request');
    });
    it('should be 400 Bad Request with description', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { description: 'error' } }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read',
        },
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await httpRequest.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while managing attribute: 400 Bad Request', 'Details: error']);
    });
    it('Should be unknown error', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read',
        },
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await httpRequest.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Exception while managing attribute: unknown error');
    });
  });
  describe('createParam', () => {
    it('payload', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'read' } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature',
        method: 'get',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          attrName: 'temperature',
          id: 'E',
          type: 'T',
          skipForwarding: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('get', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature',
        method: 'get',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          attrName: 'temperature',
          id: 'E',
          type: 'T',
          skipForwarding: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { 'type': 'Number', 'value': 1234.5 } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature',
        method: 'put',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
          attribute: { 'type': 'Number', 'value': 1234.5 },
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('delete', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'delete',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature',
        method: 'delete',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'delete',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      actual.getToken = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature',
        method: 'delete',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('payload is empty', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: null };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload is empty');
    });
    it('payload not JSON object', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: [] };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON object');
    });
    it('actionType not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType not found');
    });
    it('Entity id not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: '',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Entity id not found');
    });
    it('attrName not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        attrName: '',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'attrName not found');
    });
    it('skipForwarding not boolean', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'skipForwarding not boolean');
    });
    it('ActionType error', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'create' } };
      const defaultConfig = {
        servicepath: '/',
        actionType: '',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        attribute: { 'type': 'Number', 'value': 1234.5 },
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: create');
    });
  });
  describe('NGSI Atribute Value node', () => {
    afterEach(() => {
      attributesNode.__ResetDependency__('httpRequest');
    });
    it('update attributes', async () => {
      const red = new MockRed();
      attributesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      attributesNode.__set__('httpRequest', (param) => {
        actual = param;
        return 204;
      });

      await red.inputWithAwait({ payload: { 'type': 'Number', 'value': 1234.5 } });

      const expected = {
        payload: 204,
        context: { 'fiwareService': 'openiot', 'fiwareServicePath': '/' },
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        attribute: { 'type': 'Number', 'value': 1234.5 },
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
        servicepath: '/',
      });
    });
    it('GE Type error', async () => {
      const red = new MockRed();
      attributesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,

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
    it('ActionType error', async () => {
      const red = new MockRed();
      attributesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'create',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,

        openapis: {
          apiEndpoint: 'http://comet:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'ActionType error: create');
    });
  });
});
