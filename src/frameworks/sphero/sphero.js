/**
 * @fileoverview Sphero framework for the runner instance.
 * This Sphero framework will be used by the runner instance, inside the webview
 * sandbox, to access the Sphero over the runner instance and the Bluetooth
 * interface.
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
goog.provide('cwc.framework.Sphero');

goog.require('cwc.framework.Runner');



/**
 * @constructor
 * @param {!cwc.framework.Runner} runner
 * @struct
 * @final
 */
cwc.framework.Sphero = function(runner) {
  /** @type {string} */
  this.name = 'Sphero Framework';

  /** @type {!cwc.framework.Runner} */
  this.runner = runner;

  if (this.runner) {
    this.init();
  } else {
    console.error('Was unable to get runner:', runner);
  }
};


/**
 * Inits the Sphero framework.
 */
cwc.framework.Sphero.prototype.init = function() {

};


/**
 * Adds the Sphero framework to the runner listener.
 * @param {Function} callback
 * @export
 */
cwc.framework.Sphero.prototype.listen = function(callback) {
  if (this.runner) {
    var warper = function() {
      callback(this);
    };
    this.runner.listen(warper.bind(this));
  }
};


/**
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 * @export
 */
cwc.framework.Sphero.prototype.setRGB = function(red, green, blue,
    opt_persistant) {
  this.runner.send({'command': 'setRGB', 'value': {
    'red': red,
    'green': green,
    'blue': blue,
    'persistant': opt_persistant }
  });
};


/**
 * @param {!number} brightness 0-100
 */
cwc.framework.Sphero.prototype.setBackLed = function(brightness) {
  this.runner.send({'command': 'setBackLed', 'value': {
    'brightness': brightness }
  });
};


/**
 * @param {!number} speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 * @export
 */
cwc.framework.Sphero.prototype.move = function(speed, opt_heading, opt_state) {
  this.runner.send({'command': 'move', 'value': {
    'speed': speed,
    'heading': opt_heading,
    'state': opt_state }
  });
};


/**
 * @param {number=} opt_time in sec
 * @param {number=} opt_heading 0-359
 * @export
 */
cwc.framework.Sphero.prototype.boost = function(opt_time, opt_heading) {
  this.runner.send({'command': 'boost', 'value': {
    'time': opt_time,
    'heading': opt_heading }
  });
};


goog.exportSymbol('cwc.framework.Sphero', cwc.framework.Sphero);
goog.exportSymbol('cwc.framework.Sphero.prototype.listen',
    cwc.framework.Sphero.prototype.listen);
goog.exportSymbol('cwc.framework.Sphero.prototype.setRGB',
    cwc.framework.Sphero.prototype.setRGB);
goog.exportSymbol('cwc.framework.Sphero.prototype.setBackLed',
    cwc.framework.Sphero.prototype.setBackLed);
goog.exportSymbol('cwc.framework.Sphero.prototype.move',
    cwc.framework.Sphero.prototype.move);
goog.exportSymbol('cwc.framework.Sphero.prototype.boost',
    cwc.framework.Sphero.prototype.boost);
