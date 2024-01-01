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

require('babel-register')({
  plugins: ['babel-plugin-rewire']
});

const { assert } = require('chai');

const gtfsRealtimeNode = require('../../src/nodes/NGSI/gtfs-realtime/gtfs-realtime.js');
const MockRed = require('./helpers/mockred.js');

describe('gtfs-realtime.js', () => {
  describe('getGtfsRealtime', () => {
    it('get gtfs data', async () => {
      const data = [
        {
          id: 'bus01',
          tripUpdate: {
            trip: {
              tripId: '1119'
            },
            stopTimeUpdate: [
              {
                stopSequence: 20,
                departure: {
                  delay: 7
                }
              }
            ]
          }
        }
      ];
      gtfsRealtimeNode.__set__('lib', {
        http: async () =>
          Promise.resolve({
            status: 200,
            data: data
          }),
        buildHTTPHeader: () => {
          return {};
        },
        buildSearchParams: () => new URLSearchParams()
      });
      gtfsRealtimeNode.__set__('gtfsRealtimeBindings', {
        transit_realtime: {
          FeedMessage: {
            decode: (data) => {
              return data;
            }
          }
        }
      });
      const getGtfsRealtime = gtfsRealtimeNode.__get__('getGtfsRealtime');

      const msg = { payload: 'http://gtfs-realtime' };
      await getGtfsRealtime(msg);

      assert.deepEqual(msg, { payload: data, statusCode: 200 });
    });
    it('should be 400 Bad Request', async () => {
      gtfsRealtimeNode.__set__('lib', {
        http: async () => Promise.resolve({ status: 400, statusText: 'Bad Request' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildSearchParams: () => new URLSearchParams()
      });
      const getGtfsRealtime = gtfsRealtimeNode.__get__('getGtfsRealtime');

      let errmsg = '';
      const node = {
        msg: '',
        error: (e) => {
          errmsg = e;
        }
      };

      const msg = { payload: 'http://gtfs-realtime' };
      await getGtfsRealtime.call(node, msg);

      assert.equal(errmsg, 'Error while retrieving gtfs realtime data: 400 Bad Request');
      assert.deepEqual(msg, { payload: undefined, statusCode: 400 });
    });
    it('Should be unknown error', async () => {
      gtfsRealtimeNode.__set__('lib', {
        http: async () => Promise.reject({ message: 'unknown error' }),
        buildHTTPHeader: () => {
          return {};
        },
        buildSearchParams: () => new URLSearchParams()
      });
      const getGtfsRealtime = gtfsRealtimeNode.__get__('getGtfsRealtime');

      let errmsg = '';
      const node = {
        msg: '',
        error: (e) => {
          errmsg = e;
        }
      };

      const msg = { payload: 'http://gtfs-realtime' };
      await getGtfsRealtime.call(node, msg);

      assert.equal(errmsg, 'Exception while retrieving gtfs realtime data: unknown error');
      assert.deepEqual(msg, {
        payload: { error: 'unknown error' },
        statusCode: 500
      });
    });
  });
  describe('vehicle2ngsi', () => {
    it('should be a entity', () => {
      const vehicle2ngsi = gtfsRealtimeNode.__get__('vehicle2ngsi');
      const data = {
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
      };
      const expected = {
        currentStatus: {
          type: 'Text',
          value: 'IN_TRANSIT_TO'
        },
        currentStopSequence: {
          type: 'Number',
          value: 1
        },
        id: 'urn:ngsi-ld:Vehicle:bus01',
        location: {
          type: 'geo:json',
          value: {
            coordinates: [135.2, 35.1],
            type: 'Point'
          }
        },
        position: {
          type: 'StructuredValues',
          value: {
            bearing: 180.3,
            latitude: 35.1,
            longitude: 135.2
          }
        },
        stopId: {
          type: 'Text',
          value: 'S0001'
        },
        timestamp: {
          type: 'Text',
          value: '0000000001'
        },
        trip: {
          type: 'StructuredValues',
          value: {
            routeId: '001',
            scheduleRelationship: 'SCHEDULED',
            startDate: '20220301',
            tripId: '00000000000000000000000000000000'
          }
        },
        type: 'Vehicle',
        vehicle: {
          type: 'StructuredValues',
          value: {
            id: 'bus01'
          }
        }
      };

      const actual = vehicle2ngsi(data);

      assert.deepEqual(actual, expected);
    });
  });
  describe('tripUpdate2ngsi', () => {
    it('should be a entity', () => {
      const tripUpdate2ngsi = gtfsRealtimeNode.__get__('tripUpdate2ngsi');

      const data = {
        id: 'bus01',
        tripUpdate: {
          trip: {
            tripId: '1119'
          },
          stopTimeUpdate: [
            {
              stopSequence: 20,
              departure: {
                delay: 7
              }
            }
          ]
        }
      };

      const expected = {
        id: 'urn:ngsi-ld:TripUpdate:bus01',
        stopTimeUpdate: {
          type: 'StructuredValues',
          value: [
            {
              departure: {
                delay: 7
              },
              stopSequence: 20
            }
          ]
        },
        trip: {
          type: 'StructuredValues',
          value: {
            tripId: '1119'
          }
        },
        type: 'TripUpdate'
      };

      const actual = tripUpdate2ngsi(data);

      assert.deepEqual(actual, expected);
    });
  });
  describe('gtfs2ngsi', () => {
    it('should be vehicle', () => {
      const gtfs2ngsi = gtfsRealtimeNode.__get__('gtfs2ngsi');

      const data = [
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
      ];
      const expected = [
        {
          currentStatus: {
            type: 'Text',
            value: 'IN_TRANSIT_TO'
          },
          currentStopSequence: {
            type: 'Number',
            value: 1
          },
          id: 'urn:ngsi-ld:Vehicle:bus01',
          location: {
            type: 'geo:json',
            value: {
              coordinates: [135.2, 35.1],
              type: 'Point'
            }
          },
          position: {
            type: 'StructuredValues',
            value: {
              bearing: 180.3,
              latitude: 35.1,
              longitude: 135.2
            }
          },
          stopId: {
            type: 'Text',
            value: 'S0001'
          },
          timestamp: {
            type: 'Text',
            value: '0000000001'
          },
          trip: {
            type: 'StructuredValues',
            value: {
              routeId: '001',
              scheduleRelationship: 'SCHEDULED',
              startDate: '20220301',
              tripId: '00000000000000000000000000000000'
            }
          },
          type: 'Vehicle',
          vehicle: {
            type: 'StructuredValues',
            value: {
              id: 'bus01'
            }
          }
        }
      ];
      const actual = gtfs2ngsi(data);

      assert.deepEqual(actual, expected);
    });
    it('should be tripUpdate', () => {
      const gtfs2ngsi = gtfsRealtimeNode.__get__('gtfs2ngsi');

      const data = [
        {
          id: 'bus01',
          tripUpdate: {
            trip: {
              tripId: '1119'
            },
            stopTimeUpdate: [
              {
                stopSequence: 20,
                departure: {
                  delay: 7
                }
              }
            ]
          }
        }
      ];

      const expected = [
        {
          id: 'urn:ngsi-ld:TripUpdate:bus01',
          stopTimeUpdate: {
            type: 'StructuredValues',
            value: [
              {
                departure: {
                  delay: 7
                },
                stopSequence: 20
              }
            ]
          },
          trip: {
            type: 'StructuredValues',
            value: {
              tripId: '1119'
            }
          },
          type: 'TripUpdate'
        }
      ];
      const actual = gtfs2ngsi(data);

      assert.deepEqual(actual, expected);
    });
    it('should be unknown', () => {
      const gtfs2ngsi = gtfsRealtimeNode.__get__('gtfs2ngsi');

      const actual = gtfs2ngsi([{}]);

      assert.deepEqual(actual, []);
    });
  });

  describe('NGSI gtfs realtime node', () => {
    afterEach(() => {
      gtfsRealtimeNode.__ResetDependency__('getGtfsRealtime');
    });
    const data = {
      id: 'bus01',
      tripUpdate: {
        trip: {
          tripId: '1119'
        },
        stopTimeUpdate: [
          {
            stopSequence: 20,
            departure: {
              delay: 7
            }
          }
        ]
      }
    };
    const expected = {
      id: 'urn:ngsi-ld:TripUpdate:bus01',
      stopTimeUpdate: {
        type: 'StructuredValues',
        value: [
          {
            departure: {
              delay: 7
            },
            stopSequence: 20
          }
        ]
      },
      trip: {
        type: 'StructuredValues',
        value: {
          tripId: '1119'
        }
      },
      type: 'TripUpdate'
    };
    it('payload url', async () => {
      const red = new MockRed();
      gtfsRealtimeNode(red);
      red.createNode({});

      let actual;
      gtfsRealtimeNode.__set__('getGtfsRealtime', (msg) => {
        actual = Object.assign({}, msg);
        msg.payload = { entity: [data] };
        msg.statusCode = 200;
      });

      await red.inputWithAwait({ payload: 'http://gtfs-realtime' });

      assert.deepEqual(actual, { payload: 'http://gtfs-realtime' });
      assert.deepEqual(red.getOutput(), {
        payload: [expected],
        statusCode: 200
      });
    });
    it('get error', async () => {
      const red = new MockRed();
      gtfsRealtimeNode(red);
      red.createNode({});

      let actual;
      gtfsRealtimeNode.__set__('getGtfsRealtime', (msg) => {
        actual = Object.assign({}, msg);
        msg.payload = { error: 'error' };
        msg.statusCode = 400;
      });

      await red.inputWithAwait({ payload: 'http://gtfs-realtime' });

      assert.deepEqual(actual, { payload: 'http://gtfs-realtime' });
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'error' },
        statusCode: 400
      });
    });
    it('payload object', async () => {
      const red = new MockRed();
      gtfsRealtimeNode(red);
      red.createNode({});

      await red.inputWithAwait({ payload: data });

      assert.deepEqual(red.getOutput(), {
        payload: [expected],
        statusCode: 200
      });
    });
    it('payload array', async () => {
      const red = new MockRed();
      gtfsRealtimeNode(red);
      red.createNode({});

      await red.inputWithAwait({ payload: [data] });

      assert.deepEqual(red.getOutput(), {
        payload: [expected],
        statusCode: 200
      });
    });
    it('payload error', async () => {
      const red = new MockRed();
      gtfsRealtimeNode(red);
      red.createNode({});

      await red.inputWithAwait({ payload: 1 });

      assert.equal(red.getMessage(), 'payload error');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'payload error' },
        statusCode: 500
      });
    });
    it('entities empty', async () => {
      const red = new MockRed();
      gtfsRealtimeNode(red);
      red.createNode({});

      await red.inputWithAwait({ payload: [] });

      assert.equal(red.getMessage(), 'entities empty');
      assert.deepEqual(red.getOutput(), {
        payload: { error: 'entities empty' },
        statusCode: 500
      });
    });
  });
});
