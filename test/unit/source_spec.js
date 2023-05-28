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
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: { 'fiware-total-count': 2 },
            data: [
              { id: 'E1', type: 'T' },
              { id: 'E2', type: 'T' }
            ]
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      let actual;
      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({
          send: (entities) => {
            actual = entities;
          }
        }),
        config: {
          offset: 0,
          limit: 1
        }
      };

      const msg = {};
      await getEntities(msg, param);

      assert.deepEqual(actual, {
        payload: [
          { id: 'E1', type: 'T' },
          { id: 'E2', type: 'T' }
        ],
        statusCode: 200
      });
    });
    it('get entities', async () => {
      sourceNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: { 'fiware-total-count': 2 },
            data: [
              { id: 'E1', type: 'T' },
              { id: 'E2', type: 'T' }
            ]
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      let actual;
      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({
          send: (entities) => {
            actual = entities;
          }
        }),
        config: {
          offset: 0,
          limit: 1
        }
      };

      const msg = {};
      await getEntities(msg, param);

      assert.deepEqual(actual, {
        payload: [
          { id: 'E1', type: 'T' },
          { id: 'E2', type: 'T' }
        ],
        statusCode: 200
      });
    });
    it('get no entities', async () => {
      sourceNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: { 'fiware-total-count': 0 },
            data: []
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      let actual;
      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({
          send: (entities) => {
            actual = entities;
          }
        }),
        config: {
          offset: 0,
          limit: 2
        }
      };

      const msg = {};
      await getEntities(msg, param);

      assert.deepEqual(actual, {
        payload: [],
        statusCode: 200
      });
    });
    it('total count 0', async () => {
      sourceNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 200,
            headers: { 'fiware-total-count': 0 },
            data: [{}]
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      let actual;
      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({
          send: (entities) => {
            actual = entities;
          }
        }),
        config: {
          offset: 0,
          limit: 2
        }
      };

      const msg = {};
      await getEntities(msg, param);

      assert.deepEqual(actual, {
        payload: [{}],
        statusCode: 200
      });
    });
    it('should be 400 Bad Request', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => {} }),
        config: {
          offset: 0,
          limit: 2
        }
      };

      let errmsg = '';
      let out = {};
      const node = {
        msg: '',
        error: (e) => {
          errmsg = e;
        },
        send: (o) => {
          out = o;
        }
      };

      const msg = {};
      await getEntities.call(node, msg, param);

      assert.equal(errmsg, 'Error while retrieving entities: 400 Bad Request');
      assert.deepEqual(out, { payload: undefined, statusCode: 400 });
    });
    it('should be 400 Bad Request with description', async () => {
      sourceNode.__set__('lib', {
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
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => {} }),
        config: {
          offset: 0,
          limit: 2
        }
      };

      let errmsg = [];
      let out = {};
      const node = {
        msg: '',
        error: (e) => {
          errmsg.push(e);
        },
        send: (o) => {
          out = o;
        }
      };

      const msg = {};
      await getEntities.call(node, msg, param);

      assert.deepEqual(errmsg, ['Error while retrieving entities: 400 Bad Request', 'Details: error']);
      assert.deepEqual(out, {
        payload: { description: 'error' },
        statusCode: 400
      });
    });
    it('Should be unknown error', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildParams: () => new URLSearchParams(),
        encodeNGSI: (data) => data,
        decodeNGSI: (data) => data
      });
      const getEntities = sourceNode.__get__('getEntities');
      const nobuffering = sourceNode.__get__('nobuffering');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        buffer: nobuffering.open({ send: () => {} }),
        config: {
          offset: 0,
          limit: 2
        }
      };

      let errmsg = '';
      let out = {};
      const node = {
        msg: '',
        error: (e) => {
          errmsg = e;
        },
        send: (o) => {
          out = o;
        }
      };

      const msg = {};
      await getEntities.call(node, msg, param);

      assert.equal(errmsg, 'Exception while retrieving entities: unknown error');
      assert.deepEqual(out, {
        payload: { error: 'unknown error' },
        statusCode: 500
      });
    });
  });
  describe('nobuffering', () => {
    it('should have a entity', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      nobuffering.send([{ id: 'E1', type: 'T' }]);
      nobuffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }], statusCode: 200 }]);
    });
    it('should have a entities', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      nobuffering.send([{ id: 'E1', type: 'T' }]);
      nobuffering.send([{ id: 'E2', type: 'T' }]);
      nobuffering.close();

      assert.deepEqual(actual, [
        { payload: [{ id: 'E1', type: 'T' }], statusCode: 200 },
        { payload: [{ id: 'E2', type: 'T' }], statusCode: 200 }
      ]);
    });
    it('should be empty', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      nobuffering.close();

      assert.deepEqual(actual, []);
    });
    it('should have a entity', () => {
      const nobuffering = sourceNode.__get__('nobuffering');
      const msg = {};
      const actual = [];

      nobuffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      nobuffering.out([{ id: 'E1', type: 'T' }]);
      nobuffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }], statusCode: 200 }]);
    });
  });
  describe('buffering', () => {
    it('should have a entity', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      buffering.send([{ id: 'E1', type: 'T' }]);
      buffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }], statusCode: 200 }]);
    });
    it('should have a entities', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      buffering.send([{ id: 'E1', type: 'T' }]);
      buffering.send([{ id: 'E2', type: 'T' }]);
      buffering.close();

      assert.deepEqual(actual, [
        {
          payload: [
            { id: 'E1', type: 'T' },
            { id: 'E2', type: 'T' }
          ],
          statusCode: 200
        }
      ]);
    });
    it('should be empty', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      buffering.close();

      assert.deepEqual(actual, [{ payload: [], statusCode: 200 }]);
    });
    it('should have a entity', () => {
      const buffering = sourceNode.__get__('buffering');
      const msg = {};
      const actual = [];

      buffering.open(
        {
          send: (data) => {
            actual.push(data);
          }
        },
        msg
      );
      buffering.out([{ id: 'E1', type: 'T' }]);
      buffering.close();

      assert.deepEqual(actual, [{ payload: [{ id: 'E1', type: 'T' }], statusCode: 200 }]);
    });
  });
  describe('createParam', () => {
    it('idPatterm', async () => {
      const createParam = sourceNode.__get__('createParam');
      const msg = { payload: '.*' };

      const config = {
        service: 'openiot',
        servicepath: '/',
        buffering: 'on',
        keyValues: 'keyValues',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: ''
      };

      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(typeof actual.buffer, 'object');
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
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('getToken', async () => {
      const createParam = sourceNode.__get__('createParam');
      const msg = { payload: '.*' };

      const config = {
        service: 'openiot',
        servicepath: '/',
        buffering: 'off',
        keyValues: 'keyValues',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
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

      assert.equal(typeof actual.buffer, 'object');
      actual.buffer = null;
      assert.equal(typeof actual.getToken, 'function');
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
          forbidden: false
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('FIWARE GE type not Orion', async () => {
      const createParam = sourceNode.__get__('createParam');

      const config = {
        service: 'openiot',
        servicepath: '/',
        buffering: 'off',
        keyValues: 'normalized',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        forbidden: 'false'
      };

      const openAPIsConfig = {
        geType: 'orion-ld',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const msg = { payload: null };
      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'FIWARE GE type not Orion' } });
    });
    it('payload is null', async () => {
      const createParam = sourceNode.__get__('createParam');

      const config = {
        service: 'openiot',
        servicepath: '/',
        buffering: 'off',
        keyValues: 'normalized',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        forbidden: 'false'
      };

      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const msg = { payload: null };
      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, { payload: { error: 'payload is null' } });
    });
    it('payload not string or JSON Object', async () => {
      const createParam = sourceNode.__get__('createParam');

      const config = {
        service: 'openiot',
        servicepath: '/',
        buffering: 'off',
        keyValues: 'normalized',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        forbidden: 'false'
      };

      const openAPIsConfig = {
        geType: 'orion',
        apiEndpoint: 'http://orion:1026',
        getToken: null,
        service: 'openiot',
        servicepath: '/'
      };

      const msg = { payload: [] };
      const actual = createParam(msg, config, openAPIsConfig);

      assert.equal(actual, null);
      assert.deepEqual(msg, {
        payload: { error: 'payload not string or JSON Object' }
      });
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
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion'
        }
      });

      let actual;
      sourceNode.__set__('getEntities', (msg, param) => {
        actual = param;
      });

      await red.inputWithAwait({ payload: '.*' });

      assert.deepEqual(actual.config, {
        service: 'openiot',
        servicepath: '/',
        buffering: true,
        keyValues: false,
        type: '',
        idPattern: '.*',
        attrs: '',
        q: '',
        limit: 100,
        offset: 0,
        forbidden: false
      });
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
        forbidden: 'false',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
          geType: 'fiware'
        }
      });

      sourceNode.__set__('getEntities', () => {});

      await red.inputWithAwait({ payload: null });

      assert.equal(red.getMessage(), 'FIWARE GE type not Orion');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'FIWARE GE type not Orion' },
        statusCode: 500
      });
    });
  });
});
