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
goog.require('cwc.utils.Helper');
goog.require('goog.Timer');
goog.require('goog.dom');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {boolean} bluetooth_socket
 * @struct
 * @final
 */
cwc.mode.ev3.Runner = function(helper, bluetooth_socket) {
  /** @type {string} */
  this.name = 'EV3 Runner';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.bluetoothSocket = bluetooth_socket;

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-runner');

  /** @type {cwc.protocol.ev3.Api} */
  this.ev3 = null;

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
  this.showPreview = true;
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
  this.runner.addCommand('delayedStop', this.handleDelayedStop.bind(this));
  this.runner.addCommand('move', this.handleMove.bind(this));
  this.runner.addCommand('moveServo', this.handleMoveServo.bind(this));
  this.runner.addCommand('playSound', this.handlePlaySound.bind(this));
  this.runner.addCommand('playTone', this.handlePlayTone.bind(this));
  this.runner.addCommand('rotate', this.handleRotate.bind(this));
  this.runner.addCommand('showImage', this.handleShowImage.bind(this));

  // Direct commands
  this.runner.addCommand('movePower', this.handleMovePower.bind(this));
  this.runner.addCommand('rotatePower', this.handleRotatePower.bind(this));
  this.runner.addCommand('stop', this.handleStop.bind(this));

  // General commands
  this.runner.addCommand('echo', this.handleEcho.bind(this));
  this.runner.addCommand('setColorSensorMode',
      this.handleSetColorSensorMode.bind(this));
  this.runner.addCommand('setIrSensorMode',
      this.handleSetIrSensorMode.bind(this));
  this.runner.addCommand('setLed', this.handleSetLed.bind(this));
  this.runner.addCommand('setStepSpeed', this.handleSetStepSpeed.bind(this));

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

  this.runner.setCleanUpFunction(this.handleCleanUp.bind(this));
  this.runner.decorate(this.node, this.prefix);
  this.runner.showRunButton(false);

  if (this.showPreview) {
    this.preview.decorate();
  }

  // EV3 connection
  this.ev3 = this.helper.getInstance('ev3');

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
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

  // Stores EV3 instance.
  if (!this.ev3) {
    console.error('Was not able to get EV3 instance!');
  }

  // Monitor EV3 events.
  this.updateDeviceInfo();
  this.updateDeviceData();
  var eventHandler = this.ev3.getEventHandler();

  this.addEventListener(eventHandler,
      cwc.protocol.ev3.Events.CHANGED_VALUES,
      this.updateDeviceData, false, this);

  this.addEventListener(eventHandler,
      cwc.protocol.ev3.Events.CHANGED_DEVICES,
      this.updateDeviceInfo, false, this);

  // Send acknowledge for the start.
  goog.Timer.callOnce(function() {
    this.runner.send('__start__');
  }.bind(this), 200);
};


/**
 * Handles the cleanup and make sure that the EV3 stops.
 */
cwc.mode.ev3.Runner.prototype.handleCleanUp = function() {
  if (this.ev3) {
    this.ev3.cleanUp();
  }
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handlePlayTone = function(data) {
  this.ev3.playTone(data['frequency'], data['duration'], data['volume']);
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handlePlaySound = function(data) {
  this.ev3.playSound(data['file'], data['volume']);
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleShowImage = function(data) {
  this.ev3.showImage(data['file']);
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleMove = function(data) {
  this.ev3.moveSteps(data['steps'], data['direction']);
  if (this.showPreview) {
    this.preview.addToBuffer({name: 'move', data: data});
  }
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleMoveServo = function(data) {
  this.ev3.moveServo(data['steps'], data['direction']);
  if (this.showPreview) {
    this.preview.addToBuffer({name: 'setPenDown', data: !data['direction']});
  }
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleRotate = function(data) {
  this.ev3.rotateAngle(data['angle'], data['direction']);
  if (this.showPreview) {
    this.preview.addToBuffer({name: 'rotate', data: data});
  }
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleDelayedStop = function(data) {
  this.ev3.delayedStop();
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleMovePower = function(data) {
  this.ev3.movePower(data['power'], data['direction']);
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleRotatePower = function(data) {
  this.ev3.rotatePower(data['power'], data['opt_power'], data['direction']);
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleStop = function(data) {
  this.ev3.stop();
};


/**
 * @param {string} value
 */
cwc.mode.ev3.Runner.prototype.handleEcho = function(value) {
  this.ev3.echo(value);
};


/**
 * @param {!cwc.protocol.ev3.ColorSensorMode} mode
 */
cwc.mode.ev3.Runner.prototype.handleSetColorSensorMode = function(
    mode) {
  this.ev3.setColorSensorMode(mode);
};


/**
 * @param {!cwc.protocol.ev3.IrSensorMode} mode
 */
cwc.mode.ev3.Runner.prototype.handleSetIrSensorMode = function(
    mode) {
  this.ev3.setIrSensorMode(mode);
};


/**
 * @param {!Object} data
 */
cwc.mode.ev3.Runner.prototype.handleSetLed = function(data) {
  this.ev3.setLed(data['color'], data['mode']);
};


/**
 * @param {!number} data
 */
cwc.mode.ev3.Runner.prototype.handleSetStepSpeed = function(data) {
  this.ev3.setStepSpeed(data);
};


/**
 * Updates the runner inside the sandbox with the device data.
 */
cwc.mode.ev3.Runner.prototype.updateDeviceData = function() {
  this.runner.send('updateDeviceData', this.ev3.getDeviceData());
};


/**
 * Updates the runner inside the sandbox with the device information.
 */
cwc.mode.ev3.Runner.prototype.updateDeviceInfo = function() {
  this.runner.send('updateDeviceInfo', this.ev3.getDeviceInfo());
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
