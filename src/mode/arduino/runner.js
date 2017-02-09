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

goog.require('cwc.protocol.Arduino.api');
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

  /** @type {cwc.protocol.Arduino.api} */
  this.arduino = null;

  /** @type {Element} */
  this.node = null;

  /** @type {!Array} */
  this.listener = [];

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
  this.runner.addCommand('__handshake__', this.handleHandshake.bind(this));

  this.runner.setCleanUpFunction(this.handleCleanUp.bind(this));
  this.runner.decorate(this.node);
  this.runner.showRunButton(false);
  this.runner.enableTerminal(true);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
};


/**
 * @param {string=} opt_token
 */
cwc.mode.arduino.Runner.prototype.handleHandshake = function(
    opt_token) {
  console.log('Recieved Handshake:', opt_token);

  // Stores EV3 instance.
  if (!this.arduino) {
    console.error('Was not able to get Arduino instance!');
  }

  // Monitor Arduino events.
  //var eventHandler = this.arduino.getEventHandler();

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


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.arduino.Runner.prototype.cleanUp = function() {
  this.helper.removeEventListeners(this.listener, this.name);
  this.listener = [];
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 */
cwc.mode.arduino.Runner.prototype.addEventListener = function(src,
    type, listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
