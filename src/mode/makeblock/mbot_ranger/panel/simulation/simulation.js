/**
 * @fileoverview Simulation for the mBot Ranger modification.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.makeblock.mbotRanger.Simulation');

goog.require('cwc.MessengerEvents');
goog.require('cwc.mode.makeblock.mbotRanger.SimulationCommand');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Events');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.mode.makeblock.mbotRanger.Simulation = function(helper) {
  /** @type {string} */
  this.name = 'mBot Ranger Simulation';

  /** @type {string} */
  this.prefix = helper.getPrefix('mbot-ranger-simulation');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  /** @type {string} */
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

  /** @type {!cwc.mode.makeblock.mbotRanger.SimulationCommand} */
  this.commands_ = new cwc.mode.makeblock.mbotRanger.SimulationCommand(
    this.turtle);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Decorates the simulation for the mBot modification.
 * @param {!Element} node
 * @export
 */
cwc.mode.makeblock.mbotRanger.Simulation.prototype.decorate = function(node) {
  this.node = node;

  // Decorate turtle
  this.turtle.decorate(node);

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.events_.listen(layoutInstance.getEventHandler(),
        goog.events.EventType.UNLOAD, this.cleanUp);
  }

  // Command event
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    this.events_.listen(previewInstance.getEventHandler(),
        cwc.MessengerEvents.Type.COMMAND, this.handleCommand_);
  }
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.makeblock.mbotRanger.Simulation.prototype.cleanUp = function() {
  console.log('Clean up EV3 simulation ...');
  this.events_.clear();
};


/**
 * @param {!Event} e
 * @private
 */
cwc.mode.makeblock.mbotRanger.Simulation.prototype.handleCommand_ = function(
    e) {
  if (typeof this.commands_[e.data['name']] === 'undefined') {
    return;
  }
  this.commands_[e.data['name']](e.data['value']);
};
