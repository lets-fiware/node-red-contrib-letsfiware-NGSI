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
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };
      const node = { send: () => { } };

      const actual = await opUpdate.call(node, param);

      assert.equal(actual, 204);
    });
    it('Should be 400 Bad Request', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };
      let errmsg;
      const node = { error: (e) => { errmsg = e; }, send: () => { } };

      const actual = await opUpdate.call(node, param);

      assert.equal(errmsg, 'Error while updating entities: 400 Bad Request');
      assert.equal(actual, null);
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
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await opUpdate.call(node, param);

      assert.deepEqual(msg, ['Error while updating entities: 400 Bad Request', 'Details: error']);
      assert.equal(actual, null);
    });
    it('Should be unknown error', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: { data: [{ 'id': 'urn:ngsi-ld:WeatherObserved:sensor001', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }, { 'id': 'urn:ngsi-ld:WeatherObserved:sensor002', 'type': 'Sensor', 'temperature': { 'type': 'Number', 'value': 20.6, 'metadata': {} } }] }
      };
      let errmsg;
      const node = { error: (e) => { errmsg = e; }, send: () => { } };

      const actual = await opUpdate.call(node, param);

      assert.equal(errmsg, 'Exception while updating entities: unknown error');
      assert.equal(actual, null);
    });
  });
  describe('createParam', () => {
    it('append entities (array)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: [] };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/op/update',
        getToken: null,
        contentType: 'json',
        config: {
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
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('append entities (JSON Object)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/op/update',
        getToken: null,
        contentType: 'json',
        config: {
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
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('append entities (payload)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: { actionType: 'append', entities: [], keyValues: true } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/op/update',
        getToken: null,
        contentType: 'json',
        config: {
          servicepath: '/',
          actionType: 'payload',
          data: [
            {
              id: 'E',
              type: 'T',
            },
          ],
          keyValues: true,
          overrideMetadata: false,
          forcedUpdate: false,
          flowControl: false,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('payload not JSON Object (null)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: null };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };
      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON Object');
    });
    it('payload not JSON Object (string)', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: '' };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };
      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON Object');
    });
    it('actionType and/or entities missing', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: { actionType: 'append' } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };
      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType and/or entities missing');
    });
    it('not boolean', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: { actionType: 'append', entities: [], keyValues: 'true' } };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'payload',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };
      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'keyValues not boolean');
    });
    it('ActionType error', () => {
      const createParam = batchUpdateNode.__get__('createParam');
      const msg = { payload: {} };
      const defaultConfig = {
        servicepath: '/',
        actionType: 'create',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,
      };
      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };
      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: create');
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
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => { },
          geType: 'orion',
        }
      });

      let actual;
      batchUpdateNode.__set__('opUpdate', (param) => actual = param);

      await red.inputWithAwait({ payload: { id: 'E1', type: 'T' } });

      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/op/update');
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.deepEqual(actual.config.data, { actionType: 'append', entities: [{ id: 'E1', type: 'T' }] });
    });
    it('FIWARE GE type not Orion', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,

        openapis: {
          borkerNedpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'fiware',
        }
      });
      await red.inputWithAwait({});

      assert.equal(red.getMessage(), 'FIWARE GE type not Orion');
    });
    it('payload not JSON Object', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'append',
        data: [{ id: 'E', type: 'T' }],
        keyValues: false,
        overrideMetadata: false,
        forcedUpdate: false,
        flowControl: false,

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
