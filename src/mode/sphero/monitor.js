/**
 * @fileoverview Monitor layout for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Monitor');

goog.require('cwc.protocol.sphero.Events');
goog.require('cwc.soy.mode.sphero.Monitor');
goog.require('cwc.ui.Helper');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero Monitor';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!string} */
  this.prefix = this.helper.getPrefix('sphero-monitor');

  /** @type {!cwc.mode.sphero.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.sphero.Api} */
  this.api = this.connection.getApi();

  /** @type {Element} */
  this.nodeIntro = null;

  /** @type {Element} */
  this.nodeControl = null;

  /** @type {Element} */
  this.nodeCalibration = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Element} */
  this.nodeMonitorLocation = null;

  /** @type {goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {!Array} */
  this.listener = [];

  /** @private {cwc.ui.RunnerMonitor} */
  this.runnerMonitor_ = null;
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.sphero.Monitor.prototype.decorate = function() {
  var runnerInstance = this.helper.getInstance('runner', true);
  this.runnerMonitor_ = runnerInstance.getMonitor();
  if (!this.runnerMonitor_) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeIntro = this.runnerMonitor_.getIntroNode();
  this.nodeMonitor = this.runnerMonitor_.getMonitorNode();
  this.nodeCalibration = this.runnerMonitor_.getCalibrationNode();
  this.nodeControl = this.runnerMonitor_.getControlNode();

  goog.soy.renderElement(
      this.nodeIntro,
      cwc.soy.mode.sphero.Monitor.intro,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeCalibration,
      cwc.soy.mode.sphero.Monitor.calibration,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeMonitor,
      cwc.soy.mode.sphero.Monitor.monitor,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeControl,
      cwc.soy.mode.sphero.Monitor.control,
      {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.sphero.Monitor.style({'prefix': this.prefix}));
  }

  this.nodeMonitorLocation = goog.dom.getElement(this.prefix + 'location');
  this.nodeMonitorVelocity = goog.dom.getElement(this.prefix + 'velocity');
  this.nodeMonitorSpeed = goog.dom.getElement(this.prefix + 'speed');

  // Update events
  var eventHandler = this.connection.getEventHandler();
  this.addEventListener_(eventHandler,
      cwc.protocol.sphero.Events.Type.CHANGED_LOCATION,
      this.updateLocationData_, false, this);

  this.addEventListener_(eventHandler,
      cwc.protocol.sphero.Events.Type.CHANGED_VELOCITY,
      this.updateVelocityData_, false, this);

  this.addEventListener_(eventHandler,
      cwc.protocol.sphero.Events.Type.CHANGED_SPEED,
      this.updateSpeedData_, false, this);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout', true);
  var layoutEventHandler = layoutInstance.getEventHandler();
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
cwc.mode.sphero.Monitor.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addEventHandler_ = function() {

  // Movements
  this.addEventListener_('move-left', goog.events.EventType.CLICK, function() {
    this.api.roll(50, 270);
  }.bind(this), false, this);

  this.addEventListener_('move-forward', goog.events.EventType.CLICK,
    function() {
      this.api.roll(50, 0);
    }.bind(this), false, this);

  this.addEventListener_('move-backward', goog.events.EventType.CLICK,
    function() {
      this.api.roll(50, 180);
    }.bind(this), false, this);

  this.addEventListener_('move-right', goog.events.EventType.CLICK, function() {
    this.api.roll(50, 90);
  }.bind(this), false, this);

  // Stop
  this.addEventListener_('stop', goog.events.EventType.CLICK, function() {
    this.connection.stop();
  }.bind(this), false, this);

  // Sleep
  this.addEventListener_('sleep', goog.events.EventType.CLICK, function() {
    this.api.sleep();
  }.bind(this), false, this);

  // Calibration slide
  var calibrationSlide = goog.dom.getElement(this.prefix + 'calibration-slide');
  this.addEventListener_(
    calibrationSlide, goog.events.EventType.INPUT, function(e) {
      this.api.calibrate(e.target.value);
    }, false, this);

  this.addEventListener_(
    calibrationSlide, goog.events.EventType.CHANGE, function(opt_e) {
      this.api.setCalibration();
    }, false, this);

};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addKeyHandler_ = function() {
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
 * Updates the location data in monitor tab.
 * @param {Event} e
 * @private
 */
cwc.mode.sphero.Monitor.prototype.updateLocationData_ = function(e) {
  if (this.runnerMonitor_.isMonitorActive()) {
    goog.soy.renderElement(
        this.nodeMonitorLocation,
        cwc.soy.mode.sphero.Monitor.locationData,
        {'prefix': this.prefix, 'data': e.data}
    );
  }
};


/**
 * Updates the velocity data in monitor tab.
 * @param {Event} e
 * @private
 */
cwc.mode.sphero.Monitor.prototype.updateVelocityData_ = function(e) {
  if (this.runnerMonitor_.isMonitorActive()) {
    goog.soy.renderElement(
        this.nodeMonitorVelocity,
        cwc.soy.mode.sphero.Monitor.velocityData,
        {'prefix': this.prefix, 'data': e.data}
    );
  }
};


/**
 * Updates the speed data in monitor tab.
 * @param {Event} e
 * @private
 */
cwc.mode.sphero.Monitor.prototype.updateSpeedData_ = function(e) {
  if (this.runnerMonitor_.isMonitorActive()) {
    goog.soy.renderElement(
        this.nodeMonitorSpeed,
        cwc.soy.mode.sphero.Monitor.speedData,
        {'prefix': this.prefix, 'data': e.data}
    );
  }
};


/**
 * Handles keyboard shortcuts.
 * @private
 */
cwc.mode.sphero.Monitor.prototype.handleKeyboardShortcut_ = function(event) {
  if (!this.runnerMonitor_.isControlActive()) {
    return;
  }

  var normalSpeed = 50;
  var boostedSpeed = 255;

  switch (event.identifier) {

    // Normal speed
    case 'forward':
      this.api.roll(normalSpeed, 0);
      break;
    case 'right':
      this.api.roll(normalSpeed, 90);
      break;
    case 'backward':
      this.api.roll(normalSpeed, 180);
      break;
    case 'left':
      this.api.roll(normalSpeed, 270);
      break;

    // Boosted speed
    case 'boost-forward':
      this.api.roll(boostedSpeed, 0);
      break;
    case 'boost-right':
      this.api.roll(boostedSpeed, 90);
      break;
    case 'boost-backward':
      this.api.roll(boostedSpeed, 180);
      break;
    case 'boost-left':
      this.api.roll(boostedSpeed, 270);
      break;

    case 'stop':
      this.api.boost(false);
      this.api.roll(0);
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
cwc.mode.sphero.Monitor.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var target = goog.isString(src) ?
    goog.dom.getElement(this.prefix + src) : src;
  var eventListener = goog.events.listen(target, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
