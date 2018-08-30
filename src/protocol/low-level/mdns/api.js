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
goog.require('cwc.utils.EventData');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.mDNS.Api = function() {
  /** @type {string} */
  this.name = 'mDNS';

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @private {!Object} */
  this.services_ = {};

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Updates the list of hosts associated with the given service. Should be called
 * from the onServiceList handler of chrome.mdns.
 * @param {string} service
 * @param {Array} data
 */
cwc.protocol.mDNS.Api.prototype.updateService_ = function(service, data = []) {
  this.services_[service] = data;
  this.eventHandler.dispatchEvent(new cwc.utils.EventData(service, data));
  if (data && data.length >= 1) {
    this.log_.info(service, data);
  }
};


/**
 * Returns the list of hosts associated with the given service.
 * @param {string} service
 * @returns {Array}
 * @export
 */
cwc.protocol.mDNS.Api.prototype.getServiceList = function(service) {
  if (!this.services_[service]) {
    this.services_[service] = [];
  }
  return this.services_[service];
};


/**
 * Forces an immediate rescan / discovery of services.
 * @param {string} service
 * @returns {Array}
 * @export
 */
cwc.protocol.mDNS.Api.prototype.forceDiscovery = function() {
  if (chrome.mdns) {
    chrome.mdns.forceDiscovery();
  }
};


/**
 * Returns the event handler.
 * @return {goog.events.EventTarget}
 * @export
 */
cwc.protocol.aiy.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};
