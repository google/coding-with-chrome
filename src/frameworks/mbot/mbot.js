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
  */
 cwc.framework.mbot.prototype.beepBuzzer = function() {
   this.runner.send('beepBuzzer');
 };
