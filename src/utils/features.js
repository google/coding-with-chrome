/**
 * @fileoverview Automatic feature detection.
 *
 * This helper class provides shortcuts to get the different of UI elements.
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
goog.provide('cwc.utils.Features');

goog.require('cwc.utils.Logger');
goog.require('goog.events.OnlineHandler');
goog.require('goog.net.NetworkStatusMonitor');


/**
 * Helper for automatic feature detection.
 * @param {string=} opt_loglevel
 * @constructor
 * @final
 * @export
 */
cwc.utils.Features = function(opt_loglevel) {
  /** @type {!string} */
  this.name = 'Features';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = opt_loglevel || 5;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @type {!string} */
  this.defaultGroup = 'general';

  /** @private {Object} */
  this.feature_ = {};

  /** @private {Object} */
  this.onlineMonitor_ = null;

  /** @private {Object} */
  this.offlineMonitor_ = null;
};


/**
 * @export
 */
cwc.utils.Features.prototype.detect = function() {
  this.detectChromeFeatures();
  this.detectOnlineStatus();
  this.detectJavaScripts();
  this.monitorOnlineStatus();
};


/**
 * Detect avalible Chrome features.
 * @param {Event=} opt_event
 * @export
 */
cwc.utils.Features.prototype.detectChromeFeatures = function(opt_event) {
  var group = 'chrome';

  // General features
  this.set('bluetooth', goog.isObject(chrome.bluetooth), group);
  this.set('bluetoothSocket', goog.isObject(chrome.bluetoothSocket), group);
  this.set('serial', goog.isObject(chrome.serial), group);
  this.set('system.memory', goog.isObject(chrome.system.memory), group);
  this.set('tts', goog.isObject(chrome.tts), group);
  this.set('usb', goog.isObject(chrome.usb), group);

  // Sockets
  this.set('sockets', goog.isObject(chrome.sockets), group);
  if (this.get('sockets', group)) {
    this.set('tcp', goog.isObject(chrome.sockets.tcp), group);
    this.set('udp', goog.isObject(chrome.sockets.udp), group);
    this.set('tcpServer', goog.isObject(chrome.sockets.tcpServer), group);
  } else {
    this.set('tcp', false, group);
    this.set('udp', false, group);
    this.set('tcpServer', false, group);
  }

  // Manifest
  this.set('manifest', goog.isObject(chrome.runtime.getManifest), group);
  if (this.get('manifest', group)) {
    var manifest = chrome.runtime.getManifest();
    this.set('oauth2', typeof manifest.oauth2 != 'undefined', group);
    this.set('key', typeof manifest.key != 'undefined', group);
  } else {
    this.set('oauth2', false, group);
    this.set('key', false, group);
  }
};


/**
 * Detect current online status.
 * @param {Event=} opt_event
 * @export
 */
cwc.utils.Features.prototype.detectJavaScripts = function(opt_event) {
  var group = 'js';
  this.set('codemirror', typeof window['CodeMirror'] != 'undefined', group);
  this.set('coffeelint', typeof window['coffeelint'] != 'undefined', group);
  this.set('coffeescript', typeof window['CoffeeScript'] != 'undefined', group);
  this.set('htmlhint', typeof window['HTMLHint'] != 'undefined', group);
  this.set('jshint', typeof window['JSHINT'] != 'undefined', group);
};


/**
 * Detect current online status.
 * @param {Event=} opt_event
 * @export
 */
cwc.utils.Features.prototype.detectOnlineStatus = function(opt_event) {
  this.set('online', window.navigator.onLine);
  this.log_.debug('Online Status:', this.get('online'));
};


/**
 * Monitors the online status.
 * @export
 */
cwc.utils.Features.prototype.monitorOnlineStatus = function() {
  var onlineHandler = new goog.events.OnlineHandler();
  if (!this.offlineMonitor_) {
    this.offlineMonitor_ = goog.events.listen(onlineHandler,
        goog.net.NetworkStatusMonitor.EventType.OFFLINE,
        this.detectOnlineStatus, false, this);
  }

  if (!this.onlineMonitor_) {
    this.onlineMonitor_ = goog.events.listen(onlineHandler,
        goog.net.NetworkStatusMonitor.EventType.ONLINE,
        this.detectOnlineStatus, false, this);
  }
};


/**
 * @param {string} name
 * @param {string=} opt_group
 * @return {string|boolean}
 * @export
 */
cwc.utils.Features.prototype.get = function(name, opt_group) {
  var group = opt_group || this.defaultGroup;
  if (!(group in this.feature_)) {
    this.log_.warn('Feature group', group, 'is unknown, yet.');
    return false;
  }

  if (name in this.feature_[group]) {
    return this.feature_[group][name];
  }
  this.log_.warn('Feature', name, 'is unknown, yet.');
  return false;
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @param {string=} opt_group
 * @export
 */
cwc.utils.Features.prototype.set = function(name, value, opt_group) {
  var group = opt_group || this.defaultGroup;
  this.log_.debug('Set', group, 'feature', name, 'to', value);
  if (!(group in this.feature_)) {
    this.feature_[group] = {};
  }
  this.feature_[group][name] = value;
};


/**
 * @export
 */
cwc.utils.Features.prototype.log = function() {
  for (var group in this.feature_) {
    if (this.feature_.hasOwnProperty(group)) {
      for (var feature in this.feature_[group]) {
        if (this.feature_[group].hasOwnProperty(feature)) {
          console.log('[', group, ']', feature, '=',
              this.feature_[group][feature]);
        }
      }
    }
  }
};
