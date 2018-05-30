/**
 * @fileoverview Simulation for the EV3 modification.
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
goog.provide('cwc.mode.lego.ev3.Simulation');

goog.require('cwc.MessengerEvents');
goog.require('cwc.mode.lego.ev3.SimulationCommand');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Events');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.mode.lego.ev3.Simulation = function(helper) {
  /** @type {string} */
  this.name = 'EV3 Simulation';

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-simulation');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!string} */
  this.sprite = ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAWCAMAA' +
    'AACYceEAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAEVAAABFQEpfgIbAAAAGXRFWHRTb2Z0d' +
    '2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAMxQTFRFAAAAAAAAYGBgcXFxZmZmdHR0iXZ2j' +
    '4BwgICAioqKhISEhISElnZcmnFZkJCQl5eXjIyMi4uLmZmZmpqamJiYpKSkn5+fmJiYp6enp' +
    'qamqampp6enw4lgzoZYr6+vsLCwr6+vrq6upKSk1YdS14VOxoFSuLi4tbW1t7e3tLS04IFD4' +
    'INEurq6v7+/u7u7vr6+w8PDwsLCwsLCw8PDv7+/83opxsbGx8fHyMjI9HUhyMjIwbClwrGm+' +
    'HEW+W8TxbGjy8vLzMzM/mcC/2YAuorQHQAAAD90Uk5TAAEICQoLDRAWGBsdJysuMTM3NzpUV' +
    'FhcdHV5en+Dk5SZmqqsrbS4ub3Dz8/V1tjZ6Ors7u/2+Pj5+fr7/P39zRrHRwAAAJNJREFUG' +
    'BltwQUCgkAUBcCH3d0tdncX33//OymKsgs7A4HW06BWe9ahFNjxKQiVDjN3oRC7MfM9DrcJm' +
    '8ZwyVwepmsWTkP6GmmQFQ2yFCDxzuhn4YeoSrYKBJE12TZR2NokauEvtSfROY2fPskGsOQMk' +
    'hl5fHim5DT3wVQmtxLeQktyW4UBNEmlASQOpHJMQt+q6S/tLkQmfwmdrwAAAABJRU5ErkJgg' +
    'g==';

  /** @type {!cwc.ui.Turtle} */
  this.turtle = new cwc.ui.Turtle(helper, this.sprite);

  /** @type {!cwc.mode.lego.ev3.SimulationCommand} */
  this.commands_ = new cwc.mode.lego.ev3.SimulationCommand(this.turtle);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Decorates the simulation for the EV3 modification.
 * @param {!Element} node
 * @export
 */
cwc.mode.lego.ev3.Simulation.prototype.decorate = function(node) {
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
cwc.mode.lego.ev3.Simulation.prototype.cleanUp = function() {
  console.log('Clean up EV3 simulation ...');
  this.events_.clear();
};


/**
 * @param {!Event} e
 * @private
 */
cwc.mode.lego.ev3.Simulation.prototype.handleCommand_ = function(e) {
  if (typeof this.commands_[e.data['name']] === 'undefined') {
    return;
  }
  this.commands_[e.data['name']](e.data['value']);
};
