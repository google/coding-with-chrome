/**
 * @fileoverview Connection for the Sphero BB-8 modification.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.mode.sphero.bb8.Connection');

goog.require('cwc.lib.protocol.bluetoothWeb.profile.Device');
goog.require('cwc.lib.protocol.sphero.sprkPlus.Api');
goog.require('cwc.lib.protocol.sphero.sprkPlus.Events');
goog.require('cwc.utils.Events');

goog.require('goog.Timer');


goog.scope(function() {
const Api = goog.module.get('cwc.lib.protocol.sphero.sprkPlus.Api');
const BluetoothProfile =
  goog.module.get('cwc.lib.protocol.bluetoothWeb.profile.Device');
const Events = goog.module.get('cwc.lib.protocol.sphero.sprkPlus.Events');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.bb8.Connection = function(helper) {
  /** @type {string} */
  this.name = 'Sphero BB-8 Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.lib.protocol.sphero.sprkPlus.Api} */
  this.api_ = new Api();

  /** @private {!goog.events.EventTarget} */
  this.apiEvents_ = this.api_.getEventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.lib.protocol.bluetoothWeb.profile.Device.Device} */
  this.device_ = BluetoothProfile.SPHERO_BB8;
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.sphero.bb8.Connection.prototype.init = function() {
  if (this.apiEvents_) {
    this.events_.listen(this.apiEvents_, Events.Type.CONNECT,
      this.handleConnecting_.bind(this));
  }

  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }
  let connectScreenInstance = this.helper.getInstance('connectScreen');
  connectScreenInstance.requestBluetoothDevice(this.device_).then(
    (bluetoothDevice) => {
      bluetoothDevice.connect().then((device) => {
        this.api_.connect(device);
      });
  }).catch(() => {
    this.connectMonitor.start();
  });
};


/**
 * Connects the Sphero BB-8.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.sphero.bb8.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    let bluetoothInstance = this.helper.getInstance('bluetoothWeb', true);
    let devices = bluetoothInstance.getDevicesByName(this.device_.name);
    if (devices) {
      devices[0].connect().then((device) => {
        this.api_.connect(device);
      });
    }
  }
  this.api_.monitor(true);
};


/**
 * Stops the current executions.
 */
cwc.mode.sphero.bb8.Connection.prototype.stop = function() {
  this.api_.stop();
};


/**
 * Resets the connection.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.sphero.bb8.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api_.reset();
  }
};


/**
 * @return {boolean}
 * @export
 */
cwc.mode.sphero.bb8.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.sphero.bb8.Connection.prototype.getEventTarget = function() {
  return this.apiEvents_;
};


/**
 * @return {!cwc.protocol.sphero.v1.Api}
 * @export
 */
cwc.mode.sphero.bb8.Connection.prototype.getApi = function() {
  return this.api_;
};


/**
 * @param {Event} e
 * @private
 */
cwc.mode.sphero.bb8.Connection.prototype.handleConnecting_ = function(e) {
  let message = e.data;
  let step = e.source;
  let title = 'Connecting ' + this.device_.name;
  let connectScreenInstance = this.helper.getInstance('connectScreen');
  connectScreenInstance.showConnectingStep(title, message, step);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.bb8.Connection.prototype.cleanUp = function() {
  console.log('Clean up Sphero connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.stop();
  this.events_.clear();
};
});
