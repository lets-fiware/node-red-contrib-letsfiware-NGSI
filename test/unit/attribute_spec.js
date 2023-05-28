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
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: {},
            data: { type: 'Number', value: 45, metadata: {} }
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read'
        }
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.equal(msg.statusCode, 200);
      assert.deepEqual(msg.payload, {
        type: 'Number',
        value: 45,
        metadata: {}
      });
    });
    it('update attribute', async () => {
      attributesNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 204,
            headers: {}
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature/value',
        config: {
          actionType: 'update',
          attribute: { type: 'Number', value: 45, metadata: {} }
        }
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.equal(msg.statusCode, 204);
      assert.equal(msg.payload, undefined);
    });
    it('delete attribute', async () => {
      attributesNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 204,
            headers: {}
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'delete'
        }
      };

      const msg = {};
      await httpRequest(msg, param);

      assert.equal(msg.statusCode, 204);
      assert.equal(msg.payload, undefined);
    });
    it('should be 400 Bad Request', async () => {
      attributesNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 400,
            statusText: 'Bad Request',
            data: undefined
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read'
        }
      };

      let errmsg = '';
      const node = {
        errmsg: '',
        error: (e) => {
          errmsg = e;
        }
      };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Error while managing attribute: 400 Bad Request');
      assert.equal(msg.statusCode, 400);
      assert.equal(msg.payload, undefined);
    });
    it('should be 400 Bad Request with description', async () => {
      attributesNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 400,
            statusText: 'Bad Request',
            data: { description: 'error' }
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read'
        }
      };

      let errmsg = [];
      const node = {
        errmsg: '',
        error: (e) => {
          errmsg.push(e);
        }
      };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while managing attribute: 400 Bad Request', 'Details: error']);
      assert.equal(msg.statusCode, 400);
      assert.deepEqual(msg.payload, { description: 'error' });
    });
    it('Should be unknown error', async () => {
      attributesNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const httpRequest = attributesNode.__get__('httpRequest');

      const param = {
        method: 'post',
        host: 'http://orion:1026',
        pathname: '/entities/E/attrs/temperature',
        config: {
          actionType: 'read'
        }
      };

      let errmsg = '';
      const node = {
        errmsg: '',
        error: (e) => {
          errmsg = e;
        }
      };

      const msg = {};
      await httpRequest.call(node, msg, param);

      assert.equal(errmsg, 'Exception while managing attribute: unknown error');
      assert.equal(msg.statusCode, 500);
      assert.deepEqual(msg.payload, { error: 'unknown error' });
    });
  });
  describe('createParam', () => {
    it('payload', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'read' } };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

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
          metadata: '',
          id: 'E',
          type: 'T',
          skipForwarding: false,
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('get', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

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
          metadata: '',
          id: 'E',
          type: 'T',
          skipForwarding: false,
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('update', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { type: 'Number', value: 1234.5 } };
      const config = {
        servicepath: '/',
        actionType: 'update',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

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
          attribute: { type: 'Number', value: 1234.5 },
          overrideMetadata: false,
          flowControl: false,
          forcedUpdate: false,
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('delete', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'delete',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

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
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'delete',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: () => {},
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.getToken, 'function');
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
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion-ld',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'FIWARE GE type not Orion' });
    });
    it('payload is empty', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'payload is empty' });
    });
    it('payload not JSON object', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: [] };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'payload not JSON object' });
    });
    it('actionType not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'actionType not found' });
    });
    it('Entity id not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: '',
        entityType: 'T',
        metadata: '',
        attrName: 'temperature',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'Entity id not found' });
    });
    it('attrName not found', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: '',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'attrName not found' });
    });
    it('skipForwarding not boolean', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { skipForwarding: 'false' } };
      const config = {
        servicepath: '/',
        actionType: 'read',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'skipForwarding not boolean' });
    });
    it('ActionType error', () => {
      const createParam = attributesNode.__get__('createParam');
      const msg = { payload: { actionType: 'create' } };
      const config = {
        servicepath: '/',
        actionType: '',
        entityId: 'E',
        entityType: 'T',
        attrName: 'temperature',
        metadata: '',
        attribute: { type: 'Number', value: 1234.5 },
        skipForwarding: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
        service: 'openiot'
      };
      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg.payload, { error: 'ActionType error: create' });
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
        skipForwarding: 'false',
        overrideMetadata: 'false',
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
      attributesNode.__set__('httpRequest', (msg, param) => {
        actual = param;
        msg.payload = undefined;
        msg.statusCode = 204;
      });

      await red.inputWithAwait({ payload: { type: 'Number', value: 1234.5 } });

      const expected = {
        payload: undefined,
        statusCode: 204,
        context: { fiwareService: 'openiot', fiwareServicePath: '/' }
      };

      assert.deepEqual(red.getOutput(), expected);
      assert.deepEqual(actual.config, {
        actionType: 'update',
        id: 'E',
        type: 'T',
        attrName: 'temperature',
        attribute: { type: 'Number', value: 1234.5 },
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
        service: 'openiot',
        servicepath: '/',
        forbidden: false
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
        metadata: '',
        skipForwarding: 'false',
        overrideMetadata: 'false',
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
