/**
 * @fileoverview mbot framework for runner instances.
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

 goog.provide('cwc.framework.mbot');

 goog.require('cwc.framework.Runner');



 /**
  * @constructor
  * @param {!Function} code
  * @struct
  * @final
  * @export
  */
 cwc.framework.mbot = function(code) {
   /** @type {string} */
   this.name = 'mbot Framework';

   /** @type {Function} */
   this.code = function() {code(this);}.bind(this);

   /** @type {!cwc.framework.Runner} */
   this.runner = new cwc.framework.Runner(this.code);
 };


 /**
  * beep the buzzer on mbot
  * @return {void}
  * @export
  */
 cwc.framework.mbot.prototype.beepBuzzer = function() {
   this.runner.send('beepBuzzer');
 };

 /**
  * move mBot at a speed
  * @param  {Number} opt_speed speed at which to move
  * @param  {Number} opt_delay Seconds of delay after a move
  * @return {void}
  * @export
  */
 cwc.framework.mbot.prototype.move = function(opt_speed, opt_delay){
   this.runner.send('move', {'speed': opt_speed}, opt_delay);
 }

/**
 * Turn mBot at a speed
 * @param  {Number} opt_speed speed at which to turn
 * @param  {Number} opt_delay Seconds to delay
 * @return {void}
 * @export
 */
 cwc.framework.mbot.prototype.turn = function(opt_speed, opt_delay){
   this.runner.send('turn', {'speed': opt_speed}, opt_delay);
 }

 cwc.framework.mbot.prototype.moveSteps = function(steps, opt_speed, opt_delay) {
   this.runner.send('moveSteps', {
     'steps': steps,
     'speed': opt_speed}, opt_delay);
 };


 /**
  * turn mbot for certain seconds
  * @param  {number} time      time/"steps" to turn
  * @param  {number} opt_speed how fast does it turn
  * @return {void}
  * @export
  */
 cwc.framework.mbot.prototype.turnSteps = function(time, opt_speed){
   this.turn(opt_speed || 50, time);
   this.stop(100);
 }
