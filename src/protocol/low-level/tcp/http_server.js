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
goog.provide('cwc.protocol.tcp.HTTPServer');

goog.require('cwc.utils.ByteTools');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.tcp.HTTPServer = function() {
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

  /** @private {number} */
  this.socket_ = null;

  /** @private {!Object} */
  this.files_ = {};

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {number=} port
 * @param {address=} address
 */
cwc.protocol.tcp.HTTPServer.prototype.listen = function(port, address) {
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
 * @param {!number} socketId
 * @param {!string} content
 * @param {string=} type
 */
cwc.protocol.tcp.HTTPServer.prototype.sendHTTPResponse = function(socketId,
  content, type='text/plain') {
  chrome.sockets.tcp.getInfo(socketId, function(socketInfo) {
    if (!socketInfo['connected']) {
      this.log_.error('Socket is no longer connected', socketInfo);
      this.disconnectClientSocket_(socketId);
      return;
    }
    let output = [];
    output.push('HTTP/1.1 200 OK');
    output.push('Server: Coding with Chrome - local');
    output.push('Content-length: ' + content.length);
    output.push('Content-type: ' + type);
    output.push('');
    output.push(content);
    output.push('\n');
    let response = cwc.utils.ByteTools.toUint8Array(output.join('\n'));
    let view = new Uint8Array(new ArrayBuffer(response.byteLength));
    view.set(response, 0);
    chrome.sockets.tcp.send(socketId, view.buffer, this.handleSend_.bind(this));
  }.bind(this));
};


/**
 * @param {!string} path
 * @param {!string} content
 * @param {string=} type
 */
cwc.protocol.tcp.HTTPServer.prototype.addFile = function(path, content,
    type='text/plain') {
  this.log_.info('Add file', path, 'with type', type);
  this.files_[path.startsWith('/') ? path : '/' + path] = {
    content: content,
    type: type,
  };
};


/**
 * @param {Function=} callback
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.createSocket_ = function(callback) {
  chrome.sockets.tcpServer.create({}, callback);
};


/**
 * @param {Object} socketInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.listen_ = function(socketInfo) {
  this.socket_ = socketInfo['socketId'];
  if (!this.socket_) {
    this.log_.error('Unable to get socket', socketInfo);
  }
  chrome.sockets.tcpServer.listen(this.socket_, this.address, this.port,
    this.backlog, this.handleListen_.bind(this));
};


/**
 * @param {Object} acceptInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleAccept_ = function(acceptInfo) {
  console.log('Accept handler', acceptInfo);
  if (acceptInfo['socketId'] !== this.socket_) {
    this.log_.error('Socket mismatch!');
    return;
  }
  chrome.sockets.tcp.setPaused(acceptInfo['clientSocketId'], false);
};


/**
 * @param {number} result
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleListen_ = function(result) {
  console.log('Listening on', this.address, ':', this.port, result);
  chrome.sockets.tcpServer.onAccept.addListener(this.handleAccept_.bind(this));
  chrome.sockets.tcp.onReceive.addListener(this.HandleRecieve_.bind(this));
  chrome.sockets.tcp.onReceiveError.addListener(
    this.HandleRecieveError_.bind(this));
};


/**
 * @param {Object} sendInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.handleSend_ = function(sendInfo) {
  console.log('Send handler', sendInfo);
};


/**
 * @param {Object} receiveInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.HandleRecieve_ = function(receiveInfo) {
  console.log('Receive Handler', receiveInfo);
  if (!receiveInfo['data']) {
    return;
  }
  let socketId = receiveInfo['socketId'];
  let data = cwc.utils.ByteTools.toString(receiveInfo['data']);
  if (!data) {
    return;
  }
  if (data.startsWith('GET ') && data.includes('HTTP')) {
    let requestPath = data.substring(4, data.indexOf(' ', 4));
    console.log('GET', requestPath);
    if (requestPath === '/') {
      this.sendHTTPResponse(socketId, 'CwC HTTPServer\n' + new Date());
    } else if (typeof this.files_[requestPath] !== 'undefined') {
      let file = this.files_[requestPath];
      this.sendHTTPResponse(socketId, file.content, file.type);
    } else {
      this.disconnectClientSocket_(socketId);
    }
  } else {
    this.disconnectClientSocket_(socketId);
  }
  console.log(data);
};


/**
 * @param {Object} receiveInfo
 * @private
 */
cwc.protocol.tcp.HTTPServer.prototype.HandleRecieveError_ = function(
    receiveInfo) {
  console.log('Receive Error Handler', receiveInfo);
};


/**
 * @param {!number} socketId
 */
cwc.protocol.tcp.HTTPServer.prototype.disconnectClientSocket_ = function(
    socketId) {
  chrome.sockets.tcp.disconnect(socketId, function() {
    chrome.sockets.tcp.close(socketId);
  });
};
