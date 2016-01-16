/**
 * @fileoverview Layout for the EV3 modification.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.mode.ev3.Connection');

goog.require('cwc.protocol.ev3.Api');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.ev3.Connection = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.ui.ConnectionManager} */
  this.connectionManager = helper.getInstance('connectionManager');

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = helper.getInstance('ev3', true);

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @type {!Array} */
  this.listener = [];
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.init = function() {
  // Unload event
  var layoutInstance = this.helper.getInstance('layout', true);
  var eventHandler = layoutInstance.getEventHandler();
  this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
      this.cleanUp, false, this);

  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.addEventListener_(this.connectMonitor, goog.Timer.TICK,
        this.connect.bind(this));
  }
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.connect = function() {
  if (!this.isConnected()) {
    console.log('Connect to the EV3 unit …');
    this.api.autoConnect();
  }
  this.api.monitor(true);
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.disconnect = function() {
  console.log('Disconnect the EV3 unit …');
  this.api.disconnect();
};


/**
 * @return {!boolean}
 */
cwc.mode.ev3.Connection.prototype.isConnected = function() {
  return this.api.isConnected();
};


/**
 * @return {}
 */
cwc.mode.ev3.Connection.prototype.getEventHandler = function() {
  return this.api.getEventHandler();
};


/**
 * @return {}
 */
cwc.mode.ev3.Connection.prototype.getDeviceData = function() {
  return this.api.getDeviceData();
};


/**
 * @return {}
 */
cwc.mode.ev3.Connection.prototype.getDevices = function() {
  return this.api.getDevices();
};


/**
 * @return {!cwc.protocol.ev3.Api}
 * @export
 */
cwc.mode.ev3.Connection.prototype.getApi = function() {
  return this.api;
};


/**
 * Stops the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.stop = function() {
  console.log('Stop the EV3 unit …');
  this.api.stop();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Connection.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api.monitor(false);
  this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.mode.ev3.Connection.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
