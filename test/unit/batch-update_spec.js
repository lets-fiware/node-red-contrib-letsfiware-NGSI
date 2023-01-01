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
  describe('batch update node', () => {
    afterEach(() => {
      batchUpdateNode.__ResetDependency__('opUpdate');
    });
    it('append an entity', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'append',
        servicepath: '/',
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });

      let actual;
      batchUpdateNode.__set__('opUpdate', (param) => actual = param);

      await red.inputWithAwait({payload: {id: 'E1', type: 'T'}});

      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/op/update');
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.deepEqual(actual.config.data, {actionType: 'append', entities:[{id: 'E1', type: 'T'}]});
    });
    it('update entities', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'update',
        servicepath: '/device',
        openapis: {
          brokerEndpoint: 'http://myorion:1026',
          service: 'fiware',
          getToken: null,
        }
      });

      let actual;
      batchUpdateNode.__set__('opUpdate', (param) => actual = param);

      await red.inputWithAwait({payload: [{id: 'E1', type: 'T'}, {id: 'E2', type: 'T'}]});

      assert.equal(actual.host, 'http://myorion:1026');
      assert.equal(actual.pathname, '/v2/op/update');
      assert.equal(actual.getToken, null);
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.config.service, 'fiware');
      assert.equal(actual.config.servicepath, '/device');
      assert.deepEqual(actual.config.data, {actionType: 'update', entities:[{id: 'E1', type: 'T'},{id: 'E2', type: 'T'}]});
    });
    it('update entities with actionType', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'update',
        servicepath: '/',
        openapis: {
          brokerEndpoint: 'http://myorion:1026',
          service: 'fiware',
          getToken: null,
        }
      });

      let actual;
      batchUpdateNode.__set__('opUpdate', (param) => actual = param);

      await red.inputWithAwait({payload: {actionType: 'update', entities:[{id: 'E1', type: 'T'},{id: 'E2', type: 'T'}]}});

      assert.equal(actual.host, 'http://myorion:1026');
      assert.equal(actual.pathname, '/v2/op/update');
      assert.equal(actual.getToken, null);
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.config.service, 'fiware');
      assert.equal(actual.config.servicepath, '/');
      assert.deepEqual(actual.config.data, {actionType: 'update', entities:[{id: 'E1', type: 'T'},{id: 'E2', type: 'T'}]});
    });
    it('update entities with actionType (string)', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'update',
        servicepath: '/',
        openapis: {
          brokerEndpoint: 'http://myorion:1026',
          service: 'fiware',
          getToken: null,
        }
      });

      let actual;
      batchUpdateNode.__set__('opUpdate', (param) => actual = param);

      await red.inputWithAwait({payload: JSON.stringify({actionType: 'update', entities:[{id: 'E1', type: 'T'},{id: 'E2', type: 'T'}]})});

      assert.equal(actual.host, 'http://myorion:1026');
      assert.equal(actual.pathname, '/v2/op/update');
      assert.equal(actual.getToken, null);
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.config.service, 'fiware');
      assert.equal(actual.config.servicepath, '/');
      assert.deepEqual(actual.config.data, {actionType: 'update', entities:[{id: 'E1', type: 'T'},{id: 'E2', type: 'T'}]});
    });
    it('payload missing', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'append',
        servicepath: '/',
        openapis: {
          borkerNedpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });
      await red.inputWithAwait({});

      assert.equal(red.getMessage(), 'payload missing');
    });
    it('payload not JSON Object', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'append',
        servicepath: '/',
        openapis: {
          borkerNedpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });
      await red.inputWithAwait({payload: 1});

      assert.equal(red.getMessage(), 'payload not JSON Object');
    });
    it('payload incorrect', async () => {
      const red = new MockRed();
      batchUpdateNode(red);
      red.createNode({
        actiontype: 'append',
        servicepath: '/',
        openapis: {
          borkerNedpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });
      await red.inputWithAwait({payload: {}});

      assert.equal(red.getMessage(), 'actionType and/or entities missing');
    });
  });

  describe('opUpdate', () => {
    afterEach(() => {
      batchUpdateNode.__ResetDependency__('lib');
    });
    it('Should be 204 No Content', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve({status: 204, statusText: 'No Content'}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: {data:{}}
      };
      const msg = {
        payload: null
      };
      let message;
      const node = {send:(msg)=>{message = msg;}};
      const actual = await opUpdate.call(node, param, msg);
  
      assert.equal(actual.status, 204);
      assert.equal(actual.status, 204);
      assert.equal(actual.statusText, 'No Content');
      assert.equal(message.payload, 204);
    });
    it('Should be 400 Bad Request', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request'}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: {data:{}}
      };
      const msg = {
        payload: null
      };
      let errmsg;
      let message;
      const node = {error:(e)=>{errmsg= e;}, send:(msg)=>{message = msg;}};
      const actual = await opUpdate.call(node, param, msg);
  
      assert.equal(actual.status, 400);
      assert.equal(actual.statusText, 'Bad Request');
      assert.equal(errmsg, 'Error while updating entities: 400 Bad Request');
      assert.equal(message.payload, null);
    });
    it('Should be 400 Bad Request with orionError', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.resolve(
          {status: 400,
            statusText: 'Bad Request',
            data: {orionError: 'orionError'}
          }),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: {data:{}}
      };
      const msg = {
        payload: null
      };
      let errmsg;
      let message;
      const node = {error:(e)=>{errmsg= e;}, send:(msg)=>{message = msg;}};
      const actual = await opUpdate.call(node, param, msg);
  
      assert.equal(actual.status, 400);
      assert.equal(actual.statusText, 'Bad Request');
      assert.equal(errmsg, 'Details: "orionError"');
      assert.equal(message.payload, null);
    });
    it('Should be unknown error', async () => {
      batchUpdateNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const param = {
        host: 'http://orion:1026',
        url: '/v2/op/update',
        config: {data:{}}
      };
      const msg = {
        payload: null
      };
      let errmsg;
      let message;
      const node = {error:(e)=>{errmsg= e;}, send:(msg)=>{message = msg;}};
      await opUpdate.call(node, param, msg);
  
      assert.equal(errmsg, 'Exception while updating entities: unknown error');
      assert.equal(message.payload, null);
    });
  });
});
