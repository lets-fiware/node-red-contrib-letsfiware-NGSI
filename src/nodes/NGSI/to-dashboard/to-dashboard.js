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

function calculateDateTime(origin, resolution, offset) {
  const dt = new Date(origin);

  switch (resolution) {
    case 'month':
      dt.setMonth(dt.getMonth() + offset);
      break;
    case 'day':
      dt.setDate(dt.getDate() + offset);
      break;
    case 'hour':
      dt.setHours(dt.getHours() + offset);
      break;
    case 'minute':
      dt.setMinutes(dt.getMinutes() + offset);
      break;
    case 'second':
      dt.setSeconds(dt.getSeconds() + offset);
      break;
  }

  return dt.getTime();
}

function transformHistorical(payload) {
  const data = {};

  data.series = [payload.attrName];
  data.labels = [];
  data.data = [];
  const dataType = payload.dataType;

  let values = [];
  if (payload.dataType === 'raw') {
    values = payload.value.map((e) => { return { 'x': Date.parse(e.recvTime), 'y': e.attrValue }; });
  } else {
    payload.value.forEach((e) => {
      const origin = e._id.origin;
      const resolution = e._id.resolution;
      e.points.forEach((e) => values.push({ 'x': calculateDateTime(origin, resolution, e.offset), 'y': e[dataType] }));
    });
  }
  data.data.push(values);

  return [data];
}

function getDateTime(attribute) {
  let dt = null;
  if ('metadata' in attribute) {
    if ('TimeInstant' in attribute.metadata) {
      dt = Date.parse(attribute.metadata.TimeInstant.value);
    } else if ('dateModified' in attribute.metadata) {
      dt = Date.parse(attribute.metadata.dateModified.value);
    }
  }
  return dt;
}

module.exports = function (RED) {
  function ngsi2dashboard(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      const attrs = config.attrs.split(',');
      let names = config.names === '' ? [] : config.names.split(',');
      if (names.length < attrs.length) {
        names = attrs;
      }

      if (config.inputType === 'entity') {
        const entity = msg.payload;
        attrs.forEach((item, index) => {
          if (Object.prototype.hasOwnProperty.call(entity, item)) {
            msg.topic = names[index];
            msg.payload = entity[item].value;
            msg.timestamp = getDateTime(entity[item]);
            node.send(msg);
          }
        });

      } else if (config.inputType === 'notification') {
        const entity = msg.payload.data[0];
        attrs.forEach((item, index) => {
          if (Object.prototype.hasOwnProperty.call(entity, item)) {
            msg.topic = names[index];
            msg.payload = entity[item].value;
            msg.timestamp = getDateTime(entity[item]);
            node.send(msg);
          }
        });

      } else if (config.inputType === 'historical') {
        msg.payload = transformHistorical(msg.payload);
        node.send(msg);
      } else {
        node.error('Input type error: ' + config.inputType);
      }

    });
  }
  RED.nodes.registerType('NGSI to dashboard', ngsi2dashboard);
};
