/**
 * @fileoverview TTS framework for the runner instance.
 * This TTS framework will be used by the runner instance, inside the webview
 * sandbox, to access the TTS interface.
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
goog.provide('cwc.framework.TTS');

goog.require('cwc.framework.Runner');



/**
 * @constructor
 * @param {!cwc.framework.Runner} runner
 * @struct
 * @final
 */
cwc.framework.TTS = function(runner) {
  /** @type {string} */
  this.name = 'TTS Framework';

  /** @type {!cwc.framework.Runner} */
  this.runner = runner;

  if (this.runner) {
    this.init();
  } else {
    console.error('Was unable to get runner:', runner);
  }
};


/**
 * Inits the TTS framework.
 */
cwc.framework.TTS.prototype.init = function() {};


/**
 * Adds the TTS framework to the runner listener.
 * @param {Function} callback
 * @export
 */
cwc.framework.TTS.prototype.listen = function(callback) {
  if (this.runner) {
    var warper = function() {
      callback(this);
    };
    this.runner.listen(warper.bind(this));
  }
};


/**
 * @param {!string} text
 * @export
 */
cwc.framework.TTS.prototype.speak = function(text) {
  this.runner.send('speak', {'text': text});
};



goog.exportSymbol('cwc.framework.TTS', cwc.framework.TTS);
goog.exportSymbol('cwc.framework.TTS.prototype.speak',
    cwc.framework.TTS.prototype.speak);
