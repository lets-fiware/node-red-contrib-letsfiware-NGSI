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

describe('attributes.js', () => {
  describe('attributes node', () => {
    it('create entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-entity',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301',
          type: 'Thing'
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
        data: 'urn:ngsi-ld:entity:301'
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing'
      });
    });
    it('Append attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/append-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
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
    it('Append attributes (already exist)', async () => {
      const actual = await http({
        method: 'post',
        url: '/append-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
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
      assert.deepEqual(actual.data, {
        error: 'Unprocessable',
        description: 'one or more of the attributes in the request already exist: [ temperature, humidity ]'
      });
    });
    it('Update attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/update-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          temperature: {
            type: 'Number',
            value: 28,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 40,
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 28,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 40,
          metadata: {}
        }
      });
    });
    it('Upsert attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/upsert-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          temperature: {
            type: 'Number',
            value: 18,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 20,
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 18,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 20,
          metadata: {}
        }
      });
    });
    it('Replace attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/replace-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          atmosphericPressure: {
            type: 'Number',
            value: 998,
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        atmosphericPressure: {
          type: 'Number',
          value: 998,
          metadata: {}
        }
      });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:entity:301'
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
          id: 'urn:ngsi-ld:entity:301',
          type: 'Thing'
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
        data: 'urn:ngsi-ld:entity:301'
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing'
      });
    });
    it('Append attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'append',
          id: 'urn:ngsi-ld:entity:301',
          attributes: {
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
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
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
    it('Update attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          id: 'urn:ngsi-ld:entity:301',
          attributes: {
            temperature: {
              type: 'Number',
              value: 28,
              metadata: {}
            },
            humidity: {
              type: 'Number',
              value: 40,
              metadata: {}
            }
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 28,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 40,
          metadata: {}
        }
      });
    });
    it('Upsert attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'upsert',
          id: 'urn:ngsi-ld:entity:301',
          attributes: {
            temperature: {
              type: 'Number',
              value: 18,
              metadata: {}
            },
            humidity: {
              type: 'Number',
              value: 20,
              metadata: {}
            }
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        temperature: {
          type: 'Number',
          value: 18,
          metadata: {}
        },
        humidity: {
          type: 'Number',
          value: 20,
          metadata: {}
        }
      });
    });
    it('Replace attributes', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'replace',
          id: 'urn:ngsi-ld:entity:301',
          attributes: {
            atmosphericPressure: {
              type: 'Number',
              value: 998,
              metadata: {}
            }
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        atmosphericPressure: {
          type: 'Number',
          value: 998,
          metadata: {}
        }
      });
    });
    it('Replace attributes (forbidden chars)', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-attributes',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'replace',
          id: 'urn:ngsi-ld:entity:301',
          forbidden: true,
          attributes: {
            name: {
              type: 'Text',
              value: '<name>',
              metadata: {}
            }
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
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:entity:301'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        id: 'urn:ngsi-ld:entity:301',
        type: 'Thing',
        name: {
          type: 'Text',
          value: '%3Cname%3E',
          metadata: {}
        }
      });
    });
    it('delete entity', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-entity',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: 'urn:ngsi-ld:entity:301'
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
  });
});
