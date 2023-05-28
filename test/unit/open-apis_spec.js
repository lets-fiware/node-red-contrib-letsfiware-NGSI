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

const openAPIsNode = require('../../src/nodes/NGSI/open-apis/open-apis.js');
const MockRed = require('./helpers/mockred.js');

describe('open-apis.js', () => {
  describe('Open APIs node', () => {
    it('Init Open APIs node', async () => {
      const red = new MockRed();
      openAPIsNode(red);
      red.createNode({
        name: '',
        apiEndpoint: 'http://orion:1026',
        service: 'openiot',
        idmEndpoint: '',
        idmType: ''
      });
    });
    it('Init Open APIs node', async () => {
      const red = new MockRed();
      openAPIsNode(red);
      red.createNode({
        name: '',
        apiEndpoint: 'http://orion:1026',
        service: 'openiot',
        idmEndpoint: '',
        idmType: 'none'
      });
    });
    it('Init Open APIs node with IdM', async () => {
      const red = new MockRed();
      openAPIsNode(red);
      red.createNode({
        name: '',
        apiEndpoint: 'http://orion:1026',
        service: 'openiot',
        idmEndpoint: '',
        idmType: 'keyrock'
      });
    });
  });
  describe('urlValidator', () => {
    let urlValidator;
    before(() => {
      urlValidator = openAPIsNode.__get__('urlValidator');
    });
    after(() => {
      openAPIsNode.__ResetDependency__('urlValidator');
    });
    it('should be http://orion:1026', async () => {
      const actual = urlValidator('http://orion:1026');
      assert.equal(actual, 'http://orion:1026');
    });
    it('should be http://orion:1026', async () => {
      const actual = urlValidator('http://orion:1026/');
      assert.equal(actual, 'http://orion:1026');
    });
    it('should be http://orion:1026', async () => {
      const actual = urlValidator('http://orion:1026/version');
      assert.equal(actual, 'http://orion:1026/version');
    });
    it('should be null', async () => {
      const actual = urlValidator('');
      assert.equal(actual, null);
    });
    it('should be null', async () => {
      const actual = urlValidator('http://');
      assert.equal(actual, null);
    });
    it('should be null', async () => {
      const actual = urlValidator('mail://');
      assert.equal(actual, null);
    });
  });
  describe('getToken', () => {
    let getToken;
    before(() => {
      getToken = openAPIsNode.__get__('getToken');
    });
    after(() => {
      openAPIsNode.__ResetDependency__('getToken');
    });
    afterEach(() => {
      openAPIsNode.__ResetDependency__('http');
    });
    it('should get cached access token', async () => {
      const config = {
        accessToken: '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4',
        tokenExpires: new Date(Date.now() + 10 * 1000)
      };
      const actual = await getToken.call(config);
      assert.equal(actual, '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4');
    });
    it('should get access token', async () => {
      const config = {
        idmType: 'tokenproxy',
        idmEndpoint: 'http://orion:1026',
        credentials: {
          username: 'fiware',
          password: '1234',
          clientid: null,
          clientsecret: null
        },
        accessToken: '',
        tokenExpires: null
      };
      openAPIsNode.__set__('http', async () => {
        return {
          status: 200,
          data: {
            access_token: '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4',
            token_type: 'bearer',
            expires_in: 3599,
            refresh_token: '8b23aeabcb97b2b6b09670c8fa4c448a46ab5268',
            scope: ['bearer']
          }
        };
      });
      const actual = await getToken.call(config);
      assert.equal(actual, '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4');
    });
    it('should get access token', async () => {
      const config = {
        idmType: 'tokenproxy',
        idmEndpoint: 'http://orion:1026/token',
        credentials: {
          username: 'fiware',
          password: '1234',
          clientid: null,
          clientsecret: null
        },
        accessToken: '',
        tokenExpires: null
      };
      openAPIsNode.__set__('http', async () => {
        return {
          status: 200,
          data: {
            access_token: '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4',
            token_type: 'bearer',
            expires_in: 3599,
            refresh_token: '8b23aeabcb97b2b6b09670c8fa4c448a46ab5268',
            scope: ['bearer']
          }
        };
      });
      const actual = await getToken.call(config);
      assert.equal(actual, '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4');
    });
    it('should get access token', async () => {
      const config = {
        idmType: 'keyrock',
        idmEndpoint: 'http://keyrock:3000',
        credentials: {
          username: 'fiware',
          password: '1234',
          clientid: '58de156f-0fec-400b-bc7c-86265a885bee',
          clientsecret: '921cf732-b39c-4e7c-815c-a91277e52b70'
        },
        accessToken: '',
        tokenExpires: null
      };
      openAPIsNode.__set__('http', async () => {
        return {
          status: 200,
          data: {
            access_token: '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4',
            token_type: 'bearer',
            expires_in: 3599,
            refresh_token: '8b23aeabcb97b2b6b09670c8fa4c448a46ab5268',
            scope: ['bearer']
          }
        };
      });
      const actual = await getToken.call(config);
      assert.equal(actual, '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4');
    });
    it('should get access token', async () => {
      const config = {
        idmType: 'generic',
        idmEndpoint: 'http://generic',
        credentials: {
          username: 'fiware',
          password: '1234',
          clientid: '58de156f-0fec-400b-bc7c-86265a885bee',
          clientsecret: '921cf732-b39c-4e7c-815c-a91277e52b70'
        },
        accessToken: '',
        tokenExpires: null
      };
      openAPIsNode.__set__('http', async () => {
        return {
          status: 200,
          data: {
            access_token: '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4',
            token_type: 'bearer',
            expires_in: 3599,
            refresh_token: '8b23aeabcb97b2b6b09670c8fa4c448a46ab5268',
            scope: ['bearer']
          }
        };
      });
      const actual = await getToken.call(config);
      assert.equal(actual, '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4');
    });
    it('should be 401 Unauthorized error', async () => {
      let message;
      const config = {
        idmType: 'generic',
        idmEndpoint: 'http://generic',
        credentials: {
          username: 'fiware',
          password: '1234',
          clientid: '58de156f-0fec-400b-bc7c-86265a885bee',
          clientsecret: '921cf732-b39c-4e7c-815c-a91277e52b70'
        },
        accessToken: '',
        tokenExpires: null,
        error: (msg) => {
          message = msg;
        }
      };
      openAPIsNode.__set__('http', async () => {
        return { status: 401, statusText: 'Unauthorized' };
      });
      await getToken.call(config);
      assert.equal(message, 'Error while obtaining token. Status Code: 401 Unauthorized');
    });
    it('should be unknown error', async () => {
      let message;
      const config = {
        idmType: 'generic',
        idmEndpoint: 'http://generic',
        credentials: {
          username: 'fiware',
          password: '1234',
          clientid: '58de156f-0fec-400b-bc7c-86265a885bee',
          clientsecret: '921cf732-b39c-4e7c-815c-a91277e52b70'
        },
        accessToken: '',
        tokenExpires: null,
        error: (msg) => {
          message = msg;
        }
      };
      openAPIsNode.__set__('http', async () => Promise.reject('unknown error'));
      await getToken.call(config);
      assert.equal(message, 'Exception while obtaining token: unknown error');
    });
  });
});
