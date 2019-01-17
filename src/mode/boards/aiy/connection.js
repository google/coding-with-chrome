/**
 * @fileoverview Connection for the AIY modification.
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
goog.provide('cwc.mode.aiy.Connection');

goog.require('cwc.utils.Events');
goog.require('cwc.protocol.aiy.Api');
goog.require('cwc.protocol.mDNS.Api');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Database');


/**
 * The AIY socket port.
 * @const
 */
cwc.mode.aiy.Connection.PORT = '8765';


/**
 * The default AIY hostname.
 * @const
 */
cwc.mode.aiy.Connection.DEFAULT_HOSTNAME = 'raspberrypi.local';


/**
 * IP address used by AIY when connected via USB.
 * @const
 */
cwc.mode.aiy.Connection.USB_HOST = '192.168.11.2';


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.aiy.Connection = function(helper) {
  /** @type {string} */
  this.name = 'AIY Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.protocol.aiy.Api} */
  this.api_ = new cwc.protocol.aiy.Api();

  /** @private {cwc.utils.Dialog} */
  this.dialog_ = new cwc.utils.Dialog();

  /** @private {!cwc.utils.Database} */
  this.database_ = new cwc.utils.Database(this.name)
    .setObjectStoreName('__aiy__');

  /** @private {!cwc.protocol.mDNS.Api} */
  this.mdns_ = helper.getInstance('mdns');
};


/**
 * Performs init.
 * @export
 */
cwc.mode.aiy.Connection.prototype.init = function() {
  this.database_.open();
};


/**
 * Checks if AIY device is connected.
 * @return {boolean}
 * @export
 */
cwc.mode.aiy.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * Connects to the AIY if not connected and sends a message.
 * @param {!string} data
 * @return {!Promise}
 * @export
 */
cwc.mode.aiy.Connection.prototype.connectAndSendRun = function(data) {
  let blocker = Promise.resolve();
  if (!this.api_.isConnected()) {
    blocker = this.connectInteractive();
  }
  return blocker.then(() => this.api_.sendRun(data));
};


/**
 * Prompts the user for the hostname and then tries to connect to it.
 * @param {string=} host
 * @return {Promise}
 * @export
 */
cwc.mode.aiy.Connection.prototype.connectInteractive = async function(host) {
  host = host || await this.database_.get('host');
  host = this.findAIY_(host) || host;
  host = host || cwc.mode.aiy.Connection.DEFAULT_HOSTNAME;

  try {
    host = await this.dialog_.showPrompt(
      'Socket URL',
      'Please type in the URL of the Raspberry Pi',
      host
    );
    try {
      await this.connect(host);
    } catch (error) {
      await this.dialog_.showAlert(
        'Error connecting to AIY',
        `Error code: ${error}`
      );
      return this.connectInteractive(host);
    }
  } catch (error) {
    throw new Error('Cancelled');
  }
};


/**
 * Tries to connect to the given host.
 * @param {string} host
 * @export
 */
cwc.mode.aiy.Connection.prototype.connect = async function(host) {
  await this.api_.connect(this.buildSocketUrl(host));
  await this.api_.terminateJoyDemo();
  this.database_.put('host', host);
};


/**
 * Tries to connect to the AIY via USB.
 * @return {Promise}
 * @export
 */
cwc.mode.aiy.Connection.prototype.connectUSB = function() {
  return this.connect(cwc.mode.aiy.Connection.USB_HOST);
};


/**
 * Attempts to reconnect to the previous successful url.
 * @export
 */
cwc.mode.aiy.Connection.prototype.sendTerminate = function() {
  if (this.api_.isConnected()) {
    // 2 is SIGINT
    this.api_.sendSignal(2);
  }
};


/**
 * Attempts to reconnect to the previous successful url.
 * @export
 */
cwc.mode.aiy.Connection.prototype.disconnect = function() {
  if (this.api_.isConnected()) {
    this.api_.disconnect();
  }
};


/**
 * Attempts to reconnect to the previous successful url.
 * @return {Promise}
 * @export
 */
cwc.mode.aiy.Connection.prototype.reconnect = async function() {
  this.disconnect();
  return this.api_.reconnect().catch((err) => {
    console.warn(`Failed to reconnect: ${err}`);
  });
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.aiy.Connection.prototype.getEventHandler = function() {
  return this.api_.getEventHandler();
};


/**
 * Attempts to use mDNS to find the AIY device.
 * @param {string} hint Address to prefer if multiple found
 * @return {String}
 * @private
 */
cwc.mode.aiy.Connection.prototype.findAIY_ = function(hint) {
  const services = this.mdns_.getServiceList('_aiy_cwc._tcp.local');
  const service = services.find((el) => {
    return el.serviceHostPort === hint || el.ipAddress == hint;
  }) || services[0];
  if (service) {
    return service.serviceHostPort;
  }
  return null;
};


/**
 * Builds WebSocket URL from hostname.
 * @param {!string} host
 * @return {String}
 * @private
 */
cwc.mode.aiy.Connection.prototype.buildSocketUrl = function(host) {
  if (host.indexOf(':') > 0) {
    return `ws://${host}/spawn`;
  }
  return `ws://${host}:${cwc.mode.aiy.Connection.PORT}/spawn`;
};
