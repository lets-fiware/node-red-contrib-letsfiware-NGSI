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
  
const sourceNode = require('../../src/nodes/NGSI/version/version.js');
const MockRed = require('./helpers/mockred.js');

const orion_version = JSON.parse('{"orion":{"version":"3.7.0","uptime":"0d,0h,0m,1s","git_hash":"8b19705a8ec645ba1452cb97847a5615f0b2d3ca","compile_time":"ThuMay2611:45:49UTC2022","compiled_by":"root","compiled_in":"025d96e1419a","release_date":"ThuMay2611:45:49UTC2022","machine":"x86_64","doc":"https://fiware-orion.rtfd.io/en/3.7.0/","libversions":{"boost":"1_74","libcurl":"libcurl/7.74.0OpenSSL/1.1.1nzlib/1.2.11brotli/1.0.9libidn2/2.3.0libpsl/0.21.0(+libidn2/2.3.0)libssh2/1.9.0nghttp2/1.43.0librtmp/2.3","libmosquitto":"2.0.12","libmicrohttpd":"0.9.70","openssl":"1.1","rapidjson":"1.1.0","mongoc":"1.17.4","bson":"1.17.4"}}}');

describe('version.js', () => {
  describe('getVersion', () => {
    it('get version', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({
          status: 200,
          data: orion_version
        }),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const getVersion= sourceNode.__get__('getVersion');

      const param = {
        host: 'http://orion:1026',
        pathname: '/version'
      };

      const res = await getVersion(param);

      assert.equal(res, orion_version);
    });
    it('should be 400 Bad Request', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.resolve({status: 400, statusText: 'Bad Request'}),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const getVersion= sourceNode.__get__('getVersion');

      const param = {
        host: 'http://orion:1026',
        pathname: '/version'
      };

      let msg = '';
      const node ={msg: '', error:(e)=>{msg = e;}};
      const res = await getVersion.call(node, param);
      
      assert.equal(res, null);
      assert.equal(msg, 'Error while getting version: 400 Bad Request');
    });
    it('Should be unknown error', async () => {
      sourceNode.__set__('lib', {
        http: async () => Promise.reject('unknown error'),
        buildHTTPHeader: ()=>{return{};},
        buildSearchParams: () =>new URLSearchParams(),
      });
      const getVersion= sourceNode.__get__('getVersion');

      const param = {
        host: 'http://orion:1026',
        pathname: '/version'
      };

      let msg = '';
      const node ={msg: '', error:(e)=>{msg = e;}};
      const res = await getVersion.call(node, param);

      assert.equal(res, null);
      assert.equal(msg, 'Exception while getting version: unknown error');
    });
  });
  describe('FIWARE version node', () => {
    afterEach(() => {
      sourceNode.__ResetDependency__('getVersion');
    });
    it('orion version', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          getToken: () => {},
        }
      });

      let actual;
      sourceNode.__set__('getVersion', (param) => {actual = param; return orion_version;});

      await red.inputWithAwait({payload: null});

      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/version');
      const output = red.getOutput();
      assert.equal(output.payload, orion_version);
    });
    it('orion version without getToken', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          getToken: null,
        }
      });

      let actual;
      sourceNode.__set__('getVersion', (param) => {actual = param; return orion_version;});

      await red.inputWithAwait({payload: null});

      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/version');
      const output = red.getOutput();
      assert.equal(output.payload, orion_version);
    });
    it('error', async () => {
      const red = new MockRed();
      sourceNode(red);
      red.createNode({
        openapis: {
          brokerEndpoint: 'http://orion:1026',
          getToken: () => {},
        }
      });

      let actual;
      sourceNode.__set__('getVersion', (param) => {actual = param; return null;});

      await red.inputWithAwait({payload: null});

      assert.equal(actual.host, 'http://orion:1026');
      assert.equal(actual.pathname, '/version');
      const output = red.getOutput();
      assert.deepEqual(output, []);
    });
  });
});
