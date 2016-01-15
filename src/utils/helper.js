/**
 * @fileoverview Helper for the Coding with Chrome editor.
 *
 * This helper class provides shortcuts to get the implemented instances and
 * make sure that they have the correct type.
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
goog.provide('cwc.utils.Helper');

goog.require('cwc.config.Debug');
goog.require('cwc.config.Prefix');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Features');
goog.require('cwc.utils.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarToggleButton');



/**
 * Helper for all the ui parts and modules.
 * @constructor
 * @final
 * @export
 */
cwc.utils.Helper = function() {
  /** @type {!string} */
  this.name = 'Helper';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = cwc.config.LogLevel;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @private {!cwc.utils.features} */
  this.features_ = new cwc.utils.Features(this.loglevel_);

  /** @private {string} */
  this.prefix_ = cwc.config.Prefix.GENERAL || '';

  /** @private {string} */
  this.cssPrefix_ = cwc.config.Prefix.CSS || '';

  /** @private {Object} */
  this.instances_ = {
    'account': null,  /** @type {?cwc.ui.Account} */
    'arduino': null, /** @type {?cwc.protocol.Arduino.api} */
    'bluetooth': null,  /** @type {?cwc.protocol.bluetooth.Api} */
    'serial': null,  /** @type {?cwc.protocol.Serial.api} */
    'blockly': null,  /** @type {?cwc.ui.Blockly} */
    /** @type {?cwc.ui.ConnectionManager} */
    'connectionManager': null,
    'config': null,  /** @type {?cwc.ui.Config} */
    'debug': null, /** @type {?cwc.ui.Debug} */
    'editor': null,  /** @type {?cwc.ui.Editor} */
    'ev3': null,  /** @type {?cwc.protocol.ev3.Api} */
    'documentation': null,  /** @type {?cwc.ui.Documentation} */
    'file': null,  /** @type {?cwc.ui.File} */
    'fileCreator': null,  /** @type {?cwc.fileHandler.FileCreator} */
    'fileLoader': null,  /** @type {?cwc.fileHandler.FileLoader} */
    'fileSaver': null,  /** @type {?cwc.fileHandler.FileSaver} */
    'fileExporter': null,  /** @type {?cwc.fileHandler.FileExporter} */
    'gDrive': null,  /** @type {?cwc.ui.GDrive} */
    'gui': null,  /** @type {?cwc.ui.Gui} */
    'message': null,  /** @type {?cwc.ui.Message} */
    'menubar': null,  /** @type {?cwc.ui.Menubar} */
    'mode': null,  /** @type {?cwc.mode.Modder} */
    'renderer': null,  /** @type {?cwc.renderer.Renderer} */
    'settings': null,  /** @type {?cwc.ui.Setting} */
    'layout': null,  /** @type {?cwc.ui.Layout} */
    'library': null,  /** @type {?cwc.ui.Library} */
    'preview': null,  /** @type {?cwc.ui.Preview} */
    'runner': null,  /** @type {?cwc.ui.Runner} */
    'selectScreen': null,  /** @type {?cwc.ui.SelectScreen} */
    'statusbar': null,  /** @type {?cwc.ui.Statusbar} */
    'tutorial': null /** @type {?cwc.ui.Tutorial} */
  };

};


/**
 * @param {!string} name
 * @param {!cwc.ui.Account|
 *   cwc.protocol.Arduino.api|
 *   cwc.ui.Blockly|
 *   cwc.protocol.bluetooth.Api|
 *   cwc.protocol.Serial.api|
 *   cwc.ui.ConnectionManager|
 *   cwc.ui.Config|
 *   cwc.ui.Debug|
 *   cwc.ui.Documentation|
 *   cwc.protocol.ev3.Api|
 *   cwc.ui.Editor|
 *   cwc.ui.File|
 *   cwc.fileHandler.FileCreator|
 *   cwc.fileHandler.FileLoader|
 *   cwc.fileHandler.FileSaver|
 *   cwc.fileHandler.FileExporter|
 *   cwc.ui.GDrive|
 *   cwc.ui.Gui|
 *   cwc.ui.Layout|
 *   cwc.ui.Library|
 *   cwc.ui.Menubar|
 *   cwc.ui.Message|
 *   cwc.mode.Modder|
 *   cwc.ui.Preview|
 *   cwc.renderer.Renderer|
 *   cwc.ui.Runner|
 *   cwc.ui.SelectScreen|
 *   cwc.ui.Statusbar|
 *   cwc.ui.Tutorial} instance
 * @param {boolean=} opt_overwrite
 * @export
 */
cwc.utils.Helper.prototype.setInstance = function(name, instance,
    opt_overwrite) {
  if (this.instances_[name] && !opt_overwrite) {
    this.log_.error('Instance', name, ' already exists!');
  }
  this.log_.debug('Set', name, 'instance to', instance);
  this.instances_[name] = instance;
  if (typeof instance.setHelper == 'function') {
    instance.setHelper(this);
  }
};


/**
 * @param {!string} name
 * @param {boolean=} opt_required
 * @return {cwc.ui.Account|
 *   cwc.protocol.Arduino.api|
 *   cwc.ui.Blockly|
 *   cwc.protocol.bluetooth.Api|
 *   cwc.protocol.Serial.api|
 *   cwc.ui.ConnectionManager|
 *   cwc.ui.Config|
 *   cwc.ui.Documentation|
 *   cwc.protocol.ev3.Api|
 *   cwc.ui.Editor|
 *   cwc.ui.File|
 *   cwc.fileHandler.FileCreator|
 *   cwc.fileHandler.FileLoader|
 *   cwc.fileHandler.FileSaver|
 *   cwc.ui.GDrive|
 *   cwc.ui.Gui|
 *   cwc.ui.Layout|
 *   cwc.ui.Library|
 *   cwc.ui.Menubar|
 *   cwc.ui.Message|
 *   cwc.mode.Modder|
 *   cwc.ui.Preview|
 *   cwc.renderer.Renderer|
 *   cwc.ui.Runner|
 *   cwc.ui.SelectScreen|
 *   cwc.ui.Statusbar|
 *   cwc.ui.Tutorial}
 * @export
 */
cwc.utils.Helper.prototype.getInstance = function(name, opt_required) {
  var error = null;
  if (typeof this.instances_[name] == 'undefined') {
    error = 'Instance ' + name + ' is not implemented!';
    this.log_.error(error);
  } else if (!this.instances_[name]) {
    error = 'Instance ' + name + ' is not initilized yet.';
    this.log_.warn(error);
  }
  if (opt_required && error) {
    throw 'Required ' + error;
  } else if (error) {
    return null;
  }
  return this.instances_[name];
};


/**
 * Shows an error message over the message instance.
 * @param {!string} error_msg
 * @export
 */
cwc.utils.Helper.prototype.showError = function(error_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.error(error_msg);
  }
  this.log_.error(error_msg);
};


/**
 * Shows a warning message over the message instance.
 * @param {!string} warn_msg
 * @export
 */
cwc.utils.Helper.prototype.showWarning = function(warn_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.warning(warn_msg);
  }
  this.log_.warn(warn_msg);
};


/**
 * Shows an info message over the message instance.
 * @param {!string} info_msg
 * @export
 */
cwc.utils.Helper.prototype.showInfo = function(info_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.info(info_msg);
  }
  this.log_.info(info_msg);
};


/**
 * Removes all defined event listeners in the provided list.
 * @param {Array} events_list
 * @param {string=} opt_name
 * @return {!Array} empty array
 */
cwc.utils.Helper.prototype.removeEventListeners = function(events_list,
    opt_name) {
  if (events_list) {
    this.log_.debug('Clearing', events_list.length, 'events listener',
        (opt_name) ? ' for ' + opt_name : '');
    goog.array.forEach(events_list, function(listener) {
      goog.events.unlistenByKey(listener);
    });
  }
  return [];
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @param {string=} opt_group
 * @export
 */
cwc.utils.Helper.prototype.setFeature = function(name, value, opt_group) {
  this.features_.set(name, value, opt_group);
};


/**
 * @param {string} name
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkChromeFeature = function(name) {
  return this.checkFeature(name, 'chrome');
};


/**
 * @param {string} name
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkJavaScriptFeature = function(name) {
  return this.checkFeature(name, 'js');
};


/**
 * @param {string} name
 * @param {string=} opt_group
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkFeature = function(name, opt_group) {
  return this.features_.get(name, opt_group);
};


/**
 * @export
 */
cwc.utils.Helper.prototype.detectFeatures = function() {
  return this.features_.detect();
};


/**
 * @param {string} name
 * @param {string=} opt_group
 * @return {boolean}
 * @export
 */
cwc.utils.Helper.prototype.showFeatures = function(name, opt_group) {
  return this.features_.log();
};


/**
 * @export
 */
cwc.utils.Helper.prototype.getManifest = function() {
  if (this.checkChromeFeature('manifest')) {
    return chrome.runtime.getManifest();
  }
  return null;
};


/**
 * @export
 * @return {!string}
 */
cwc.utils.Helper.prototype.getAppVersion = function() {
  var manifest = this.getManifest();
  if (manifest) {
    return manifest['version'];
  }
  return String(Date().getTime());
};


/**
 * @export
 */
cwc.utils.Helper.prototype.getFileExtensions = function() {
  var manifest = this.getManifest();
  if (manifest) {
    var fileExtensions = manifest['file_handlers']['supported']['extensions'];
    return fileExtensions;
  }
  return null;
};


/**
 * @param {string=} opt_name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.debugEnabled = function(opt_name) {
  var name = opt_name || 'ENABLED';
  if (name in cwc.config.Debug) {
    return cwc.config.Debug[name];
  }
  return false;
};


/**
 * @param {string} status
 * @export
 */
cwc.utils.Helper.prototype.setStatus = function(status) {
  if (this.statusbarInstance_) {
    this.statusbarInstance_.setStatus(status);
  }
};


/**
 * @param {string} prefix General Prefix
 * @export
 */
cwc.utils.Helper.prototype.setPrefix = function(prefix) {
  this.prefix_ = prefix || '';
};


/**
 * @return {!cwc.utils.Logger}
 * @export
 */
cwc.utils.Helper.prototype.getLogger = function() {
  return this.log_;
};


/**
 * @param {string=} opt_additional_prefix
 * @return {string}
 * @export
 */
cwc.utils.Helper.prototype.getPrefix = function(
    opt_additional_prefix) {
  if (opt_additional_prefix) {
    return this.prefix_ + opt_additional_prefix + '-';
  }
  return this.prefix_;
};


/**
 * @param {function} func
 */
cwc.utils.Helper.prototype.handleUnsavedChanges = function(func) {
  var dialog = new goog.ui.Dialog();
  var fileName = '';
  var fileModified = false;
  var fileInstance = this.getInstance('file');
  if (fileInstance) {
    fileName = fileInstance.getFileTitle();
    fileModified = fileInstance.isModified();
  }

  console.log('File was saved:', fileModified);
  if (fileModified) {
    dialog.setTitle('Unsaved Changes for ' + fileName);
    dialog.setContent('Changes have not been saved. Exit?');
    dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createYesNo());
    dialog.setDisposeOnHide(true);
    dialog.render();

    goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT,
        function(event) {
          if (event.key == 'yes') {
            func();
          }
        }, false, this);
    dialog.setVisible(true);
  } else {
    func();
  }
};


/**
 * @export
 */
cwc.utils.Helper.prototype.uninstallStyles =
    cwc.ui.Helper.uninstallStyles;
