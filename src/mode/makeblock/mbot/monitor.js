/**
 * @fileoverview Monitor layout for the mbot modification.
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
goog.provide('cwc.mode.makeblock.mbot.Monitor');

goog.require('cwc.soy.mode.makeblock.mbot.Monitor');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.makeblock.mbot.Connection} connection
 */
cwc.mode.makeblock.mbot.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'mBot Monitor';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!string} */
  this.prefix = this.helper.getPrefix('mbot-monitor');

  /** @type {!cwc.mode.makeblock.mbot.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.makeblock.mbot.Api} */
  this.api = this.connection.getApi();

  /** @type {Element} */
  this.nodeIntro = null;

  /** @type {Element} */
  this.nodeControl = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Element} */
  this.nodeMonitorUltrasonic = null;

  /** @type {goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = null;

  /** @type {!Array} */
  this.listener = [];

  /** @private {cwc.ui.RunnerMonitor} */
  this.runnerMonitor_ = null;
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.makeblock.mbot.Monitor.prototype.decorate = function() {
  let runnerInstance = this.helper.getInstance('runner', true);
  this.runnerMonitor_ = runnerInstance.getMonitor();
  if (!this.runnerMonitor_) {
    console.error('Runner Monitor is not there!', this.runnerMonitor_);
    return;
  }

  this.nodeIntro = this.runnerMonitor_.getIntroNode();
  this.nodeMonitor = this.runnerMonitor_.getMonitorNode();
  this.nodeControl = this.runnerMonitor_.getControlNode();
  this.runnerMonitor_.showCalibrationTab(false);
  this.runnerMonitor_.showMonitorTab(false);

  goog.soy.renderElement(
      this.nodeIntro,
      cwc.soy.mode.makeblock.mbot.Monitor.intro,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeMonitor,
      cwc.soy.mode.makeblock.mbot.Monitor.monitor,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeControl,
      cwc.soy.mode.makeblock.mbot.Monitor.control,
      {'prefix': this.prefix}
  );

  this.nodeMonitorUltrasonic = goog.dom.getElement(this.prefix + 'ultrasonic');

  // Update events
  // var eventHandler = this.connection.getEventHandler();

  // Unload event
  let layoutInstance = this.helper.getInstance('layout', true);
  let layoutEventHandler = layoutInstance.getEventHandler();
  this.addEventListener_(layoutEventHandler, goog.events.EventType.UNLOAD,
    this.cleanUp, false, this);

  this.addEventHandler_();
  this.addKeyHandler_();
  runnerInstance.enableMonitor(true);
  layoutInstance.refresh();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.makeblock.mbot.Monitor.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * @private
 */
cwc.mode.makeblock.mbot.Monitor.prototype.addEventHandler_ = function() {
  // Movements
  this.addEventListener_('move-left', goog.events.EventType.CLICK, function() {
    this.api.setLeftMotorPower(85);
    this.api.setRightMotorPower(85);
  }.bind(this), false, this);

  this.addEventListener_('move-forward', goog.events.EventType.CLICK,
    function() {
      this.api.setLeftMotorPower(-85);
      this.api.setRightMotorPower(85);
    }.bind(this), false, this);

  this.addEventListener_('move-backward', goog.events.EventType.CLICK,
    function() {
      this.api.setLeftMotorPower(85);
      this.api.setRightMotorPower(-85);
    }.bind(this), false, this);

  this.addEventListener_('move-right', goog.events.EventType.CLICK, function() {
    this.api.setLeftMotorPower(-85);
    this.api.setRightMotorPower(-85);
  }.bind(this), false, this);

  // Ping
  this.addEventListener_('ping', goog.events.EventType.CLICK, function() {
    this.api.playTone(588, 240);
  }.bind(this), false, this);

  // Stop
  this.addEventListener_('stop', goog.events.EventType.CLICK, function() {
    this.connection.stop();
  }.bind(this), false, this);
};


/**
 * @private
 */
cwc.mode.makeblock.mbot.Monitor.prototype.addKeyHandler_ = function() {
  this.shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  this.shortcutHandler.registerShortcut('backward', 'down');
  this.shortcutHandler.registerShortcut('left', 'left');
  this.shortcutHandler.registerShortcut('right', 'right');
  this.shortcutHandler.registerShortcut('forward', 'up');

  this.shortcutHandler.registerShortcut('boost-backward', 'shift+down');
  this.shortcutHandler.registerShortcut('boost-left', 'shift+left');
  this.shortcutHandler.registerShortcut('boost-right', 'shift+right');
  this.shortcutHandler.registerShortcut('boost-forward', 'shift+up');

  this.shortcutHandler.registerShortcut('stop', 'space');

  goog.events.listen(this.shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_, false, this);
};


/**
 * Handles keyboard shortcuts.
 * @param {event} event
 * @private
 */
cwc.mode.makeblock.mbot.Monitor.prototype.handleKeyboardShortcut_ = function(
    event) {
  if (!this.runnerMonitor_.isControlActive()) {
    return;
  }

  let normalSpeed = 85;
  let boostedSpeed = 255;

  switch (event.identifier) {

    // Normal speed
    case 'forward':
      this.api.setLeftMotorPower(-normalSpeed);
      this.api.setRightMotorPower(normalSpeed);
      break;
    case 'right':
      this.api.setLeftMotorPower(-normalSpeed);
      this.api.setRightMotorPower(-normalSpeed);
      break;
    case 'backward':
      this.api.setLeftMotorPower(normalSpeed);
      this.api.setRightMotorPower(-normalSpeed);
      break;
    case 'left':
      this.api.setLeftMotorPower(normalSpeed);
      this.api.setRightMotorPower(normalSpeed);
      break;

    // Boosted speed
    case 'boost-forward':
      this.api.setLeftMotorPower(-boostedSpeed);
      this.api.setRightMotorPower(boostedSpeed);
      break;
    case 'boost-right':
      this.api.setLeftMotorPower(-boostedSpeed);
      this.api.setRightMotorPower(-boostedSpeed);
      break;
    case 'boost-backward':
      this.api.setLeftMotorPower(boostedSpeed);
      this.api.setRightMotorPower(-boostedSpeed);
      break;
    case 'boost-left':
      this.api.setLeftMotorPower(boostedSpeed);
      this.api.setRightMotorPower(boostedSpeed);
      break;

    case 'stop':
      this.connection.stop();
      break;
    default:
      console.info(event.identifier);
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable|string} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.mode.makeblock.mbot.Monitor.prototype.addEventListener_ = function(src,
    type, listener, opt_useCapture, opt_listenerScope) {
  let target = goog.isString(src) ?
    goog.dom.getElement(this.prefix + src) : src;
  let eventListener = goog.events.listen(target, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
