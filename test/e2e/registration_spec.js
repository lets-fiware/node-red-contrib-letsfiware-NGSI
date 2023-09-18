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

describe('registration.js', () => {
  describe('registration node', () => {
    let registrationId;
    it('create registration', async () => {
      const actual = await http({
        method: 'post',
        url: '/create-registration',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          description: 'registration node',
          dataProvided: {
            entities: [
              {
                id: 'Room001',
                type: 'Room'
              }
            ],
            attrs: ['temperature', 'pressure']
          },
          provider: {
            http: {
              url: 'http://letsfiware.jp/Rooms'
            }
          }
        }
      });

      const pattern = /[0-9a-z]{24}/;
      assert.equal(pattern.test(actual.data), true);
      assert.equal(actual.status, 201);
      registrationId = actual.data;
    });
    it('delete registration', async () => {
      const actual = await http({
        method: 'post',
        url: '/delete-registration',
        headers: { 'Content-Type': 'application/text; charset=utf-8' },
        data: registrationId
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
  });
});
