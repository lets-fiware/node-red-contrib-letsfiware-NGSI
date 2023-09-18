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

describe('source.js', () => {
  describe('NGSI srouce node', () => {
    it('batch create entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-append',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:101',
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
          },
          {
            id: 'urn:ngsi-ld:Thing:102',
            type: 'Thing',
            temperature: {
              type: 'Number',
              value: 2
            },
            humidity: {
              type: 'Number',
              value: 50,
              metadata: {}
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:103',
            type: 'Thing',
            temperature: {
              type: 'Number',
              value: 45
            },
            humidity: {
              type: 'Number',
              value: 50,
              metadata: {}
            }
          }
        ]
      });

      assert.equal(actual.status, 204);
      assert.deepEqual(actual.data, '');
    });
    it('read entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: '.*'
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:101',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 20,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:102',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 2,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 45,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities (JSON)', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: '.*'
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:101',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 20,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:102',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 2,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 45,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities with idPattern', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: 'urn:ngsi-ld:Thing:103'
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 45,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities with keyValues', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: 'urn:ngsi-ld:Thing:103',
          keyValues: true
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: 45,
          humidity: 50
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities with type', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          keyValues: true
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: 45,
          humidity: 50
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities with type (not found)', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: 'urn:ngsi-ld:Thing:103',
          type: 'Event'
        }
      });

      assert.deepEqual(actual.data, []);
      assert.equal(actual.status, 200);
    });
    it('read entities with attrs', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: '.*',
          attrs: 'temperature'
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:101',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 20,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:102',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 2,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 45,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities with q', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: '.*',
          q: 'temperature==45'
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:103',
          type: 'Thing',
          temperature: {
            type: 'Number',
            value: 45,
            metadata: {}
          },
          humidity: {
            type: 'Number',
            value: 50,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch delete entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-delete',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [{ id: 'urn:ngsi-ld:Thing:101' }, { id: 'urn:ngsi-ld:Thing:102' }, { id: 'urn:ngsi-ld:Thing:103' }]
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('batch create entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'append',
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:104',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<name>',
                metadata: {}
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:105',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<name>',
                metadata: {}
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:106',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<name>',
                metadata: {}
              }
            }
          ]
        }
      });

      assert.equal(actual.status, 400);
      assert.deepEqual(actual.data, { error: 'BadRequest', description: 'Invalid characters in attribute value' });
    });
    it('batch create entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'append',
          forbidden: true,
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:104',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<name>',
                metadata: {}
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:105',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<name>',
                metadata: {}
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:106',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<name>',
                metadata: {}
              }
            }
          ]
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: '.*'
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:104',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '%3Cname%3E',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:105',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '%3Cname%3E',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:106',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '%3Cname%3E',
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('read entities with encording forbidden chars', async () => {
      const actual = await http({
        method: 'post',
        url: '/source',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          idPattern: '.*',
          forbidden: true
        }
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:104',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '<name>',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:105',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '<name>',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:106',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '<name>',
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch delete entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-delete',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [{ id: 'urn:ngsi-ld:Thing:104' }, { id: 'urn:ngsi-ld:Thing:105' }, { id: 'urn:ngsi-ld:Thing:106' }]
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
  });
});
