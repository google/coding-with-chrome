/**
 * @fileoverview Connection for the EV3 modification.
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
goog.provide('cwc.mode.lego.ev3.Connection');

goog.require('cwc.protocol.lego.ev3.Api');
goog.require('cwc.utils.Events');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.lego.ev3.Connection = function(helper) {
  /** @type {string} */
  this.name = 'EV3 Connection';

  /** @type {string} */
  this.autoConnectName = 'EV3';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.protocol.lego.ev3.Api} */
  this.api_ = new cwc.protocol.lego.ev3.Api();

  /** @private {!goog.events.EventTarget} */
  this.apiEvents_ = this.api_.getEventHandler();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.lego.ev3.Connection.prototype.init = function() {
  this.handleConnecting_({
    'data': 'Connecting EV3',
    'source': 1,
  });
  if (this.apiEvents_) {
    this.events_.listen(this.apiEvents_,
      cwc.protocol.sphero.v1.Events.Type.CONNECT,
      this.handleConnecting_.bind(this));
  }

  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
        this.connect.bind(this));
  }
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.lego.ev3.Connection.prototype.connect = function() {
  if (!this.isConnected()) {
    let bluetoothInstance = this.helper.getInstance('bluetooth', true);
    bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.api_.connect.bind(this.api_));
  }
  this.api_.monitor(true);
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.lego.ev3.Connection.prototype.disconnect = function() {
  console.log('Disconnect the EV3 unit...');
  this.api_.disconnect();
};


/**
 * @return {!boolean}
 */
cwc.mode.lego.ev3.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.lego.ev3.Connection.prototype.getEventHandler = function() {
  return this.api_.getEventHandler();
};


/**
 * @return {Object}
 */
cwc.mode.lego.ev3.Connection.prototype.getDeviceData = function() {
  return this.api_.getDeviceData();
};


cwc.mode.lego.ev3.Connection.prototype.getDevices = function() {
  this.api_.getDevices();
};


/**
 * @return {!cwc.protocol.lego.ev3.Api}
 * @export
 */
cwc.mode.lego.ev3.Connection.prototype.getApi = function() {
  return this.api_;
};


/**
 * Stops the EV3 unit.
 */
cwc.mode.lego.ev3.Connection.prototype.stop = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.api_.stop();
};


/**
 * @param {Event} e
 * @private
 */
cwc.mode.lego.ev3.Connection.prototype.handleConnecting_ = function(e) {
  let message = e.data;
  let step = e.source;
  let title = 'Connecting EV3';
  let connectScreenInstance = this.helper.getInstance('connectScreen');
  connectScreenInstance.showConnectingStep(title, message, step);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.lego.ev3.Connection.prototype.cleanUp = function() {
  console.log('Clean up EV3 connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api_.monitor(false);
  this.stop();
  this.events_.clear();
};
