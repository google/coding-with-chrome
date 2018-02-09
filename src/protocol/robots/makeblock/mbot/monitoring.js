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
goog.provide('cwc.protocol.makeblock.mbot.Monitoring');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.protocol.makeblock.mbot.Api} api
 * @struct
 * @final
 */
cwc.protocol.makeblock.mbot.Monitoring = function(api) {
  /** @type {!cwc.protocol.makeblock.mbot.Api} */
  this.api = api;

  /** @type {!number} */
  this.monitorSensorLineFollowerInterval = 100; // Duration in ms.

  /** @type {!number} */
  this.monitorSensorLightInterval = 1000; // Duration in ms.

  /** @type {!number} */
  this.monitorSensorUltrasonicInterval = 200; // Duration in ms.

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

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  // Monitor Events
  this.events_.listen(this.monitorSensorLineFollower, goog.Timer.TICK,
      this.api.readLineFollowerSensor, false, this.api);

  this.events_.listen(this.monitorSensorLight, goog.Timer.TICK,
      this.api.readLightSensor, false, this.api);

  this.events_.listen(this.monitorSensorUltrasonic, goog.Timer.TICK,
      this.api.readUltrasonicSensor, false, this.api);
};


/**
 * start sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbot.Monitoring.prototype.start = function() {
  if (this.started) {
    return;
  }
  console.log('Starting mBot Monitoring ...');
  this.monitorSensorLineFollower.start();
  this.monitorSensorLight.start();
  this.monitorSensorUltrasonic.start();
  this.started = true;
};


/**
 * stop sending reading sensor signals.
 * @export
 */
cwc.protocol.makeblock.mbot.Monitoring.prototype.stop = function() {
  if (!this.started) {
    return;
  }
  console.log('Stopping mBot Monitoring ...');
  this.monitorSensorLineFollower.stop();
  this.monitorSensorLight.stop();
  this.monitorSensorUltrasonic.stop();
  this.started = false;
};
