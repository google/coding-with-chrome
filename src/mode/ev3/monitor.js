/**
 * @fileoverview Monitor for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Monitor');

goog.require('cwc.protocol.ev3.Api');
goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.soy.mode.ev3.Monitor');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!boolean} bluetooth_socket
 * @struct
 * @final
 */
cwc.mode.ev3.Monitor = function(helper, bluetooth_socket) {
  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.bluetoothSocket = bluetooth_socket;

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-monitor');

  /** @type {string} */
  this.generalPrefix = helper.getPrefix();

  /** @type {goog.ui.Toolbar} */
  this.toolbar = null;

  /** @type {goog.ui.ToolbarButton} */
  this.toolbarConnect = cwc.ui.Helper.getIconToolbarButton('cast',
      'Connects Monitor to EV3 unit.', this.connect.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.toolbarDisconnect = cwc.ui.Helper.getIconToolbarButton(
      'cast_connected', 'Disconnects Monitor from the EV3 unit.',
      this.disconnect.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.toolbarStop = cwc.ui.Helper.getIconToolbarButton(
      'stop', 'Stops the EV3 unit.', this.stop.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.toolbarDetect = cwc.ui.Helper.getIconToolbarButton(
      'cached', 'Refreshes the detected sensors and actors.',
      this.detect.bind(this));

  /** @type {goog.Timer} */
  this.timerMonitor = null;

  /** @type {!number} */
  this.timerMonitorInterval = 2500;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {boolean} */
  this.connected = false;

  /** @type {boolean} */
  this.statusDetected = false;

  /** @type {!Array} */
  this.listener = [];

  /** @type {cwc.protocol.ev3.Api} */
  this.ev3 = new cwc.protocol.ev3.Api(helper);
};


/**
 * Decorates the EV3 monitor window.
 */
cwc.mode.ev3.Monitor.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'monitor-chrome');

  goog.style.installStyles(
      cwc.soy.mode.ev3.Monitor.style({ 'prefix': this.prefix }));

  goog.soy.renderElement(
      this.node,
      cwc.soy.mode.ev3.Monitor.template,
      {'prefix': this.prefix,
        'bluetoothSocket': this.bluetoothSocket});

  // Monitoring
  this.nodeMonitor = goog.dom.getElement(this.prefix + 'monitor');
  this.updateDeviceData();

  // Toolbar Buttons
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');

  this.toolbarConnect.setEnabled(this.bluetoothSocket);
  this.toolbarDisconnect.setVisible(false);
  this.toolbarDetect.setEnabled(false);
  this.toolbarStop.setEnabled(false);

  this.toolbar = new goog.ui.Toolbar();
  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.addChild(this.toolbarConnect, true);
  this.toolbar.addChild(this.toolbarDisconnect, true);
  this.toolbar.addChild(this.toolbarStop, true);
  this.toolbar.addChild(this.toolbarDetect, true);
  this.toolbar.render(this.nodeToolbar);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  // EV3 connection
  this.ev3 = this.helper.getInstance('ev3');
  if (!this.timerMonitor) {
    this.timerMonitor = new goog.Timer(this.timerMonitorInterval);
    goog.events.listen(this.timerMonitor, goog.Timer.TICK,
        this.handleConnect.bind(this));
  }
  this.timerMonitor.start();
  this.statusDetected = false;

  // Show connect notice.
  if (this.bluetoothSocket) {
    this.helper.showInfo('Please make sure to connect to the Bluetooth ' +
        'device by using the "Devices" menu.');
  } else {
    this.helper.showError('Bluetooth is not available!');
  }
};


/**
 * Handles the EV3 connection state.
 */
cwc.mode.ev3.Monitor.prototype.handleConnect = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (this.isReady() && !this.connected) {
    if (runnerInstance) {
      runnerInstance.showConnect();
    }
    this.connect();
  } else if (!this.isReady() && (this.connected || !this.statusDetected)) {
    if (runnerInstance) {
      runnerInstance.showDisconnect();
    }
    if (!this.statusDetected) {
      this.statusDetected = true;
    } else {
      this.disconnect();
    }
  }
};


/**
 * Checks if the EV3 unit is ready.
 * @return {boolean}
 */
cwc.mode.ev3.Monitor.prototype.isReady = function() {
  if (!this.ev3) {
    return false;
  }

  return this.ev3.isAvailable();
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Monitor.prototype.connect = function() {
  this.ev3 = this.helper.getInstance('ev3');
  console.log('Try to connect to the EV3 unit ...');
  var oldConnectStatus = this.connected;
  this.connected = this.ev3.connect();
  this.toolbarConnect.setVisible(!this.connected);
  this.toolbarDisconnect.setVisible(this.connected);
  this.toolbarStop.setEnabled(this.connected);
  this.toolbarDetect.setEnabled(this.connected);

  if (oldConnectStatus && !this.connected) {
    this.helper.showWarning('Lost connection to EV3');
  } else if (!oldConnectStatus && this.connected) {
    this.prepare();
  } else if (!this.connected) {
    this.helper.showWarning('Was unable to connect to the EV3 unit.\n' +
        'Please make sure that the EV3 is connected under "Devices".\n' +
        'Click on the "Connect" button after the device is connected!');
  }
};


/**
 * Prepares Monitoring
 */
cwc.mode.ev3.Monitor.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }
  var eventHandler = this.ev3.getEventHandler();
  goog.events.listen(eventHandler,
      cwc.protocol.ev3.Events.CHANGED_VALUES,
      this.updateDeviceData, false, this);
  this.prepared = true;
};


/**
 * Disconnects the EV3 unit.
 */
cwc.mode.ev3.Monitor.prototype.disconnect = function() {
  if (this.ev3) {
    this.ev3.disconnect();
  }

  if (this.timerMonitor) {
    this.timerMonitor.stop();
  }

  this.connected = false;
  this.toolbarConnect.setVisible(!this.connected);
  this.toolbarConnect.setEnabled(!this.connected);
  this.toolbarDisconnect.setVisible(this.connected);
  this.toolbarStop.setEnabled(this.connected);
  this.toolbarDetect.setEnabled(this.connected);
};


/**
 * Disconnects the EV3 unit.
 */
cwc.mode.ev3.Monitor.prototype.stop = function() {
  if (this.ev3) {
    this.ev3.stop();
  }
};


/**
 * Detects the connected EV3 devices.
 */
cwc.mode.ev3.Monitor.prototype.detect = function() {
  if (this.ev3) {
    this.ev3.getDevices();
  }
};


/**
 * Updates device Data.
 */
cwc.mode.ev3.Monitor.prototype.updateDeviceData = function() {
  goog.soy.renderElement(
      this.nodeMonitor,
      cwc.soy.mode.ev3.Monitor.monitor,
      {'prefix': this.prefix, 'devices': this.ev3.getDeviceData()}
  );
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Monitor.prototype.cleanUp = function() {
  if (this.timerMonitor) {
    this.timerMonitor.stop();
  }
  this.stop();
  if (this.ev3) {
    this.ev3.disconnect();
  }
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
 */
cwc.mode.ev3.Monitor.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
