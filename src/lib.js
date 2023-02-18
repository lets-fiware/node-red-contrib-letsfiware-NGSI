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

  if (typeof config.limit !== 'undefined') {
    params.set('limit', config.limit);
    if (typeof config.page !== 'undefined') {
      params.set('offset', config.page * config.limit);
    }
  }

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

module.exports = {
  http,
  buildHTTPHeader,
  buildParams,
  updateContext,
  getServiceAndServicePath,
};
