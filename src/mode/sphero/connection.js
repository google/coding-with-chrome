/**
 * @fileoverview Connection for the Sphero modification.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.sphero.Connection');

goog.require('cwc.utils.Listener');
goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.Connection = function(helper) {
  /** @type {string} */
  this.name = 'Sphero Connection';

  /** @type {string} */
  this.autoConnectName = 'Sphero';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.sphero.Api} */
  this.api = helper.getInstance('sphero', true);

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.utils.Listener} */
  this.listener_ = new cwc.utils.Listener(this.name);
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.sphero.Connection.prototype.init = function() {
  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.listener_.add(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the Sphero ball.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.sphero.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    let bluetoothInstance = this.helper.getInstance('bluetooth', true);
    bluetoothInstance.autoConnectDevice(this.autoConnectName, function(device) {
      if (device) {
        this.api.connect(device);
      }
    }.bind(this));
  }
  this.api.monitor(true);
};


/**
 * Stops the current executions.
 */
cwc.mode.sphero.Connection.prototype.stop = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.api.stop();
};


/**
 * Resets the connection.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.sphero.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api.reset();
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.mode.sphero.Connection.prototype.isConnected = function() {
  return this.api.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.sphero.Connection.prototype.getEventHandler = function() {
  return this.api.getEventHandler();
};


/**
 * @return {!cwc.protocol.sphero.Api}
 * @export
 */
cwc.mode.sphero.Connection.prototype.getApi = function() {
  return this.api;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.Connection.prototype.cleanUp = function() {
  console.log('Clean up Sphero connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.stop();
  this.listener_.clear();
};
