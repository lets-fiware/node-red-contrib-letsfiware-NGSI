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

const attributesNode = require('../../src/nodes/NGSI/attributes/attributes.js');
const MockRed = require('./helpers/mockred.js');

describe('attributes.js', () => {
  describe('updateAttrs', () => {
    afterEach(() => {
      attributesNode.__ResetDependency__('lib');
    });
    it('update attribute value', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const updateAttrs = attributesNode.__get__('updateAttrs');

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
      await updateAttrs(msg, param);

      assert.deepEqual(msg, { payload: undefined, statusCode: 204 });
    });
    it('should be 400 Bad Request', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const updateAttrs = attributesNode.__get__('updateAttrs');

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
      await updateAttrs.call(node, msg, param);

      assert.equal(errmsg, 'Error while managing attribute value: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('should be 400 Bad Request with description', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { description: 'error' } }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const updateAttrs = attributesNode.__get__('updateAttrs');

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
      await updateAttrs.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while managing attribute value: 400 Bad Request', 'Details: error']);
      assert.deepEqual(msg, { payload: { 'description': 'error' }, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const updateAttrs = attributesNode.__get__('updateAttrs');

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
      await updateAttrs.call(node, msg, param);

      assert.equal(errmsg, 'Exception while managing attribute value: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('createParam', () => {
    it('append with actionType and attributes', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'append', 'attributes': {} } };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs',
        method: 'post',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'append',
          id: 'E',
          type: 'T',
          keyValues: false,
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          forbidden: false,
          append: true,
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('append', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'append',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs',
        method: 'post',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'append',
          id: 'E',
          type: 'T',
          keyValues: false,
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          forbidden: false,
          append: true,
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('upsert', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'upsert',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs',
        method: 'post',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'upsert',
          id: 'E',
          type: 'T',
          keyValues: false,
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          forbidden: false,
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs',
        method: 'patch',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: 'E',
          type: 'T',
          keyValues: false,
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          forbidden: false,
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('replace', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'replace',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs',
        method: 'put',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'replace',
          id: 'E',
          type: 'T',
          keyValues: false,
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          forbidden: false,
          attributes: {}
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'append',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.getToken, 'function');
      actual.getToken = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities/E/attrs',
        method: 'post',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'append',
          id: 'E',
          type: 'T',
          keyValues: false,
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          append: true,
          forbidden: false,
          attributes: {}
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'update' } };
      const config = {
        servicepath: '/',
        actionType: 'create',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion-ld', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Orion' } });
    });
    it('payload is empty', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload is empty' } });
    });
    it('payload not JSON object', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: [] };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload not JSON object' } });
    });
    it('actionType and/or attributes not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'actionType and/or attributes not found' } });
    });
    it('Entity id not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: '',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'Entity id not found' } });
    });
    it('keyValues not boolean', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'append', attributes: {}, keyValues: 'false' } };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'keyValues not boolean' } });
    });
    it('ActionType error', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'update' } };
      const config = {
        servicepath: '/',
        actionType: 'create',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'ActionType error: create' } });
    });
  });
  describe('NGSI Atribute Value node', () => {
    afterEach(() => {
      attributesNode.__ResetDependency__('updateAttrs');
    });
    it('update attributes', async () => {
      const red = new MockRed();
      attributesNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        append: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      attributesNode.__set__('updateAttrs', (msg, param) => {
        actual = param;
        msg.payload = undefined;
        msg.statusCode = 204;
      });

      await red.inputWithAwait({ payload: { 'temperature': 25 } });

      assert.deepEqual(red.getOutput(), {
        payload: undefined,
        statusCode: 204,
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/'
        }
      });
      assert.deepEqual(actual.config, {
        actionType: 'update',
        id: 'E',
        type: 'T',
        attributes: { 'temperature': 25 },
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        forbidden: false,
        service: 'openiot',
        servicepath: '/',
      });
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
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'ActionType error: create' },
        statusCode: 500
      });
    });
  });
});
