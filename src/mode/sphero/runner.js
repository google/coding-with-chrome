/**
 * @fileoverview Runner for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Runner');

goog.require('cwc.ui.Runner');
goog.require('cwc.runner.profile.Sphero');
goog.require('cwc.utils.Helper');

goog.require('goog.Timer');
goog.require('goog.dom');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.sphero.Runner = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero Runner';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-runner');

  /** @type {!cwc.mode.sphero.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.sphero.Api} */
  this.api = this.connection.getApi();

  /** @type {!cwc.runner.profile.Sphero} */
  this.profile = new cwc.runner.profile.Sphero(this.api);

  /** @type {Element} */
  this.node = null;

  /** @type {!Array} */
  this.listener = [];

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);
};


/**
 * Decorates the runner object for the Sphero modification.
 * @export
 */
cwc.mode.sphero.Runner.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'runner-chrome');
  this.helper.setInstance('runner', this.runner, true);

  this.runner.addCommand('__init__', this.handleInit.bind(this));
  this.runner.addCommand('__reset__', this.handleReset.bind(this));

  // Normal Commands
  this.runner.addCommand('boost', this.profile.boost, this);
  this.runner.addCommand('setRGB', this.profile.setRGB, this);
  this.runner.addCommand('setBackLed', this.profile.setBackLed, this);
  this.runner.addCommand('move', this.profile.move, this);
  this.runner.addCommand('stop', this.profile.stop, this);

  // System Commands
  this.runner.addCommand('calibrate', this.profile.calibrate, this);
  this.runner.addCommand('sleep', this.profile.sleep, this);

  this.runner.setCleanUpFunction(this.handleCleanUp.bind(this));
  this.runner.decorate(this.node, this.prefix);
  this.runner.showRunButton(false);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

};


/**
 * Prepares preview if needed.
 */
cwc.mode.sphero.Runner.prototype.handleInit = function() {
  console.log('Init Runner …');
};


/**
* Resets preview if needed.
*/
cwc.mode.sphero.Runner.prototype.handleReset = function() {
  console.log('Reset Runner …');
};


/**
 * Handles the cleanup and make sure that the Sphero stops.
 */
cwc.mode.sphero.Runner.prototype.handleCleanUp = function() {
  this.api.cleanUp();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.Runner.prototype.cleanUp = function() {
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
cwc.mode.sphero.Runner.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
