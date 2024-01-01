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

describe('to-dashboard.js', () => {
  describe('NGSI to Dashboard node', () => {
    it('NGSI to Dashboard', async () => {
      const actual = await http({
        method: 'post',
        url: '/ngsi-dashboard',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          id: 'urn:ngsi-ld:WeatherObserved:sensor001',
          type: 'Sensor',
          relativeHumidity: {
            type: 'Number',
            value: 32,
            metadata: {
              TimeInstant: {
                type: 'DateTime',
                value: '2023-01-28T04:53:13.301Z'
              }
            }
          },
          temperature: {
            type: 'Number',
            value: 22.4,
            metadata: {
              TimeInstant: {
                type: 'DateTime',
                value: '2023-01-28T04:53:13.301Z'
              }
            }
          }
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(actual.data, 22.4);
    });
  });
});
