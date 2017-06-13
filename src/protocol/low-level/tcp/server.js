 /**
 * @fileoverview Simple TCP Server.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.protocol.tcp.Server');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.tcp.Server = function() {
  /** @type {string} */
  this.name = 'TCP';

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!string} */
  this.address = '127.0.0.1';

  /** @type {!number} */
  this.port = 8090;

  /** @type {!number} */
  this.backlog = 10;

  /** @private {} */
  this.socket_ = null;

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {number=} port
 * @param {address=} address
 */
cwc.protocol.tcp.Server.prototype.listen = function(port, address) {
  if (port) {
    this.port = port;
  }
  if (address) {
    this.address = address;
  }
  if (this.port && this.address) {
    this.createSocket_(this.listen_.bind(this));
  }
};


/**
 * @param {Function=} callback
 * @private
 */
cwc.protocol.tcp.Server.prototype.createSocket_ = function(callback) {
  chrome.sockets.tcpServer.create({}, callback);
};


/**
 * @param {Object} socketInfo
 * @private
 */
cwc.protocol.tcp.Server.prototype.listen_ = function(socketInfo) {
  this.socket_ = socketInfo['socketId'];
  if (!this.socket_) {
    this.log_.error('Unable to get socket', socketInfo);
  }
  chrome.sockets.tcpServer.listen(this.socket_, this.address, this.port,
    this.backlog, this.handleListen_.bind(this));
};


/**
 * @param {number} result
 * @private
 */
cwc.protocol.tcp.Server.prototype.handleListen_ = function(result) {
  console.log('Listening on', this.address, ':', this.port, result);
  chrome.sockets.tcpServer.onAccept.addListener(
    this.acceptHandler_.bind(this));
  chrome.sockets.tcp.onReceive.addListener(
    this.recieveHandler_.bind(this));
};


/**
 * @param {Object} e
 * @private
 */
cwc.protocol.tcp.Server.prototype.acceptHandler_ = function(e) {
  console.log('Accept handler', e);
};


/**
 * @param {Object} e
 * @private
 */
cwc.protocol.tcp.Server.prototype.recieveHandler_ = function(e) {
  console.log('Recieve Handler', e);
};
