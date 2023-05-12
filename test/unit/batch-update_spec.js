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

const batchUpdateNode = require('../../src/nodes/NGSI/batch-update/batch-update.js');
const MockRed = require('./helpers/mockred.js');

const opUpdate = batchUpdateNode.__get__('opUpdate');

describe('batch-update.js', () => {
  describe('opUpdate', () => {
    afterEach(() => {
      batchUpdateNode.__ResetDependency__('lib');
    });
    it('Should be 204 No Content', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 204, statusText: 'No Content' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };
      const node = { send: () => { } };

      const msg = {};
      await opUpdate.call(node, msg, param);

      assert.deepEqual(msg, { payload: undefined, statusCode: 204 });
    });
    it('Should be 400 Bad Request', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };

      let errmsg;
      const node = { error: (e) => { errmsg = e; }, send: () => { } };

      const msg = {};
      await opUpdate.call(node, msg, param);

      assert.equal(errmsg, 'Error while updating entities: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('Should be 400 Bad Request with description', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve(
          {
            status: 400,
            statusText: 'Bad Request',
            data: { description: 'error' }
          }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };

      let errmsg = [];
      const node = { msg: '', error: (e) => { errmsg.push(e); } };

      const msg = {};
      await opUpdate.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while updating entities: 400 Bad Request', 'Details: error']);
      assert.deepEqual(msg, { payload: { description: 'error' }, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data,
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };

      let errmsg;
      const node = { error: (e) => { errmsg = e; }, send: () => { } };

      const msg = {};
      await opUpdate.call(node, msg, param);

      assert.equal(errmsg, 'Exception while updating entities: unknown error');
      assert.deepEqual(msg, { payload: { error: 'unknown error' }, statusCode: 500 });
    });
  });
  describe('createParam', () => {
    it('append entities (array)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: [] };
      const config = {
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/op/update',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'append',
          data: {
            actionType: 'append',
            entities: [
            ],
          },
          keyValues: false,
          overrideMetadata: false,
          forcedUpdate: false,
          flowControl: false,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('append entities (JSON Object)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/op/update',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'append',
          data: {
            actionType: 'append',
            entities: [{}],
          },
          keyValues: false,
          overrideMetadata: false,
          forcedUpdate: false,
          flowControl: false,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('append entities (payload)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: { actionType: 'append', entities: [{ id: 'E', type: 'T' }], keyValues: true } };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        data: {},
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/op/update',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'payload',
          data: {
            actionType: 'append',
            entities: [
              {
                id: 'E',
                type: 'T'
              }
            ]
          },
          keyValues: true,
          overrideMetadata: false,
          forcedUpdate: false,
          flowControl: false,
          forbidden: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion-ld', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Orion' } });
    });
    it('payload not JSON Object (null)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: null };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload not JSON Object' } });
    });
    it('payload not JSON Object (string)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: '' };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload not JSON Object' } });
    });
    it('actionType and/or entities missing', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: { actionType: 'append' } };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'actionType and/or entities missing' } });
    });
    it('not boolean', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: { actionType: 'append', entities: [], keyValues: 'true' } };
      const config = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'keyValues not boolean' } });
    });
    it('ActionType error', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: {} };
      const config = {
        servicepath: '/',
        actionType: 'create',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',
      };
      const openAPIsConfig = { geType: 'orion', apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'ActionType error: create' } });
    });
  });
  describe('batch update node', () => {
    afterEach(() => {
      batchUpdateNode.__ResetDependency__('opUpdate');
    });
    it('append an entity', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => { },
          geType: 'orion',
        }
      });

      let actual;
      batchUpdateNode.__set__('opUpdate', (msg, param) => {
        actual = param;
        msg.payload = undefined;
        msg.statusCode = 204;
      });

      await red.inputWithAwait({ payload: { id: 'E1', type: 'T' } });

      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/op/update');
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.deepEqual(actual.config.data, { actionType: 'append', entities: [{ id: 'E1', type: 'T' }] });
      assert.deepEqual(red.getOutput(), { payload: undefined, statusCode: 204 });
    });
    it('payload not JSON Object', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: 'false',
        overrideMetadata: 'false',
        forcedUpdate: 'false',
        flowControl: 'false',
        forbidden: 'false',

        openapis: {
          borkerNedpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });
      await red.inputWithAwait({});

      assert.equal(red.getMessage(), 'payload not JSON Object');
    });
  });
});
