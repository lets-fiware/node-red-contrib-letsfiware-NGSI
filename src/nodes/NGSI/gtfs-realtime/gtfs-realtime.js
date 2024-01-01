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

'use strict';

const lib = require('../../../lib.js');
const gtfsRealtimeBindings = require('gtfs-realtime-bindings');

const getGtfsRealtime = async function (msg) {
  const url = msg.payload;
  try {
    const res = await lib.http({
      method: 'get',
      baseURL: url,
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    });
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 200) {
      msg.payload = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(res.data);
    } else {
      this.error(`Error while retrieving gtfs realtime data: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    this.error(`Exception while retrieving gtfs realtime data: ${err.message}`);
    msg.payload = { error: err.message };
    msg.statusCode = 500;
  }
};

function vehicle2ngsi(v) {
  return {
    id: `urn:ngsi-ld:Vehicle:${v.id}`,
    type: 'Vehicle',
    trip: {
      type: 'StructuredValues',
      value: v.vehicle.trip
    },
    position: {
      type: 'StructuredValues',
      value: v.vehicle.position
    },
    currentStopSequence: {
      type: 'Number',
      value: v.vehicle.currentStopSequence
    },
    currentStatus: {
      type: 'Text',
      value: v.vehicle.currentStatus
    },
    timestamp: {
      type: 'Text',
      value: v.vehicle.timestamp
    },
    stopId: {
      type: 'Text',
      value: v.vehicle.stopId
    },
    vehicle: {
      type: 'StructuredValues',
      value: v.vehicle.vehicle
    },
    location: {
      type: 'geo:json',
      value: {
        type: 'Point',
        coordinates: [v.vehicle.position.longitude, v.vehicle.position.latitude]
      }
    }
  };
}

function tripUpdate2ngsi(v) {
  return {
    id: `urn:ngsi-ld:TripUpdate:${v.id}`,
    type: 'TripUpdate',
    trip: {
      type: 'StructuredValues',
      value: v.tripUpdate.trip
    },
    stopTimeUpdate: {
      type: 'StructuredValues',
      value: v.tripUpdate.stopTimeUpdate
    }
  };
}

function gtfs2ngsi(data) {
  const entities = [];

  data.forEach((e) => {
    if (e.vehicle) {
      entities.push(vehicle2ngsi(e));
    } else if (e.tripUpdate) {
      entities.push(tripUpdate2ngsi(e));
    }
  });
  return entities;
}

module.exports = function (RED) {
  function NGSIGTFSRealtime(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on('input', async function (msg) {
      if (typeof msg.payload === 'string') {
        await getGtfsRealtime.call(node, msg);
        if (msg.statusCode === 200) {
          msg.payload = msg.payload.entity;
        }
      } else if (typeof msg.payload === 'object') {
        msg.payload = Array.isArray(msg.payload) ? msg.payload : [msg.payload];
        msg.statusCode = 200;
      } else {
        msg.payload = { error: 'payload error' };
        msg.statusCode = 500;
        node.error(msg.payload.error);
      }

      if (msg.statusCode === 200) {
        msg.payload = gtfs2ngsi(msg.payload);
        if (msg.payload.length === 0) {
          msg.payload = { error: 'entities empty' };
          msg.statusCode = 500;
          node.error(msg.payload.error);
        }
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('GTFS Realtime to NGSI', NGSIGTFSRealtime);
};
