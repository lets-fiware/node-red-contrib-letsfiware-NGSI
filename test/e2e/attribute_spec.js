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

const { assert } = require('chai');
const axios = require('axios');

async function http(options) {
  return new Promise(function (resolve, reject) {
    options.baseURL = 'http://127.0.0.1:1880';
    axios(options)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        if (axios.isAxiosError(error)) {
          if (typeof error.response !== 'undefined') {
            resolve(error.response);
          } else {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
  });
}

describe('attribute.js', () => {
  describe('attribute node', () => {
    it('create entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 20
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      });

      assert.equal(actual.status, 201);
      assert.equal(actual.data, '');
    });
    it('Read attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        type: 'Number',
        value: 20,
        metadata: {}
      });
    });
    it('Update attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/update-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          type: 'Number',
          value: 30
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        type: 'Number',
        value: 30,
        metadata: {}
      });
    });
    it('Delete attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature'
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:401',
        type: 'Thing',
        humidity: {
          type: 'Number',
          value: 50,
          metadata: {}
        }
      });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:401'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('create entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 20
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      });

      assert.equal(actual.status, 201);
      assert.equal(actual.data, '');
    });
    it('Read attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        type: 'Number',
        value: 20,
        metadata: {}
      });
    });
    it('Update attribute (Invalid characters)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature',
          attribute: {
            type: 'Text',
            value: '<temperature>'
          }
        }
      });

      assert.equal(actual.status, 400);
      assert.deepEqual(actual.data, { error: 'BadRequest', description: 'Invalid characters in attribute value' });
    });
    it('Update attribute (forbidden)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature',
          attribute: {
            type: 'Text',
            value: '<temperature>'
          },
          forbidden: true
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        type: 'Text',
        value: '%3Ctemperature%3E',
        metadata: {}
      });
    });
    it('read attribute (forbidden)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature',
          forbidden: true
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        type: 'Text',
        value: '<temperature>',
        metadata: {}
      });
    });
    it('Delete attribute', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'delete',
          id: 'urn:ngsi-ld:Thing:401',
          attrName: 'temperature'
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:401'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:401',
        type: 'Thing',
        humidity: {
          type: 'Number',
          value: 50,
          metadata: {}
        }
      });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:401'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
  });
});
