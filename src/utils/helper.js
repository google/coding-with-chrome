/**
 * @fileoverview Helper for the Coding with Chrome editor.
 *
 * This helper class provides shortcuts to get the implemented instances and
 * make sure that they have the correct type.
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
goog.provide('cwc.utils.Helper');
goog.provide('cwc.utils.HelperInstances');

goog.require('cwc.config.Debug');
goog.require('cwc.config.Default');
goog.require('cwc.config.Prefix');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Features');
goog.require('cwc.utils.Logger');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @typedef {cwc.addon.Message}
 */
cwc.utils.AddonInstance;


/**
 * @typedef {cwc.ui.Account|
 *   cwc.file.File|
 *   cwc.fileHandler.FileExporter|
 *   cwc.fileHandler.FileLoader|
 *   cwc.fileHandler.FileSaver|
 *   cwc.mode.Modder|
 *   cwc.protocol.arduino.Api|
 *   cwc.protocol.bluetooth.classic.Api|
 *   cwc.protocol.lego.ev3.Api|
 *   cwc.protocol.serial.Api|
 *   cwc.renderer.Renderer|
 *   cwc.ui.Blockly|
 *   cwc.ui.Debug|
 *   cwc.ui.Documentation|
 *   cwc.ui.Editor|
 *   cwc.ui.Experimental|
 *   cwc.ui.GDrive|
 *   cwc.ui.Gui|
 *   cwc.ui.Help|
 *   cwc.ui.Layout|
 *   cwc.ui.Library|
 *   cwc.ui.Menubar|
 *   cwc.ui.Navigation|
 *   cwc.ui.Notification|
 *   cwc.ui.Notification|
 *   cwc.ui.Preview|
 *   cwc.ui.SelectScreen|
 *   cwc.ui.SettingScreen|
 *   cwc.ui.Turtle|
 *   cwc.ui.Tutorial|
 *   cwc.ui.connectScreen.Screens|
 *   cwc.utils.Dialog}
 */
cwc.utils.HelperInstance;


/**
 * Helper for all the ui parts and modules.
 * @constructor
 * @final
 * @export
 */
cwc.utils.Helper = function() {
  /** @type {!string} */
  this.name = 'Helper';

  /** @private {!cwc.utils.Features} */
  this.features_ = new cwc.utils.Features();

  /** @private {string} */
  this.prefix_ = cwc.config.Prefix.GENERAL || '';

  /** @private {string} */
  this.cssPrefix_ = cwc.config.Prefix.CSS || '';

  /** @private {Object<string, cwc.utils.HelperInstance>} */
  this.instances_ = {};

  /** @private {Object<string, cwc.utils.AddonInstance>} */
  this.addones_ = {};

  /** @private {Object} */
  this.hadFirstRun_ = {};

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {!string} name
 * @param {!cwc.utils.AddonInstance} instance
 * @param {boolean=} overwrite
 * @export
 */
cwc.utils.Helper.prototype.setAddon = function(name, instance,
    overwrite = false) {
  if (this.addones_[name] && !overwrite) {
    this.log_.error('Addon', name, ' already exists!');
  }
  this.log_.debug('Set', name, 'addon to', instance);
  this.addones_[name] = instance;
};


/**
 * @param {!string} name
 * @param {boolean=} required
 * @return {cwc.utils.AddonInstance}
 * @export
 */
cwc.utils.Helper.prototype.getAddon = function(name, required = false) {
  if (required) {
    if (typeof this.addones_[name] == 'undefined') {
      throw new Error('Addon ' + name + ' is not defined!');
    } else if (!this.addones_[name]) {
      throw new Error('Addon ' + name + ' is not initialized yet.');
    }
  }
  return this.addones_[name] || null;
};


/**
 * @param {!string} name
 * @export
 */
cwc.utils.Helper.prototype.prepareAddon = function(name) {
  let instance = this.getAddon(name);
  if (instance) {
    instance.prepare();
  }
};


/**
 * @param {!string} name
 * @export
 */
cwc.utils.Helper.prototype.clearInstance = function(name) {
  if (!(name in this.instances_)) {
    return;
  }
  this.log_.debug('Clear', name, 'instance');
  this.instances_[name] = null;
  delete this.instances_[name];
};


/**
 * @param {!string} name
 * @param {!cwc.utils.HelperInstance} instance
 * @param {boolean=} overwrite
 * @return {!cwc.utils.HelperInstance}
 * @export
 */
cwc.utils.Helper.prototype.setInstance = function(name, instance,
    overwrite = false) {
  if (this.instances_[name] && !overwrite) {
    this.log_.error('Instance', name, ' already exists!');
  }
  this.log_.debug('Set', name, 'instance to', instance);
  this.instances_[name] = instance;
  return this.instances_[name];
};


/**
 * @param {!string} name
 * @param {boolean=} required
 * @return {cwc.utils.HelperInstance}
 * @export
 */
cwc.utils.Helper.prototype.getInstance = function(name, required = false) {
  if (required) {
    if (typeof this.instances_[name] == 'undefined') {
      throw new Error('Instance ' + name + ' is not defined!');
    } else if (!this.instances_[name]) {
      throw new Error('Instance ' + name + ' is not initialized yet.');
    }
  }
  return this.instances_[name] || null;
};


/**
 * @param {!string} name
 * @param {Element|string} element
 */
cwc.utils.Helper.prototype.decorateInstance = function(name, element) {
  let node = goog.dom.getElement(element);
  let instance = this.getInstance(name);
  if (node && instance && typeof instance.decorate === 'function') {
    instance.decorate(node);
  }
};


/**
 * @return {!string}
 */
cwc.utils.Helper.prototype.getUserLanguage = function() {
  let languageInstance = this.getInstance('language');
  if (languageInstance) {
    return languageInstance.getUserLanguage();
  }
  return cwc.config.Default.LANGUAGE || '';
};


/**
 * Shows an error message over the notification instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showError = function(msg) {
  let notificationInstance = this.getInstance('notification');
  if (notificationInstance) {
    notificationInstance.error(msg);
  } else {
    this.log_.error(msg);
  }
};


/**
 * Shows a warning message over the notification instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showWarning = function(msg) {
  let notificationInstance = this.getInstance('notification');
  if (notificationInstance) {
    notificationInstance.warning(msg);
  } else {
    this.log_.warn(msg);
  }
};


/**
 * Shows an info message over the notification instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showInfo = function(msg) {
  let notificationInstance = this.getInstance('notification');
  if (notificationInstance) {
    notificationInstance.info(msg);
  } else {
    this.log_.info(msg);
  }
};


/**
 * Shows an success message over the notification instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showSuccess = function(msg) {
  let notificationInstance = this.getInstance('notification');
  if (notificationInstance) {
    notificationInstance.success(msg);
  } else {
    this.log_.info(msg);
  }
};


/**
 * Removes all defined event listeners in the provided list.
 * @param {Array} events
 * @param {string=} name
 * @return {!Array} empty array
 */
cwc.utils.Helper.prototype.removeEventListeners = function(events, name = '') {
  if (events) {
    this.log_.debug('Clearing', events.length, 'events listener',
        (name) ? ' for ' + name : '');
    goog.array.forEach(events, function(listener) {
      goog.events.unlistenByKey(listener);
    });
  }
  return [];
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkBrowserFeature = function(name) {
  return this.features_.getBrowserFeature(name);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkChromeFeature = function(name) {
  return this.features_.getChromeFeature(name);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkJavaScriptFeature = function(name) {
  return this.features_.getJavaScriptFeature(name);
};


/**
 * @param {string} name
 * @param {string=} group
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkFeature = function(name, group = undefined) {
  return this.features_.get(name, group) || false;
};


/**
 * @return {!string}
 * @export
 */
cwc.utils.Helper.prototype.getBaseURL = function() {
  let serverInstance = this.getInstance('server');
  let baseURL = serverInstance ? serverInstance.getRootURL() : '';
  if (!baseURL && window.location.host.includes(':')) {
    baseURL = 'http://' + window.location.host;
  }
  return baseURL;
};


/**
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.getManifest = function() {
  return this.checkChromeFeature('manifest') &&
      chrome.runtime.getManifest();
};


/**
 * @return {!string}
 * @export
 */
cwc.utils.Helper.prototype.getAppVersion = function() {
  let manifest = this.getManifest();
  if (manifest) {
    return manifest['version'];
  }
  return String(new Date().getTime());
};


/**
 * @param {string=} optName
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.debugEnabled = function(optName) {
  let debugInstance = this.getInstance('debug');
  if (debugInstance) {
    return debugInstance.isEnabled(optName);
  }
  return false;
};


/**
 * @param {string=} optName
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.experimentalEnabled = function(optName) {
  let experimentalInstance = this.getInstance('experimental');
  if (experimentalInstance) {
    return experimentalInstance.isEnabled(optName);
  }
  return false;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.isGoogleAccountEnabled = function() {
  let accountInstance = this.getInstance('account');
  if (accountInstance) {
    return accountInstance.isAuthenticated();
  }
  return false;
};


/**
 * @param {string=} additionalPrefix
 * @return {string}
 * @export
 */
cwc.utils.Helper.prototype.getPrefix = function(additionalPrefix = '') {
  if (additionalPrefix) {
    return this.prefix_ + additionalPrefix + '-';
  }
  return this.prefix_;
};


/**
 * @param {Function} func
 */
cwc.utils.Helper.prototype.handleUnsavedChanges = function(func) {
  let filename = '';
  let fileModified = false;
  let fileInstance = this.getInstance('file');
  if (fileInstance) {
    filename = fileInstance.getFileTitle();
    fileModified = fileInstance.isModified();
  }

  this.log_.info('File', filename, 'was modified:', fileModified);
  if (fileModified) {
    let dialogInstance = this.getInstance('dialog');
    let title = {
      icon: 'warning',
      title: 'Unsaved Changes for',
      untranslated: ' ' + filename,
    };
    let content = 'Changes have not been saved. Exit?';
    let action = i18t('@@GENERAL__EXIT');
    dialogInstance.showActionCancel(title, content, action).then((answer) => {
      if (answer) {
        func();
      }
    });
  } else {
    func();
  }
};


/**
 * @param {!string} name
 */
cwc.utils.Helper.prototype.tourEvent = function(name) {
  if (this.checkJavaScriptFeature('shepherd')) {
    new Shepherd.Evented().trigger(name);
  }
};


/**
 * End currently active tour.
 */
cwc.utils.Helper.prototype.endTour = function() {
  if (this.checkJavaScriptFeature('shepherd')) {
    if (Shepherd.activeTour) {
      Shepherd.activeTour.complete();
    }
  }
};


/**
 * @param {!string} name
 * @param {string=} feature
 * @return {!boolean}
 */
cwc.utils.Helper.prototype.isFirstRun = function(name, feature = 'general') {
  let firstRun = !this.hadFirstRun_[name + '__' + feature];
  if (firstRun) {
    this.log_.info('First run for', name,
      (feature !== 'general') ? 'and feature ' + feature : '');
  }
  return firstRun;
};


/**
 * @param {!string} name
 * @param {!boolean} firstRun
 * @param {string=} feature
 */
cwc.utils.Helper.prototype.setFirstRun = function(name, firstRun,
    feature = 'general') {
  this.hadFirstRun_[name + '__' + feature] = !firstRun;
};


/**
 * @param {!string} name
 * @param {string=} feature
 * @param {boolean=} optFirstRun
 * @return {!boolean}
 */
cwc.utils.Helper.prototype.getAndSetFirstRun = function(name,
    feature = 'general', optFirstRun = false) {
  let firstRun = this.isFirstRun(name, feature);
  this.setFirstRun(name, optFirstRun, feature);
  return firstRun;
};


/**
 * @param {!string} url
 */
cwc.utils.Helper.prototype.openUrl = function(url) {
  if (this.checkChromeFeature('browser')) {
    chrome.browser.openTab({
      url: url,
    });
  } else {
    window.open(url);
  }
};
