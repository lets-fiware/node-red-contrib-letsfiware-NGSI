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
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const param = {
        type: '',
      };

      const actual = buildSubscription(param);

      const expected = {};

      assert.deepEqual(actual, expected);
    });
    it('subscription with query', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const param = {
        type: 'T',
        idPattern: '.*',
        watchedAttrs: 'temperature,humidity',
        q: 'temperature>10',
        url: 'http://context-consumer',
        attrs: 'humidity',
        'description': 'subscription for node-red',
        'expires': '2030-04-05T14:00:00.00Z',
        'throttling': 5
      };

      const actual = buildSubscription(param);

      const expeced = {
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
      };

      assert.deepEqual(actual, expeced);
    });
    it('subscription with geoquery', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const param = {
        type: 'T',
        idPattern: '.*',
        url: 'http://context-consumer',
        q: 'temperature>10',
        mq: 'accuracy>100',
        georel: 'near',
        geometry: 'point',
        coords: '-40.4,-3.5',
      };

      const actual = buildSubscription(param);

      const expeced = {
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
      };

      assert.deepEqual(actual, expeced);
    });
  });
  describe('createSubscription', () => {
    afterEach(() => {
      subscriptionNode.__ResetDependency__('lib');
    });
    it('create subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: { 'location': '/v2/subscriptions/5fa7988a627088ba9b91b1c1' },
        }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: { data: {} }
      };

      const actuial = await createSubscription(param);
      assert.equal(actuial, '5fa7988a627088ba9b91b1c1');
    });
    it('create subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: { 'location': '/v2/subscriptions/5fa7988a627088ba9b91b1c1' },
        }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: { data: { subject: {}, notification: {} } }
      };

      const actuial = await createSubscription(param);
      assert.equal(actuial, '5fa7988a627088ba9b91b1c1');
    });
    it('should be 400 Bad Request', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: { data: {} }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actuial = await createSubscription.call(node, param);
      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Error while creating subscription: 400 Bad Request']);
    });
    it('should be 400 Bad Request with orionError', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { orionError: 'orion error' } }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: { data: {} }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actuial = await createSubscription.call(node, param);
      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Error while creating subscription: 400 Bad Request', 'Details: "orion error"']);
    });
    it('should be unknown error', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createSubscription = subscriptionNode.__get__('createSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        config: { data: {} }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actuial = await createSubscription.call(node, param);

      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Exception while creating subscription: unknown error']);
    });
  });
  describe('updateSubscription', () => {
    afterEach(() => {
      subscriptionNode.__ResetDependency__('lib');
    });
    it('update subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
        }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: { data: { 'expires': '2030-04-05T14:00:00.00Z' } }
      };

      const actual = await updateSubscription(param);

      assert.deepEqual(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: { data: { 'expires': '2030-04-05T14:00:00.00Z' } }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await updateSubscription.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while updating subscription: 400 Bad Request']);
    });
    it('should be 400 Bad Request with orionError', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { orionError: 'orion error' } }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: { data: { 'expires': '2030-04-05T14:00:00.00Z' } }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await updateSubscription.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while updating subscription: 400 Bad Request', 'Details: "orion error"']);
    });
    it('should be unknown error', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const updateSubscription = subscriptionNode.__get__('updateSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: { data: { 'expires': '2030-04-05T14:00:00.00Z' } }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await updateSubscription.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Exception while updating subscription: unknown error']);
    });
  });
  describe('deleteSubscription', () => {
    afterEach(() => {
      subscriptionNode.__ResetDependency__('lib');
    });
    it('delete subscription', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
        }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      const actual = await deleteSubscription(param);

      assert.deepEqual(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await deleteSubscription.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while deleting subscription: 400 Bad Request']);
    });
    it('should be 400 Bad Request with orionError', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { orionError: 'orion error' } }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await deleteSubscription.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while deleting subscription: 400 Bad Request', 'Details: "orion error"']);
    });
    it('should be unknown error', async () => {
      subscriptionNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteSubscription = subscriptionNode.__get__('deleteSubscription');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        config: {},
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await deleteSubscription.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Exception while deleting subscription: unknown error']);
    });
  });
  describe('createParam', () => {
    it('create subscription', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = { payload: { notification: {}, subject: {} } };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'create',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          id: '',
          subscription: {
            notification: {},
            subject: {},
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('create subscription with actionType', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'create',
          subscription: {},
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          id: '',
          subscription: {
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('update subscription', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          subscription: {},
          id: '5fa7988a627088ba9b91b1c1',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'update',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: '5fa7988a627088ba9b91b1c1',
          subscription: {
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('update subscription with payload', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'update',
          subscription: {},
          id: '5fa7988a627088ba9b91b1c1',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'update',
          id: '5fa7988a627088ba9b91b1c1',
          subscription: {
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('delete subscription', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = { payload: '5fa7988a627088ba9b91b1c1' };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'delete',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          id: '5fa7988a627088ba9b91b1c1',
          subscription: {
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('delete subscription with actionType', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'delete',
          id: '5fa7988a627088ba9b91b1c1',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/subscriptions/5fa7988a627088ba9b91b1c1',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          id: '5fa7988a627088ba9b91b1c1',
          subscription: {
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('actionType not found', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          id: '5fa7988a627088ba9b91b1c1',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType not found');
    });
    it('payload not string', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = { payload: {} };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'delete',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not string');
    });
    it('payload not JSON object', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = { payload: 'payload' };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'update',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON object');
    });
    it('subscription id not fouond', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = { payload: {} };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'update',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'subscription id not found');
    });
    it('subscription id not string', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'delete',
          id: 1234,
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'subscription id not string');
    });
    it('ActionType error', async () => {
      const buildSubscription = subscriptionNode.__get__('buildSubscription');
      const createParam = subscriptionNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'upsert',
          id: '5fa7988a627088ba9b91b1c1',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        subscription: buildSubscription({
          type: '',
          idPattern: '',
          watchedAttrs: '',
          q: '',
          url: '',
          attrs: '',
          attrsFormat: '',
        }),
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: upsert');
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
        actionType: 'create',
        entityType: '',
        idPattern: '',
        watchedAttrs: '',
        query: '',
        url: '',
        attrs: '',
        attrsFormat: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => { },
          geType: 'orion',
        }
      });

      let actual;
      subscriptionNode.__set__('createSubscription', async (param) => { actual = param; return '5fa7988a627088ba9b91b1c1'; });

      await red.inputWithAwait({ payload: { idPattern: '.*', url: 'http://context-consumer' } });

      assert.deepEqual(red.getOutput(), {
        payload: '5fa7988a627088ba9b91b1c1',
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/'
        }
      });
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/subscriptions');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.equal(actual.config.subscription.subject.entities[0].idPattern, '.*');
      assert.equal(actual.config.subscription.notification.http.url, 'http://context-consumer');
    });
    it('ActionType error', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'upsert',
        entityType: '',
        idPattern: '',
        watchedAttrs: '',
        query: '',
        url: '',
        attrs: '',
        attrsFormat: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      subscriptionNode.__set__('deleteSubscription', async () => { });

      await red.inputWithAwait({ payload: { id: '' } });

      assert.equal(red.getMessage(), 'ActionType error: upsert');
    });
    it('FIWARE GE type not Orion', async () => {
      const red = new MockRed();
      subscriptionNode(red);
      red.createNode({
        servicepath: '/',
        actionType: '',
        entityType: '',
        idPattern: '',
        watchedAttrs: '',
        query: '',
        url: '',
        attrs: '',
        attrsFormat: 'normalized',

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'fiware',
        }
      });

      subscriptionNode.__set__('deleteSubscription', async () => { });

      await red.inputWithAwait({ payload: { id: '5fa7988a627088ba9b91b1c1' } });

      assert.equal(red.getMessage(), 'FIWARE GE type not Orion');
    });
  });
});
