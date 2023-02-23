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

'use strict';

const lib = require('../../../lib.js');

const transform = function (data) {

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    this.error('data not object');
    return null;
  }

  const res = lib.jsonToNGSI(data);

  res.location = {
    type: 'geo:json',
    value: {
      type: 'Point',
    }
  };

  if (data.weather) {
    res.type = 'OpenWeatherMapWeather';
    res.location.value.coordinates = [data.coord.lon, data.coord.lat];
  } else {
    res.type = 'OpenWeatherMapForecast';
    res.location.value.coordinates = [data.city.coord.lon, data.city.coord.lat];
  }
  res.id = 'urn:ngsi-ld:' + res.type + ':' + data.id;

  return res;
};

module.exports = function (RED) {
  function OpenWeatherMapToNGSI(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', async function (msg) {
      const res = transform.call(node, msg.data);

      if (res) {
        msg.payload = res;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('OpenWeatherMap to NGSI', OpenWeatherMapToNGSI);
};
