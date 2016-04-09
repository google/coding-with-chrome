/**
 * @fileoverview runner profile for  Makeblock mBots.
 *
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
goog.provide('cwc.runner.profile.mbot.Command');



/**
 * @param {!cwc.protocol.mbot.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.mbot.Command = function(api) {
  /** @type {cwc.protocol.mbot.Api} */
  this.api = api;
};


/**
 * @param {!Object} data
 */
cwc.runner.profile.mbot.Command.prototype.beepBuzzer = function(opt_data){
  this.api.beepBuzzer();
};

//
// /**
//  * @param {!Object} data
//  */
// cwc.runner.profile.mbot.Command.prototype.roll = function(data) {
//   this.api.roll(data['speed'], data['heading'], data['state']);
// };
//
//
// /**
//  * @param {!Object} data
//  */
// cwc.runner.profile.mbot.Command.prototype.boost = function(data) {
//   this.api.boost(data['enable']);
// };
//
//
// /**
//  * @param {!Object} data
//  */
// cwc.runner.profile.mbot.Command.prototype.setBackLed = function(data) {
//   this.api.setBackLed(data['brightness']);
// };
//
//
// /**
//  * @param {!Object} data
//  */
// cwc.runner.profile.mbot.Command.prototype.setMotionTimeout = function(data) {
//   this.api.setMotionTimeout(data['timeout']);
// };
//
//
// /**
//  * @param {!Object} data
//  */
// cwc.runner.profile.mbot.Command.prototype.calibrate = function(data) {
//   this.api.calibrate(data['heading']);
// };
//
//
// /**
//  * @param {!Object} data
//  */
// cwc.runner.profile.mbot.Command.prototype.stop = function(data) {
//   this.api.stop(data['delay']);
// };
//
//
// /**
//  * @param {!Object} opt_data
//  */
// cwc.runner.profile.mbot.Command.prototype.sleep = function(opt_data) {
//   this.api.sleep();
// };
