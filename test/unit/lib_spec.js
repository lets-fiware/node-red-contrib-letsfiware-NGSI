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

/* eslint-env node, mocha */

'use strict';

require('babel-register')({
  plugins: ['babel-plugin-rewire']
});

const { assert } = require('chai');

const lib = require('../../src/lib.js');

describe('lib.js', () => {
  describe('http', () => {
    afterEach(() => {
      lib.__ResetDependency__('axios');
    });
    it('should be http 200 OK', async () => {
      lib.__set__('axios', async () => Promise.resolve({ status: 200 }));
      const actual = await lib.http({});

      assert.equal(actual.status, 200);
    });
    it('should be http 400 Bad request', async () => {
      const Mockaxios = async () => Promise.reject({ status: 400, response: 'Bad request' });
      Mockaxios.isAxiosError = () => true;
      lib.__set__('axios', Mockaxios);
      const actual = await lib.http({});

      assert.equal(actual, 'Bad request');
    });
    it('should be axios error', async () => {
      const Mockaxios = async () => Promise.reject({ status: 400 });
      Mockaxios.isAxiosError = () => true;
      lib.__set__('axios', Mockaxios);
      await lib.http({}).catch(() => {
      });
    });
    it('should be unknown exception', async () => {
      const Mockaxios = async () => Promise.reject({});
      Mockaxios.isAxiosError = () => false;
      lib.__set__('axios', Mockaxios);
      await lib.http({}).catch(() => {
      });
    });
  });

  describe('buildHTTPHeader', () => {
    it('Should be empty', async () => {
      const param = {};
      const actual = await lib.buildHTTPHeader(param);

      const expected = {};

      assert.deepEqual(actual, expected);
    });
    it('Has FIWARE-Service header', async () => {
      const param = { config: { service: 'openiot' } };
      const actual = await lib.buildHTTPHeader(param);

      const expected = { 'Fiware-Service': 'openiot' };

      assert.deepEqual(actual, expected);
    });
    it('Has FIWARE-ServicePath header', async () => {
      const param = { config: { servicepath: '/fiware' } };
      const actual = await lib.buildHTTPHeader(param);

      const expected = { 'Fiware-ServicePath': '/fiware' };

      assert.deepEqual(actual, expected);
    });
    it('Has Authorization header', async () => {
      const param = { getToken: async () => { return '3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4'; } };
      const actual = await lib.buildHTTPHeader(param);

      const expected = { 'Authorization': 'Bearer 3b7c02f9e8a0b8fb1ca0df27052b6dfc00f32df4' };

      assert.deepEqual(actual, expected);
    });
    it('Has application/json as Content-Type', async () => {
      const param = { contentType: 'json' };
      const actual = await lib.buildHTTPHeader(param);

      const expected = { 'Content-Type': 'application/json' };

      assert.deepEqual(actual, expected);
    });
    it('Has text/plain as Content-Type', async () => {
      const param = { contentType: 'text/plain' };
      const actual = await lib.buildHTTPHeader(param);

      const expected = { 'Content-Type': 'text/plain' };

      assert.deepEqual(actual, expected);
    });
  });
  describe('buildParams', () => {
    it('Empty param', () => {
      const param = {};
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), '');
    });
    it('type', () => {
      const param = { type: 'T1' };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'type=T1');
    });
    it('attrs', () => {
      const param = { attrs: 'A1,A2' };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'attrs=A1%2CA2');
    });
    it('metadata', () => {
      const param = { metadata: 'A1,A2' };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'metadata=A1%2CA2');
    });
    it('keyValues', () => {
      const param = { keyValues: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=keyValues');
    });
    it('upsert', () => {
      const param = { upsert: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=upsert');
    });
    it('skipForwarding', () => {
      const param = { skipForwarding: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=skipForwarding');
    });
    it('forcedUpdate', () => {
      const param = { forcedUpdate: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=forcedUpdate');
    });
    it('flowControl', () => {
      const param = { flowControl: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=flowControl');
    });
    it('append', () => {
      const param = { append: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=append');
    });
    it('overrideMetadata', () => {
      const param = { overrideMetadata: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.toString(), 'options=overrideMetadata');
    });
    it('Empty param', () => {
      const param = {};
      const actual = lib.buildParams(param);

      assert.equal(actual.get('options'), null);
    });
    it('limit, offset param', () => {
      const param = { limit: 100 };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('limit'), 100);
      assert.equal(actual.get('options'), null);
    });
    it('limit, offset param', () => {
      const param = { limit: 100, offset: 200 };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('limit'), 100);
      assert.equal(actual.get('offset'), 200);
      assert.equal(actual.get('options'), null);
    });
    it('keyValues is false', () => {
      const param = { limit: 10, offset: 30, keyValues: false };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('limit'), 10);
      assert.equal(actual.get('offset'), 30);
      assert.equal(actual.get('options'), null);
    });
    it('keyValues is true', () => {
      const param = { limit: 99, offset: '0', keyValues: true };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('limit'), 99);
      assert.equal(actual.get('offset'), 0);
      assert.equal(actual.get('options'), 'keyValues');
    });

    it('id, type param', () => {
      const param = { id: 'urn:ngsi-ld:Building:store001', type: 'Building', idPattern: '.*', typePattern: 'Build.*' };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('options'), null);
      assert.equal(actual.get('id'), 'urn:ngsi-ld:Building:store001');
      assert.equal(actual.get('type'), 'Building');
      assert.equal(actual.get('idPattern'), '.*');
      assert.equal(actual.get('typePattern'), 'Build.*');
    });
    it('query', () => {
      const param = { q: 'temperature==50', mq: 'accuracy>100' };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('q'), 'temperature==50');
      assert.equal(actual.get('mq'), 'accuracy>100');
    });
    it('geo query', () => {
      const param = { georel: 'near', geometry: 'point', coords: '-40.4,-3.5', maxDistance: 100, minDistance: 50 };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('georel'), 'near');
      assert.equal(actual.get('geometry'), 'point');
      assert.equal(actual.get('coords'), '-40.4,-3.5');
      assert.equal(actual.get('maxDistance'), '100');
      assert.equal(actual.get('minDistance'), '50');
    });
    it('attrs, metadata', () => {
      const param = { limit: 100, page: 2, attrs: 'temperature', metadata: 'accuracy' };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('attrs'), 'temperature');
      assert.equal(actual.get('metadata'), 'accuracy');
    });
    it('orderBy', () => {
      const param = { orderBy: 'temperature,!humidity' };
      const actual = lib.buildParams(param);

      assert.equal(actual.get('orderBy'), 'temperature,!humidity');
    });
  });
  describe('updateContext', () => {
    it('empty object', () => {
      const msg = {};
      const actual = lib.updateContext(msg, 'openiot', '/', 10);

      assert.deepEqual(actual, {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: 10,
        },
      });
    });
    it('empty context', () => {
      const msg = { context: {} };
      const actual = lib.updateContext(msg, 'openiot', '/', 10);

      assert.deepEqual(actual, {
        context: {
          fiwareService: 'openiot',
          fiwareServicePath: '/',
          fiwareTotalCount: 10,
        },
      });
    });
  });
  describe('getServiceAndServicePath', () => {
    it('empty object', () => {
      const msg = {};
      const actual = lib.getServiceAndServicePath(msg, 'openiot', '/');

      assert.deepEqual(actual, ['openiot', '/']);
    });
    it('empty context', () => {
      const msg = { context: {} };
      const actual = lib.getServiceAndServicePath(msg, 'openiot', '/');

      assert.deepEqual(actual, ['openiot', '/']);
    });
    it('empty context', () => {
      const msg = { context: { fiwareService: 'orion', fiwareServicePath: '/#' } };
      const actual = lib.getServiceAndServicePath(msg, 'openio', '/');

      assert.deepEqual(actual, ['orion', '/#']);
    });
    it('toLowerCase', () => {
      const msg = { context: { fiwareService: 'ORION', fiwareServicePath: '/#' } };
      const actual = lib.getServiceAndServicePath(msg, 'openio', '/');

      assert.deepEqual(actual, ['orion', '/#']);
    });
  });
  describe('convertDateTime', () => {
    it('Empty value', () => {
      const dt = Date('2023-01-01T12:34:56.000Z');
      const value = '';
      const unit = 'day';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['', null]);
    });
    it('years', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '-1';
      const unit = 'years';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2022-01-01T12:34:56.000Z', null]);
    });
    it('months', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '-2';
      const unit = 'months';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2022-11-01T12:34:56.000Z', null]);
    });
    it('days', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '3';
      const unit = 'days';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2022-12-29T12:34:56.000Z', null]);
    });
    it('hours', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '-4';
      const unit = 'hours';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2023-01-01T08:34:56.000Z', null]);
    });
    it('minutes', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '-5';
      const unit = 'minutes';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2023-01-01T12:29:56.000Z', null]);
    });
    it('seconds', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '-6';
      const unit = 'seconds';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2023-01-01T12:34:50.000Z', null]);
    });
    it('ISO8601', () => {
      const dt = new Date('2023-01-01T12:34:56.000Z');
      const value = '2024-01-01T12:34:56.000Z';
      const unit = 'ISO8601';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, ['2024-01-01T12:34:56.000Z', null]);
    });
    it('dateTime not Number', () => {
      const dt = Date('2023-01-01T12:34:56.000Z');
      const value = '-a';
      const unit = 'day';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, [null, 'dateTime not Number']);
    });
    it('unit error', () => {
      const dt = Date('2023-01-01T12:34:56.000Z');
      const value = '-1';
      const unit = 'day';

      const actual = lib.convertDateTime(dt, value, unit);

      assert.deepEqual(actual, [null, 'Unit error: day']);
    });
  });
  describe('jsonToNGSI', () => {
    it('null', () => {
      const actual = lib.jsonToNGSI(null);

      const expected = null;

      assert.equal(actual, expected);
    });
    it('Number', () => {
      const actual = lib.jsonToNGSI(123);

      const expected = null;

      assert.equal(actual, expected);
    });
    it('String', () => {
      const actual = lib.jsonToNGSI('abc');

      const expected = null;

      assert.equal(actual, expected);
    });
    it('Array', () => {
      const actual = lib.jsonToNGSI([]);

      const expected = null;

      assert.equal(actual, expected);
    });

    it('null value', () => {
      const actual = lib.jsonToNGSI({ none: null });

      const expected = {
        none: {
          type: 'None',
          value: null,
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('boolean', () => {
      const actual = lib.jsonToNGSI({ keyValues: true });

      const expected = {
        keyValues: {
          type: 'Boolean',
          value: true,
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('number', () => {
      const actual = lib.jsonToNGSI({ temperature: 28.4 });

      const expected = {
        temperature: {
          type: 'Number',
          value: 28.4,
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('text', () => {
      const actual = lib.jsonToNGSI({ name: 'fiware' });

      const expected = {
        name: {
          type: 'Text',
          value: 'fiware',
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('object', () => {
      const actual = lib.jsonToNGSI({ location: {} });

      const expected = {
        location: {
          type: 'StructuredValue',
          value: {},
        }
      };

      assert.deepEqual(actual, expected);
    });
    it('array', () => {
      const actual = lib.jsonToNGSI({ list: [] });

      const expected = {
        list: {
          type: 'StructuredValue',
          value: [],
        }
      };

      assert.deepEqual(actual, expected);
    });
  });
});
