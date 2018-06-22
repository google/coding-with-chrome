/**
 * @fileoverview Calibration pane for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Calibration');

goog.require('cwc.soy.mode.sphero.Calibration');
goog.require('cwc.utils.Events');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.sphero.classic.Connection|
 *   cwc.mode.sphero.bb8.Connection|
 *   cwc.mode.sphero.sprkPlus.Connection|
 *   cwc.mode.sphero.ollie.Connection} connection
 */
cwc.mode.sphero.Calibration = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero Calibration';

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-calibration');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeSlider = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /**
   * @type {!cwc.mode.sphero.classic.Connection|
   *   cwc.mode.sphero.bb8.Connection|
   *   cwc.mode.sphero.sprkPlus.Connection|
   *   cwc.mode.sphero.ollie.Connection}
   */
  this.connection = connection;

  /** @type {!cwc.protocol.sphero.classic.Api} */
  this.api = this.connection.getApi();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @private {cwc.ui.Message} */
  this.messageInstance_ = null;
};


/**
 * Decorates the Sphero Calibration window.
 * @param {!Element} node
 * @export
 */
cwc.mode.sphero.Calibration.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.sphero.Calibration.template, {
      prefix: this.prefix,
    }
  );

  this.nodeSlider = goog.dom.getElement(this.prefix + 'calibration-slide');
  this.messageInstance_ = this.helper.getInstance('message');

  this.addEventHandler_();
  this.addKeyHandler_();
};


/**
 * @private
 */
cwc.mode.sphero.Calibration.prototype.addEventHandler_ = function() {
  this.events_.listen(
    this.nodeSlider, goog.events.EventType.INPUT, function(e) {
      this.api.exec('calibrate', {'heading': e.target.value});
    });

  this.events_.listen(
    this.nodeSlider, goog.events.EventType.MOUSEUP, function() {
      this.api.exec('setCalibration');
    });
};


/**
 * @private
 */
cwc.mode.sphero.Calibration.prototype.addKeyHandler_ = function() {
  let shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  shortcutHandler.registerShortcut('left', 'left');
  shortcutHandler.registerShortcut('right', 'right');

  this.events_.listen(shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_);
};


/**
 * Handles keyboard shortcuts.
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.mode.sphero.Calibration.prototype.handleKeyboardShortcut_ = function(
    event) {
  if (!this.messageInstance_.isCalibrationActive() ||
      event.target.tagName === 'INPUT') {
    return;
  }

  switch (event.identifier) {
    case 'right':
      this.nodeSlider['MaterialSlider']['change'](++this.nodeSlider.value);
      break;
    case 'left':
      this.nodeSlider['MaterialSlider']['change'](--this.nodeSlider.value);
      break;
    default:
      console.info(event.identifier);
  }

  if (this.nodeSlider.value) {
    console.log(this.nodeSlider.value);
    this.api.exec('calibrate', {'heading': this.nodeSlider.value});
  }
};
