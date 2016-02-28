/**
 * @fileoverview EV3 monitoring logic.
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
goog.provide('cwc.protocol.ev3.Monitoring');
goog.require('cwc.protocol.ev3.DeviceName');
goog.require('cwc.protocol.ev3.Events');

goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.events.EventTarget');



/**
 * @constructor
 * @param {!cwc.protocol.ev3.Api} api
 * @struct
 * @final
 */
cwc.protocol.ev3.Monitoring = function(api) {
  /** @type {!cwc.protocol.ev3.Api} */
  this.api = api;

  /** @type {boolean} */
  this.monitor = false;

  /** @type {!number} */
  this.monitorMotorInterval = 2000;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorTouchInterval = 600;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorColorInterval = 250;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorGyroInterval = 250;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorIrInterval = 250;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorUltrasonicInterval = 250;  // Duration in ms.

  /** @type {!number} */
  this.monitorUpdateInterval = Math.min(this.monitorMotorInterval,
      this.monitorSensorTouchInterval, this.monitorSensorColorInterval,
      this.monitorSensorGyroInterval, this.monitorSensorIrInterval,
      this.monitorSensorUltrasonic, 1000);

  /** @type {goog.Timer} */
  this.monitorSensorTouch = new goog.Timer(this.monitorSensorTouchInterval);

  /** @type {goog.Timer} */
  this.monitorSensorTouchOpt = new goog.Timer(this.monitorSensorTouchInterval);

  /** @type {goog.Timer} */
  this.monitorSensorColor = new goog.Timer(this.monitorSensorColorInterval);

  /** @type {goog.Timer} */
  this.monitorSensorGyro = new goog.Timer(this.monitorSensorGyroInterval);

  /** @type {goog.Timer} */
  this.monitorSensorIr = new goog.Timer(this.monitorSensorIrInterval);

  /** @type {goog.Timer} */
  this.monitorSensorUltrasonic = new goog.Timer(
    this.monitorSensorUltrasonicInterval);

  /** @type {goog.Timer} */
  this.monitorLargeMotor = new goog.Timer(this.monitorMotorInterval);

  /** @type {goog.Timer} */
  this.monitorMediumMotor = new goog.Timer(this.monitorMotorInterval);

  /** @type {goog.Timer} */
  this.monitorLargeMotorOpt = new goog.Timer(this.monitorMotorInterval);

  /** @type {goog.Timer} */
  this.monitorMediumMotorOpt = new goog.Timer(this.monitorMotorInterval);

  /** @type {goog.Timer} */
  this.monitorUpdate = new goog.Timer(this.monitorUpdateInterval);

  /** @type {goog.events.EventTarget} */
  this.eventHandler = api.getEventHandler();

  /** @type {Object} */
  this.deviceInfo = {};

  /** @type {boolean} */
  this.detectChangedValues = false;

  /** @type {boolean} */
  this.started = false;

  /** @type {!Array} */
  this.listener = [];
};


/**
 * Prepares events for port monitoring.
 */
cwc.protocol.ev3.Monitoring.prototype.init = function() {
  if (this.monitor) {
    return;
  }

  console.log('Init EV3 sensor and actor monitoring ...');

  this.addEventListener_(this.monitorSensorColor, goog.Timer.TICK,
      this.updateColorSensor, false, this);

  this.addEventListener_(this.monitorSensorGyro, goog.Timer.TICK,
      this.updateGyroSensor, false, this);

  this.addEventListener_(this.monitorSensorIr, goog.Timer.TICK,
      this.updateIrSensor, false, this);

  this.addEventListener_(this.monitorSensorUltrasonic, goog.Timer.TICK,
      this.updateUltrasonicSensor, false, this);

  this.addEventListener_(this.monitorSensorTouch, goog.Timer.TICK,
      this.updateTouchSensor, false, this);

  this.addEventListener_(this.monitorLargeMotor, goog.Timer.TICK,
      this.updateLargeMotor, false, this);

  this.addEventListener_(this.monitorMediumMotor, goog.Timer.TICK,
      this.updateMediumMotor, false, this);

  this.addEventListener_(this.monitorLargeMotorOpt, goog.Timer.TICK,
      this.updateLargeMotorOpt, false, this);

  this.addEventListener_(this.monitorMediumMotorOpt, goog.Timer.TICK,
      this.updateMediumMotorOpt, false, this);

  this.addEventListener_(this.monitorUpdate, goog.Timer.TICK,
      this.updateData, false, this);

  this.monitor = true;
};


/**
 * Starts the port monitoring.
 * @param {Object=} opt_device_info
 */
cwc.protocol.ev3.Monitoring.prototype.start = function(opt_device_info) {
  if (opt_device_info) {
    this.deviceInfo = opt_device_info;
  }
  if (!this.deviceInfo ||
      !Object.getOwnPropertyNames(this.deviceInfo).length > 0) {
    return;
  }
  if (!this.started) {
    console.log('Preparing EV3 monitoring ...');
  }
  var monitoring = false;

  if (cwc.protocol.ev3.DeviceName.COLOR_SENSOR in this.deviceInfo) {
    this.monitorSensorColor.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.GYRO_SENSOR in this.deviceInfo) {
    this.monitorSensorGyro.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.IR_SENSOR in this.deviceInfo) {
    this.monitorSensorIr.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.ULTRASONIC_SENSOR in this.deviceInfo) {
    this.monitorSensorUltrasonic.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.TOUCH_SENSOR in this.deviceInfo) {
    this.monitorSensorTouch.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.TOUCH_SENSOR_OPT in this.deviceInfo) {
    this.monitorSensorTouchOpt.start();
    monitoring = true;
  }


  if (cwc.protocol.ev3.DeviceName.LARGE_MOTOR in this.deviceInfo) {
    this.monitorLargeMotor.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.MEDIUM_MOTOR in this.deviceInfo) {
    this.monitorMediumMotor.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.LARGE_MOTOR_OPT in this.deviceInfo) {
    this.monitorLargeMotorOpt.start();
    monitoring = true;
  }

  if (cwc.protocol.ev3.DeviceName.MEDIUM_MOTOR_OPT in this.deviceInfo) {
    this.monitorMediumMotorOpt.start();
    monitoring = true;
  }

  if (monitoring) {
    this.monitorUpdate.start();
    this.started = true;
  }
};


/**
 * Stops the port monitoring.
 */
cwc.protocol.ev3.Monitoring.prototype.stop = function() {
  if (this.started) {
    console.log('Stopping EV3 Monitoring ...');
    this.monitorSensorColor.stop();
    this.monitorSensorGyro.stop();
    this.monitorSensorIr.stop();
    this.monitorSensorTouch.stop();
    this.monitorSensorTouchOpt.stop();
    this.monitorLargeMotor.stop();
    this.monitorMediumMotor.stop();
    this.monitorLargeMotorOpt.stop();
    this.monitorMediumMotorOpt.stop();
    this.monitorUpdate.stop();
  }
};


/**
 * Informs monitoring that an update is needed.
 */
cwc.protocol.ev3.Monitoring.prototype.update = function() {
  this.detectChangedValues = true;
};


/**
 * Requests updated color sensor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateColorSensor = function() {
  this.api.getSensorData(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.COLOR_SENSOR]);
};


/**
 * Requests updated gyro sensor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateGyroSensor = function() {
  this.api.getSensorDataSi(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.GYRO_SENSOR]);
};


/**
 * Request updated ir sensor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateIrSensor = function() {
  this.api.getSensorData(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.IR_SENSOR]);
};


/**
 * Request updated ultrasonic sensor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateUltrasonicSensor = function() {
  this.api.getSensorDataSi(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.ULTRASONIC_SENSOR]);
};


/**
 * Request updated touch sensor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateTouchSensor = function() {
  this.api.getSensorDataPct(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.TOUCH_SENSOR]);
};


/**
 * Request updated touch sensor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateTouchSensorOpt = function() {
  this.api.getSensorDataPct(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.TOUCH_SENSOR_OPT]);
};


/**
 * Request updated large motor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateLargeMotor = function() {
  this.api.getActorData(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.LARGE_MOTOR]);
};


/**
 * Request updated medium motor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateMediumMotor = function() {
  this.api.getActorData(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.MEDIUM_MOTOR]);
};


/**
 * Request updated opt large motor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateLargeMotorOpt = function() {
  this.api.getActorData(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.LARGE_MOTOR_OPT]);
};


/**
 * Request updated opt medium motor device data.
 */
cwc.protocol.ev3.Monitoring.prototype.updateMediumMotorOpt = function() {
  this.api.getActorData(
      this.deviceInfo[cwc.protocol.ev3.DeviceName.MEDIUM_MOTOR_OPT]);
};


/**
 * Triggers event handler that updates values are available.
 */
cwc.protocol.ev3.Monitoring.prototype.updateData = function() {
  if (this.api.isConnected()) {
    if (this.detectChangedValues) {
      this.eventHandler.dispatchEvent(
          cwc.protocol.ev3.Events.Type.CHANGED_VALUES);
      this.detectChangedValues = false;
    }
  } else {
    this.stop();
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.protocol.ev3.Monitoring.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
