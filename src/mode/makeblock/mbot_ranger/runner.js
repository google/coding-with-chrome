/**
 * @fileoverview runner for mBot instances.
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
goog.provide('cwc.mode.makeblock.mbotRanger.Runner');

goog.require('cwc.protocol.makeblock.mbotRanger.Events');
goog.require('cwc.runner.profile.makeblock.mbotRanger.Command');
goog.require('cwc.runner.profile.makeblock.mbotRanger.Monitor');
goog.require('cwc.ui.Runner');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.makeblock.mbotRanger.Runner = function(helper, connection) {
  /** @type {string} */
  this.name = 'mBot Ranger Runner';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('mbot-ranger-runner');

  /** @type {!cwc.mode.makeblock.mbotRanger.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.makeblock.mbotRanger.Api} */
  this.api = this.connection.getApi();

  /** @type {!cwc.runner.profile.makeblock.mbotRanger.Command} */
  this.command = new cwc.runner.profile.makeblock.mbotRanger.Command(this.api);

  /** @type {!string} */
  this.sprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAA' +
    'BXAvmHAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu7' +
    '8iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PS' +
    'JhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG' +
    '1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj' +
    '4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bX' +
    'BtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAXNpQ0NQUmVjLiBJVFUtUiBCVC4yMD' +
    'IwLTEAACiRZZA9SEJRFMf/liKYQ0PU0nAh+kBU1EBqVCMRGkwMqiHQ60sFPx7vvSihoZZmoa' +
    'HdGnVvbK8tiIYIo4Z2wSX1du57hkoHDufHn//5uBeYspd4WbcDKFcMLRWPsv2DQ+ZswwYHZr' +
    'GJ1QzX1UgyuUMW/NXJ6L6Qm+LZJ2ctt3ofa7W06yh8keveDK7++yfClVN0TrVHuc1VzQBsW8' +
    'RLp4YquUA8p9FRxOeS8xbXJWctvjM96VSM+J6Y8UImR/xK7M2O6fkxLpdO+PAGeb17yB7KRa' +
    'SggMMPhgTS2IOPFIYosR8hBMz0ISgbDOXMkDVWVWtaMV8wWERVSwpLVLjfy0KBYBiQf2qN7+' +
    'ya22zzTyOtWQTiVSHE5UjzkNb8BJytkcamgZkW8DhQM1rGlEjB1MYX8N0GFsgn2d7Qj9dD1s' +
    'vcUcDxLkRnhWZdA/26ED8NIfq31PwGPFR+ATiEaGxFPxSrAAAACXBIWXMAAA7EAAAOxAGVKw' +
    '4bAAAHnElEQVRoge2Ye2wUxx3HP7v32rPPsX1+ADY2xobUxgabhjgoDxAJpHWBQKoEJUEiRS' +
    'rEKIgAfaQKFAkQjwItLSlqm6RATWpoBYJAaAoNmDQtBUVpDBjbJJxtbB6WsX1nuLu9u73b6R' +
    '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';

  /** @type {!cwc.ui.Turtle} */
  this.turtle = new cwc.ui.Turtle(helper, this.sprite);

  /** @type {!cwc.runner.profile.ev3.Command} */
  this.monitor = new cwc.runner.profile.makeblock.mbotRanger.Monitor(
    this.turtle);

  /** @type {Element} */
  this.node = null;

  /** @type {!Array} */
  this.listener = [];

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);
};


/**
 * Decorates the runner object for the mbot modification.
 * @export
 */
cwc.mode.makeblock.mbotRanger.Runner.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'runner-chrome');
  this.helper.setInstance('runner', this.runner, true);
  this.helper.setInstance('turtle', this.turtle, true);

  this.runner.addCommand('__start__', this.handleStart_, this);

  // Normal Commands
  this.runner.addCommand('setMotor', this.command.setMotor, this);

  this.runner.addCommand('movePower', this.command.movePower, this);
  this.runner.addMonitor('movePower', this.monitor.movePower, this);

  this.runner.addCommand('rotatePower', this.command.rotatePower, this);
  this.runner.addMonitor('rotatePower', this.monitor.rotatePower, this);

  this.runner.addCommand('wait', this.command.wait, this);
  this.runner.addCommand('stop', this.command.stop, this);
  this.runner.addCommand('setLEDColor', this.command.setLEDColor, this);
  this.runner.addCommand('playTone', this.command.playTone, this);

  // Events
  var apiEventHandler = this.api.getEventHandler();
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.makeblock.mbotRanger.Events.Type.BUTTON_PRESSED,
      'updateButton');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.makeblock.mbotRanger.Events.Type.LIGHTNESS_SENSOR,
      'updateLightnessSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.makeblock.mbotRanger.Events.Type.LINEFOLLOWER_SENSOR,
      'updateLinefollowerSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.makeblock.mbotRanger.Events.Type.ULTRASONIC_SENSOR,
      'updateUltrasonicSensor');

  this.runner.setCleanUpFunction(this.handleCleanUp.bind(this));
  this.runner.decorate(this.node, this.prefix);

  // Preview output
  var turtleNode = this.runner.getTurtleNode();
  this.turtle.decorate(turtleNode, this.prefix);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

};


/**
 * @private
 */
cwc.mode.makeblock.mbotRanger.Runner.prototype.handleStart_ = function() {
  this.monitor.reset();
  this.turtle.action('speed', 3);
  this.turtle.reset();
  this.api.start();
};


/**
 * Handles the cleanup and make sure that the mbot stops.
 */
cwc.mode.makeblock.mbotRanger.Runner.prototype.handleCleanUp = function() {
  this.api.cleanUp();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.makeblock.mbotRanger.Runner.prototype.cleanUp = function() {
  this.connection.cleanUp();
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
cwc.mode.makeblock.mbotRanger.Runner.prototype.addEventListener = function(src,
    type, listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
