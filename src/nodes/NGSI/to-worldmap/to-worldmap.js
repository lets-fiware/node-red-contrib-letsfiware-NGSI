/*
   MIT License

   Copyright 2022 Kazuhito Suda

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

function createGeoSpatialInfo(location) {
  const payload = {};

  switch (location.type) {
  case 'geo:point': {
    const latlon = location.value.split(',');
    payload.lat = Number(latlon[0]);
    payload.lon = Number(latlon[1]);
    break;
  }
  case 'geo:line': 
    payload.line = location.value.map((e) => {
      return e.split(',').map(e => Number(e));
    });
    break;
  case 'geo:box':
  case 'geo:polygon':
    payload.area = location.value.map((e) => {
      return e.split(',').map((e) => Number(e));
    });
    break;
  case 'Point':
    payload.lat = location.coordinates[1];
    payload.lon = location.coordinates[0];
    break;
  case 'LineString':
    payload.line = location.coordinates.map((e) => [e[1], e[0]]);
    break;
  case 'Polygon':
    payload.area = [location.coordinates[0].map((e) => [e[1], e[0]])];
    break;
  case 'MultiLineString':
    payload.line = location.coordinates.map((e1) => e1.map((e2) => [e2[1], e2[0]]));
    break;
  case 'MultiPolygon':
    payload.area = location.coordinates.map((e1) =>
      e1.map((e2) => e2.map((e3) => [e3[1], e3[0]]))
    );
    break;
  }
  return payload;
}

module.exports = function (RED) {
  function ngsi2worldmap(config) {
    RED.nodes.createNode(this, config);
    let node = this;

    node.on('input', function (msg) {
      if (typeof msg.payload == 'string') {
        msg.payload = JSON.parse(msg.payload);
      }
      if (!Array.isArray(msg.payload)) {
        if (Object.prototype.hasOwnProperty.call(msg.payload,'subscriptionId')) {
          msg.payload = msg.payload.data;
        } else {
          msg.payload = [msg.payload];
        }
      }
      const pois = [];
      msg.payload.forEach((entity) => {
        const location =
          entity.location.coordinates == null ? entity.location.value : entity.location;

        let poi = createGeoSpatialInfo(location);

        poi.name =
          entity[config.attrname] == null
            ? entity.id
            : typeof entity[config.attrname] == 'string'
              ? entity[config.attrname]
              : entity[config.attrname].value;

        if (entity[config.attrworldmap]) {
          if (entity[config.attrworldmap].value) {
            poi = Object.assign(poi, entity[config.attrworldmap].value); 
          } else {
            poi = Object.assign(poi, entity[config.attrworldmap]); 
          }
        }
        pois.push(poi);
      });
      node.send({ payload: pois });
    });
  }
  RED.nodes.registerType('NGSI to worldmap', ngsi2worldmap);
};
