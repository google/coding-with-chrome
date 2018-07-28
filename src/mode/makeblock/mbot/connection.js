/**
 * @fileoverview Handles mBot connection.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.mode.makeblock.mBot.Connection');

goog.require('cwc.lib.protocol.makeblock.mBot.Api');
goog.require('cwc.lib.protocol.bluetoothChrome.profile.Device');
goog.require('cwc.lib.protocol.makeblock.mBot.Events');
goog.require('cwc.utils.Events');

goog.require('goog.Timer');


goog.scope(function() {
const Api = goog.module.get('cwc.lib.protocol.makeblock.mBot.Api');
const BluetoothProfile =
  goog.module.get('cwc.lib.protocol.bluetoothChrome.profile.Device');
const Events = goog.module.get('cwc.lib.protocol.makeblock.mBot.Events');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.makeblock.mBot.Connection = function(helper) {
  /** @type {string} */
  this.name = 'mBot Connection';

  /** @type {string} */
  this.autoConnectName = 'Makeblock';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {number} */
  this.connectMonitorInterval = 5000;

  /** @type {!cwc.protocol.makeblock.mBot.Api} */
  this.api_ = new Api();

  /** @private {!goog.events.EventTarget} */
  this.apiEvents_ = this.api_.getEventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.lib.protocol.bluetoothChrome.profile.Device} */
  this.device_ = BluetoothProfile.MAKEBLOCK_MBOT;
};


/**
 * Connects the mBot unit.
 * @export
 */
cwc.mode.makeblock.mBot.Connection.prototype.init = function() {
  this.handleConnecting_({
    'data': 'Searching for ' + this.device_.name,
    'source': 1,
  });

  if (this.apiEvents_) {
    this.events_.listen(this.apiEvents_,
      Events.Type.CONNECT, this.handleConnecting_.bind(this));
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

  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }

  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the mBot robot.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.makeblock.mBot.Connection.prototype.connect = function(opt_event) {
  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (!bluetoothInstance) {
    return;
  }
  if (!this.isConnected()) {
    bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.api_.connect.bind(this.api_));
  }
  this.api_.monitor(true);
};


/**
 * Stops the current executions.
 * @export
 */
cwc.mode.makeblock.mBot.Connection.prototype.stop = function() {
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
cwc.mode.makeblock.mBot.Connection.prototype.reset = function() {
  if (this.isConnected()) {
    this.api_.reset();
  }
};


/**
 * @return {boolean}
 * @export
 */
cwc.mode.makeblock.mBot.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {!cwc.protocol.makeblock.mBot.Api}
 * @export
 */
cwc.mode.makeblock.mBot.Connection.prototype.getApi = function() {
  return this.api_;
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.makeblock.mBot.Connection.prototype.getEventTarget = function() {
  return this.api_.getEventTarget();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.makeblock.mBot.Connection.prototype.cleanUp = function() {
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
cwc.mode.makeblock.mBot.Connection.prototype.handleConnecting_ = function(e) {
  let message = e.data;
  let step = e.source;
  let title = 'Connecting ' + this.device_.name;
  let connectScreenInstance = this.helper.getInstance('connectScreen');
  connectScreenInstance.showConnectingStep(title, message, step);
};


/**
 * @param {Event|Object} e
 * @private
 */
cwc.mode.makeblock.mBot.Connection.prototype.handlePreviewStatus_ = function(
    e) {
  if (e.data === cwc.ui.PreviewState.STOPPED) {
    this.stop();
  }
};
});
