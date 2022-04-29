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

const http= require('../../../lib.js').http;

const urlValidator = function (url) {
  url = url.trim();
  if (url === '') {
    return null;
  }
  try {
    url = new URL(url);
  } catch(error) {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return null;
  }
  url.search = '';

  return url.toString().replace(/\/$/, '');
};

const getToken = async function () {
  if (this.accessToken && this.tokenExpires && this.tokenExpires.getTime() > Date.now()) {
    return this.accessToken;
  }

  this.accessToken = null;
  this.tokenExpires = null;

  const options = {
    method: 'post',
    baseURL: this.idmEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: `username=${this.credentials.username}&password=${this.credentials.password}&grant_type=password`,
  };

  if (this.idmType === 'tokenproxy') {
    if (!this.idmEndpoint.endsWith('/token')) {
      options.url = '/token';
      options.data = `username=${this.credentials.username}&password=${this.credentials.password}`;
    }
  } else {
    const authBearer = Buffer.from(`${this.credentials.clientid}:${this.credentials.clientsecret}`).toString(
      'base64'
    );
    options.headers.Authorization = `Basic ${authBearer}`;
    if (this.idmType === 'keyrock' && !this.idmEndpoint.endsWith('/oauth2/token')) {
      options.url = '/oauth2/token';
    }
  }

  try {
    const res = await http(options);
    if (res.status === 200) {
      this.accessToken = res.data.access_token;
      this.tokenExpires = new Date(Date.now() + (res.data.expires_in - 60) * 1000);
    } else {
      this.error(`Error while obtaining token. Status Code: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    this.error(`Exception while obtaining token: ${error}`);
  }

  return this.accessToken;
};

module.exports = function (RED) {
  function OpenAPIsNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.brokerEndpoint = urlValidator(config.brokerEndpoint);
    node.service = config.service;

    node.idmType = config.idmType || 'none';
    node.idmEndpoint = urlValidator(config.idmEndpoint);

    node.accessToken = null;
    node.tokenExpires = null;

    node.getToken =
      node.idmType === 'none'
        ? null
        : getToken;
  }

  RED.nodes.registerType('Open APIs', OpenAPIsNode, {
    credentials: {
      username: { type: 'text' },
      password: { type: 'password' },
      clientid: { type: 'text' },
      clientsecret: { type: 'password' },
    },
  });
};
