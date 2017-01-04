/**
 * @fileoverview Arduino framework for the runner instance.
 * This Arduino framework will be used by the runner instance, inside the
 * webview sandbox, to access the Arduino over the runner instance and
 * the serial interface.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.provide('cwc.framework.Arduino');

goog.require('cwc.framework.Runner');



/**
 * @constructor
 * @param {!cwc.framework.Runner} runner
 * @struct
 * @final
 */
cwc.framework.Arduino = function(runner) {
  /** @type {string} */
  this.name = 'Arduino Framework';

  /** @type {!cwc.framework.Runner} */
  this.runner = runner;

  if (this.runner) {
    this.init();
  } else {
    console.error('Was unable to get runner:', runner);
  }
};


/**
 * Initial Arduino framework.
 */
cwc.framework.Arduino.prototype.init = function() {
};


/**
 * Adds the Arduino framework to the runner listener.
 * @param {Function} callback
 * @export
 */
cwc.framework.Arduino.prototype.listen = function(callback) {
  console.log(callback);
};
