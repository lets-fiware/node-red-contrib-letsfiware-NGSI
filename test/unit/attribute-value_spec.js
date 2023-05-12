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

      const actual = typeConversion('null', false);

      assert.equal(actual, null);
    });
    it('number', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('123', false);

      assert.equal(actual, 123);
    });
    it('string', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('abc', false);

      assert.equal(actual, 'abc');
    });
    it('string - forbidden false', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('%3C%3E', false);

      assert.equal(actual, '%3C%3E');
    });
    it('string - forbidden true', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion('%3C%3E', true);

      assert.equal(actual, '<>');
    });
    it('boolean - true', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(true, false);

      assert.equal(actual, true);
    });
    it('boolean - false', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(false, false);

      assert.equal(actual, false);
    });
    it('JSON Object', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion({ 'abc': 123 }, false);

      assert.deepEqual(actual, { 'abc': 123 });
    });
    it('Array', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(['abc', 123], false);

      assert.deepEqual(actual, ['abc', 123]);
    });
    it('Function', async () => {
      const typeConversion = attributeValueNode.__get__('typeConversion');

      const actual = typeConversion(() => { }, false);

      assert.equal(typeof actual, 'function');
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
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
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

      const msg = {};
      await attrValue(msg, param);

      assert.deepEqual(msg, { payload: 10, statusCode: 200 });
    });
    it('update attribute value', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
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

      const msg = {};
      await attrValue(msg, param);

      assert.deepEqual(msg, { payload: undefined, statusCode: 204 });
    });
    it('should be 400 Bad Request', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
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

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await attrValue.call(node, msg, param);

      assert.equal(errmsg, 'Error while managing attribute value: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
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
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
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

      let errmsg = [];
      const node = { msg: '', error: (e) => { errmsg.push(e); } };

      const msg = {};
      await attrValue.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while managing attribute value: 400 Bad Request', 'Details: error']);
      assert.deepEqual(msg, { payload: { description: 'error' }, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      attributeValueNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
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

      let errmsg = '';
      const node = { msg: '', error: (e) => { errmsg = e; } };

      const msg = {};
      await attrValue.call(node, msg, param);

      assert.equal(errmsg, 'Exception while managing attribute value: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('createParam', () => {
    it('read msg.payload with actionType and entity id', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { actionType: 'read', id: 'E2' } };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false,
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('read msg.payload with {}', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { id: 'E2', type: 'T2', attrName: 'temp', skipForwarding: true } };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false,
        },
        method: 'get',
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with boolean value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: true };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false,
          value: 'true',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with number value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: 25 };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false,
          value: '25',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with string value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: 'fiware' };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false,
          value: '"fiware"',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update msg.payload with null value', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false,
          value: 'null',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.getToken, 'function');
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
          forbidden: false,
          value: 'null',
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion-ld', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Orion' } });
    });
    it('actionType not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        entityId: '',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'actionType not found' } });
    });
    it('Entity id not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        entityId: '',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Entity id not found' } });
    });
    it('Attribute name not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        entityId: 'I',
        entityType: 'T',
        attrName: '',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Attribute name not found' } });
    });
    it('skipForwarding not boolean', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { skipForwarding: 'false' } };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'read',
        entityId: 'I',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'skipForwarding not boolean' } });
    });
    it('Attribute value not found', () => {
      const createParam = attributeValueNode.__get__('createParam');
      const msg = { payload: { actionType: 'update' } };
      const config = {
        service: '',
        servicepath: '/',
        actionType: 'payload',
        entityId: 'I',
        entityType: 'T',
        attrName: 'temperature',
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Attribute value not found' } });
    });
  });
  describe('NGSI Atribute Value node', () => {
    afterEach(() => {
      attributeValueNode.__ResetDependency__('attrValue');
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
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      attributeValueNode.__set__('attrValue', (msg, param) => {
        actual = param;
        msg.payload = undefined;
        msg.statusCode = 204;
      });

      await red.inputWithAwait({ payload: {} });

      const expected = {
        payload: undefined,
        statusCode: 204,
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
        forbidden: false,
        service: 'openiot',
        servicepath: '/',
      });
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
        skipForwarding: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://comet:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'ActionType error: create');
      assert.deepEqual(red.getOutput(), { payload: { 'error': 'ActionType error: create' }, statusCode: 500 });
    });
  });
});
