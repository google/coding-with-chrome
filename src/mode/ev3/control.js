/**
 * @fileoverview Control screen for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Control');

goog.require('cwc.protocol.ev3.Api');
goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.soy.mode.ev3.Control');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.ev3.Control = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Control';

  /** @type {Element} */
  this.nodeControl = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-control');

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!Array} */
  this.listener = [];

  if (!this.connection) {
    console.error('Missing connection instance !');
  }

};


/**
 * Decorates the EV3 monitor window.
 */
cwc.mode.ev3.Control.prototype.decorate = function() {
  var runnerInstance = this.helper.getInstance('runner', true);
  var runnerMonitor = runnerInstance.getMonitor();
  if (!runnerMonitor) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeControl = runnerMonitor.getControlNode();

  goog.soy.renderElement(
      this.nodeControl,
      cwc.soy.mode.ev3.Control.template, {
        'prefix': this.prefix
      }
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.ev3.Control.style({'prefix': this.prefix}));
  }

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  this.addEventHandler_();
  runnerInstance.enableMonitor(true);
};


/**
 * @private
 */
cwc.mode.ev3.Control.prototype.addEventHandler_ = function() {
  var moveLeft = goog.dom.getElement(this.prefix + 'move-left');
  var moveForward = goog.dom.getElement(this.prefix + 'move-forward');
  var moveBackward = goog.dom.getElement(this.prefix + 'move-backward');
  var moveRight = goog.dom.getElement(this.prefix + 'move-right');
  var stop = goog.dom.getElement(this.prefix + 'stop');

  // Movements
  this.addEventListener_(moveLeft, goog.events.EventType.CLICK, function() {
    this.api.rotateAngle(-45);
  }.bind(this), false, this);

  this.addEventListener_(moveForward, goog.events.EventType.CLICK, function() {
    this.api.moveSteps(50);
  }.bind(this), false, this);

  this.addEventListener_(moveBackward, goog.events.EventType.CLICK, function() {
    this.api.moveSteps(-50);
  }.bind(this), false, this);

  this.addEventListener_(moveRight, goog.events.EventType.CLICK, function() {
    this.api.rotateAngle(45);
  }.bind(this), false, this);

  this.addEventListener_(stop, goog.events.EventType.CLICK, function() {
    this.api.stop();
  }.bind(this), false, this);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Control.prototype.cleanUp = function() {
  this.helper.removeEventListeners(this.listener, this.name);
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
 * @private
 */
cwc.mode.ev3.Control.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
