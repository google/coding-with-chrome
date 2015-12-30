/**
 * @fileoverview Runner for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Runner');

goog.require('cwc.mode.ev3.Preview');
goog.require('cwc.soy.mode.ev3.Runner');
goog.require('cwc.ui.Runner');
goog.require('cwc.runner.profile.EV3');
goog.require('cwc.utils.Helper');
goog.require('cwc.protocol.ev3.Events');

goog.require('goog.Timer');
goog.require('goog.dom');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.ev3.Runner = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Runner';

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-runner');

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {!cwc.runner.profile.EV3} */
  this.profile = new cwc.runner.profile.EV3(this.api);

  /** @type {Element} */
  this.node = null;

  /** @type {!Array} */
  this.listener = [];

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);

  /** @type {!cwc.mode.ev3.Preview} */
  this.preview = new cwc.mode.ev3.Preview(helper);

  /** @type {!boolean} */
  this.showOverlay = true;

  /** @type {!boolean} */
  this.showPreview = false;
};


/**
 * Decorates the runner object for the EV3 modification.
 * @export
 */
cwc.mode.ev3.Runner.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'runner-chrome');
  this.helper.setInstance('runner', this.runner, true);
  this.runner.addCommand('__handshake__', this.handleHandshake.bind(this));
  this.runner.addCommand('__reset__', this.handleReset.bind(this));
  this.runner.addCommand('__init__', this.handleInit.bind(this));

  // Delayed Commands
  this.runner.addCommand('moveSteps', this.profile.moveSteps, this);
  this.runner.addCommand('moveServo', this.profile.moveServo, this);
  this.runner.addCommand('rotateAngle', this.profile.rotateAngle, this);
  this.runner.addCommand('playSound', this.profile.playSound, this);
  this.runner.addCommand('playTone', this.profile.playTone, this);
  this.runner.addCommand('showImage', this.profile.showImage, this);

  // Direct commands
  this.runner.addCommand('movePower', this.profile.movePower, this);
  this.runner.addCommand('rotatePower', this.profile.rotatePower, this);
  this.runner.addCommand('stop', this.profile.stop, this);

  // General commands
  this.runner.addCommand('setColorSensorMode', this.profile.setColorSensorMode,
      this);
  this.runner.addCommand('setIrSensorMode', this.profile.setIrSensorMode, this);
  this.runner.addCommand('setLed', this.profile.setLed, this);
  this.runner.addCommand('setStepSpeed', this.profile.setStepSpeed, this);

  // Overlay and templates.
  var templates = cwc.soy.mode.ev3.Runner;
  this.runner.setInfoTemplate(templates.info);
  if (this.showOverlay && !this.showPreview) {
    this.runner.setOverlayTemplate(templates.overlay);
  } else if (this.showPreview) {
    this.runner.setOverlayTemplate(this.preview.getTemplate(),
        this.helper.getPrefix('ev3-preview'));
  } else {
    this.runner.setConnectTemplate(templates.connect);
    this.runner.setDisconnectTemplate(templates.disconnect);
    this.runner.setPrepareTemplate(templates.prepare);
    this.runner.setRunTemplate(templates.run);
    this.runner.setReloadTemplate(templates.reload);
    this.runner.setStopTemplate(templates.stop);
    this.runner.setTerminateTemplate(templates.stop);
  }

  this.runner.setCleanUpFunction(this.profile.cleanUp.bind(this));
  this.runner.decorate(this.node, this.prefix);
  this.runner.showRunButton(false);

  if (this.showPreview) {
    this.preview.decorate();
  }

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  // EV3 events
  var apiEventHandler = this.api.getEventHandler();
  this.addEventListener(apiEventHandler,
      cwc.protocol.ev3.Events.Type.CHANGED_VALUES,
      this.updateDeviceData, false, this);
  this.addEventListener(apiEventHandler,
      cwc.protocol.ev3.Events.Type.CHANGED_DEVICES,
      this.updateDeviceInfo, false, this);
  this.addEventListener(apiEventHandler,
      cwc.protocol.ev3.Events.Type.IR_SENSOR_VALUE_CHANGED,
      this.updateIrSensor_, false, this);
  this.addEventListener(apiEventHandler,
      cwc.protocol.ev3.Events.Type.COLOR_SENSOR_VALUE_CHANGED,
      this.updateColorSensor_, false, this);
  this.addEventListener(apiEventHandler,
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR_VALUE_CHANGED,
      this.updateTouchSensor_, false, this);
};


/**
 * Prepares preview if needed.
 */
cwc.mode.ev3.Runner.prototype.handleInit = function() {
  if (this.showPreview) {
    this.preview.prepareDisplay();
  }
};


/**
* Resets preview if needed.
*/
cwc.mode.ev3.Runner.prototype.handleReset = function() {
  if (this.showPreview) {
    this.preview.clearBuffer();
  }
};


/**
 * @param {string=} opt_token
 */
cwc.mode.ev3.Runner.prototype.handleHandshake = function(opt_token) {
  console.log('Recieved Handshake:', opt_token);

  // Monitor EV3 events.
  this.updateDeviceInfo();
  this.updateDeviceData();

  // Send acknowledge for the start.
  goog.Timer.callOnce(function() {
    this.runner.send('__start__');
  }.bind(this), 200);
};


/**
 * Updates the runner inside the sandbox with the device data.
 */
cwc.mode.ev3.Runner.prototype.updateDeviceData = function() {
  this.runner.send('updateDeviceData', this.api.getDeviceData());
};


/**
 * Updates the runner inside the sandbox with the device information.
 */
cwc.mode.ev3.Runner.prototype.updateDeviceInfo = function() {
  this.runner.send('updateDeviceInfo', this.api.getDeviceInfo());
};


/**
 * @param {event} e
 * @private
 */
cwc.mode.ev3.Runner.prototype.updateIrSensor_ = function(e) {
  this.runner.send('updateIrSensor', e.data);
};


/**
 * @param {event} e
 * @private
 */
cwc.mode.ev3.Runner.prototype.updateColorSensor_= function(e) {
  this.runner.send('updateColorSensor', e.data);
};


/**
 * @param {event} e
 * @private
 */
cwc.mode.ev3.Runner.prototype.updateTouchSensor_ = function(e) {
  this.runner.send('updateTouchSensor', e.data);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Runner.prototype.cleanUp = function() {
  this.helper.removeEventListeners(this.listener, this.name);
  this.listener = [];
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
cwc.mode.ev3.Runner.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
