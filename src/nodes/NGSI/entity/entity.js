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

const getEntity = async function (param) {

  const options = {
    method: 'get',
    baseURL: param.host,
    url: param.pathname + '/' + param.config.id,
    headers: await lib.buildHTTPHeader(param),
    params: lib.buildParams(param.config),
  };

  try {
    const res = await lib.http(options);
    if (res.status === 200) {
      return res.data;
    } else {
      this.error(`Error while retrieving entities: ${res.status} ${res.statusText}`);
      return null;
    }
  } catch (error) {
    this.error(`Exception while retrieving entities: ${error}`);
    return null;
  }
};

module.exports = function (RED) {
  function NGSIEntity(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const openAPIsConfig = RED.nodes.getNode(config.openapis);

    node.on('input', async function (msg) {
      if (!msg.payload) {
        msg.payload = {};
      } else if (typeof msg.payload === 'string') {
        msg.payload = { id: msg.payload.trim() };
      }

      const defaultConfig = {
        service: openAPIsConfig.service.trim(),
        servicepath: config.servicepath.trim(),
        keyValues: config.mode !== 'normalized',
        type: config.entitytype.trim(),
        attrs: config.attrs.trim(),
        metadata: '',
      };

      if (config.datemodified === 'true') {
        if (defaultConfig.attrs === '') {
          defaultConfig.attrs = 'dateModified,*';
        } else {
          defaultConfig.attrs += ',dateModified';
        }
        defaultConfig.metadata = 'dateModified,*';
      }

      const param = {
        host: openAPIsConfig.brokerEndpoint,
        pathname: '/v2/entities',
        getToken: openAPIsConfig.getToken === null ? null : openAPIsConfig.getToken.bind(openAPIsConfig),
        config: Object.assign(defaultConfig, msg.payload),
      };

      if (!('id' in msg.payload) || msg.payload.id === '') {
        node.error('Entity Id missing');
        return;
      }

      const entity = await getEntity.call(node, param);

      if (entity) {
        node.send({ payload: entity });
      }
    });
  }
  RED.nodes.registerType('NGSI Entity', NGSIEntity);
};
