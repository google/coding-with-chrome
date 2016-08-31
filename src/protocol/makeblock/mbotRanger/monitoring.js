/**
 * @fileoverview Define monitors used in mbot protocol.
 *
 * monitor real time values in makeblock sensors
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
goog.provide('cwc.protocol.makeblock.mbotRanger.Monitoring');

goog.require('goog.Timer');



/**
 * @constructor
 * @param {!cwc.protocol.makeblock.mbotRanger.Api} api
 * @struct
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Monitoring = function(api) {

  /** @type {!cwc.protocol.makeblock.mbotRanger.Api} */
  this.api = api;

  /** @type {!number} */
  this.monitorSensorLineFollowerInterval = 100;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorLight1Interval = 1500;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorLight2Interval = 1750;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorTemperatureInterval = 1500;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorUltrasonicInterval = 200;  // Duration in ms.

  /** @type {goog.Timer} */
  this.monitorSensorLineFollower = new goog.Timer(
    this.monitorSensorLineFollowerInterval);

  /** @type {goog.Timer} */
  this.monitorSensorLight1 = new goog.Timer(this.monitorSensorLight1Interval);

  /** @type {goog.Timer} */
  this.monitorSensorLight2 = new goog.Timer(this.monitorSensorLight2Interval);

  /** @type {goog.Timer} */
  this.monitorSensorTemperature = new goog.Timer(
    this.monitorSensorTemperatureInterval);

  /** @type {goog.Timer} */
  this.monitorSensorUltrasonic = new goog.Timer(
    this.monitorSensorUltrasonicInterval);

  /** @type {!Array} */
  this.listener = [];

  // Monitor Events
  this.addEventListener_(this.monitorSensorLineFollower, goog.Timer.TICK,
      this.api.readLineFollowerSensor, false, this.api);

  this.addEventListener_(this.monitorSensorLight1, goog.Timer.TICK,
      this.api.readLightSensor1, false, this.api);

  this.addEventListener_(this.monitorSensorLight2, goog.Timer.TICK,
      this.api.readLightSensor2, false, this.api);

  this.addEventListener_(this.monitorSensorTemperature, goog.Timer.TICK,
      this.api.readTemperatureSensor, false, this.api);

  this.addEventListener_(this.monitorSensorUltrasonic, goog.Timer.TICK,
      this.api.readUltrasonicSensor, false, this.api);
};


/**
 * start sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.start = function() {
  console.log('Starting mBot Ranger Monitoring ...');
  this.start_(this.monitorSensorLineFollower);
  this.start_(this.monitorSensorLight1);
  this.start_(this.monitorSensorLight2);
  this.start_(this.monitorSensorTemperature);
  this.start_(this.monitorSensorUltrasonic);
};


/**
 * stop sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.stop = function() {
  console.log('Stopping mBot Ranger Monitoring ...');
  this.stop_(this.monitorSensorLineFollower);
  this.stop_(this.monitorSensorLight1);
  this.stop_(this.monitorSensorLight2);
  this.stop_(this.monitorSensorTemperature);
  this.stop_(this.monitorSensorUltrasonic);
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.setLineFollowerMonitor =
function(enable) {
  this.enable_(enable, this.monitorSensorLineFollower, 'line follower');
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.setLightnessMonitor =
function(enable) {
  this.enable_(enable, this.monitorSensorLight1, 'lightness 1');
  this.enable_(enable, this.monitorSensorLight2, 'lightness 2');
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.setTemperatureMonitor =
function(enable) {
  this.enable_(enable, this.monitorSensorTemperature, 'temperature');
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.setUltrasonicMonitor =
function(enable) {
  this.enable_(enable, this.monitorSensorUltrasonic, 'ultrasonic');
};


/**
 * @param {!boolean} enable
 * @param {!goog.Timer} monitor
 * @param {string=} opt_name
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.enable_ = function(
  enable, monitor, opt_name) {
  if (enable) {
    this.start_(monitor, opt_name);
  } else {
    this.stop_(monitor, opt_name);
  }
};


/**
 * @param {!goog.Timer} monitor
 * @param {string=} opt_name
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.start_ = function(
  monitor, opt_name) {
  if (opt_name) {
    console.log('Starting mBot Ranger', opt_name, 'sensor monitoring ...');
  }
  monitor.start();
};


/**
 * @param {!goog.Timer} monitor
 * @param {string=} opt_name
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.stop_ = function(
  monitor, opt_name) {
  if (opt_name) {
    console.log('Stopping mBot Ranger', opt_name, 'sensor monitoring ...');
  }
  monitor.stop();
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
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.addEventListener_ =
function(src, type, listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
