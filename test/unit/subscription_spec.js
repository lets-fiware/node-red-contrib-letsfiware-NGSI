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
  
const subscriptionNode = require('../../src/nodes/NGSI/subscription/subscription.js');
const MockRed = require('./helpers/mockred.js');

describe('subscription.js', () => {
  describe('buildSubscription', () => {
    it('emplty param', async () => {
      const buildSubscription =subscriptionNode.__get__('buildSubscription'); 
      const param = {
        config: {
          data: {type:''},
        },
      };
      buildSubscription(param);

      assert.deepEqual(param .config.data, { subject: { entities: [{}] }, notification: {} });
    });
    it('subscription', async () => {
      const buildSubscription =subscriptionNode.__get__('buildSubscription'); 
      const param = {
        config: {
          data: {
            type: 'T',
            idPattern: '.*',
            watchedAttrs: 'temperature,humidity',
            q: 'temperature>10',
            url: 'http://context-consumer',
            attrs: 'humidity',
            'description': 'subscription for node-red',
            'expires': '2030-04-05T14:00:00.00Z',
            'throttling': 5
          },
        },
      };
      buildSubscription(param);

      assert.deepEqual(param .config.data, {
        'description': 'subscription for node-red',
        'notification': {
          'attrs': [
            'humidity'
          ],
          'http': {
            'url': 'http://context-consumer'
          }
        },
        'subject': {
          'condition': {
            'attrs': [
              'temperature',
              'humidity'
            ],
            'expression': {
              'q': 'temperature>10'
            }
          },
          'entities': [
            {
              'idPattern': '.*',
              'type': 'T'
            }
          ]
        },
        'expires': '2030-04-05T14:00:00.00Z',
        'throttling': 5
      });
    });
    it('subscription', async () => {
      const buildSubscription =subscriptionNode.__get__('buildSubscription'); 
      const param = {
        config: {
          data: {
            type: 'T',
            idPattern: '.*',
            url: 'http://context-consumer',
            q: 'temperature>10',
            mq:'accuracy>100',
            georel:'near',
            geometry: 'point',
            coords:'-40.4,-3.5',
          },
        },
      };
      buildSubscription(param);

      assert.deepEqual(param .config.data, {
        'notification': {
          'http': {
            'url': 'http://context-consumer'
          }
        },
        'subject': {
          'condition': {
            'expression': {
              coords: '-40.4,-3.5',
              geometry: 'point',
              georel: 'near',
              mq: 'accuracy>100',
              q: 'temperature>10',
            },
          },
          'entities': [
            {
              'idPattern': '.*',
              'type': 'T'
            }
          ]
        },
      });
    });
  });
  describe('createSubscription', () => {
    it('create subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: {'location': '/v2/subscriptions/5fa7988a627088ba9b91b1c1'},
        }),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: {data:{}}
      };

      const actuial = await createSubscription(param);
      assert.equal(actuial, '5fa7988a627088ba9b91b1c1');
    });
    it('create subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: {'location': '/v2/subscriptions/5fa7988a627088ba9b91b1c1'},
        }),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: {data:{subject:{}, notification:{}}}
      };

      const actuial = await createSubscription(param);
      assert.equal(actuial, '5fa7988a627088ba9b91b1c1');
    });
    it('should be 400 Bad Request', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request'}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: {data:{}}
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actuial = await createSubscription.call(node, param);
      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Error while creating subscription: 400 Bad Request']);
    });
    it('should be 400 Bad Request with orionError', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request', data:{orionError: 'orion error'}}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: {data:{}}
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actuial = await createSubscription.call(node, param);
      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Error while creating subscription: 400 Bad Request', 'Details: "orion error"']);
    });
    it('should be unknown error', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: {data:{}}
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actuial = await createSubscription.call(node, param);

      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Exception while creating subscription: unknown error']);
    });
  });
  describe('updateSubscription', () => {
    it('update subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
        }),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {data: {'expires': '2030-04-05T14:00:00.00Z' }}
      };

      const actual = await updateSubscription(param);

      assert.deepEqual(actual, {payload: 204});
    });
    it('should be 400 Bad Request', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request'}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {data: {'expires': '2030-04-05T14:00:00.00Z' }}
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actual= await updateSubscription.call(node, param);

      assert.deepEqual(actual, {payload: null});
      assert.deepEqual(msg, ['Error while updating subscription: 400 Bad Request']);
    });
    it('should be 400 Bad Request with orionError', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request', data:{orionError: 'orion error'}}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {data: {'expires': '2030-04-05T14:00:00.00Z' }}
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actual = await updateSubscription.call(node, param);

      assert.deepEqual(actual, {payload: null});
      assert.deepEqual(msg, ['Error while updating subscription: 400 Bad Request', 'Details: "orion error"']);
    });
    it('should be unknown error', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {data: {'expires': '2030-04-05T14:00:00.00Z' }}
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actual = await updateSubscription.call(node, param);

      assert.deepEqual(actual, {payload: null});
      assert.deepEqual(msg, ['Exception while updating subscription: unknown error']);
    });
  });
  describe('deleteSubscription', () => {
    it('delete subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
        }),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      const actual = await deleteSubscription(param);

      assert.deepEqual(actual, {payload: 204});
    });
    it('should be 400 Bad Request', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request'}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actual = await deleteSubscription.call(node, param);

      assert.deepEqual(actual, {payload: null});
      assert.deepEqual(msg, ['Error while deleting subscription: 400 Bad Request']);
    });
    it('should be 400 Bad Request with orionError', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request', data:{orionError: 'orion error'}}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actual = await deleteSubscription.call(node, param);

      assert.deepEqual(actual, {payload: null});
      assert.deepEqual(msg, ['Error while deleting subscription: 400 Bad Request', 'Details: "orion error"']);
    });
    it('should be unknown error', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      let msg = [];
      const node ={msg: '', error:(e)=>{msg.push(e);}};

      const actual = await deleteSubscription.call(node, param);

      assert.deepEqual(actual, {payload: null});
      assert.deepEqual(msg, ['Exception while deleting subscription: unknown error']);
    });
  });
  describe('NGSI subscription node', () => {
    afterEach(() => {
      subscriptionNode.__ResetDependency__('createSubscription');
      subscriptionNode.__ResetDependency__('updateSubscription');
      subscriptionNode.__ResetDependency__('deleteSubscription');
    });
    it('create subscripton', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => {},
        }
      });

      let actual;
      subscriptionNode.__set__('createSubscription', async (param) => {actual = param; return '5fa7988a627088ba9b91b1c1';});

      await red.inputWithAwait({payload: {idPattern: '.*', url: 'http://context-consumer'}});

      assert.deepEqual(red.getOutput(), {
        payload:{
          id:'5fa7988a627088ba9b91b1c1',
          service: 'openiot',
          servicepath: '/',
        }});
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/subscriptions');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.equal(actual.config.data.idPattern, '.*');
      assert.equal(actual.config.data.url, 'http://context-consumer');
    });
    it('create subscripton (string)', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      let actual;
      subscriptionNode.__set__('createSubscription', async (param) => {actual = param; return '5fa7988a627088ba9b91b1c1';});

      await red.inputWithAwait({payload: JSON.stringify({idPattern: '.*', url: 'http://context-consumer'})});

      assert.deepEqual(red.getOutput(), {
        payload:{
          id:'5fa7988a627088ba9b91b1c1',
          service: 'openiot',
          servicepath: '/',
        }});
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.getToken, null);
      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/subscriptions');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.equal(actual.config.data.idPattern, '.*');
      assert.equal(actual.config.data.url, 'http://context-consumer');
    });
    it('create subscripton with service, servicepath and limit', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      let actual;
      subscriptionNode.__set__('createSubscription', async (param) => {actual = param; return '5fa7988a627088ba9b91b1c1';});

      await red.inputWithAwait({
        payload: {
          idPattern: '.*',
          url: 'http://context-consumer',
          service: 'fiware',
          servicepath: '/device',
          limit: 100,
        }
      });

      assert.deepEqual(red.getOutput(), {
        payload:{
          id:'5fa7988a627088ba9b91b1c1',
          service: 'openiot',
          servicepath: '/',
        }});
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.getToken, null);
      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/subscriptions');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.equal(actual.config.data.idPattern, '.*');
      assert.equal(actual.config.data.url, 'http://context-consumer');
    });
    it('should be `not subscription payload` (number)', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      await red.inputWithAwait({payload: 1});

      assert.equal(red.getMessage(), 'not subscription payload');
    });
    it('create subscripton (error)', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      subscriptionNode.__set__('createSubscription', async () => {});

      await red.inputWithAwait({payload: {}});

      assert.deepEqual(red.getOutput(), { payload: null });
    });
    it('update subscripton', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      let actual;
      subscriptionNode.__set__('updateSubscription', async (param) => {actual = param;});

      await red.inputWithAwait({payload: {id: '5fa7988a627088ba9b91b1c1', 'expires': '2030-04-05T14:00:00.00Z'}});

      assert.equal(actual.pathname, '/v2/subscriptions/5fa7988a627088ba9b91b1c1');
    });
    it('delete subscripton', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        entitytypes: '',
        idpattern: '',
        watchedattrs: '',
        query: '',
        url: '',
        attrs: '',
        mode: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
        }
      });

      let actual;
      subscriptionNode.__set__('deleteSubscription', async (param) => {actual = param;});

      await red.inputWithAwait({payload: {id: '5fa7988a627088ba9b91b1c1'}});

      assert.equal(actual.pathname, '/v2/subscriptions/5fa7988a627088ba9b91b1c1');
    });
  });
});
