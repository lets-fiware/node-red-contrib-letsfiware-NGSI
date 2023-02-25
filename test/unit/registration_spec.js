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

const registrationNode = require('../../src/nodes/NGSI/registration/registration.js');
const MockRed = require('./helpers/mockred.js');

describe('registration.js', () => {
  describe('createRegistration', () => {
    afterEach(() => {
      registrationNode.__ResetDependency__('lib');
    });
    it('create registration', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 201,
          headers: { 'location': '/v2/registrations/63ed51173bdeaadaf909c57b' },
        }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createRegistration = registrationNode.__get__('createRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations',
        config: {
          data: {
            'description': 'Relative Humidity Context Source',
            'dataProvided': {
              'entities': [
                {
                  'id': 'room',
                  'type': 'Room'
                }
              ],
              'attrs': [
                'relativeHumidity'
              ]
            },
            'provider': {
              'http': {
                'url': 'http://orion:1026'
              }
            }
          }
        }
      };

      const actuial = await createRegistration(param);
      assert.equal(actuial, '63ed51173bdeaadaf909c57b');
    });
    it('should be 400 Bad Request', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createRegistration = registrationNode.__get__('createRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations',
        config: { data: {} }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actuial = await createRegistration.call(node, param);
      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Error while creating registration: 400 Bad Request']);
    });
    it('should be 400 Bad Request with description', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { description: 'error' } }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createRegistration = registrationNode.__get__('createRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations',
        config: { data: {} }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actuial = await createRegistration.call(node, param);
      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Error while creating registration: 400 Bad Request', 'Details: error']);
    });
    it('should be unknown error', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const createRegistration = registrationNode.__get__('createRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations',
        config: { data: {} }
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actuial = await createRegistration.call(node, param);

      assert.equal(actuial, null);
      assert.deepEqual(msg, ['Exception while creating registration: unknown error']);
    });
  });
  describe('deleteRegistration', () => {
    afterEach(() => {
      registrationNode.__ResetDependency__('lib');
    });
    it('delete registration', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 204,
        }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteRegistration = registrationNode.__get__('deleteRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations/63ed51173bdeaadaf909c57b',
        config: {},
      };

      const actual = await deleteRegistration(param);

      assert.deepEqual(actual, 204);
    });
    it('should be 400 Bad Request', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteRegistration = registrationNode.__get__('deleteRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations/63ed51173bdeaadaf909c57b',
        config: {},
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await deleteRegistration.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while deleting registration: 400 Bad Request']);
    });
    it('should be 400 Bad Request with description', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request', data: { description: 'error' } }),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteRegistration = registrationNode.__get__('deleteRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations/63ed51173bdeaadaf909c57b',
        config: {},
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await deleteRegistration.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Error while deleting registration: 400 Bad Request', 'Details: error']);
    });
    it('should be unknown error', async () => {
      registrationNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: () => { return {}; },
        buildSearchParams: () => new URLSearchParams(),
      });
      const deleteRegistration = registrationNode.__get__('deleteRegistration');

      const param = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations/63ed51173bdeaadaf909c57b',
        config: {},
      };

      let msg = [];
      const node = { msg: '', error: (e) => { msg.push(e); } };

      const actual = await deleteRegistration.call(node, param);

      assert.deepEqual(actual, null);
      assert.deepEqual(msg, ['Exception while deleting registration: unknown error']);
    });
  });
  describe('createParam', () => {
    it('create registration', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          'description': 'Relative Humidity Context Source',
          'dataProvided': {
            'entities': [
              {
                'id': 'room',
                'type': 'Room'
              }
            ],
            'attrs': [
              'relativeHumidity'
            ]
          },
          'provider': {
            'http': {
              'url': 'http://orion:1026'
            }
          }
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'create',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          id: '',
          registration: {
            'description': 'Relative Humidity Context Source',
            'dataProvided': {
              'entities': [
                {
                  'id': 'room',
                  'type': 'Room'
                }
              ],
              'attrs': [
                'relativeHumidity'
              ]
            },
            'provider': {
              'http': {
                'url': 'http://orion:1026'
              }
            }
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('create registration with actionType', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'create',
          registration: {
            'description': 'Relative Humidity Context Source',
            'dataProvided': {
              'entities': [
                {
                  'id': 'room',
                  'type': 'Room'
                }
              ],
              'attrs': [
                'relativeHumidity'
              ]
            },
            'provider': {
              'http': {
                'url': 'http://orion:1026'
              }
            }
          },
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        registration: {},
        id: '',
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations',
        getToken: null,
        contentType: 'json',
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'create',
          id: '',
          registration: {
            'description': 'Relative Humidity Context Source',
            'dataProvided': {
              'entities': [
                {
                  'id': 'room',
                  'type': 'Room'
                }
              ],
              'attrs': [
                'relativeHumidity'
              ]
            },
            'provider': {
              'http': {
                'url': 'http://orion:1026'
              }
            }
          },
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('delete registration', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = { payload: '63ed51173bdeaadaf909c57b' };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'delete',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations/63ed51173bdeaadaf909c57b',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          id: '63ed51173bdeaadaf909c57b',
          registration: {},
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('delete registration with actionType', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'delete',
          id: '63ed51173bdeaadaf909c57b',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      const actual = createParam(msg, defaultConfig, openAPIsConfig);
      actual.func = null;

      const expected = {
        host: 'http://orion:1026',
        pathname: '/v2/registrations/63ed51173bdeaadaf909c57b',
        getToken: null,
        config: {
          service: 'openiot',
          servicepath: '/',
          actionType: 'delete',
          id: '63ed51173bdeaadaf909c57b',
          registration: {},
        },
        func: null,
      };

      assert.deepEqual(actual, expected);
    });
    it('registration not JSON object', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'create',
          registration: '',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'registration not JSON object');
    });
    it('actionType not found', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          id: '63ed51173bdeaadaf909c57b',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'actionType not found');
    });
    it('payload not string', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = { payload: {} };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'delete',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not string');
    });
    it('payload not JSON object', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = { payload: 'payload' };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'create',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'payload not JSON object');
    });
    it('registration id not string', async () => {
      const createParam = registrationNode.__get__('createParam');
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
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'registration id not string');
    });
    it('ActionType error', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          actionType: 'upsert',
          id: '63ed51173bdeaadaf909c57b',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'payload',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: upsert');
    });
    it('ActionType error', async () => {
      const createParam = registrationNode.__get__('createParam');
      const msg = {
        payload: {
          id: '63ed51173bdeaadaf909c57b',
        }
      };

      const defaultConfig = {
        service: 'openiot',
        servicepath: '/',
        actionType: 'upsert',
        id: '',
        registration: {},
      };

      const openAPIsConfig = { apiEndpoint: 'http://orion:1026', getToken: null, service: 'openiot', servicepath: '/' };

      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = createParam.call(node, msg, defaultConfig, openAPIsConfig);

      assert.equal(actual, null);
      assert.equal(err, 'ActionType error: upsert');
    });
  });
  describe('NGSI registration node', () => {
    afterEach(() => {
      registrationNode.__ResetDependency__('createRegistration');
      registrationNode.__ResetDependency__('deleteRegistration');
    });
    it('create registration', async () => {
      const red = new MockRed();
      registrationNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'create',
        registrationId: '',
        registration: {},

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: () => { },
          geType: 'orion',
        }
      });

      let actual;
      registrationNode.__set__('createRegistration', async (param) => { actual = param; return '63ed51173bdeaadaf909c57b'; });

      await red.inputWithAwait({
        payload: {
          'description': 'Relative Humidity Context Source',
          'dataProvided': {
            'entities': [
              {
                'id': 'room',
                'type': 'Room'
              }
            ],
            'attrs': [
              'relativeHumidity'
            ]
          },
          'provider': {
            'http': {
              'url': 'http://orion:1026'
            }
          }
        }
      });

      const expected = {
        'description': 'Relative Humidity Context Source',
        'dataProvided': {
          'entities': [
            {
              'id': 'room',
              'type': 'Room'
            }
          ],
          'attrs': [
            'relativeHumidity'
          ]
        },
        'provider': {
          'http': {
            'url': 'http://orion:1026'
          }
        }
      };

      assert.deepEqual(red.getOutput(), {
        payload: '63ed51173bdeaadaf909c57b',
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/'
        }
      });
      assert.equal(actual.contentType, 'json');
      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/v2/registrations');
      assert.equal(actual.config.service, 'openiot');
      assert.equal(actual.config.servicepath, '/');
      assert.deepEqual(actual.config.registration, expected);
    });
    it('ActionType error', async () => {
      const red = new MockRed();
      registrationNode(red);
      red.createNode({
        servicepath: '/',
        actionType: 'payload',
        registrationId: '',
        registration: {},

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'orion',
        }
      });

      registrationNode.__set__('deleteRegistration', async () => { });

      await red.inputWithAwait({ payload: { actionType: 'upsert', id: '' } });

      assert.equal(red.getMessage(), 'ActionType error: upsert');
    });
    it('FIWARE GE type not Orion', async () => {
      const red = new MockRed();
      registrationNode(red);
      red.createNode({
        servicepath: '/',
        actionType: '',
        id: '',
        registration: {},

        openapis: {
          apiEndpoint: 'http://orion:1026',
          service: 'openiot',
          getToken: null,
          geType: 'fiware',
        }
      });

      registrationNode.__set__('deleteRegistration', async () => { });

      await red.inputWithAwait({ payload: { id: '63ed51173bdeaadaf909c57b' } });

      assert.equal(red.getMessage(), 'FIWARE GE type not Orion');
    });
  });
});
