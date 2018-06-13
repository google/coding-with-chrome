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

  /** @type {WebSocket} */
  this.socket = null;

  /** @type {!boolean} */
  this.connected = false;
};


/**
 * The socket was closed normally (no error).
 * @const
 */
cwc.protocol.aiy.NORMAL_CLOSURE = 1000;


/**
 * Connects the AIY device.
 * @param {!string} url
 * @return {Promise}
 * @export
 */
cwc.protocol.aiy.Api.prototype.connect = function(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => {
      this.socket = socket;
      this.connected = true;
      resolve();
    }, false);
    socket.addEventListener('close', (event) => {
      this.connected = false;
      if (event.code !== cwc.protocol.aiy.NORMAL_CLOSURE) {
        reject(new Error(`WebSocket closed with code ${event.code}`));
      } else {
        this.handleClose_();
      }
    }, false);
    socket.addEventListener('message', (event) => {
      this.handleMessage_(event.data);
    }, false);
  });
};


/**
 * Disconnects the AIY.
 */
cwc.protocol.aiy.Api.prototype.disconnect = function() {
  if (!this.connected) {
    console.warn('AIY is not connected, no need to disconnect!');
    return;
  }
  this.socket.close();
  this.connected = false;
};


/**
 * @return {!boolean}
 */
cwc.protocol.aiy.Api.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @param {!string} data
 * @export
 */
cwc.protocol.aiy.Api.prototype.send = function(data) {
  if (!this.connected) {
    console.warn('AIY is not connected, unable to send data!');
    return;
  }
  this.socket.send(data);
};


/**
 * @return {goog.events.EventTarget}
 * @export
 */
cwc.protocol.aiy.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * Handles received message from WebSocket.
 * @param {string} data
 * @private
 */
cwc.protocol.aiy.Api.prototype.handleMessage_ = function(data) {
  if (!data) {
    return;
  }

  this.eventHandler.dispatchEvent(
    cwc.protocol.aiy.Events.receivedData(data));
};
