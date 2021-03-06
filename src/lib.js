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

  if (typeof param.contentType !== 'undefined' && param.contentType === 'json') {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

function buildParams(config) {
  const params = new URLSearchParams();
  
  if (typeof config.type !== 'undefined' && config.type !== '') {
    params.set('type', config.type);
  }

  if (typeof config.attrs!== 'undefined' && config.attrs !== '') {
    params.set('attrs', config.attrs);
  }

  if (typeof config.keyValues !== 'undefined' && config.keyValues) {
    params.set('options', 'keyValues');
  }

  return params;
}

function buildSearchParams(config) {
  const searchParams = new URLSearchParams();

  if (typeof config.limit !== 'undefined') {
    searchParams.set('limit', config.limit);
    if (typeof config.page !== 'undefined') {
      searchParams.set('offset', config.page * config.limit);
    }
  }
  
  let options = 'count';
  if (typeof config.keyValues !== 'undefined' && config.keyValues) {
    options += ',keyValues';
  }
  searchParams.set('options', options);

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
      searchParams.set(e, config[e]);
    }
  });

  return searchParams;
}

module.exports = {
  http,
  buildHTTPHeader,
  buildSearchParams,
  buildParams,
};
