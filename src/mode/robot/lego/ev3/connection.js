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

goog.require('cwc.lib.protocol.bluetoothChrome.profile.Device');
goog.require('cwc.protocol.lego.ev3.Api');
goog.require('cwc.ui.PreviewState');
goog.require('cwc.utils.Events');

goog.require('goog.Timer');


goog.scope(function() {
const BluetoothProfile =
  goog.module.get('cwc.lib.protocol.bluetoothChrome.profile.Device');
/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.lego.ev3.Connection = function(helper) {
  /** @type {string} */
  this.name = 'EV3 Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.protocol.lego.ev3.Api} */
  this.api_ = new cwc.protocol.lego.ev3.Api();

  /** @private {!goog.events.EventTarget} */
  this.apiEvents_ = this.api_.getEventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.lib.protocol.bluetoothChrome.profile.Device} */
  this.device_ = BluetoothProfile.LEGO_EV3;
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.lego.ev3.Connection.prototype.init = function() {
  if (this.apiEvents_) {
    this.events_.listen(this.apiEvents_,
      cwc.protocol.lego.ev3.Events.Type.CONNECT,
      this.handleConnecting_.bind(this));

    // Monitor device data
    this.events_.listen(this.apiEvents_,
      cwc.protocol.lego.ev3.Events.Type.CHANGED_DEVICES,
      this.handleUpdateDevices_.bind(this));
  }

  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.events_.listen(layoutInstance.getEventTarget(),
        goog.events.EventType.UNLOAD, this.cleanUp, false, this);
  }

  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    this.events_.listen(previewInstance.getEventTarget(),
      cwc.ui.PreviewEvents.Type.STATUS_CHANGE, this.handlePreviewStatus_,
      false, this);
  }

  let menuBarInstance = this.helper.getInstance('menuBar');
  if (menuBarInstance) {
    menuBarInstance.setBluetoothWebHandler(this.requestDevice.bind(this));
  }

  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (bluetoothInstance) {
    if (bluetoothInstance.getDeviceByName(this.device_.namePrefix)) {
      this.handleConnecting_({
        'data': 'Searching for ' + this.device_.name,
        'source': 1,
      });
    } else {
      this.handleConnecting_({
        'data': 'Unable to find any valid ' + this.device_.name + ' device!',
        'source': -1,
      });
    }
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
  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (!bluetoothInstance) {
    return;
  }
  if (!this.isConnected()) {
    bluetoothInstance.autoConnectDevice(this.device_.namePrefix,
      this.api_.connect.bind(this.api_));
  }
  this.api_.monitor(true);
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.lego.ev3.Connection.prototype.disconnect = function() {
  this.api_.disconnect();
};


/**
 * @return {boolean}
 */
cwc.mode.lego.ev3.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.lego.ev3.Connection.prototype.getEventTarget = function() {
  return this.api_.getEventTarget();
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
 * @param {Object} data
 */
cwc.mode.lego.ev3.Connection.prototype.setSensorMode = function(data) {
  this.api_.setSensorMode(data);
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
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.stop();
  }
  this.api_.exec('stop');
};


/**
 * Resets the connection.
 * @export
 */
cwc.mode.lego.ev3.Connection.prototype.reset = function() {
  if (this.isConnected()) {
    this.api_.reset();
  }
};


/**
 * Request device to connect.
 */
cwc.mode.lego.ev3.Connection.prototype.requestDevice = function() {
};


/**
 * @param {Event|Object} e
 * @private
 */
cwc.mode.lego.ev3.Connection.prototype.handleUpdateDevices_ = function(e) {
  let rendererInstance = this.helper.getInstance('renderer');
  if (rendererInstance && e.data) {
    rendererInstance.setDevices(e.data);
  }
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.lego.ev3.Connection.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api_.cleanUp();
  this.stop();
  this.events_.clear();
};


/**
 * @param {Event|Object} e
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
 * @param {Event|Object} e
 * @private
 */
cwc.mode.lego.ev3.Connection.prototype.handlePreviewStatus_ = function(e) {
  if (e.data === cwc.ui.PreviewState.STOPPED) {
    this.stop();
  }
};
});
