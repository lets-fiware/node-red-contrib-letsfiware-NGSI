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

describe('gtfs-ngsi.js', () => {
  describe('GTFS NGSI node', () => {
    it('GTFS to NGSI', async () => {
      const actual = await http({
        method: 'post',
        url: '/gtfs-ngsi',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'bus01',
            vehicle: {
              trip: {
                tripId: '00000000000000000000000000000000',
                startDate: '20220301',
                scheduleRelationship: 'SCHEDULED',
                routeId: '001'
              },
              position: {
                latitude: 35.1,
                longitude: 135.2,
                bearing: 180.3
              },
              currentStopSequence: 1,
              currentStatus: 'IN_TRANSIT_TO',
              timestamp: '0000000001',
              stopId: 'S0001',
              vehicle: {
                id: 'bus01'
              }
            }
          }
        ]
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, [
        {
          id: 'urn:ngsi-ld:Vehicle:bus01',
          type: 'Vehicle',
          trip: {
            type: 'StructuredValues',
            value: { tripId: '00000000000000000000000000000000', startDate: '20220301', scheduleRelationship: 'SCHEDULED', routeId: '001' }
          },
          position: { type: 'StructuredValues', value: { latitude: 35.1, longitude: 135.2, bearing: 180.3 } },
          currentStopSequence: { type: 'Number', value: 1 },
          currentStatus: { type: 'Text', value: 'IN_TRANSIT_TO' },
          timestamp: { type: 'Text', value: '0000000001' },
          stopId: { type: 'Text', value: 'S0001' },
          vehicle: { type: 'StructuredValues', value: { id: 'bus01' } },
          location: { type: 'geo:json', value: { type: 'Point', coordinates: [135.2, 35.1] } }
        }
      ]);
    });
  });
});
