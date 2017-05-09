/**
 * @fileoverview Runner for the Arduino modification.
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
goog.provide('cwc.mode.arduino.Runner');

goog.require('cwc.protocol.arduino.Api');
goog.require('cwc.ui.Runner');
goog.require('cwc.utils.Helper');
goog.require('goog.Timer');
goog.require('goog.dom');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.arduino.Runner = function(helper) {
  /** @type {string} */
  this.name = 'Arduino Runner';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('arduino-runner');

  /** @type {cwc.protocol.arduino.Api} */
  this.arduino = null;

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);

  /** @type {boolean} */
  this.overlay = false;
};


/**
 * Decorates the runner object for the EV3 modification.
 * @export
 */
cwc.mode.arduino.Runner.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'runner-chrome');
  this.helper.setInstance('runner', this.runner, true);
  this.runner.addCommand('__handshake__', this.handleHandshake, this);

  this.runner.setCleanUpFunction(this.handleCleanUp.bind(this));
  this.runner.decorate(this.node);
  this.runner.showRunButton(false);
  this.runner.enableTerminal(true);
};


/**
 * @param {string=} opt_token
 */
cwc.mode.arduino.Runner.prototype.handleHandshake = function(
    opt_token) {
  console.log('Received Handshake:', opt_token);

  // Stores EV3 instance.
  if (!this.arduino) {
    console.error('Was not able to get Arduino instance!');
  }

  // Monitor Arduino events.
  // var eventHandler = this.arduino.getEventHandler();

  // Send acknowledge for the start.
  goog.Timer.callOnce(function() {
    this.runner.send('__start__');
  }.bind(this), 200);
};


/**
 * Handles the cleanup and ensures that the EV3 stops.
 */
cwc.mode.arduino.Runner.prototype.handleCleanUp = function() {
  if (this.arduino) {
    this.arduino.cleanUp();
  }
};
