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

const sourceNode = require('../../src/nodes/NGSI/source/source.js');
const MockRed = require('./helpers/mockred.js');

describe('source.js', () => {
  describe('getEntities', () => {
    afterEach(() => {
      sourceNode.__ResetDependency__('lib');
    });
    it('get entities', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 2 },
          data: [{ id: 'E1', type: 'T' }, { id: 'E2', type: 'T' }]
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => { } }, {}),
        config: {
          offset: 0,
          limit: 1,
        }
      };

      await getEntities(param);
    });
    it('get entities', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 2 },
          data: [{ id: 'E1', type: 'T' }, { id: 'E2', type: 'T' }]
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => { } }, {}),
        config: {
          offset: 0,
          limit: 2,
        }
      };

      await getEntities(param);
    });
    it('get no entities', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 0 },
          data: []
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => { } }),
        config: {
          offset: 0,
          limit: 2,
        }
      };

      await getEntities(param);
    });
    it('total count 0', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          headers: { 'fiware-total-count': 0 },
          data: [{}]
        }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => { } }),
        config: {
          offset: 0,
          limit: 2,
        }
      };

      await getEntities(param);
    });
    it('should be 400 Bad Request', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => { } }),
        config: {
          offset: 0,
          limit: 2,
        }
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };
      await getEntities.call(node, param);

      assert.equal(msg, 'Error while retrieving entities: 400 Bad Request');
    });
    it('Should be unknown error', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildParams: () => new URLSearchParams(),
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => { } }),
        config: {
          offset: 0,
          limit: 2,
        }
      };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };
      await getEntities.call(node, param);

      assert.equal(msg, 'Exception while retrieving entities: unknown error');
    });
  });
  describe('nobuffering', () => {
    it('should have a entity', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open({ send: (data) => { actual.push(data); } }, msg);
      nobuffering.send([{ id: 'E1', type: 'T' }]);
      nobuffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }] }]);

    });
    it('should have a entities', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open({ send: (data) => { actual.push(data); } }, msg);
      nobuffering.send([{ id: 'E1', type: 'T' }]);
      nobuffering.send([{ id: 'E2', type: 'T' }]);
      nobuffering.close();

      assert.deepEqual(actual, [
        { payload: [{ id: 'E1', type: 'T' }] },
        { payload: [{ id: 'E2', type: 'T' }] },
      ]);
    });
    it('should be empty', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open({ send: (data) => { actual.push(data); } }, msg);
      nobuffering.close();

      assert.deepEqual(actual, []);

    });
    it('should have a entity', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open({ send: (data) => { actual.push(data); } }, msg);
      nobuffering.out([{ id: 'E1', type: 'T' }]);
      nobuffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }] }]);

    });
  });
  describe('buffering', () => {
    it('should have a entity', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open({ send: (data) => { actual.push(data); } }, msg);
      buffering.send([{ id: 'E1', type: 'T' }]);
      buffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }] }]);

    });
    it('should have a entities', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open({ send: (data) => { actual.push(data); } }, msg);
      buffering.send([{ id: 'E1', type: 'T' }]);
      buffering.send([{ id: 'E2', type: 'T' }]);
      buffering.close();

      assert.deepEqual(actual, [
        {
          payload: [
            { id: 'E1', type: 'T' },
            { id: 'E2', type: 'T' },
          ]
        },
      ]);
    });
    it('should be empty', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open({ send: (data) => { actual.push(data); } }, msg);
      buffering.close();

      assert.deepEqual(actual, [{ 'payload': [] }]);

    });
    it('should have a entity', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open({ send: (data) => { actual.push(data); } }, msg);
      buffering.out([{ id: 'E1', type: 'T' }]);
      buffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }] }]);

    });
  });
  describe('createParam', () => {
    it('idPatterm', async () => {
      const createParam = sourceNode.__get__('createParam');
      const msg = { payload: '.*' };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        buffering: true,
        keyValues: true,
        type: '',
        idPattern: '',
        attrs: '',
        q: '',
        limit: 100,
        offset: 0,
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.buffer = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: null,
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          buffering: true,
          keyValues: true,
          type: '',
          idPattern: '.*',
          attrs: '',
          q: '',
          limit: 100,
          offset: 0,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', async () => {
      const createParam = sourceNode.__get__('createParam');
      const msg = { payload: '.*' };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        buffering: false,
        keyValues: true,
        type: '',
        idPattern: '',
        attrs: '',
        q: '',
        limit: 100,
        offset: 0,
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: () => { }, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.buffer = null;
      actual.getToken = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: null,
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          buffering: false,
          keyValues: true,
          type: '',
          idPattern: '.*',
          attrs: '',
          q: '',
          limit: 100,
          offset: 0,
        },
      };

      assert.deepEqual(actual, expected);
    });
    it('payload is null', async () => {
      const createParam = sourceNode.__get__('createParam');

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        buffering: false,
        keyValues: false,
        type: '',
        idPattern: '',
        attrs: '',
        q: '',
        limit: 100,
        offset: 0,
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = createParam.call(node, { payload: null }, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(msg, 'payload is null');
    });
    it('payload not string or JSON Object', async () => {
      const createParam = sourceNode.__get__('createParam');

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        buffering: false,
        keyValues: false,
        type: '',
        idPattern: '',
        attrs: '',
        q: '',
        limit: 100,
        offset: 0,
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let msg = '';
      const node = { msg: '', error: (e) => { msg = e; } };

      const actual = createParam.call(node, { payload: [] }, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(msg, 'payload not string or JSON Object');
    });
  });
  describe('NGSI source node', () => {
    afterEach(() => {
      sourceNode.__ResetDependency__('getEntities');
    });
    it('payload string', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        buffering: 'on',
        limit: 100,
        offset: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      sourceNode.__set__('getEntities', (param) => { actual = param; });

      await red.inputWithAwait({ payload: '.*' });

      assert.equal(actual.config.idPattern, '.*');
    });
    it('payload object', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        buffering: 'on',
        limit: 100,
        offset: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      sourceNode.__set__('getEntities', (param) => { actual = param; });

      await red.inputWithAwait({ payload: { idPattern: '.*' } });

      assert.equal(actual.config.idPattern, '.*');
    });
    it('keyValues', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'keyvalues',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        buffering: 'off',
        limit: 100,
        offset: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      let actual;
      sourceNode.__set__('getEntities', (param) => { actual = param; });

      await red.inputWithAwait({ payload: '.*' });

      assert.equal(actual.config.keyValues, true);
    });
    it('payload empty', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: 'T',
        idpattern: '.*',
        attrs: 'temperature',
        query: 'temperature>20',
        buffering: 'off',
        limit: 100,
        offset: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => { },
          geType: 'orion',
        }
      });

      sourceNode.__set__('getEntities', () => { });

      await red.inputWithAwait({ payload: null });

      assert.equal(red.getMessage(), 'payload is null');
    });
    it('FIWARE GE type not Orion', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: 'T',
        idpattern: '.*',
        attrs: 'temperature',
        query: 'temperature>20',
        buffering: 'off',
        limit: 100,
        offset: 0,

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => { },
          geType: 'fiware',
        }
      });

      sourceNode.__set__('getEntities', () => { });

      await red.inputWithAwait({ payload: null });

      assert.equal(red.getMessage(), 'FIWARE GE type not Orion');
    });
  });
});
