/**
 * @fileoverview Automatic feature detection.
 *
 * This helper class provides shortcuts to get the different of UI elements.
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
goog.provide('cwc.utils.Features');

goog.require('cwc.utils.Logger');
goog.require('goog.events.OnlineHandler');
goog.require('goog.net.NetworkStatusMonitor');



/**
 * Helper for automatic feature detection.
 * @return {!cwc.utils.Features}
 * @constructor
 * @final
 * @export
 */
cwc.utils.Features = function() {
  /** @type {!string} */
  this.name = 'Features';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = cwc.utils.LogLevel.NOTICE;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @type {!string} */
  this.defaultGroup = 'general';

  /** @type {!string} */
  this.browserGroup = 'browser';

  /** @type {!string} */
  this.chromeGroup = 'chrome';

  /** @type {!string} */
  this.javaScriptGroup = 'javascript';

  /** @private {Object} */
  this.feature_ = {};

  /** @private {Object} */
  this.onlineMonitor_ = null;

  /** @private {Object} */
  this.offlineMonitor_ = null;

  this.detectFeatures();
};


/**
 * @export
 */
cwc.utils.Features.prototype.detectFeatures = function() {
  console.log('Detecting features ...');
  this.detectChromeFeatures();
  this.detectBrowserFeatures();
  this.detectOnlineStatus();
  this.detectJavaScripts();
  this.monitorOnlineStatus();
  this.log();
};


/**
 * Detect available Chrome features.
 * @param {Event=} opt_event
 * @export
 */
cwc.utils.Features.prototype.detectBrowserFeatures = function(opt_event) {

  // Storage features.
  this.setBrowserFeature('storage', typeof Storage);
  this.setBrowserFeature('globalStorage', typeof globalStorage);
  this.setBrowserFeature('localStorage', false);
  if (!this.getChromeFeature('storage.localStorage')) {
    this.setBrowserFeature('localStorage', typeof localStorage);
  }
  this.setBrowserFeature('sessionStorage', typeof sessionStorage);

  // General features.
  this.setBrowserFeature('Promise', typeof Promise);

  // Communication features
  this.setBrowserFeature('bluetooth', typeof navigator.bluetooth);
};


/**
 * Detect available Chrome features.
 * @param {Event=} opt_event
 * @export
 */
cwc.utils.Features.prototype.detectChromeFeatures = function(opt_event) {
  if (typeof chrome == 'undefined') {
    this.feature_['chrome'] = {};
    return;
  }

  // App features
  this.setChromeFeature('app', typeof chrome.app);
  if (this.getChromeFeature('app')) {
    this.setChromeFeature('app.window', typeof chrome.app.window);
  }

  // General features.
  this.setChromeFeature('bluetooth', typeof chrome.bluetooth);
  this.setChromeFeature('bluetoothSocket', typeof chrome.bluetoothSocket);
  this.setChromeFeature('serial', typeof chrome.serial);

  // System features.
  this.setChromeFeature('system', typeof chrome.system);
  this.setChromeFeature('system.memory', false);
  if (this.getChromeFeature('system')) {
    this.setChromeFeature('system.memory', typeof chrome.system.memory);
  }

  // Misc features.
  this.setChromeFeature('i18n', typeof chrome.i18n);
  this.setChromeFeature('runtime', typeof chrome.runtime);
  this.setChromeFeature('tts', typeof chrome.tts);
  this.setChromeFeature('usb', typeof chrome.usb);

  // Storage features.
  this.setChromeFeature('storage', typeof chrome.storage);
  this.setChromeFeature('storage.localStorage', false);
  if (this.getChromeFeature('storage')) {
    this.setChromeFeature('storage.localStorage', typeof chrome.storage.local);
  }

  // Sockets features.
  this.setChromeFeature('sockets', typeof chrome.sockets);
  this.setChromeFeature('sockets.tcp', false);
  this.setChromeFeature('sockets.udp', false);
  this.setChromeFeature('sockets.tcpServer', false);
  if (this.getChromeFeature('sockets')) {
    this.setChromeFeature('sockets.tcp', typeof chrome.sockets.tcp);
    this.setChromeFeature('sockets.udp', typeof chrome.sockets.udp);
    this.setChromeFeature('sockets.tcpServer', typeof chrome.sockets.tcpServer);
  }

  // Manifest options.
  this.setChromeFeature('manifest', typeof chrome.runtime.getManifest);
  this.setChromeFeature('manifest.oauth2', false);
  this.setChromeFeature('manifest.key', false);
  if (this.getChromeFeature('manifest')) {
    var manifest = chrome.runtime.getManifest();
    this.setChromeFeature('manifest.oauth2', typeof manifest.oauth2);
    this.setChromeFeature('manifest.key', typeof manifest.key);
  }
};


/**
 * Detect available JavaScript frameworks.
 * @param {Event=} opt_event
 * @export
 */
cwc.utils.Features.prototype.detectJavaScripts = function(opt_event) {
  this.setJavaScriptFeature('blockly', typeof window['Blockly']);
  this.setJavaScriptFeature('codemirror', typeof window['CodeMirror']);
  this.setJavaScriptFeature('coffeelint', typeof window['coffeelint']);
  this.setJavaScriptFeature('coffeescript', typeof window['CoffeeScript']);
  this.setJavaScriptFeature('htmlhint', typeof window['HTMLHint']);
  this.setJavaScriptFeature('i18next', typeof window['i18next']);
  this.setJavaScriptFeature('jshint', typeof window['JSHINT']);
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
 * @return {boolean}
 * @export
 */
cwc.utils.Features.prototype.get = function(name, opt_group) {
  var group = opt_group || this.defaultGroup;
  if (!(group in this.feature_)) {
    this.log_.warn('Feature group', group, 'is unknown!');
    return false;
  }
  if (name in this.feature_[group]) {
    return this.feature_[group][name] || false;
  }
  this.log_.warn('Feature', name, 'is undetected!');
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
  var state = value;
  if (value == 'undefined') {
    state = false;
  } else if (value == 'object' || value == 'function') {
    state = true;
  }
  this.feature_[group][name] = state;
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Features.prototype.getBrowserFeature = function(name) {
  return this.get(name, this.browserGroup);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Features.prototype.getChromeFeature = function(name) {
  return this.get(name, this.chromeGroup);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Features.prototype.getJavaScriptFeature = function(name) {
  return this.get(name, this.javaScriptGroup);
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @export
 */
cwc.utils.Features.prototype.setBrowserFeature = function(name, value) {
  return this.set(name, value, this.browserGroup);
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @export
 */
cwc.utils.Features.prototype.setChromeFeature = function(name, value) {
  return this.set(name, value, this.chromeGroup);
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @export
 */
cwc.utils.Features.prototype.setJavaScriptFeature = function(name, value) {
  return this.set(name, value, this.javaScriptGroup);
};


/**
 * @export
 */
cwc.utils.Features.prototype.log = function() {
  for (let group in this.feature_) {
    if (this.feature_.hasOwnProperty(group)) {
      for (let feature in this.feature_[group]) {
        if (this.feature_[group].hasOwnProperty(feature)) {
          console.log('[', group, ']', feature, '=',
              this.feature_[group][feature]);
        }
      }
    }
  }
};
