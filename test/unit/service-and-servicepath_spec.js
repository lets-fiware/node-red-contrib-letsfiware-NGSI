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

const serviceAndServicePathNode = require('../../src/nodes/NGSI/service-and-servicepath/service-and-servicepath.js');
const MockRed = require('./helpers/mockred.js');

describe('service-and-servicepath.js', () => {
  describe('manageServiceAndServicePath', () => {
    it('msg.context is null', () => {
      const manageServiceAndServicePath = serviceAndServicePathNode.__get__('manageServiceAndServicePath');
      const msg = { context: null };
      const defaultConfig = {
        servicepath: '/',
        serviceMode: 'add',
        serviceValue: 'OpenIoT',
        servicePathMode: 'add',
        servicePathValue: '/iot',
      };
      const node = { msg: '', error: () => { } };

      const actual = manageServiceAndServicePath.call(node, msg, defaultConfig);

      const expected = {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/iot',
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('Add', () => {
      const manageServiceAndServicePath = serviceAndServicePathNode.__get__('manageServiceAndServicePath');
      const msg = { context: null };
      const defaultConfig = {
        servicepath: '/',
        serviceMode: 'add',
        serviceValue: 'OpenIoT',
        servicePathMode: 'add',
        servicePathValue: '/iot',
      };
      const node = { msg: '', error: () => { } };

      const actual = manageServiceAndServicePath.call(node, msg, defaultConfig);

      const expected = {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/iot',
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('Delete', () => {
      const manageServiceAndServicePath = serviceAndServicePathNode.__get__('manageServiceAndServicePath');
      const msg = {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/iot',
        }
      };
      const defaultConfig = {
        servicepath: '/',
        serviceMode: 'delete',
        serviceValue: 'OpenIoT',
        servicePathMode: 'delete',
        servicePathValue: '/iot',
      };
      const node = { msg: '', error: () => { } };

      const actual = manageServiceAndServicePath.call(node, msg, defaultConfig);

      const expected = { context: {} };
      assert.deepEqual(actual, expected);
    });
    it('Pass', () => {
      const manageServiceAndServicePath = serviceAndServicePathNode.__get__('manageServiceAndServicePath');
      const msg = {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/iot',
        }
      };
      const defaultConfig = {
        servicepath: '/',
        serviceMode: 'pass',
        serviceValue: 'OpenIoT',
        servicePathMode: 'pass',
        servicePathValue: '/iot',
      };
      const node = { msg: '', error: () => { } };

      const actual = manageServiceAndServicePath.call(node, msg, defaultConfig);

      const expected = {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/iot',
        }
      };
      assert.deepEqual(actual, expected);
    });
    it('msg.context not JSON Object', () => {
      const manageServiceAndServicePath = serviceAndServicePathNode.__get__('manageServiceAndServicePath');
      const msg = { context: [] };
      const defaultConfig = {
        servicepath: '/',
        serviceMode: 'add',
        serviceValue: 'OpenIoT',
        servicePathMode: 'add',
        servicePathValue: '/iot',
      };
      let err = '';
      const node = { msg: '', error: (e) => { err = e; } };

      const actual = manageServiceAndServicePath.call(node, msg, defaultConfig);

      assert.deepEqual(actual, { context: [] });
      assert.equal(err, 'msg.context not JSON Object');
    });
  });
  describe('NGSI Entity node', () => {
    it('Add FIWARE Service and ServicePath', async () => {
      const red = new MockRed();
      serviceAndServicePathNode(red);
      red.createNode({
        servicepath: '/',
        serviceMode: 'add',
        serviceValue: 'OpenIoT',
        servicePathMode: 'add',
        servicePathValue: '/iot',
      });

      await red.inputWithAwait({ context: {} });

      const expected = {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/iot',
        }
      };

      assert.deepEqual(red.getOutput(), expected);
    });
    it('msg.context not JSON Object', async () => {
      const red = new MockRed();
      serviceAndServicePathNode(red);
      red.createNode({
        servicepath: '/',
        serviceMode: 'add',
        serviceValue: 'OpenIoT',
        servicePathMode: 'add',
        servicePathValue: '/iot',
      });

      await red.inputWithAwait({ context: [] });

      assert.deepEqual(red.getOutput(), { context: [] });
      assert.equal(red.getMessage(), 'msg.context not JSON Object');
    });
  });
});
