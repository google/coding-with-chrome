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
  this.monitorSensorLightInterval = 1000;  // Duration in ms.

  /** @type {!number} */
  this.monitorSensorUltrasonicInterval = 200;  // Duration in ms.

  /** @type {goog.Timer} */
  this.monitorSensorLineFollower = new goog.Timer(
    this.monitorSensorLineFollowerInterval);

  /** @type {goog.Timer} */
  this.monitorSensorLight = new goog.Timer(
    this.monitorSensorLightInterval);

  /** @type {goog.Timer} */
  this.monitorSensorUltrasonic = new goog.Timer(
    this.monitorSensorUltrasonicInterval);

  /** @type {!boolean} */
  this.started = false;

  /** @type {!Array} */
  this.listener = [];

  // Monitor Events
  this.addEventListener_(this.monitorSensorLineFollower, goog.Timer.TICK,
      this.api.readLineFollowerSensor, false, this.api);

  this.addEventListener_(this.monitorSensorLight, goog.Timer.TICK,
      this.api.readLightSensor, false, this.api);

  this.addEventListener_(this.monitorSensorUltrasonic, goog.Timer.TICK,
      this.api.readUltrasonicSensor, false, this.api);
};


/**
 * start sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.start = function() {
  if (this.started) {
    return;
  }
  console.log('Starting mBot Ranger Monitoring ...');
  //this.monitorSensorLineFollower.start();
  //this.monitorSensorLight.start();
  //this.monitorSensorUltrasonic.start();
  this.started = true;
};


/**
 * stop sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Monitoring.prototype.stop = function() {
  if (!this.started) {
    return;
  }
  console.log('Stopping mBot Ranger Monitoring ...');
  this.monitorSensorLineFollower.stop();
  this.monitorSensorLight.stop();
  this.monitorSensorUltrasonic.stop();
  this.started = false;
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
