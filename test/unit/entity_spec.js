/*
   MIT License
 
   Copyright 2022 Kazuhito Suda
 
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
  
const entityNode = require('../../src/nodes/NGSI/entity/entity.js');
const MockRed = require('./helpers/mockred.js');

describe('entity.js', () => {
  describe('getEntity', () => {
    it('get entity', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          data: {id: 'E1', type: 'T'}
        }),
        buildHTTPHeader: ()=>{return{};},
        buildParams: () =>new URLSearchParams(),
      });
      const getEntity = entityNode.__get__('getEntity');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        config: {
          id: 'E1'
        }
      };

      const actual = await getEntity(param);

      assert.deepEqual(actual, {id: 'E1', type: 'T'});
    });
    it('should be 400 Bad Request', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request'}),
        buildHTTPHeader: ()=>{return{};},
        buildParams: () =>new URLSearchParams(),
      });
      const getEntity = entityNode.__get__('getEntity');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        config: {
          id: 'E1'
        }
      };

      let msg = '';
      const node ={msg: '', error:(e)=>{msg = e;}};
      
      const actual = await getEntity.call(node, param);

      assert.equal(actual, null);
      assert.equal(msg, 'Error while retrieving entities: 400 Bad Request');
    });
    it('Should be unknown error', async () => {
      entityNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: ()=>{return{};},
        buildParams: () =>new URLSearchParams(),
      });
      const getEntity = entityNode.__get__('getEntity');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/entities',
        config: {
          id: 'E1'
        }
      };

      let msg = '';
      const node ={msg: '', error:(e)=>{msg = e;}};

      const actual = await getEntity.call(node, param);

      assert.equal(actual, null);
      assert.equal(msg, 'Exception while retrieving entities: unknown error');
    });
  });
  describe('NGSI entity node', () => {
    afterEach(() => {
      entityNode.__ResetDependency__('getEntity');
    });
    it('payload string', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: 'T1',
        attrs: 'A1',

        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      let actual;
      entityNode.__set__('getEntity', (param) => {actual = param; return {'id': 'E1', 'type': 'T1'};});

      await red.inputWithAwait({payload: 'E1'});

      assert.deepEqual(red.getOutput(), { payload: { id: 'E1', type: 'T1' } });
      assert.deepEqual(actual.config, {
        'attrs': 'A1',
        'id': 'E1',
        'keyValues': false,
        'service': 'openiot',
        'servicepath': '/',
        'type': 'T1'
      });
    });
    it('payload object', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: 'T1',
        attrs: 'A1',

        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });

      let actual;
      entityNode.__set__('getEntity', (param) => {actual = param; return {'id': 'E1', 'type': 'T2'};});

      await red.inputWithAwait({payload: {id: 'E1', entitytype: 'T2', attrs: 'A2', service: 'iot', servicepath: '/device', keyValues: true}});

      assert.deepEqual(red.getOutput(), { payload: { id: 'E1', type: 'T2' } });
      assert.deepEqual(actual.config, {
        'attrs': 'A2',
        'entitytype': 'T2',
        'id': 'E1',
        'keyValues': true,
        'service': 'iot',
        'servicepath': '/device',
        'type': 'T1'
      });
    });
    it('keyValues', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'keyvalues',
        entitytype: '',
        idpattern: '',
        attrs: '',
        query: '',
        buffering: 'off',

        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });

      let actual;
      entityNode.__set__('getEntity', (param) => {actual = param; return {'id': 'E2', 'type': 'T2'};});

      await red.inputWithAwait({payload: 'E2'});

      assert.deepEqual(red.getOutput(), { payload: { id: 'E2', type: 'T2' } });
      assert.deepEqual(actual.config, {
        'attrs': '',
        'id': 'E2',
        'keyValues': true,
        'service': 'openiot',
        'servicepath': '/',
        'type': '',
      });
    });
    it('payload empty', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: '',
        attrs: '',
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });

      await red.inputWithAwait({payload: null});

      assert.equal(red.getMessage(), 'Entity Id missing');
    });
    it('entity id empty', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: '',
        attrs: '',
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });

      await red.inputWithAwait({payload: ''});

      assert.equal(red.getMessage(), 'Entity Id missing');
    });
    it('entity not found', async () => {
      const red = new MockRed();
      entityNode(red);
      red.createNode({
        servicepath: '/',
        mode: 'normalized',
        entitytype: '',
        attrs: '',
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });
      entityNode.__set__('getEntity', () => {return null;});

      await red.inputWithAwait({payload: 'E1'});
    });
  });
});
