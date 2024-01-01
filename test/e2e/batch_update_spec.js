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

describe('batch-update.js', () => {
  describe('NGSI batch-update node', () => {
    it('batch append', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-append',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:601',
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
            id: 'urn:ngsi-ld:Thing:602',
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
            id: 'urn:ngsi-ld:Thing:603',
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
      assert.equal(actual.data, '');
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
          id: 'urn:ngsi-ld:Thing:601',
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
          id: 'urn:ngsi-ld:Thing:602',
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
          id: 'urn:ngsi-ld:Thing:603',
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
    it('batch append', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-append',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:601',
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
            id: 'urn:ngsi-ld:Thing:602',
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
            id: 'urn:ngsi-ld:Thing:603',
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
      assert.equal(actual.data, '');
    });
    it('batch appendStrict', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-appendStrict',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:601',
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
            id: 'urn:ngsi-ld:Thing:602',
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
            id: 'urn:ngsi-ld:Thing:603',
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

      assert.equal(actual.status, 422);
      assert.deepEqual(actual.data, {
        error: 'Unprocessable',
        description: 'one or more of the attributes in the request already exist: [ temperature, humidity ]'
      });
    });
    it('batch appendStrict', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-appendStrict',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:601',
            type: 'Thing',
            atmosphericPressure: {
              type: 'Number',
              value: 997
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:602',
            type: 'Thing',
            atmosphericPressure: {
              type: 'Number',
              value: 998
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:603',
            type: 'Thing',
            atmosphericPressure: {
              type: 'Number',
              value: 999
            }
          }
        ]
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
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
          id: 'urn:ngsi-ld:Thing:601',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 997,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:602',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 998,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:603',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 999,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch update', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-update',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:601',
            type: 'Thing',
            atmosphericPressure: {
              type: 'Number',
              value: 1000
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:602',
            type: 'Thing',
            atmosphericPressure: {
              type: 'Number',
              value: 1001
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:603',
            type: 'Thing',
            atmosphericPressure: {
              type: 'Number',
              value: 1002
            }
          }
        ]
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
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
          id: 'urn:ngsi-ld:Thing:601',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 1000,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:602',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 1001,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:603',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 1002,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch replace', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-replace',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:Thing:601',
            type: 'Thing',
            name: {
              type: 'Text',
              value: 'abc'
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:602',
            type: 'Thing',
            name: {
              type: 'Text',
              value: 'abc'
            }
          },
          {
            id: 'urn:ngsi-ld:Thing:603',
            type: 'Thing',
            name: {
              type: 'Text',
              value: 'abc'
            }
          }
        ]
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
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
          id: 'urn:ngsi-ld:Thing:601',
          type: 'Thing',
          name: {
            type: 'Text',
            value: 'abc',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:602',
          type: 'Thing',
          name: {
            type: 'Text',
            value: 'abc',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:603',
          type: 'Thing',
          name: {
            type: 'Text',
            value: 'abc',
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
        data: [{ id: 'urn:ngsi-ld:Thing:601' }, { id: 'urn:ngsi-ld:Thing:602' }, { id: 'urn:ngsi-ld:Thing:603' }]
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('batch append', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'append',
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:601',
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
              id: 'urn:ngsi-ld:Thing:602',
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
              id: 'urn:ngsi-ld:Thing:603',
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
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
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
          id: 'urn:ngsi-ld:Thing:601',
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
          id: 'urn:ngsi-ld:Thing:602',
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
          id: 'urn:ngsi-ld:Thing:603',
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
    it('batch appendStrict', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'appendStrict',
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:601',
              type: 'Thing',
              atmosphericPressure: {
                type: 'Number',
                value: 997
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:602',
              type: 'Thing',
              atmosphericPressure: {
                type: 'Number',
                value: 998
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:603',
              type: 'Thing',
              atmosphericPressure: {
                type: 'Number',
                value: 999
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
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: '.*'
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:601',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 997,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:602',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 998,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:603',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 999,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch update', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'update',
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:601',
              type: 'Thing',
              atmosphericPressure: {
                type: 'Number',
                value: 1000
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:602',
              type: 'Thing',
              atmosphericPressure: {
                type: 'Number',
                value: 1001
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:603',
              type: 'Thing',
              atmosphericPressure: {
                type: 'Number',
                value: 1002
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
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: '.*'
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:601',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 1000,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:602',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 1001,
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:603',
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
          },
          atmosphericPressure: {
            type: 'Number',
            value: 1002,
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch replace', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'replace',
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:601',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<abc>'
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:602',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<abc>'
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:603',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<abc>'
              }
            }
          ]
        }
      });

      assert.equal(actual.status, 400);
      assert.deepEqual(actual.data, { error: 'BadRequest', description: 'Invalid characters in attribute value' });
    });
    it('batch replace with forbidden option', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'replace',
          forbidden: true,
          entities: [
            {
              id: 'urn:ngsi-ld:Thing:601',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<abc>'
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:602',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<abc>'
              }
            },
            {
              id: 'urn:ngsi-ld:Thing:603',
              type: 'Thing',
              name: {
                type: 'Text',
                value: '<abc>'
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
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: '.*'
      });

      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Thing:601',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '%3Cabc%3E',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:602',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '%3Cabc%3E',
            metadata: {}
          }
        },
        {
          id: 'urn:ngsi-ld:Thing:603',
          type: 'Thing',
          name: {
            type: 'Text',
            value: '%3Cabc%3E',
            metadata: {}
          }
        }
      ]);
      assert.equal(actual.status, 200);
    });
    it('batch delete entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/payload-batch',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          actionType: 'delete',
          entities: [{ id: 'urn:ngsi-ld:Thing:601' }, { id: 'urn:ngsi-ld:Thing:602' }, { id: 'urn:ngsi-ld:Thing:603' }]
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
  });
});
