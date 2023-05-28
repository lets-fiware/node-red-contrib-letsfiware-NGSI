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

require('babel-register')({
  plugins: ['babel-plugin-rewire']
});

const { assert } = require('chai');

const openweathermapToNGSInode = require('../../src/nodes/NGSI/openweathermap_to_ngsi/openweathermap_to_ngsi.js');
const MockRed = require('./helpers/mockred.js');

describe('openweathermap_to_ngsi.js', () => {
  describe('transform', () => {
    it('Weather', () => {
      const transform = openweathermapToNGSInode.__get__('transform');
      const data = {
        coord: { lon: 139.6917, lat: 35.6895 },
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
        wind: { speed: 4.12, deg: 320 },
        clouds: { all: 75 },
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
      };

      const actual = transform(data);

      const expected = {
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
      };
      assert.deepEqual(actual, expected);
    });
    it('forcast', () => {
      const transform = openweathermapToNGSInode.__get__('transform');
      const data = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: [
          {
            dt: 1677121200,
            main: {
              temp: 280.79,
              feels_like: 280.79,
              temp_min: 280.79,
              temp_max: 283.38,
              pressure: 1020,
              sea_level: 1020,
              grnd_level: 1014,
              humidity: 46,
              temp_kf: -2.59
            },
            weather: [
              {
                id: 803,
                main: 'Clouds',
                description: 'broken clouds',
                icon: '04d'
              }
            ],
            clouds: {
              all: 78
            },
            wind: {
              speed: 1.19,
              deg: 259,
              gust: 3.2
            },
            visibility: 10000,
            pop: 0.01,
            sys: {
              pod: 'd'
            },
            dt_txt: '2023-02-23 03:00:00'
          }
        ],
        city: {
          id: 1850144,
          name: 'Tokyo',
          coord: {
            lat: 35.6895,
            lon: 139.6917
          },
          country: 'JP',
          population: 12445327,
          timezone: 32400,
          sunrise: 1677100803,
          sunset: 1677140982
        }
      };

      const actual = transform(data);

      const expected = {
        cod: {
          type: 'Text',
          value: '200'
        },
        message: {
          type: 'Number',
          value: 0
        },
        cnt: {
          type: 'Number',
          value: 40
        },
        list: {
          type: 'StructuredValue',
          value: [
            {
              dt: 1677121200,
              main: {
                temp: 280.79,
                feels_like: 280.79,
                temp_min: 280.79,
                temp_max: 283.38,
                pressure: 1020,
                sea_level: 1020,
                grnd_level: 1014,
                humidity: 46,
                temp_kf: -2.59
              },
              weather: [
                {
                  id: 803,
                  main: 'Clouds',
                  description: 'broken clouds',
                  icon: '04d'
                }
              ],
              clouds: {
                all: 78
              },
              wind: {
                speed: 1.19,
                deg: 259,
                gust: 3.2
              },
              visibility: 10000,
              pop: 0.01,
              sys: {
                pod: 'd'
              },
              dt_txt: '2023-02-23 03:00:00'
            }
          ]
        },
        city: {
          type: 'StructuredValue',
          value: {
            id: 1850144,
            name: 'Tokyo',
            coord: {
              lat: 35.6895,
              lon: 139.6917
            },
            country: 'JP',
            population: 12445327,
            timezone: 32400,
            sunrise: 1677100803,
            sunset: 1677140982
          }
        },
        id: 'urn:ngsi-ld:OpenWeatherMapForecast:undefined',
        location: {
          type: 'geo:json',
          value: {
            type: 'Point',
            coordinates: [139.6917, 35.6895]
          }
        },
        type: 'OpenWeatherMapForecast'
      };

      assert.deepEqual(actual, expected);
    });
    it('null', () => {
      const transform = openweathermapToNGSInode.__get__('transform');
      const data = null;

      let msg = '';
      const node = {
        msg: '',
        error: (e) => {
          msg = e;
        }
      };

      const actual = transform.call(node, data);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'data not object');
    });
    it('String', () => {
      const transform = openweathermapToNGSInode.__get__('transform');
      const data = 'FIWARE';

      let msg = '';
      const node = {
        msg: '',
        error: (e) => {
          msg = e;
        }
      };

      const actual = transform.call(node, data);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'data not object');
    });
    it('Array', () => {
      const transform = openweathermapToNGSInode.__get__('transform');
      const data = [];

      let msg = '';
      const node = {
        msg: '',
        error: (e) => {
          msg = e;
        }
      };

      const actual = transform.call(node, data);

      assert.deepEqual(actual, null);
      assert.equal(msg, 'data not object');
    });
  });
  describe('OpenWeatherMap to NGSI node', () => {
    it('create entity', async () => {
      const red = new MockRed();
      openweathermapToNGSInode(red);
      red.createNode({});

      await red.inputWithAwait({
        data: {
          coord: { lon: 139.6917, lat: 35.6895 },
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
          wind: { speed: 4.12, deg: 320 },
          clouds: { all: 75 },
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

      const expected = {
        data: {
          coord: { lon: 139.6917, lat: 35.6895 },
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
          wind: { speed: 4.12, deg: 320 },
          clouds: { all: 75 },
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
        },
        payload: {
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
        }
      };
      assert.deepEqual(red.getOutput(), expected);
    });
    it('data not object', async () => {
      const red = new MockRed();
      openweathermapToNGSInode(red);
      red.createNode({});

      await red.inputWithAwait({ data: null });

      assert.equal(red.getMessage(), 'data not object');
    });
  });
});
