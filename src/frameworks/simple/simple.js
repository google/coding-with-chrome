/**
 * @fileoverview Simple JavaScript Framework for Coding with Chrome.
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
goog.provide('cwc.framework.simple.Loader');

goog.require('cwc.framework.simple.Command');
goog.require('cwc.framework.simple.Draw');
goog.require('goog.dom');



/**
 * @param {Element=} opt_target
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.simple.Loader = function(opt_target) {

  /** @type {Element} */
  this.target = opt_target || document.body;

  /** @type {cwc.framework.simple.Command} */
  this.commandFramework = new cwc.framework.simple.Command(
      this.target);

  /** @type {cwc.framework.simple.Draw} */
  this.drawFramework = new cwc.framework.simple.Draw(
      this.target);
};


/**
 * @export
 * @return {cwc.framework.simple.Command}
 */
cwc.framework.simple.Loader.prototype.getCommandFramework =
    function() {
  return this.commandFramework;
};


/**
 * @export
 * @return {cwc.framework.simple.Draw}
 */
cwc.framework.simple.Loader.prototype.getDrawFramework = function() {
  return this.drawFramework;
};


/**
 * @export
 */
cwc.framework.simple.Loader.prototype.mapFramework = function() {
  if (this.commandFramework) {
    this.commandFramework.mapGlobal();
  }
  if (this.drawFramework) {
    this.drawFramework.mapGlobal();
  }
};


goog.exportSymbol('cwc.framework.simple.Loader',
    cwc.framework.simple.Loader);
goog.exportSymbol('cwc.framework.simple.Loader.prototype.mapFramework',
    cwc.framework.simple.Loader.prototype.mapFramework);
