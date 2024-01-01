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

describe('openweathermap_to_ngsi.js', () => {
  describe('OpenWeatherMap to NGSI', () => {
    it('OpenWeatherMap to NGSI', async () => {
      const actual = await http({
        method: 'post',
        url: '/openweathermap-ngsi',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          coord: {
            lon: 139.6917,
            lat: 35.6895
          },
          weather: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04n'
            }
          ],
          base: 'stations',
          main: {
            temp: 278.23,
            feels_like: 275.04,
            temp_min: 275.4,
            temp_max: 280.12,
            pressure: 1022,
            humidity: 55
          },
          visibility: 10000,
          wind: {
            speed: 4.12,
            deg: 320
          },
          clouds: {
            all: 75
          },
          dt: 1677100198,
          sys: {
            type: 2,
            id: 2001249,
            country: 'JP',
            sunrise: 1677100803,
            sunset: 1677140982
          },
          timezone: 32400,
          id: 1850144,
          name: 'Tokyo',
          cod: 200
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, {
        coord: {
          type: 'StructuredValue',
          value: {
            lon: 139.6917,
            lat: 35.6895
          }
        },
        weather: {
          type: 'StructuredValue',
          value: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04n'
            }
          ]
        },
        base: {
          type: 'Text',
          value: 'stations'
        },
        main: {
          type: 'StructuredValue',
          value: {
            temp: 278.23,
            feels_like: 275.04,
            temp_min: 275.4,
            temp_max: 280.12,
            pressure: 1022,
            humidity: 55
          }
        },
        visibility: {
          type: 'Number',
          value: 10000
        },
        wind: {
          type: 'StructuredValue',
          value: {
            speed: 4.12,
            deg: 320
          }
        },
        clouds: {
          type: 'StructuredValue',
          value: {
            all: 75
          }
        },
        dt: {
          type: 'Number',
          value: 1677100198
        },
        sys: {
          type: 'StructuredValue',
          value: {
            type: 2,
            id: 2001249,
            country: 'JP',
            sunrise: 1677100803,
            sunset: 1677140982
          }
        },
        timezone: {
          type: 'Number',
          value: 32400
        },
        id: 'urn:ngsi-ld:OpenWeatherMapWeather:1850144',
        name: {
          type: 'Text',
          value: 'Tokyo'
        },
        cod: {
          type: 'Number',
          value: 200
        },
        location: {
          type: 'geo:json',
          value: {
            type: 'Point',
            coordinates: [139.6917, 35.6895]
          }
        },
        type: 'OpenWeatherMapWeather'
      });
    });
  });
});
