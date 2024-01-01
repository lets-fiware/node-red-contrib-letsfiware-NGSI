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

describe('attribute-value.js', () => {
  describe('attribute-value node', () => {
    it('create entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'create',
          keyValues: true,
          entity: {
            id: 'urn:ngsi-ld:Thing:501',
            attr1: null,
            attr2: true,
            attr3: 123,
            attr4: 'abc',
            attr5: { data: 123 },
            attr6: [123, 456]
          }
        }
      });

      assert.equal(actual.status, 201);
      assert.equal(actual.data, '');
    });
    it('Read attribute value (null)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:501',
          attrName: 'attr1'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, null);
    });
    it('Read attribute value (Number)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:501',
          attrName: 'attr3'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, 123);
    });
    it('Read attribute value (String)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:501',
          attrName: 'attr4'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, 'abc');
    });
    it('Read attribute value (Object)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:501',
          attrName: 'attr5'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, { data: 123 });
    });
    it('Read attribute value (Array)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:501',
          attrName: 'attr6'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, [123, 456]);
    });
    it('Update attribute value', async () => {
      const actual = await http({
        method: 'post',
        url: '/update-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          data: 'abc'
        }
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('Read attribute value (Array)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:501',
          attrName: 'attr6'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, { data: 'abc' });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:501'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('create entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'create',
          keyValues: true,
          entity: {
            id: 'urn:ngsi-ld:Thing:502',
            attr1: null,
            attr2: true,
            attr3: 123,
            attr4: 'abc',
            attr5: { data: 123 },
            attr6: [123, 456]
          }
        }
      });

      assert.equal(actual.status, 201);
      assert.equal(actual.data, '');
    });
    it('Read attribute value (null)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr1'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, null);
    });
    it('Read attribute value (Number)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr3'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, 123);
    });
    it('Read attribute value (String)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr4'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, 'abc');
    });
    it('Read attribute value (Object)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr5'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, { data: 123 });
    });
    it('Read attribute value (Array)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, [123, 456]);
    });
    it('Update attribute value', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6',
          value: {
            data: 'abc'
          }
        }
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('Read attribute value (Array)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, { data: 'abc' });
    });
    it('Update attribute value', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6',
          value: {
            data: '<abc>'
          }
        }
      });

      assert.equal(actual.status, 400);
      assert.deepEqual(actual.data, { error: 'BadRequest', description: 'Invalid characters in attribute value' });
    });
    it('Update attribute value', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6',
          value: {
            data: '<abc>'
          },
          forbidden: true
        }
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('Read attribute value (Array)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, { data: '%3Cabc%3E' });
    });
    it('Read attribute value (Array)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attribute-value',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'read',
          id: 'urn:ngsi-ld:Thing:502',
          attrName: 'attr6',
          forbidden: true
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, { data: '<abc>' });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:502'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
  });
});
