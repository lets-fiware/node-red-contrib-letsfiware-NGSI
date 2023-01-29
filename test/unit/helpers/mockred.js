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

class MockRedNode {
  constructor() {
    this.credentials = {
      username: '',
      password: '',
      clientid: '',
      clientsecret: '',
    };
    this.out = [];
    this.error = (msg) => { this.msg = msg; };
  }
  on(mode, func) { this.mode = mode; this.func = func; }
  send(msg) { this.out.push(Object.assign({}, msg)); }
  getFunc() { return this.func; }
  getMessage() { return this.msg; }
  getOutput() { return (this.out.length === 1) ? this.out[0] : this.out; }
  setCredentials(username, password, clientid, clientsecret) {
    this.username = username;
    this.password = password;
    this.clientid = clientid;
    this.clientsecret = clientsecret;
  }
}

module.exports = class MockRed {
  constructor() {
    this.nodes = {
      registerType: (name, func) => { this.nodeName = name; this.nodeFunc = func; },
      createNode: (node, config) => { this.nodeThis = node; this.nodeConfig = config; },
      getNode: (a) => a,
    };
    this.node = new MockRedNode();
  }
  getFunc() {
    return this.nodeFunc;
  }
  createNode(config) {
    this.nodeFunc.call(this.node, config);
  }
  input(config) {
    const func = this.node.getFunc();
    func.call(this.node, config);
  }
  async inputWithAwait(config) {
    const func = this.node.getFunc();
    await func.call(this.node, config);
  }
  getMessage() { return this.node.getMessage(); }
  getOutput() { return this.node.getOutput(); }
  setCredentials(username, password, clientid, clientsecret) {
    this.node.setCredentials(username, password, clientid, clientsecret);
  }
};
