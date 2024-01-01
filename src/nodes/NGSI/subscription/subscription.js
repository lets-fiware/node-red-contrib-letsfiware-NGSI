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

const buildSubscription = function (param) {
  const subscription = { subject: { entities: [{}] }, notification: {} };

  ['type', 'idPattern', 'watchedAttrs', 'q', 'url', 'attrs', 'attrsFormat'].forEach((e) => {
    if (param[e] === '') {
      delete param[e];
    }
  });

  ['watchedAttrs', 'attrs'].forEach((e) => {
    if (param[e] && typeof param[e] === 'string') {
      param[e] = param[e].split(',');
    }
  });

  ['description', 'expires', 'throttling', 'status'].forEach((e) => {
    if (param[e] && param[e] !== '') {
      subscription[e] = param[e];
    }
  });

  ['idPattern', 'type'].forEach((e) => {
    if (param[e]) {
      subscription.subject.entities[0][e] = param[e];
    }
  });

  if (param.watchedAttrs) {
    subscription.subject.condition = {};
    subscription.subject.condition.attrs = param['watchedAttrs'];
  }

  ['q', 'mq', 'georel', 'geometry', 'coords'].forEach((e) => {
    if (param[e]) {
      if (!subscription.subject.condition) {
        subscription.subject.condition = {};
      }
      if (!subscription.subject.condition.expression) {
        subscription.subject.condition.expression = {};
      }
      subscription.subject.condition.expression[e] = param[e];
    }
  });

  if (param['url']) {
    subscription.notification.http = { url: param['url'] };
  }
  if (param['attrs']) {
    subscription.notification.attrs = param['attrs'];
  }
  if (param['attrsFormat']) {
    subscription.notification.attrsFormat = param['attrsFormat'];
  }

  if (subscription.subject.entities.length === 1 && !Object.keys(subscription.subject.entities[0]).length) {
    delete subscription.subject.entities;
  }
  if (!Object.keys(subscription.subject).length) {
    delete subscription.subject;
  }
  if (!Object.keys(subscription.notification).length) {
    delete subscription.notification;
  }
  return subscription;
};

const createSubscription = async function (msg, param) {
  const options = {
    method: 'post',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: param.config.subscription
  };

  try {
    const res = await lib.http(options);
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 201) {
      msg.payload = res.headers.location.slice('/v2/subscriptions/'.length);
      msg.headers = {};
      msg.headers.location = res.headers.location;
    } else {
      this.error(`Error while creating subscription: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
    }
  } catch (error) {
    this.error(`Exception while creating subscription: ${error.message}`);
    msg.payload = { error: error.message };
    msg.statusCode = 500;
  }
};

const updateSubscription = async function (msg, param) {
  const options = {
    method: 'patch',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param),
    data: param.config.subscription
  };

  try {
    const res = await lib.http(options);
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 204) {
      return;
    } else {
      this.error(`Error while updating subscription: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
    }
  } catch (error) {
    this.error(`Exception while updating subscription: ${error.message}`);
    msg.payload = { error: error.message };
    msg.statusCode = 500;
  }
};

const deleteSubscription = async function (msg, param) {
  const options = {
    method: 'delete',
    baseURL: param.host,
    url: param.pathname,
    headers: await lib.buildHTTPHeader(param)
  };

  try {
    const res = await lib.http(options);
    msg.payload = res.data;
    msg.statusCode = Number(res.status);
    if (res.status === 204) {
      return;
    } else {
      this.error(`Error while deleting subscription: ${res.status} ${res.statusText}`);
      if (res.data && res.data.description) {
        this.error(`Details: ${res.data.description}`);
      }
      if (res.data && res.data.orionError) {
        this.error(`Details: ${JSON.stringify(res.data.orionError)}`);
      }
    }
  } catch (error) {
    this.error(`Exception while deleting subscription: ${error.message}`);
    msg.payload = { error: error.message };
    msg.statusCode = 500;
  }
};

const createParam = function (msg, config, openAPIsConfig) {
  if (openAPIsConfig.geType !== 'orion') {
    msg.payload = { error: 'FIWARE GE type not Orion' };
    return null;
  }

  let defaultConfig = {
    service: openAPIsConfig.service.trim(),
    servicepath: config.servicepath.trim(),
    actionType: config.actionType.trim(),
    id: '',
    subscription: buildSubscription({
      type: config.entityType.trim(),
      idPattern: config.idPattern.trim(),
      watchedAttrs: config.watchedAttrs.trim(),
      q: config.query.trim(),
      url: config.url.trim(),
      attrs: config.attrs.trim(),
      attrsFormat: config.attrsFormat.trim()
    })
  };

  if (defaultConfig.actionType === 'payload') {
    if ('actionType' in msg.payload) {
      defaultConfig.actionType = msg.payload.actionType;
      if ('id' in msg.payload) {
        defaultConfig.id = msg.payload.id;
      }
      if ('subscription' in msg.payload) {
        defaultConfig.subscription = Object.assign(defaultConfig.subscription, buildSubscription(msg.payload.subscription));
      }
    } else {
      msg.payload = { error: 'actionType not found' };
      return null;
    }
  } else {
    if (defaultConfig.actionType === 'delete') {
      if (typeof msg.payload === 'string') {
        defaultConfig.id = msg.payload;
      } else {
        msg.payload = { error: 'payload not string' };
        return null;
      }
    } else {
      // create, update
      if (Array.isArray(msg.payload) || typeof msg.payload !== 'object') {
        msg.payload = { error: 'payload not JSON object' };
        return null;
      }
      if (defaultConfig.actionType === 'update') {
        if (!('id' in msg.payload)) {
          msg.payload = { error: 'subscription id not found' };
          return null;
        }
        defaultConfig.id = msg.payload.id;
        delete msg.payload.id;
      }
      defaultConfig.subscription = Object.assign(
        defaultConfig.subscription,
        'notification' in msg.payload || 'subject' in msg.payload ? msg.payload : buildSubscription(msg.payload)
      );
    }
  }

  if (typeof defaultConfig.id !== 'string') {
    msg.payload = { error: 'subscription id not string' };
    return null;
  }

  const param = {
    host: openAPIsConfig.apiEndpoint,
    pathname: '/v2/subscriptions',
    getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
    contentType: 'json',
    config: defaultConfig
  };

  switch (defaultConfig.actionType) {
    case 'create':
      param.func = createSubscription;
      break;
    case 'update':
      param.func = updateSubscription;
      param.pathname += '/' + param.config.id;
      break;
    case 'delete':
      param.func = deleteSubscription;
      param.pathname += '/' + param.config.id;
      delete param.contentType;
      break;
    default:
      msg.payload = { error: 'ActionType error: ' + defaultConfig.actionType };
      return null;
  }

  [param.config.service, param.config.servicepath] = lib.getServiceAndServicePath(msg, openAPIsConfig.service.trim(), defaultConfig.servicepath);

  return param;
};

module.exports = function (RED) {
  function NGSISubscription(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      const param = createParam(msg, config, openAPIsConfig);

      if (param) {
        await param.func.call(node, msg, param);
      } else {
        node.error(msg.payload.error);
        msg.statusCode = 500;
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('NGSI subscription', NGSISubscription);
};
