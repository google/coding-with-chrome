/**
 * @fileoverview Layout for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Connection');

goog.require('cwc.protocol.ev3.Api');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.ev3.Connection = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.ConnectionManager} */
  this.connectionManager = helper.getInstance('connectionManager');
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.init = function() {
  console.log('Connect to the EV3 unit ...');
  var ev3Instance = this.helper.getInstance('ev3', true);
  ev3Instance.autoConnect();
};
