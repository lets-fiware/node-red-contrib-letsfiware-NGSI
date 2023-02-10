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

const attributesNode = require('../../src/nodes/NGSI/attributes/attributes.js');
const MockRed = require('./helpers/mockred.js');

describe('attribute-value.js', () => {
  describe('updateAttrs', () => {
    afterEach(() => {
      attributesNode.__ResetDependency__("lib");
    });
    it('update attribute value', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
          headers: {},
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
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

      const actual = await updateAttrs(param);

      assert.equal(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
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

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await updateAttrs.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Error while managing attribute value: 400 Bad Request');
    });
    it('Should be unknown error', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
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

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = await updateAttrs.call(node, param);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'Exception while managing attribute value: unknown error');
    });
  });
  describe('createParam', () => {
    it('append with actionType and attributes', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: "append", "attributes": {} } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('append', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'append',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('upsert', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'upsert',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('update', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'update',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attributes: {},
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('replace', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'replace',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attributes: {}
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'append',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' }

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

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
          attributes: {}
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
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

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
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON object');
    });
    it('actionType and/or attributes not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType and/or attributes not found');
    });
    it('Entity id not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: '',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'Entity id not found');
    });
    it('keyValues not boolean', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'read',
        id: 'E',
        type: 'T',
        keyValues: 'false',
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'keyValues not boolean');
    });
    it('ActionType error', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'update' } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'create',
        id: 'E',
        type: 'T',
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' }

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: create');
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
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        append: false,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      attributesNode.__set__('updateAttrs', (param) => {
        actual = param;
        return 204;
      });

      await red.inputWithAwait({ payload: { "temperature": 25 } });

      const expected = {
        payload: 204,
        context: { 'fiwareService': 'openiot', 'fiwareServicePath': '/' },
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        actionType: 'update',
        id: 'E',
        type: 'T',
        attributes: { "temperature": 25 },
        keyValues: false,
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
      attributesNode(red);
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
