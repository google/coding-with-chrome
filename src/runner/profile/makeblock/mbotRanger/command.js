/**
 * @fileoverview runner profile for Makeblock mBots.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.runner.profile.makeblock.mbotRanger.Command');


/**
 * @param {!cwc.protocol.makeblock.mbotRanger.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.makeblock.mbotRanger.Command = function(api) {
  /** @type {cwc.protocol.makeblock.mbotRanger.Api} */
  this.api = api;

  /** @type {cwc.protocol.makeblock.mbotRanger.Monitoring} */
  this.monitoring = this.api.getMonitoring();
};


goog.scope(function() {
  let Command = cwc.runner.profile.makeblock.mbotRanger.Command.prototype;

  /**
   * Move mBot forward or backward.
   * @param {Object} data data package
   */
  Command['movePower'] = function(data) {
    this.api.movePower(data['power'], data['slot']);
  };


  /**
   * Rotates mBot left or right.
   * @param {Object} data data package
   */
  Command['rotatePower'] = function(data) {
    this.api.rotatePower(data['power'], data['slot']);
  };


  /**
   * @param {Object} data data package
   */
  Command['moveSteps'] = function(data) {
    this.api.moveSteps(data['steps'], data['power'], data['slot']);
  };


  /**
   * stop the mbot completely
   * @param {Object=} opt_data
   */
  Command['stop'] = function(opt_data) {
    this.api.setLeftMotorPower(0);
    this.api.setRightMotorPower(0);
  };


  /**
   * @param {!Object} data
   */
  Command['setRGBLED'] = function(data) {
    this.api.setRGBLED(
      data['red'], data['green'], data['blue'], data['index']);
  };


  /**
   * @param {!Object} data
   */
  Command['playTone'] = function(data) {
    this.api.playTone(data['frequency'], data['duration']);
  };


  /**
   * @param {!Object} data
   */
  Command['setLineFollowerMonitor'] = function(data) {
    this.monitoring.setLineFollowerMonitor(data['enable']);
  };


  /**
   * @param {!Object} data
   */
  Command['setLightnessMonitor'] = function(data) {
    this.monitoring.setLightnessMonitor(data['enable']);
  };


  /**
   * @param {!Object} data
   */
  Command['setTemperatureMonitor'] = function(data) {
    this.monitoring.setTemperatureMonitor(data['enable']);
  };


  /**
   * @param {!Object} data
   */
  Command['setUltrasonicMonitor'] = function(data) {
    this.monitoring.setUltrasonicMonitor(data['enable']);
  };
}); // goog.scope
