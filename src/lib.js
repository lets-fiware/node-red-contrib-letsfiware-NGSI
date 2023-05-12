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

const axios = require('axios');

async function http(options) {
  return new Promise(function (resolve, reject) {
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

async function buildHTTPHeader(param) {
  const headers = {};

  if (typeof param.config !== 'undefined') {
    const config = param.config;
    if (typeof config.service !== 'undefined' && config.service !== '') {
      headers['Fiware-Service'] = config.service;
    }

    if (typeof config.servicepath !== 'undefined' && config.servicepath !== '') {
      headers['Fiware-ServicePath'] = config.servicepath;
    }
  }

  if (typeof param.getToken !== 'undefined' && param.getToken) {
    const accessToken = await param.getToken();
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (typeof param.contentType !== 'undefined') {
    if (param.contentType === 'json') {
      headers['Content-Type'] = 'application/json';
    } else {
      headers['Content-Type'] = param.contentType;
    }
  }

  return headers;
}

function buildParams(config) {
  const params = new URLSearchParams();

  [
    'id',
    'type',
    'idPattern',
    'typePattern',
    'q',
    'mq',
    'georel',
    'geometry',
    'coords',
    'maxDistance',
    'minDistance',
    'attrs',
    'metadata',
    'orderBy',
    'lastN',
    'fromDate',
    'toDate',
    'aggrMethod',
    'aggrPeriod',
    'limit',
    'offset',
  ].forEach((e) => {
    if (config[e] && config[e] !== '') {
      params.set(e, config[e]);
    }
  });

  const options = [];
  ['count', 'keyValues', 'upsert', 'skipForwarding', 'forcedUpdate', 'flowControl', 'append', 'overrideMetadata', 'values', 'noAttrDetail'].forEach(e => {
    if (typeof config[e] !== 'undefined' && config[e]) {
      options.push(e);
    }
  });
  if (options.length > 0) {
    params.set('options', options.join());
  }

  return params;
}

function updateContext(msg, service, path, count) {
  if (!Object.prototype.hasOwnProperty.call(msg, 'context')) {
    msg.context = {};
  }
  msg.context.fiwareService = service;
  msg.context.fiwareServicePath = path;
  msg.context.fiwareTotalCount = count;

  return msg;
}

function getServiceAndServicePath(msg, service, path) {
  if (!Object.prototype.hasOwnProperty.call(msg, 'context')) {
    msg.context = {};
  }
  if (!Object.prototype.hasOwnProperty.call(msg.context, 'fiwareService')) {
    msg.context.fiwareService = null;
  }
  if (!Object.prototype.hasOwnProperty.call(msg.context, 'fiwareServicePath')) {
    msg.context.fiwareServicePath = null;
  }
  if (msg.context.fiwareService === null) {
    msg.context.fiwareService = service;
  }
  if (msg.context.fiwareServicePath === null) {
    msg.context.fiwareServicePath = path;
  }

  msg.context.fiwareService = msg.context.fiwareService.toLowerCase();

  return [msg.context.fiwareService, msg.context.fiwareServicePath];
}

function convertDateTime(dt, value, unit) {
  if (value === '') return ['', null];

  if (unit !== 'ISO8601') {
    value = Number(value.replace(/^-/, ''));

    if (isNaN(value)) {
      return [null, 'dateTime not Number'];
    }
    value = Number(value);
  }

  switch (unit) {
    case 'years':
      dt.setMonth(dt.getMonth() - value * 12);
      break;
    case 'months':
      dt.setMonth(dt.getMonth() - value);
      break;
    case 'days':
      dt.setDate(dt.getDate() - value);
      break;
    case 'hours':
      dt.setHours(dt.getHours() - value);
      break;
    case 'minutes':
      dt.setMinutes(dt.getMinutes() - value);
      break;
    case 'seconds':
      dt.setSeconds(dt.getSeconds() - value);
      break;
    case 'ISO8601':
      return [value, null];
    default:
      return [null, 'Unit error: ' + unit];
  }

  return [dt.toISOString(), null];
}

function jsonToNGSI(data) {
  let res = {};

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  for (var key in data) {
    let attrType = 'None';
    switch (typeof data[key]) {
      case 'boolean':
        attrType = 'Boolean';
        break;
      case 'number':
        attrType = 'Number';
        break;
      case 'string':
        attrType = 'Text';
        break;
      case 'object':
        if (data[key] != null) {
          attrType = 'StructuredValue';
        }
        break;
    }
    res[key] = {
      'type': attrType,
      'value': data[key],
    };
  }

  return res;
}

const encodeforbiddenChar = value => value.replace(/%/g, '%25').replace(/"/g, '%22').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/;/g, '%3B').replace(/</g, '%3C').replace(/=/g, '%3D').replace(/>/g, '%3E');
const decodeforbiddenChar = value => value.replace(/%25/g, '%').replace(/%22/g, '"').replace(/%27/g, '\'').replace(/%28/g, '(').replace(/%29/g, ')').replace(/%3B/g, ';').replace(/%3C/g, '<').replace(/%3D/g, '=').replace(/%3E/g, '>');

function replaceObject(json, func) {
  for (const [key, value] of Object.entries(json)) {
    if (typeof value === 'string') {
      json[key] = func(value);
    } else if (Array.isArray(value)) {
      replaceArray(value, func);
    } else if (typeof value === 'object') {
      replaceObject(value, func);
    }
  }
  return json;
}

function replaceArray(arr, func) {
  for (let i = 0; i < arr.length; ++i) {
    if (typeof arr[i] === 'string') {
      arr[i] = func(arr[i]);
    } else if (Array.isArray(arr[i])) {
      replaceArray(arr[i], func);
    } else if (typeof arr[i] === 'object') {
      replaceObject(arr[i], func);
    }
  }
  return arr;
}

function encodeNGSI(json, on) {
  if (on) {
    if (Array.isArray(json)) {
      json = replaceArray(json, encodeforbiddenChar);
    } else {
      json = replaceObject(json, encodeforbiddenChar);
    }
  }
  return json;
}

function decodeNGSI(json, on) {
  if (on) {
    if (Array.isArray(json)) {
      json = replaceArray(json, decodeforbiddenChar);
    } else {
      json = replaceObject(json, decodeforbiddenChar);
    }
  }
  return json;
}

module.exports = {
  http,
  buildHTTPHeader,
  buildParams,
  updateContext,
  getServiceAndServicePath,
  convertDateTime,
  jsonToNGSI,
  encodeNGSI,
  decodeNGSI,
  encodeforbiddenChar,
  decodeforbiddenChar,
};
