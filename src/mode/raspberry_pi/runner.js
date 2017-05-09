/**
 * @fileoverview Runner for the Raspberry Pi modification.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.raspberryPi.Runner');

goog.require('cwc.runner.profile.raspberryPi.Command');
goog.require('cwc.ui.Runner');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.raspberryPi.Connection} connection
 * @struct
 * @final
 */
cwc.mode.raspberryPi.Runner = function(helper, connection) {
  /** @type {string} */
  this.name = 'Raspberry Pi Runner';

  /** @type {string} */
  this.prefix = helper.getPrefix('raspberry_pi');

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.mode.raspberryPi.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.raspberryPi.Api} */
  this.api = this.connection.getApi();

  /** @private {!Array} */
  this.listener_ = [];

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);
};


/**
 * Decorates the runner object for the Raspberry Pi modification.
 * @export
 */
cwc.mode.raspberryPi.Runner.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'runner-chrome');

  // Commands
  this.runner.addCommandProfile(
    new cwc.runner.profile.raspberryPi.Command(this.api));

  // Events
  let apiEventHandler = this.api.getEventHandler();
  if (!apiEventHandler) {
    console.error('Raspberry Pi API event handler is not defined!');
  }
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.raspberryPi.Events.Type.RECIEVED_DATA,
      'recievedData');

  this.helper.setInstance('runner', this.runner, true);
  this.runner.decorate(this.node);
};
