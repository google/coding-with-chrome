/**
 * @fileoverview UI builder for the Coding with Chrome editor.
 *
 * Preloads all needed modules and shows a loading screen with the progress.
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
goog.provide('cwc.ui.Builder');
goog.provide('cwc.ui.BuilderFrameworks');
goog.provide('cwc.ui.BuilderHelpers');

goog.require('cwc.config');
goog.require('cwc.file.Type');
goog.require('cwc.fileHandler.File');
goog.require('cwc.fileHandler.FileCreator');
goog.require('cwc.fileHandler.FileExporter');
goog.require('cwc.fileHandler.FileLoader');
goog.require('cwc.fileHandler.FileSaver');
goog.require('cwc.mode.Modder');
goog.require('cwc.protocol.Arduino.api');
goog.require('cwc.protocol.Serial.api');
goog.require('cwc.protocol.bluetooth.Api');
goog.require('cwc.protocol.ev3.Api');
goog.require('cwc.renderer.Renderer');
goog.require('cwc.ui.Account');
goog.require('cwc.ui.Blockly');
goog.require('cwc.ui.Config');
goog.require('cwc.ui.ConnectionManager');
goog.require('cwc.ui.Debug');
goog.require('cwc.ui.Documentation');
goog.require('cwc.ui.Editor');
goog.require('cwc.ui.GDrive');
goog.require('cwc.ui.Gui');
goog.require('cwc.ui.Layout');
goog.require('cwc.ui.Library');
goog.require('cwc.ui.Menubar');
goog.require('cwc.ui.Message');
goog.require('cwc.ui.Preview');
goog.require('cwc.ui.SelectScreen');
goog.require('cwc.ui.Setting');
goog.require('cwc.ui.Statusbar');
goog.require('cwc.ui.Tutorial');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');



/**
 * Additional frameworks for the preview window or runner framework.
 * @type {!Object.<string>}
 */
cwc.ui.BuilderFrameworks = {
  'Arduino Framework': '../frameworks/arduino_framework.js',
  'Coffeescript Framework': '../frameworks/coffee-script.js',
  'EV3 Framework': '../frameworks/ev3_framework.js',
  'Runner Framework': '../frameworks/runner_framework.js',
  'Simple Framework': '../frameworks/simple_framework.js'
};


/**
 * General helpers.
 * @type {!Object.<Function>|Function}
 */
cwc.ui.BuilderHelpers = {
  'arduino': cwc.protocol.Arduino.api,
  'blockly': cwc.ui.Blockly,
  'bluetooth': cwc.protocol.bluetooth.Api,
  'connectionManager': cwc.ui.ConnectionManager,
  'debug': cwc.ui.Debug,
  'documentation': cwc.ui.Documentation,
  'ev3': cwc.protocol.ev3.Api,
  'editor': cwc.ui.Editor,
  'file': cwc.fileHandler.File,
  'fileCreator': cwc.fileHandler.FileCreator,
  'fileExporter': cwc.fileHandler.FileExporter,
  'fileLoader': cwc.fileHandler.FileLoader,
  'fileSaver': cwc.fileHandler.FileSaver,
  'gui': cwc.ui.Gui,
  'layout': cwc.ui.Layout,
  'library': cwc.ui.Library,
  'menubar': cwc.ui.Menubar,
  'message': cwc.ui.Message,
  'mode': cwc.mode.Modder,
  'preview': cwc.ui.Preview,
  'renderer': cwc.renderer.Renderer,
  'runner': cwc.ui.Runner,
  'selectScreen': cwc.ui.SelectScreen,
  'statusbar': cwc.ui.Statusbar,
  'serial': cwc.protocol.Serial.api,
  'tutorial': cwc.ui.Tutorial
};


/**
 * Specific oauth2 helpers.
 * @type {!Object.<Function>|Function}
 */
cwc.ui.oauth2Helpers = {
  'account': cwc.ui.Account,
  'gDrive': cwc.ui.GDrive
};


/**
 * Default construction of the Coding with Chrome editor.
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Builder = function() {
  /** @type {string} */
  this.name = 'Builder';

  /** @private {!number} */
  this.loglevel_ = 0;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @type {boolean} */
  this.error = false;

  /** @type {!cwc.utils.Helper} */
  this.helper = new cwc.utils.Helper();

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.prefix = cwc.config.Prefix.GENERAL;

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeOverlayer = null;
};


/**
 * Decorates the given node and adds the code editor.
 * @param {!Element|string} node
 * @param {Element=} opt_overlayer
 * @export
 */
cwc.ui.Builder.prototype.decorate = function(node,
    opt_overlayer) {
  this.log_.info('Loading Coding with Chrome editor ...');
  this.setProgress('Loading Coding with Chrome editor', 1, 1);
  if (goog.isString(node)) {
    this.node = goog.dom.getElement(node);
  } else if (goog.isObject(node)) {
    this.node = node;
  } else {
    this.raiseError('Required node is neither a string or an object!');
  }
  this.nodeOverlayer = opt_overlayer || null;
  this.load();
};


/**
 * Loads all needed helper and the ui.
 */
cwc.ui.Builder.prototype.load = function() {

  if (!this.error) {
    this.setProgress('Detect features ...', 0, 100);
    this.detectFeatures();
  }

  if (!this.error) {
    this.setProgress('Loading and prepare i18n …', 5, 100);
    this.loadI18n_();
  }

  if (!this.error) {
    this.setProgress('Checking requirements ...', 10, 100);
    this.checkRequirements();
  }

  if (!this.error) {
    this.setProgress('Loading Config ...', 40, 100);
    this.loadConfig();
  }

  if (!this.error) {
    this.setProgress('Prepare Helpers ...', 50, 100);
    this.prepareHelper();
  }

  if (!this.error && this.helper.checkChromeFeature('oauth2')) {
    this.setProgress('Prepare oauth2 Helpers ...', 55, 100);
    this.prepareOauth2Helper();
  }

  if (!this.error) {
    this.setProgress('Loading Frameworks ...', 60, 100);
    this.loadFrameworks();
  }

  if (!this.error) {
    this.setProgress('Render editor GUI ...', 70, 100);
    this.renderGui();
  }

  if (!this.error) {
    this.setProgress('Prepare Bluetooth support ...', 80, 100);
    this.prepareBluetooth();
  }

  if (!this.error) {
    this.setProgress('Prepare Serial support ...', 90, 100);
    this.prepareSerial();
  }

  if (!this.error && this.helper.checkChromeFeature('oauth2')) {
    this.setProgress('Prepare account support ...', 95, 100);
    this.prepareAccount();
  }

  this.setProgress('Done.', 100, 100);
  if (this.nodeOverlayer) {
    goog.dom.removeNode(this.nodeOverlayer);
  }
  this.closeLoader();
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {!number} total
 */
cwc.ui.Builder.prototype.setProgress = function(text, current, total) {
  var loader = chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({
      'command': 'progress', 'text': text, 'current': current, 'total': total
    }, '*');
  }
};


/**
 * Closes the Loader window.
 */
cwc.ui.Builder.prototype.closeLoader = function() {
  var loader = chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({'command': 'close'}, '*');
  }
};


/**
 * Performs feature detection.
 */
cwc.ui.Builder.prototype.detectFeatures = function() {
  this.helper.detectFeatures();
  this.helper.showFeatures();
};


/**
 * @param {!string} error_msg
 * @return {throw}
 */
cwc.ui.Builder.prototype.raiseError = function(error_msg) {
  this.error = true;
  var loader = chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({
      'command': 'error', 'msg': error_msg}, '*');
  }
  throw error_msg;
};


/**
 * Checks additional requirements.
 */
cwc.ui.Builder.prototype.checkRequirements = function() {

  if (!this.helper.checkJavaScriptFeature('codemirror')) {
    this.raiseError('Unable to find CodeMirror !\n' +
        'Please check if you have included the CodeMirror files.');
  }

  if (!this.helper.checkJavaScriptFeature('jshint')) {
    this.raiseError('Unable to find JsHint !\n' +
        'Please check if you have included the JsHint files.');
  }

  if (!this.helper.checkJavaScriptFeature('htmlhint')) {
    this.raiseError('Unable to find HTMLHint !\n' +
        'Please check if you have included the HTMLHint files.');
  }

  if (!this.helper.checkJavaScriptFeature('coffeelint')) {
    this.raiseError('Unable to find CoffeeLint !\n' +
        'Please check if you have included the CoffeeLint files.');
  }

  if (!this.helper.checkJavaScriptFeature('coffeescript')) {
    this.raiseError('Unable to find CoffeeScript !\n' +
        'Please check if you have included the CoffeeScript files.');
  }
};


/**
 * Prepares account if needed.
 */
cwc.ui.Builder.prototype.prepareAccount = function() {
  var accountInstance = this.helper.getInstance('account');
  if (accountInstance) {
    accountInstance.prepare();
  } else {
    var menubarInstance = this.helper.getInstance('menubar');
    if (menubarInstance) {
      menubarInstance.setAuthenticated(false);
    }
  }
};


/**
 * Prepare Bluetooth interface if needed.
 */
cwc.ui.Builder.prototype.prepareBluetooth = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth');
  if (this.helper.checkChromeFeature('bluetooth') && bluetoothInstance) {
    bluetoothInstance.prepare();
  } else {
    var menubarInstance = this.helper.getInstance('menubar');
    if (menubarInstance) {
      menubarInstance.setBluetoothEnabled(false);
    }
  }
};


/**
 * Prepare serial interface if needed.
 */
cwc.ui.Builder.prototype.prepareSerial = function() {
  var serialInstance = this.helper.getInstance('serial');
  if (this.helper.checkChromeFeature('serial') && serialInstance) {
    serialInstance.prepare();
  } else {
    var menubarInstance = this.helper.getInstance('menubar');
    /*if (menubarInstance) {
      menubarInstance.setSerialEnabled(false);
    }*/
  }
};


/**
 * Preloads user config.
 */
cwc.ui.Builder.prototype.loadConfig = function() {
  var configInstance = new cwc.ui.Config(this.helper);
  this.helper.setInstance('config', configInstance);
  configInstance.loadConfig();
};


/**
 * Preloads i18n helper.
 * @private
 */
cwc.ui.Builder.prototype.loadI18n_ = function() {
  var i18nInstance = new cwc.utils.I18n();
  this.helper.setInstance('i18n', i18nInstance);
  i18nInstance.mapGlobal();
};


/**
 * Prepare the UI and load the needed additional extensions.
 */
cwc.ui.Builder.prototype.prepareHelper = function() {
  this.log_.debug('Prepare Helper instances...');
  var helpers = cwc.ui.BuilderHelpers;
  var numOfHelpers = Object.keys(helpers).length;
  var counter = 1;
  for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      this.setProgress('Loading helper: ' + helper, counter,
          numOfHelpers);
      this.loadHelper(helpers[helper], helper);
      counter++;
    }
  }
  this.prepared = true;
};


/**
 * Load additional oauth2 helpers.
 */
cwc.ui.Builder.prototype.prepareOauth2Helper = function() {
  this.log_.debug('Prepare oauth2 Helper instances...');
  var helpers = cwc.ui.oauth2Helpers;
  var numOfHelpers = Object.keys(helpers).length;
  var counter = 1;
  for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      this.setProgress('Loading helper: ' + helper, counter,
          numOfHelpers);
      this.loadHelper(helpers[helper], helper);
      counter++;
    }
  }
  this.prepared = true;
};


/**
 * @param {!cwc.ui.Account|
 *   cwc.protocol.Arduino.api|
 *   cwc.ui.Blockly|
 *   cwc.protocol.bluetooth.Api|
 *   cwc.ui.Documentation|
 *   cwc.protocol.ev3.Api|
 *   cwc.ui.Editor|
 *   cwc.fileHandler.File|
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
 *   cwc.ui.Statusbar} instance
 * @param {!string} instance_name
 */
cwc.ui.Builder.prototype.loadHelper = function(instance,
    instance_name) {
  if (!goog.isFunction(instance)) {
    this.raiseError('Helper ' + instance_name + ' is not defined!');
  }
  var helperInstance = new instance(this.helper);
  this.helper.setInstance(instance_name, helperInstance);
};


/**
 * Loads additional frameworks for the renderer.
 */
cwc.ui.Builder.prototype.loadFrameworks = function() {
  var rendererInstance = this.helper.getInstance('renderer');
  var frameworks = cwc.ui.BuilderFrameworks;
  var numOfFrameworks = Object.keys(frameworks).length;
  var counter = 1;

  if (!rendererInstance) {
    this.raiseError('Was not able to load renderer instance!');
  }

  for (var framework in frameworks) {
    if (frameworks.hasOwnProperty(framework)) {
      var message = 'Loading ' + framework + ' framework ...';
      this.setProgress(message, counter, numOfFrameworks);
      rendererInstance.loadFramework(frameworks[framework]);
      counter++;
    }
  }
};


/**
 * Renders the editors ui.
 */
cwc.ui.Builder.prototype.renderGui = function() {
  if (!this.prepared) {
    this.raiseError('Helper where not prepared!');
  }

  // Decorate GUI with all other components.
  var guiInstance = this.helper.getInstance('gui');
  if (guiInstance && !this.error) {
    this.setProgress('Decorate gui ...', 30, 100);
    guiInstance.decorate(this.node, this.prefix);
  } else {
    this.raiseError('The gui instance was not loaded!');
  }

  // Prepare Layout
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.setProgress('Prepare layout ...', 60, 100);
    layoutInstance.prepare();
  } else {
    this.raiseError('The layout instance was not loaded!');
  }

  // Show Select screen
  var selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    this.setProgress('Loading select screen ...', 90, 100);
    selectScreenInstance.showSelectScreen();
  }
};
