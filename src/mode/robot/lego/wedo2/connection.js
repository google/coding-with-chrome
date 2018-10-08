/**
 * @fileoverview Connection for the Sphero SPRK+ modification.
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
goog.provide('cwc.mode.lego.weDo2.Connection');

goog.require('cwc.lib.protocol.bluetoothWeb.profile.Device');
goog.require('cwc.lib.protocol.lego.weDo2.Api');
goog.require('cwc.lib.protocol.lego.weDo2.Events');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');


goog.scope(function() {
const Api = goog.module.get('cwc.lib.protocol.lego.weDo2.Api');
const ApiEvents = goog.module.get('cwc.lib.protocol.lego.weDo2.Events');
const BluetoothProfile =
  goog.module.get('cwc.lib.protocol.bluetoothWeb.profile.Device');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.lego.weDo2.Connection = function(helper) {
  /** @type {string} */
  this.name = 'Lego WeDo 2.0 Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.protocol.sphero.v1.Api} */
  this.api_ = new Api();

  /** @private {!goog.events.EventTarget} */
  this.apiEvents_ = this.api_.getEventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.lib.protocol.bluetoothWeb.profile.Device} */
  this.device_ = BluetoothProfile.LEGO_WEDO2;

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.lego.weDo2.Connection.prototype.init = function() {
  if (this.apiEvents_) {
    this.events_.listen(this.apiEvents_, ApiEvents.Type.CONNECT,
      this.handleConnecting_.bind(this));
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

  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }
  this.requestDevice();
};


/**
 * Connects the Sphero SPRK+.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.lego.weDo2.Connection.prototype.connect = function(opt_event) {
  let bluetoothInstance = this.helper.getInstance('bluetoothWeb');
  if (!bluetoothInstance) {
    return;
  }
  if (!this.isConnected()) {
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
 * Disconnects the Sphero SPRK+.
 */
cwc.mode.lego.weDo2.Connection.prototype.disconnect = function() {
  this.log_.info('Disconnect ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.stop();
  this.events_.clear();
  this.api_.disconnect();
};


/**
 * Stops the current executions.
 */
cwc.mode.lego.weDo2.Connection.prototype.stop = function() {
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
cwc.mode.lego.weDo2.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api_.reset();
  }
};


/**
 * Request device to connect.
 */
cwc.mode.lego.weDo2.Connection.prototype.requestDevice = function() {
  let connectScreenInstance = this.helper.getInstance('connectScreen');
  connectScreenInstance.requestBluetoothDevice(this.device_).then(
    (bluetoothDevice) => {
      bluetoothDevice.connect().then((device) => {
        this.api_.connect(device);
      }).catch((error) => {
        this.helper.showError(error);
      });
  }).catch(() => {
    this.connectMonitor.start();
  });
};


/**
 * @return {boolean}
 * @export
 */
cwc.mode.lego.weDo2.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.lego.weDo2.Connection.prototype.getEventTarget = function() {
  return this.apiEvents_;
};


/**
 * @return {!cwc.protocol.sphero.v1.Api}
 * @export
 */
cwc.mode.lego.weDo2.Connection.prototype.getApi = function() {
  return this.api_;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.lego.weDo2.Connection.prototype.cleanUp = function() {
  this.log_.info('Clean up ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api_.cleanUp();
  this.stop();
  this.events_.clear();
};


/**
 * @param {Event} e
 * @private
 */
cwc.mode.lego.weDo2.Connection.prototype.handleConnecting_ = function(e) {
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
cwc.mode.lego.weDo2.Connection.prototype.handlePreviewStatus_ = function(e) {
  if (e.data === cwc.ui.PreviewState.STOPPED) {
    this.stop();
  }
};
});
