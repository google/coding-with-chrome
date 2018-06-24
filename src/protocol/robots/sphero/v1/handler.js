/**
 * @fileoverview Command Handler for Sphero v1 implementation.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.provide('cwc.protocol.sphero.v1.Handler');

goog.require('cwc.protocol.sphero.classic.Commands');


/**
 * @constructor
 * @final
 */
cwc.protocol.sphero.v1.Handler = function() {
  /** @private {boolean} */
  this.calibrate_ = false;

  /** @private {number} */
  this.heading_ = 0;

  /** @private {number} */
  this.speed_ = 20;
};


/**
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['boost'] = function(data) {
  return cwc.protocol.sphero.classic.Commands.boost(data['enable']);
};


/**
 * Starts the calibration to calibrate the Sphero.
 * @param {!Object} data
 * @return {!Array<ArrayBuffer>|ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['calibrate'] = function(data) {
  let cmds = [];
  if (!this.calibrate_) {
    cmds.push(this['setRGB']());
    cmds.push(this['setBackLed']({'brightness': 255}));
    this.calibrate_ = true;
  }
  cmds.push(this['roll']({'speed': 0, 'heading': data['heading']}));
  return cmds;
};


/**
 * Gets the current RGB color.
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['getRGB'] = function() {
  return cwc.protocol.sphero.classic.Commands.getRGB();
};


/**
 * Reads the current Sphero location.
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['getLocation'] = function() {
  return cwc.protocol.sphero.classic.Commands.getLocation();
};


/**
 * Reads current Sphero version.
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['getVersion'] = function() {
  return cwc.protocol.sphero.classic.Commands.getVersion();
};


/**
 * Rolls the robot with the given speed, heading and state.
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['roll'] = function(data) {
  let speed = this.speed_ = data['speed'] === undefined ?
    this.speed_ : data['speed'];
  let heading = this.heading_ = data['heading'] === undefined ?
    this.heading_ : data['heading'];
 return cwc.protocol.sphero.classic.Commands.roll(
    speed, heading, data['state']);
};


/**
 * Stops the rolling of the robot.
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['rollStop'] = function() {
  return cwc.protocol.sphero.classic.Commands.roll(0, this.heading_, false);
};


/**
 * Sets the bridgthness of the back led.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['setBackLed'] = function(
    data = {}) {
  return cwc.protocol.sphero.classic.Commands.setBackLed(data['brightness']);
};


/**
 * Ends the calibrate of the Sphero and store the new 0 point.
 * @return {!Array<ArrayBuffer>|ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['setCalibration'] = function() {
  this.calibrate_ = false;
  return [
    this['setBackLed'](),
    this['setHeading'](),
  ];
};


/**
 * Enables Collision detection
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['setCollisionDetection'] =
    function() {
  return cwc.protocol.sphero.classic.Commands.setCollisionDetection();
};


/**
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['setHeading'] = function(
    data = {}) {
  return cwc.protocol.sphero.classic.Commands.setHeading(data['heading']);
};


/**
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['setMotionTimeout'] = function(
    data) {
  return cwc.protocol.sphero.classic.Commands.setMotionTimeout(data['timeout']);
};


/**
 * Sets the RGB color.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['setRGB'] = function(data = {}) {
  return cwc.protocol.sphero.classic.Commands.setRGB(
    data['red'], data['green'], data['blue'], data['persistent']);
};


/**
 * Puts the Sphero into sleep.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.v1.Handler.prototype['sleep'] = function(data = {}) {
  console.log('Sends Sphero to sleep, good night.');
  return cwc.protocol.sphero.classic.Commands.sleep(
    data['wakeup'], data['macro'], data['orb_basic']);
};


/**
 * Stops the Sphero device.
 * @return {!Array<ArrayBuffer>}
 */
cwc.protocol.sphero.v1.Handler.prototype['stop'] = function() {
  return [
    this['setRGB']({'persistent': true}),
    this['setBackLed'](),
    this['boost']({'enable': false}),
    this['rollStop'](),
  ];
};
