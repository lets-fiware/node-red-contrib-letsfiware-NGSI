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

function buildSubscription(param) {
  const subscription = { subject: { entities: [{}] }, notification: {} };

  param.config = Object.assign(param.config, param.config.data);

  ['type', 'idPattern', 'watchedAttrs', 'q', 'url', 'attrs'].forEach((e) => {
    if (param.config[e] === '') {
      delete param.config[e];
    }
  });

  ['watchedAttrs', 'attrs'].forEach((e) => {
    if (param.config[e] && typeof param.config[e] === 'string') {
      param.config[e] = param.config[e].split(',');
    }
  });

  ['description', 'expires', 'throttling'].forEach((e) => {
    if (param.config[e] && param.config[e] !== '') {
      subscription[e] = param.config[e];
    }
  });

  ['idPattern', 'type'].forEach((e) => {
    if (param.config[e]) {
      subscription.subject.entities[0][e] = param.config[e];
    }
  });

  if (param.config.watchedAttrs) {
    subscription.subject.condition = {};
    subscription.subject.condition.attrs = param.config['watchedAttrs'];
  }
  ['q', 'mq', 'georel', 'geometry', 'coords'].forEach((e) => {
    if (param.config[e]) {
      if (!subscription.subject.condition) {
        subscription.subject.condition = {};
      }
      if (!subscription.subject.condition.expression) {
        subscription.subject.condition.expression = {};
      }
      subscription.subject.condition.expression[e] = param.config[e];
    }
  });

  if (param.config['url']) {
    subscription.notification.http = { url: param.config['url'] };
  }
  if (param.config['attrs'] && param.config['attrs'] !== '') {
    subscription.notification.attrs = param.config['attrs'];
  }

  param.config.data = subscription;
}

async function createSubscription(param) {
  if (
    !param.config.data['subject'] ||
    !param.config.data['notification']
  ) {
    buildSubscription(param);
  }
  const options = {
    method: 'post',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: param.config.data,
  };

  try {
    const res = await lib.http(options);
    if (res.status === 201) {
      return res.headers['location'].slice('/v2/subscriptions/'.length);
    } else {
      this.error(`Error while creating subscription: ${res.status} ${res.statusText}`);
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
    }
  } catch (error) {
    this.error(`Exception while creating subscription: ${error}`);
    return null;
  }
  return null;
}

async function updateSubscription(param) {
  const options = {
    method: 'patch',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: param.config.data,
  };

  try {
    const res = await lib.http(options);
    if (res.status === 204) {
      return {payload: res.status};
    } else {
      this.error(`Error while updating subscription: ${res.status} ${res.statusText}`);
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
      return {payload: null};
    }
  } catch (error) {
    this.error(`Exception while updating subscription: ${error}`);
    return {payload: null};
  }
}

async function deleteSubscription(param) {
  const options = {
    method: 'delete',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
  };

  try {
    const res = await lib.http(options);
    if (res.status === 204) {
      return {payload: res.status};
    } else {
      this.error(`Error while deleting subscription: ${res.status} ${res.statusText}`);
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
    }
    return {payload: null};
  } catch (error) {
    this.error(`Exception while deleting subscription: ${error}`);
    return {payload: null};
  }
}

module.exports = function (RED) {
  function NGSISubscription(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      let data = msg.payload;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (Array.isArray(data) || typeof data !== 'object') {
        this.error('not subscription payload');
        return;
      }

      const defaultConfig = {
        id: null,
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        limit: 20,
        data: data,
      };

      if (data.id) {
        defaultConfig.id = data.id;
        delete data.id;
      }
      if (data.service) {
        defaultConfig.serivce = data.service;
        delete data.service;
      }
      if (data.servicepath) {
        defaultConfig.serivcepath = data.servicepath;
        delete data.servicepath;
      }
      if (data.limit) {
        defaultConfig.limit = data.limit;
        delete data.limit;
      }

      const param = {
        host: openAPIsConfig.brokerEndpoint,
        pathname: '/v2/subscriptions',
        getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
        contentType: 'json',
        config: defaultConfig,
      };

      if (defaultConfig.id) {
        if (Object.keys(defaultConfig.data).length === 0) {
          param.pathname += '/' + defaultConfig.id;
          param.contentType = null;
          const res = await deleteSubscription(param);
          node.send(res);
        } else {
          param.pathname += '/' + defaultConfig.id;
          const res = await updateSubscription(param);
          node.send(res);
        }
      } else {
        const id = await createSubscription(param);
        if (id) {
          node.send({ payload: {id: id, service: param.config.service, servicepath: param.config.servicepath} });
        } else {
          node.send({ payload: null });
        }
      }
    });
  }
  RED.nodes.registerType('NGSI subscription', NGSISubscription);
};
