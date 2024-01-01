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

describe('entity.js', () => {
  describe('entity node', () => {
    it('create entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 24,
            metadata: {}
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
    it('read entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:001'
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:001',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 24,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 50,
          metadata: {}
        }
      });
    });
    it('create entity (Already Exists)', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 25,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      });

      assert.equal(actual.status, 422);
      assert.deepEqual(actual.data, { error: 'Unprocessable', description: 'Already Exists' });
    });
    it('upsert entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/upsert-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 25,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:001'
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:001',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 25,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 50,
          metadata: {}
        }
      });
    });
    it('read entity (JSON)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:001',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 25,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 50,
          metadata: {}
        }
      });
    });
    it('read entity as keyValues', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          keyValues: true
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:001',
        type: 'Thing',
        temperature: 25,
        humidity: 50
      });
    });
    it('read entity with dateModified', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          dateModified: true
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data.dateModified.type, 'DateTime');
      assert.equal(actual.data.temperature.metadata.dateModified.type, 'DateTime');
      assert.equal(actual.data.humidity.metadata.dateModified.type, 'DateTime');
    });
    it('read entity with attrs', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          attrs: 'temperature'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:001',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 25,
          metadata: {}
        }
      });
    });
    it('read entity with type', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          type: 'Thing'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:001',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 25,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 50,
          metadata: {}
        }
      });
    });
    it('read entity with type (not found)', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:001',
          type: 'Event'
        }
      });

      assert.equal(actual.status, 404);
      assert.deepEqual(actual.data, {
        description: 'The requested entity has not been found. Check type and id',
        error: 'NotFound'
      });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:001'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('payload entity (error)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'create',
          entity: {
            id: 'urn:ngsi-ld:Thing:002',
            type: 'Thing',
            name: {
              type: 'Text',
              value: '<name>'
            }
          }
        }
      });

      assert.equal(actual.status, 400);
      assert.deepEqual(actual.data, { error: 'BadRequest', description: 'Invalid characters in attribute value' });
    });
    it('payload entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'create',
          entity: {
            id: 'urn:ngsi-ld:Thing:002',
            type: 'Thing',
            name: {
              type: 'Text',
              value: '<name>'
            }
          },
          forbidden: true
        }
      });

      assert.equal(actual.status, 201);
      assert.equal(actual.data, '');
    });
    it('read entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:002'
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:002',
        type: 'Thing',
        name: {
          type: 'Text',
          value: '%3Cname%3E',
          metadata: {}
        }
      });
    });
    it('read entity with forbidden param', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:Thing:002',
          forbidden: true
        }
      });
      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:Thing:002',
        type: 'Thing',
        name: {
          type: 'Text',
          value: '<name>',
          metadata: {}
        }
      });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:Thing:002'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
  });
});
