/**
 * @fileoverview Handles the mDNS discovery.
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
goog.provide('cwc.protocol.mDNS.Api');

goog.require('cwc.utils.Logger');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.mDNS.Api = function() {
  /** @type {string} */
  this.name = 'mDNS';

  /** @type {!Object} */
  this.services = {
    '_cros_p2p._tcp.local': [],
    '_ssh._tcp.local': [],
  };

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {string} service
 * @param {Array} data
 */
cwc.protocol.mDNS.Api.prototype.updateService = function(service, data = []) {
  this.services[service] = data;
  if (data && data.length >= 1) {
    this.log_.info(service, data);
  }
};
