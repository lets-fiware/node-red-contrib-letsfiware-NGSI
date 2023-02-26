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

const attributeValueNode = require('../../src/nodes/NGSI/attribute-value/attribute-value.js');
const MockRed = require('./helpers/mockred.js');

describe('attribute-value.js', () => {
  describe('typeConversion', () => {
    afterEach(() => {
      attributeValueNode.__ResetDependency__('lib');
    });
    it('null', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('null');

      assert.equal(actual, null);
    });
    it('number', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('123');

      assert.equal(actual, 123);
    });
    it('string', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('abc');

      assert.equal(actual, 'abc');
    });
    it('boolean', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(true);

      assert.equal(actual, true);
    });
    it('boolean', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(false);

      assert.equal(actual, false);
    });
    it('JSON Object', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion({ 'abc': 123 });

      assert.deepEqual(actual, { 'abc': 123 });
    });
    it('Array', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(['abc', 123]);

      assert.deepEqual(actual, ['abc', 123]);
    });
  });
  describe('attrValue', () => {
    afterEach(() => {
      attributeValueNode.__ResetDependency__('lib');
    });
    it('get attribute value', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: {},
          data: 10,
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const attrValue = attributeValueNode.__get__('attrValue');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'read',
        },
      };

      const actual = await attrValue(param);

      assert.deepEqual(actual, 10);
    });
    it('update attribute value', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const attrValue = attributeValueNode.__get__('attrValue');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'update',
          value: 'abc'
        },
      };

      const actual = await attrValue(param);

      assert.equal(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const attrValue = attributeValueNode.__get__('attrValue');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'read',
        },
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await attrValue.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Error while managing attribute value: 400 Bad Request');
    });
    it('should be 400 Bad Request with description', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 400,
          statusText: 'Bad Request',
          data: { description: 'error' }
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const attrValue = attributeValueNode.__get__('attrValue');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'read',
        },
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await attrValue.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while managing attribute value: 400 Bad Request', 'Details: error']);
    });
    it('Should be unknown error', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const attrValue = attributeValueNode.__get__('attrValue');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'read',
        },
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await attrValue.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Exception while managing attribute value: unknown error');
    });
  });
  describe('createParam', () => {
    it('read msg.payload with actionType and entity id', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { actionType: 'read', id: 'E2' } };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E2/attrs/temperature/value',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          id: 'E2',
          type: 'T',
          attrName: 'temperature',
          skipForwarding: false,
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('read msg.payload with {}', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { id: 'E2', type: 'T2', attrName: 'temp', skipForwarding: true } };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E2/attrs/temp/value',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'read',
          id: 'E2',
          type: 'T2',
          attrName: 'temp',
          skipForwarding: true,
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with boolean value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: true };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature/value',
        method: 'put',
        contentType: 'text/plain',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
          flowControl: false,
          forcedUpdate: false,
          value: 'true',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with number value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: 25 };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature/value',
        method: 'put',
        contentType: 'text/plain',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
          flowControl: false,
          forcedUpdate: false,
          value: '25',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with string value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: 'fiware' };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature/value',
        method: 'put',
        contentType: 'text/plain',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
          flowControl: false,
          forcedUpdate: false,
          value: '"fiware"',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with null value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: null };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature/value',
        method: 'put',
        contentType: 'text/plain',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
          flowControl: false,
          forcedUpdate: false,
          value: 'null',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: null };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      actual.getToken = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs/temperature/value',
        method: 'put',
        contentType: 'text/plain',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          attrName: 'temperature',
          flowControl: false,
          forcedUpdate: false,
          value: 'null',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('actionType not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType not found');
    });
    it('Entity id not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        id: '',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Entity id not found');
    });
    it('Attribute name not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        id: 'I',
        type: 'T',
        attrName: '',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Attribute name not found');
    });
    it('skipForwardingnot boolean', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        id: 'I',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'skipForwarding not boolean');
    });
    it('Attribute value not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { actionType: 'update' } };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        id: 'I',
        type: 'T',
        attrName: 'temperature',
        skipForwarding: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Attribute value not found');
    });
  });
  describe('NGSI Atribute Value node', () => {
    afterEach(() => {
      attributeValueNode.__ResetDependency__('attrValue');
    });
    it('read attribute value', async () => {
      const red = new MockRed();
      attributeValueNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: false,
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
      attributeValueNode.__set__('attrValue', (param) => {
        actual = param;
        return '200';
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: '200', 'context': { 'fiwareService': 'openiot', 'fiwareServicePath': '/' }
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        actionType: 'read',
        attrName: 'temperature',
        id: 'E',
        type: 'T',
        skipForwarding: false,
        service: 'openiot',
        servicepath: '/',
      });
    });
    it('update attribute value', async () => {
      const red = new MockRed();
      attributeValueNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: false,
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
      attributeValueNode.__set__('attrValue', (param) => {
        actual = param;
        return 204;
      });

      await red.inputWithAwait({ payload: {} });

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
        value: {},
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
        servicepath: '/',
      });
    });
    it('GE Type error', async () => {
      const red = new MockRed();
      attributeValueNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: false,
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
      attributeValueNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'create',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: false,
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
