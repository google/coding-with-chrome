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
goog.provide('cwc.mode.makeblock.mbot.Connection');

goog.require('cwc.protocol.makeblock.mbot.Api');
goog.require('cwc.utils.Events');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.makeblock.mbot.Connection = function(helper) {
  /** @type {string} */
  this.name = 'mBot Connection';

  /** @type {string} */
  this.autoConnectName = 'Makeblock';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.makeblock.mbot.Api} */
  this.api_ = new cwc.protocol.makeblock.mbot.Api();

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
};


/**
 * Connects the mbot unit.
 * @export
 */
cwc.mode.makeblock.mbot.Connection.prototype.init = function() {
  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.events_.listen(layoutInstance.getEventHandler(),
        goog.events.EventType.UNLOAD, this.cleanUp, false, this);
  }

  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    this.events_.listen(previewInstance.getEventHandler(),
      cwc.ui.PreviewEvents.Type.STATUS_CHANGE, this.handlePreviewStatus_,
      false, this);
  }

  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the mbot ball.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.makeblock.mbot.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    let bluetoothInstance = this.helper.getInstance('bluetooth', true);
    bluetoothInstance.autoConnectDevice(this.autoConnectName, function(device) {
      if (device) {
        this.api_.connect(device);
      }
    }.bind(this));
  }
};


/**
 * Stops the current executions.
 * @export
 */
cwc.mode.makeblock.mbot.Connection.prototype.stop = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.stop();
  }
  this.api_.exec('stop');
};


/**
 * Resets the connection.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.makeblock.mbot.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api_.reset();
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.mode.makeblock.mbot.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {!cwc.protocol.makeblock.mbot.Api}
 * @export
 */
cwc.mode.makeblock.mbot.Connection.prototype.getApi = function() {
  return this.api_;
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.makeblock.mbot.Connection.prototype.getEventHandler = function() {
  return this.api_.getEventHandler();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.makeblock.mbot.Connection.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api_.monitor(false);
  this.stop();
  this.events_.clear();
};


/**
 * @param {Event|Object} e
 * @private
 */
cwc.mode.makeblock.mbot.Connection.prototype.handlePreviewStatus_ = function(
    e) {
  if (e.data === cwc.ui.PreviewState.STOPPED) {
    this.stop();
  }
};
