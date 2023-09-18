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

describe('subscription.js', () => {
  describe('subscription node', () => {
    let subscriptionId;
    it('create subscription', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-subscription',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          subject: {
            entities: [
              {
                idPattern: '.*'
              }
            ]
          },
          notification: {
            http: {
              url: 'http://localhost:8080'
            }
          }
        }
      });

      const pattern = /[0-9a-z]{24}/;
      assert.equal(pattern.test(actual.data), true);
      assert.equal(actual.status, 201);
      subscriptionId = actual.data;
    });
    it('update subscription', async () => {
      const actual = await http({
        method: 'post',
        url: '/update-subscription',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: subscriptionId,
          expires: '2030-04-05T14:00:00.00Z'
        }
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('delete subscription', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-subscription',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: subscriptionId
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
  });
});
