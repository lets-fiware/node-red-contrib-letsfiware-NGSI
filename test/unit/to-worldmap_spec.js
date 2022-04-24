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

/* eslint-env node, mocha */

'use strict';

require('babel-register')({
  plugins: ['babel-plugin-rewire']
});

const assert = require('chai').assert;

const toWorldmapNode = require('../../src/nodes/NGSI/to-worldmap/to-worldmap.js');
const MockRed = require('./helpers/mockred.js');

const createGeoSpatialInfo = toWorldmapNode.__get__('createGeoSpatialInfo');

describe('to-worldmap.js', () => {
  describe('createGeoSpatialInfo', () => {
    it('transform geo:point into lat-lon', () => {
      const location = { type: 'geo:point', value: '1, 2' };
      const actual = createGeoSpatialInfo(location);

      const expected = { lat: 1, lon: 2 };
      assert.deepEqual(actual, expected);
    });
    it('transform geo:line into line', () => {
      const location = { type: 'geo:line', value: ['1, 2', '3, 4', '5, 6'] };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        line: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform geo:box into area', () => {
      const location = { type: 'geo:box', value: ['1, 2', '3, 4'] };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        area: [
          [1, 2],
          [3, 4],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform geo:polygon into area', () => {
      const location = { type: 'geo:polygon', value: ['1, 2', '3, 4', '5, 6', '7, 8', '1, 2'] };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        area: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
          [1, 2],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform Point into lat-lon', () => {
      const location = { type: 'Point', coordinates: [1, 2] };
      const actual = createGeoSpatialInfo(location);

      const expected = { lat: 2, lon: 1 };
      assert.deepEqual(actual, expected);
    });
    it('transform LineString into line', () => {
      const location = {
        type: 'LineString',
        coordinates: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        line: [
          [2, 1],
          [4, 3],
          [6, 5],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform Polygon into area', () => {
      const location = {
        type: 'Polygon',
        coordinates: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
            [1, 2],
          ],
        ],
      };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        area: [
          [
            [2, 1],
            [4, 3],
            [6, 5],
            [8, 7],
            [2, 1],
          ],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform MultiLineString into line', () => {
      const location = {
        type: 'MultiLineString',
        coordinates: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
          [
            [11, 12],
            [13, 14],
            [15, 16],
            [17, 18],
          ],
        ],
      };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        line: [
          [
            [2, 1],
            [4, 3],
            [6, 5],
          ],
          [
            [12, 11],
            [14, 13],
            [16, 15],
            [18, 17],
          ],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform MultiPolygon into area', () => {
      const location = {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [1, 2],
              [3, 4],
              [5, 6],
              [7, 8],
            ],
          ],
          [
            [
              [11, 12],
              [13, 14],
              [15, 16],
              [17, 18],
              [19, 20],
            ],
          ],
        ],
      };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        area: [
          [
            [
              [2, 1],
              [4, 3],
              [6, 5],
              [8, 7],
            ],
          ],
          [
            [
              [12, 11],
              [14, 13],
              [16, 15],
              [18, 17],
              [20, 19],
            ],
          ],
        ],
      };
      assert.deepEqual(actual, expected);
    });
    it('transform MultiPolygon with hole into area', () => {
      const location = {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [1, 2],
              [3, 4],
              [5, 6],
              [7, 8],
            ],
          ],
          [
            [
              [9, 10],
              [11, 12],
              [13, 14],
              [15, 16],
              [17, 18],
              [19, 20],
            ],
            [
              [21, 22],
              [23, 24],
              [25, 26],
              [27, 28],
            ],
          ],
        ],
      };
      const actual = createGeoSpatialInfo(location);

      const expected = {
        area: [
          [
            [
              [2, 1],
              [4, 3],
              [6, 5],
              [8, 7],
            ],
          ],
          [
            [
              [10, 9],
              [12, 11],
              [14, 13],
              [16, 15],
              [18, 17],
              [20, 19],
            ],
            [
              [22, 21],
              [24, 23],
              [26, 25],
              [28, 27],
            ],
          ],
        ],
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('NGSI to worldmap', () => {
    it('Transform an entity', async () => {
      const red = new MockRed();
      toWorldmapNode(red);
      red.createNode({
        attrname: 'name',
        attrworldmap: '__worldmap__',
      });

      red.input({payload: {id: 'E1', type: 'T', location:{type: 'geo:json', value: {type: 'Point', coordinates: [ 2, 1 ]}}}});

      assert.deepEqual(red.getOutput(), {payload:[{name: 'E1', lat: 1, lon: 2}]});
    });
    it('Transform an entity (text)', async () => {
      const red = new MockRed();
      toWorldmapNode(red);
      red.createNode({
        attrname: 'name',
        attrworldmap: '__worldmap__',
      });

      red.input({payload: JSON.stringify({id: 'E1', type: 'T', location: {type: 'geo:json', value: {type: 'Point', coordinates: [ 2, 1 ]}}})});

      assert.deepEqual(red.getOutput(), {payload:[{name: 'E1', lat: 1, lon: 2}]});
    });
    it('Transform an entity (keyValues)', async () => {
      const red = new MockRed();
      toWorldmapNode(red);
      red.createNode({
        attrname: 'name',
        attrworldmap: '__worldmap__',
      });

      red.input({payload: {id: 'E1', type: 'T', name: 'PoI', location: {type: 'Point', coordinates: [ 2, 1 ]}}});

      assert.deepEqual(red.getOutput(), {payload:[{name: 'PoI', lat: 1, lon: 2}]});
    });
    it('Transform an entities', async () => {
      const red = new MockRed();
      toWorldmapNode(red);
      red.createNode({
        attrname: 'name',
        attrworldmap: '__worldmap__',
      });

      red.input({
        payload: [
          {id: 'E1', type: 'T', name: {type: 'Text', value: 'E1'}, location: {type: 'geo:json', value: {type: 'Point', coordinates: [ 2, 1 ]}}},
          {id: 'E2', type: 'T', location: {type: 'geo:json', value: {type: 'Point', coordinates: [ 4, 3 ]}}},
        ]
      });

      assert.deepEqual(red.getOutput(), {payload:[{name: 'E1', lat: 1, lon: 2},{name: 'E2', lat: 3, lon: 4}]});
    });
    it('Transform an entity with worldmap attr', async () => {
      const red = new MockRed();
      toWorldmapNode(red);
      red.createNode({
        attrname: 'name',
        attrworldmap: '__worldmap__',
      });

      red.input({payload: {id: 'E1', type: 'T', __worldmap__: {type: 'StructuredValues', value: {color: 'red'}}, location: {type: 'geo:json', value: {type: 'Point', coordinates: [ 2, 1 ]}}}});

      assert.deepEqual(red.getOutput(), {payload:[{name: 'E1', lat: 1, lon: 2, color: 'red'}]});
    });
    it('Transform an entity wth worldmap attr (keyValues)', async () => {
      const red = new MockRed();
      toWorldmapNode(red);
      red.createNode({
        attrname: 'name',
        attrworldmap: '__worldmap__',
      });

      red.input({payload: {id: 'E1', type: 'T', name: 'PoI', __worldmap__: {'color': 'red'}, location: {type: 'Point', coordinates: [ 2, 1 ]}}});

      assert.deepEqual(red.getOutput(), {payload:[{name: 'PoI', lat: 1, lon: 2, color: 'red'}]});
    });
  });
});
