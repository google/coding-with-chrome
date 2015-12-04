/**
 * @fileoverview Layout for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Connection');

goog.require('cwc.protocol.sphero.Api');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.Connection = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.ConnectionManager} */
  this.connectionManager = helper.getInstance('connectionManager');
};


/**
 * Connects the Sphero unit.
 */
cwc.mode.sphero.Connection.prototype.init = function() {
  console.log('Connect to the Sphero unit ...');
  var spheroInstance = this.helper.getInstance('sphero', true);
  spheroInstance.autoConnect();
};
