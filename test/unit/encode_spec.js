/*
   MIT License
 
   Copyright 2022-2024 Kazuhito Suda
 
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

const encodeNode = require('../../src/nodes/NGSI/encode/encode.js');
const MockRed = require('./helpers/mockred.js');

describe('encode.js', () => {
  describe('NGSI encode node', () => {
    it('encode string', async () => {
      const red = new MockRed();
      encodeNode(red);
      red.createNode({});

      await red.inputWithAwait({
        payload: '<Sensor>'
      });

      const expected = {
        payload: '%3CSensor%3E',
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
    });
    it('encode JSON Object', async () => {
      const red = new MockRed();
      encodeNode(red);
      red.createNode({});

      await red.inputWithAwait({
        payload: {
          id: 'urn:ngsi-ld:TemperatureSensor:001',
          type: 'TemperatureSensor',
          name: '<Sensor>'
        }
      });

      const expected = {
        payload: {
          id: 'urn:ngsi-ld:TemperatureSensor:001',
          type: 'TemperatureSensor',
          name: '%3CSensor%3E'
        },
        statusCode: 200
      };

      assert.deepEqual(red.getOutput(), expected);
    });
    it('error', async () => {
      const red = new MockRed();
      encodeNode(red);
      red.createNode({});

      await red.inputWithAwait({
        payload: 123
      });

      const expected = {
        payload: { error: 'payload not string, JSON Object or JSON Array' },
        statusCode: 500
      };

      assert.deepEqual(red.getOutput(), expected);
    });
  });
});
