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

const toDashboardNode = require('../../src/nodes/NGSI/to-dashboard/to-dashboard.js');
const MockRed = require('./helpers/mockred.js');

describe('to-dashboard.js', () => {
  describe('calculateDateTime', () => {
    it('month', () => {
      const calculateDateTime = toDashboardNode.__get__('calculateDateTime');
      const origin = '2023-01-01T12:34:56.000Z';
      const resolution = 'month';
      const offset = '1';

      const actual = calculateDateTime(origin, resolution, offset);

      assert.equal(actual, 1675254896000);
    });
    it('day', () => {
      const calculateDateTime = toDashboardNode.__get__('calculateDateTime');
      const origin = '2023-01-01T12:34:56.000Z';
      const resolution = 'day';
      const offset = '2';

      const actual = calculateDateTime(origin, resolution, offset);

      assert.equal(actual, 1673526896000);
    });
    it('hour', () => {
      const calculateDateTime = toDashboardNode.__get__('calculateDateTime');
      const origin = '2023-01-01T12:34:56.000Z';
      const resolution = 'hour';
      const offset = 1;

      const actual = calculateDateTime(origin, resolution, offset);

      assert.equal(actual, 1672580096000);
    });
    it('minute', () => {
      const calculateDateTime = toDashboardNode.__get__('calculateDateTime');
      const origin = '2023-01-01T12:34:56.000Z';
      const resolution = 'minute';
      const offset = '4';

      const actual = calculateDateTime(origin, resolution, offset);

      assert.equal(actual, 1672595096000);
    });
    it('second', () => {
      const calculateDateTime = toDashboardNode.__get__('calculateDateTime');
      const origin = '2023-01-01T12:34:56.000Z';
      const resolution = 'second';
      const offset = '5';

      const actual = calculateDateTime(origin, resolution, offset);

      assert.equal(actual, 1672577005000);
    });
  });
  describe('transformHistorical', () => {
    it('raw', () => {
      const transformHistorical = toDashboardNode.__get__('transformHistorical');
      const payload = {
        attrName: 'temperature',
        dataType: 'raw',
        type: 'StructuredValue',
        value: [
          {
            _id: '63d45c3587f5b27f576ed498',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 22.2,
            recvTime: '2023-01-27T23:20:21.201Z'
          },
          {
            _id: '63d45c3787f5b27f576ed49e',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 22.2,
            recvTime: '2023-01-27T23:20:23.199Z'
          },
          {
            _id: '63d45c3987f5b27f576ed4a4',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 22.2,
            recvTime: '2023-01-27T23:20:25.201Z'
          }
        ]
      };
      const actual = transformHistorical(payload);
      const expected = [
        {
          series: ['temperature'],
          labels: [],
          data: [
            [
              {
                x: 1674861621201,
                y: 22.2
              },
              {
                x: 1674861623199,
                y: 22.2
              },
              {
                x: 1674861625201,
                y: 22.2
              }
            ]
          ]
        }
      ];

      assert.deepEqual(actual, expected);
    });
    it('sum', () => {
      const transformHistorical = toDashboardNode.__get__('transformHistorical');
      const payload = {
        attrName: 'temperature',
        dataType: 'sum',
        type: 'StructuredValue',
        value: [
          {
            _id: {
              attrName: 'temperature',
              origin: '2023-01-22T00:00:00.000Z',
              resolution: 'hour'
            },
            points: [
              {
                offset: 8,
                samples: 521,
                sum: 11586.000000000007
              },
              {
                offset: 9,
                samples: 1800,
                sum: 38774.09999999979
              },
              {
                offset: 10,
                samples: 1799,
                sum: 38438.100000000326
              },
              {
                offset: 11,
                samples: 1799,
                sum: 43591.9000000002
              },
              {
                offset: 12,
                samples: 63,
                sum: 1448.1000000000008
              }
            ]
          },
          {
            _id: {
              attrName: 'temperature',
              origin: '2023-01-27T00:00:00.000Z',
              resolution: 'hour'
            },
            points: [
              {
                offset: 12,
                samples: 969,
                sum: 23644.499999999833
              },
              {
                offset: 19,
                samples: 101,
                sum: 2094.2999999999993
              },
              {
                offset: 20,
                samples: 1799,
                sum: 47159.79999999989
              },
              {
                offset: 21,
                samples: 1799,
                sum: 50274.80000000073
              },
              {
                offset: 22,
                samples: 1799,
                sum: 43363.00000000028
              },
              {
                offset: 23,
                samples: 607,
                sum: 13309.900000000103
              }
            ]
          }
        ]
      };
      const actual = transformHistorical(payload);
      const expected = [
        {
          series: ['temperature'],
          labels: [],
          data: [
            [
              {
                x: 1674374400000,
                y: 11586.000000000007
              },
              {
                x: 1674378000000,
                y: 38774.09999999979
              },
              {
                x: 1674381600000,
                y: 38438.100000000326
              },
              {
                x: 1674385200000,
                y: 43591.9000000002
              },
              {
                x: 1674388800000,
                y: 1448.1000000000008
              },
              {
                x: 1674820800000,
                y: 23644.499999999833
              },
              {
                x: 1674846000000,
                y: 2094.2999999999993
              },
              {
                x: 1674849600000,
                y: 47159.79999999989
              },
              {
                x: 1674853200000,
                y: 50274.80000000073
              },
              {
                x: 1674856800000,
                y: 43363.00000000028
              },
              {
                x: 1674860400000,
                y: 13309.900000000103
              }
            ]
          ]
        }
      ];

      assert.deepEqual(actual, expected);
    });
  });
  describe('getDateTime', () => {
    it('TimeInstant', () => {
      const getDateTime = toDashboardNode.__get__('getDateTime');
      const attribute = {
        type: 'Number',
        value: 32,
        metadata: {
          TimeInstant: {
            type: 'DateTime',
            value: '2023-01-28T04:53:13.301Z'
          }
        }
      };

      const actual = getDateTime(attribute);
      const expected = 1674881593301;

      assert.equal(actual, expected);
    });
    it('dateModified', () => {
      const getDateTime = toDashboardNode.__get__('getDateTime');
      const attribute = {
        type: 'Number',
        value: 32,
        metadata: {
          dateModified: {
            type: 'DateTime',
            value: '2023-01-28T04:53:13.301Z'
          }
        }
      };

      const actual = getDateTime(attribute);
      const expected = 1674881593301;

      assert.equal(actual, expected);
    });
    it('empty metadata', () => {
      const getDateTime = toDashboardNode.__get__('getDateTime');
      const attribute = {
        type: 'Number',
        value: 32,
        metadata: {}
      };

      const actual = getDateTime(attribute);
      const expected = null;

      assert.equal(actual, expected);
    });
    it('without metadata', () => {
      const getDateTime = toDashboardNode.__get__('getDateTime');
      const attribute = {
        type: 'Number',
        value: 32
      };

      const actual = getDateTime(attribute);
      const expected = null;

      assert.equal(actual, expected);
    });
  });
  describe('NGSI to dashboard node', () => {
    it('names', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'entity',
        attrs: 'temperature,relativeHumidity',
        names: 'temp,hum'
      });

      const payload = {
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
      };

      await red.inputWithAwait({ payload: payload });

      const expected = [
        {
          payload: 22.4,
          topic: 'temp',
          timestamp: 1674881593301
        },
        {
          payload: 32,
          topic: 'hum',
          timestamp: 1674881593301
        }
      ];

      assert.deepEqual(red.getOutput(), expected);
    });
    it('entity without attr', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'entity',
        attrs: 'temperature,relativeHumidity,atmosphericPressure',
        names: ''
      });

      const payload = {
        id: 'urn:ngsi-ld:WeatherObserved:sensor001',
        type: 'Sensor',
        relativeHumidity: {
          type: 'Number',
          value: 32
        },
        temperature: {
          type: 'Number',
          value: 22.4
        }
      };

      await red.inputWithAwait({ payload: payload });

      const expected = [
        {
          payload: 22.4,
          topic: 'temperature',
          timestamp: null
        },
        {
          payload: 32,
          topic: 'relativeHumidity',
          timestamp: null
        }
      ];

      assert.deepEqual(red.getOutput(), expected);
    });
    it('entity', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'entity',
        attrs: 'temperature,relativeHumidity',
        names: ''
      });

      const payload = {
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
      };

      await red.inputWithAwait({ payload: payload });

      const expected = [
        {
          payload: 22.4,
          topic: 'temperature',
          timestamp: 1674881593301
        },
        {
          payload: 32,
          topic: 'relativeHumidity',
          timestamp: 1674881593301
        }
      ];

      assert.deepEqual(red.getOutput(), expected);
    });
    it('notification', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'notification',
        attrs: 'temperature,relativeHumidity',
        names: ''
      });

      const payload = {
        subscriptionId: '57edf55231cee478fe9fff1f',
        data: [
          {
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
        ]
      };

      await red.inputWithAwait({ payload: payload });

      const expected = [
        {
          payload: 22.4,
          topic: 'temperature',
          timestamp: 1674881593301
        },
        {
          payload: 32,
          topic: 'relativeHumidity',
          timestamp: 1674881593301
        }
      ];

      assert.deepEqual(red.getOutput(), expected);
    });
    it('notification without attr', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'notification',
        attrs: 'temperature,relativeHumidity,atmosphericPressure',
        names: ''
      });

      const payload = {
        subscriptionId: '57edf55231cee478fe9fff1f',
        data: [
          {
            id: 'urn:ngsi-ld:WeatherObserved:sensor001',
            type: 'Sensor',
            relativeHumidity: {
              type: 'Number',
              value: 32,
              metadata: {
                dateModified: {
                  type: 'DateTime',
                  value: '2023-01-28T04:53:13.301Z'
                }
              }
            },
            temperature: {
              type: 'Number',
              value: 22.4,
              metadata: {
                dateModified: {
                  type: 'DateTime',
                  value: '2023-01-28T04:53:13.301Z'
                }
              }
            }
          }
        ]
      };

      await red.inputWithAwait({ payload: payload });

      const expected = [
        {
          payload: 22.4,
          topic: 'temperature',
          timestamp: 1674881593301
        },
        {
          payload: 32,
          topic: 'relativeHumidity',
          timestamp: 1674881593301
        }
      ];

      assert.deepEqual(red.getOutput(), expected);
    });
    it('historical', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'historical',
        attrs: 'temperature',
        names: ''
      });

      const payload = {
        attrName: 'temperature',
        dataType: 'raw',
        type: 'StructuredValue',
        value: [
          {
            _id: '63d45c3587f5b27f576ed498',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 22.2,
            recvTime: '2023-01-27T23:20:21.201Z'
          },
          {
            _id: '63d45c3787f5b27f576ed49e',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 22.2,
            recvTime: '2023-01-27T23:20:23.199Z'
          },
          {
            _id: '63d45c3987f5b27f576ed4a4',
            attrName: 'temperature',
            attrType: 'Number',
            attrValue: 22.2,
            recvTime: '2023-01-27T23:20:25.201Z'
          }
        ]
      };

      await red.inputWithAwait({ payload: payload });

      const expected = [
        {
          series: ['temperature'],
          labels: [],
          data: [
            [
              {
                x: 1674861621201,
                y: 22.2
              },
              {
                x: 1674861623199,
                y: 22.2
              },
              {
                x: 1674861625201,
                y: 22.2
              }
            ]
          ]
        }
      ];

      assert.deepEqual(red.getOutput(), { payload: expected });
    });
    it('Intpu Type error', async () => {
      const red = new MockRed();
      toDashboardNode(red);
      red.createNode({
        inputType: 'raw',
        attrs: 'temperature',
        names: ''
      });

      await red.inputWithAwait({ payload: {} });

      assert.equal(red.getMessage(), 'Input type error: raw');
    });
  });
});
