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
goog.require('cwc.config.Prefix');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Features');
goog.require('cwc.utils.Logger');

goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @typedef {cwc.ui.Account|
 *   cwc.file.File|
 *   cwc.fileHandler.FileCreator|
 *   cwc.fileHandler.FileExporter|
 *   cwc.fileHandler.FileLoader|
 *   cwc.fileHandler.FileSaver|
 *   cwc.mode.Modder|
 *   cwc.protocol.arduino.Api|
 *   cwc.protocol.bluetooth.Api|
 *   cwc.protocol.ev3.Api|
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
 *   cwc.ui.Message|
 *   cwc.ui.Navigation|
 *   cwc.ui.Preview|
 *   cwc.ui.Runner|
 *   cwc.ui.SelectScreen|
 *   cwc.ui.SettingScreen|
 *   cwc.ui.Turtle|
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

  /** @private {goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {Object<string, cwc.utils.HelperInstance>} */
  this.instances_ = {};

  /** @private {Object} */
  this.hadFirstRun_ = {};

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.utils.Helper.prototype.getEventHandler = function() {
  return this.eventHandler_;
};


/**
 * @param {!string} name
 * @param {!Object} data
 */
cwc.utils.Helper.prototype.dispatchEvent = function(name, data) {
  this.eventHandler_.dispatchEvent({
    type: name,
    data: data,
  });
};


/**
 * @param {!string} name
 * @param {!cwc.utils.HelperInstance} instance
 * @param {boolean=} overwrite
 * @export
 */
cwc.utils.Helper.prototype.setInstance = function(name, instance,
    overwrite = false) {
  if (this.instances_[name] && !overwrite) {
    this.log_.error('Instance', name, ' already exists!');
  }
  this.log_.debug('Set', name, 'instance to', instance);
  this.instances_[name] = instance;
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
 * @param {Element=} node
 * @param {boolean=} required
 * @param {string=} prefix
 * @return {cwc.utils.HelperInstance}
 * @export
 */
cwc.utils.Helper.prototype.decorateInstance = function(name, node,
    required = false, prefix = this.getPrefix()) {
  let instance = this.getInstance(name, required);
  if (instance) {
    instance.decorate(node, prefix);
  }
  return instance;
};


/**
 * @return {Object}
 */
cwc.utils.Helper.prototype.getI18nData = function() {
  let i18nInstance = this.getInstance('i18n');
  if (i18nInstance) {
    return i18nInstance.getLanguageData();
  }
  return {};
};


/**
 * Shows an error message over the message instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showError = function(msg) {
  let messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.error(msg);
  } else {
    this.log_.error(msg);
  }
};


/**
 * Shows a warning message over the message instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showWarning = function(msg) {
  let messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.warning(msg);
  } else {
    this.log_.warn(msg);
  }
};


/**
 * Shows an info message over the message instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showInfo = function(msg) {
  let messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.info(msg);
  } else {
    this.log_.info(msg);
  }
};


/**
 * Shows an success message over the message instance.
 * @param {!string} msg
 * @export
 */
cwc.utils.Helper.prototype.showSuccess = function(msg) {
  let messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.success(msg);
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
 * @param {string|boolean} value
 * @param {string=} group
 * @export
 */
cwc.utils.Helper.prototype.setFeature = function(name, value,
    group = undefined) {
  this.features_.set(name, value, group);
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
 * @return {*}
 * @export
 */
cwc.utils.Helper.prototype.detectFeatures = function() {
  return this.features_.detectFeatures();
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
 * @param {string} prefix General Prefix
 * @export
 */
cwc.utils.Helper.prototype.setPrefix = function(prefix) {
  this.prefix_ = prefix || '';
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
    dialogInstance.showYesNo(title, content).then((answer) => {
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
