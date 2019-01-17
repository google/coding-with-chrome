/**
 * @fileoverview Handles the communication with the AIY kit.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.protocol.aiy.Api');

goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.aiy.Api = function() {
  /** @type {string} */
  this.name = 'AIY';

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @private {WebSocket} */
  this.socket_ = null;

  /** @private {!boolean} */
  this.connected_ = false;

  /** @private {!boolean} */
  this.quiet_ = false;

  /** @private {!string} */
  this.url_ = '';
};


/**
 * The socket was closed normally (no error).
 * @const
 */
cwc.protocol.aiy.NORMAL_CLOSURE = 1000;


/**
 * Connects to the AIY device.
 * @param {!string} url
 * @return {!Promise}
 */
cwc.protocol.aiy.Api.prototype.connect = function(url) {
  if (this.connected_) {
    console.warn('Already connected to AIY, disconnect first!');
    return Promise.reject();
  }
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => {
      this.connected_ = true;
      this.url_ = url;
      this.socket_ = socket;
      this.eventHandler.dispatchEvent(cwc.protocol.aiy.Events.connected());
      resolve();
    }, false);
    socket.addEventListener('close', (event) => {
      this.connected_ = false;
      this.eventHandler.dispatchEvent(
        cwc.protocol.aiy.Events.disconnected(event.code));
      if (event.code !== cwc.protocol.aiy.NORMAL_CLOSURE) {
        reject(new Error(`WebSocket closed with code ${event.code}`));
      }
    }, false);
    socket.addEventListener('message', (event) => {
      this.handleMessage_(event.data);
    }, false);
  });
};


/**
 * Reconnects to the AIY device.
 * @return {!Promise}
 */
cwc.protocol.aiy.Api.prototype.reconnect = function() {
  if (!this.url_) {
    console.warn('Cannot reconnect; must connect first!');
    return Promise.reject();
  }
  return this.connect(this.url_);
};


/**
 * Disconnects the AIY.
 */
cwc.protocol.aiy.Api.prototype.disconnect = function() {
  if (!this.connected_) {
    console.warn('AIY is not connected, no need to disconnect!');
    return;
  }
  this.connected_ = false;
  this.socket_.close();
};


/**
 * @return {!boolean}
 */
cwc.protocol.aiy.Api.prototype.isConnected = function() {
  return this.connected_;
};


/**
 * @param {!string} data
 * @private
 */
cwc.protocol.aiy.Api.prototype.send_ = function(data) {
  if (!this.connected_) {
    console.warn('AIY is not connected, unable to send data!');
    return;
  }
  this.socket_.send(data);
};


/**
 * @param {!string} code
 * @param {?Array<string>=} args
 * @export
 */
cwc.protocol.aiy.Api.prototype.sendRun = function(code, args = []) {
  this.send_(JSON.stringify({
    'type': 'run',
    'files': {
      'main.py': code,
    },
    'args': ['/usr/bin/env', 'python3', 'main.py', ...args],
    'env': {
      'PYTHONUNBUFFERED': '1',
    },
  }));
};


/**
 * @param {!number} timeout
 * @return {!Promise}
 * @export
 */
cwc.protocol.aiy.Api.prototype.terminateJoyDemo = function(timeout = 2000) {
  return new Promise((resolve) => {
    this.quiet_ = true;
    this.send_(JSON.stringify({
      'type': 'run',
      'args': ['sudo', 'systemctl', 'stop', 'joy_detection_demo.service'],
    }));
    setTimeout(() => {
      this.quiet_ = false;
      this.disconnect();
      resolve(this.reconnect());
    }, timeout);
  });
};


/**
 * @param {!number} signum
 * @export
 */
cwc.protocol.aiy.Api.prototype.sendSignal = function(signum) {
  this.send_(JSON.stringify({
    'type': 'signal',
    'signum': signum,
  }));
};


/**
 * @return {goog.events.EventTarget}
 * @export
 */
cwc.protocol.aiy.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * Parses and validates JSON message.
 * @param {string} messageData
 * @return {Object}
 * @private
 */
cwc.protocol.aiy.Api.prototype.parseMessage_ = function(messageData) {
  const message = JSON.parse(messageData);
  if (typeof(message) !== 'object') {
    throw new Error(`Data type is ${typeof(message)}, not object.`);
  }
  const type = message.type;
  if (!type) {
    throw new Error(`Received message had no type field.`);
  }
  return message;
};


/**
 * Handles received message from WebSocket.
 * @param {string} messageData
 * @private
 */
cwc.protocol.aiy.Api.prototype.handleMessage_ = function(messageData) {
  if (!messageData || this.quiet_) {
    return;
  }

  try {
    const message = this.parseMessage_(messageData);
    switch (message.type) {
      case 'stdout':
        this.eventHandler.dispatchEvent(
          cwc.protocol.aiy.Events.receivedDataStdout(atob(message.data)));
        break;
      case 'stderr':
        this.eventHandler.dispatchEvent(
          cwc.protocol.aiy.Events.receivedDataStderr(atob(message.data)));
        break;
      case 'exit':
        this.eventHandler.dispatchEvent(
          cwc.protocol.aiy.Events.exit(message.code));
        break;
      default:
        throw new Error(`Unknown message type: ${message.type}.`);
    }
  } catch (error) {
    console.warn(`Received invalid message: ${error}`);
  }
};
