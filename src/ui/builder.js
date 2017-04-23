/**
 * @fileoverview UI builder for the Coding with Chrome editor.
 *
 * Preloads all needed modules and shows a loading screen with the progress.
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
goog.provide('cwc.ui.Builder');
goog.provide('cwc.ui.BuilderHelpers');

goog.require('cwc.config');
goog.require('cwc.fileHandler.File');
goog.require('cwc.fileHandler.FileCreator');
goog.require('cwc.fileHandler.FileExporter');
goog.require('cwc.fileHandler.FileLoader');
goog.require('cwc.fileHandler.FileSaver');
goog.require('cwc.framework.External');
goog.require('cwc.framework.Internal');
goog.require('cwc.mode.Modder');
goog.require('cwc.protocol.arduino.Api');
goog.require('cwc.protocol.bluetooth.Api');
goog.require('cwc.protocol.ev3.Api');
goog.require('cwc.protocol.makeblock.mbot.Api');
goog.require('cwc.protocol.makeblock.mbotRanger.Api');
goog.require('cwc.protocol.raspberryPi.Api');
goog.require('cwc.protocol.serial.Api');
goog.require('cwc.protocol.sphero.Api');
goog.require('cwc.renderer.Renderer');
goog.require('cwc.ui.Account');
goog.require('cwc.ui.Blockly');
goog.require('cwc.ui.ConnectionManager');
goog.require('cwc.ui.Debug');
goog.require('cwc.ui.Documentation');
goog.require('cwc.ui.Editor');
goog.require('cwc.ui.Experimental');
goog.require('cwc.ui.GCloud');
goog.require('cwc.ui.GDrive');
goog.require('cwc.ui.Gui');
goog.require('cwc.ui.Help');
goog.require('cwc.ui.Helper');
goog.require('cwc.ui.Layout');
goog.require('cwc.ui.Library');
goog.require('cwc.ui.Menubar');
goog.require('cwc.ui.Message');
goog.require('cwc.ui.Navigation');
goog.require('cwc.ui.Preview');
goog.require('cwc.ui.SelectScreen');
goog.require('cwc.ui.SettingScreen');
goog.require('cwc.ui.Turtle');
goog.require('cwc.ui.connectScreen.Screens');
goog.require('cwc.userConfig');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Storage');

goog.require('goog.dom');



/**
 * General helpers.
 * @type {!Object.<Function>|Function}
 */
cwc.ui.BuilderHelpers = {
  'blockly': cwc.ui.Blockly,
  'connectScreen': cwc.ui.connectScreen.Screens,
  'connectionManager': cwc.ui.ConnectionManager,
  'documentation': cwc.ui.Documentation,
  'editor': cwc.ui.Editor,
  'file': cwc.fileHandler.File,
  'fileCreator': cwc.fileHandler.FileCreator,
  'fileExporter': cwc.fileHandler.FileExporter,
  'fileLoader': cwc.fileHandler.FileLoader,
  'fileSaver': cwc.fileHandler.FileSaver,
  'gui': cwc.ui.Gui,
  'help': cwc.ui.Help,
  'layout': cwc.ui.Layout,
  'library': cwc.ui.Library,
  'menubar': cwc.ui.Menubar,
  'message': cwc.ui.Message,
  'mode': cwc.mode.Modder,
  'navigation': cwc.ui.Navigation,
  'preview': cwc.ui.Preview,
  'renderer': cwc.renderer.Renderer,
  'runner': cwc.ui.Runner,
  'selectScreen': cwc.ui.SelectScreen,
  'settingScreen': cwc.ui.SettingScreen,
  'turtle': cwc.ui.Turtle
};


/**
 * General helpers.
 * @type {!Object.<Function>|Function}
 */
cwc.ui.supportedProtocols = {
  // Low-level
  'bluetooth': cwc.protocol.bluetooth.Api,
  'serial': cwc.protocol.serial.Api,

  // Boards
  'arduino': cwc.protocol.arduino.Api,
  'raspberryPi': cwc.protocol.raspberryPi.Api,

  // Robots
  'ev3': cwc.protocol.ev3.Api,
  'mbot': cwc.protocol.makeblock.mbot.Api,
  'mbotRanger': cwc.protocol.makeblock.mbotRanger.Api,
  'sphero': cwc.protocol.sphero.Api
};


/**
 * Specific oauth2 helpers.
 * @type {!Object.<Function>|Function}
 */
cwc.ui.oauth2Helpers = {
  'account': cwc.ui.Account,
  'gcloud': cwc.ui.GCloud,
  'gdrive': cwc.ui.GDrive
};


/**
 * Default construction of the Coding with Chrome editor.
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.ui.Builder = function() {
  /** @type {string} */
  this.name = 'Builder';

  /** @private {!number} */
  this.loglevel_ = 0;

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

  /** @type {Array} */
  this.listener = [];

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @private {!boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');
};


/**
 * Decorates the given node and adds the code editor.
 * @param {!Element|string} node
 * @param {Element=} opt_overlayer
 * @export
 */
cwc.ui.Builder.prototype.decorate = function(node,
    opt_overlayer) {
  this.setProgress('Loading Coding with Chrome editor ...', 1, 1);
  if (goog.isString(node)) {
    this.node = goog.dom.getElement(node);
  } else if (goog.isObject(node)) {
    this.node = node;
  } else {
    this.raiseError('Required node is neither a string or an object!');
  }
  this.nodeOverlayer = opt_overlayer || null;

  this.addEventListener_(window, goog.events.EventType.ERROR, function(event) {
    var browserEvent = event.getBrowserEvent();
    this.raiseError('Runtime Error\n' + browserEvent.message, true);
  }, false, this);

  // Prepare and load Storage
  if (!this.error) {
    this.loadStorage_();
  }

};


/**
 * Loads the storage instance.
 * @private
 */
cwc.ui.Builder.prototype.loadStorage_ = function() {
  var storageInstance = new cwc.utils.Storage();
  if (!storageInstance) {
    this.loadI18n_();
    return;
  }
  this.helper.setInstance('storage', storageInstance);
  storageInstance.prepare(this.loadUserConfig_.bind(this));
};


/**
 * Loads the user config instance.
 * @private
 */
cwc.ui.Builder.prototype.loadUserConfig_ = function() {
  var userConfigInstance = new cwc.userConfig(this.helper);
  if (userConfigInstance) {
    this.helper.setInstance('userConfig', userConfigInstance);
  }
  this.loadI18n_();
};


/**
 * Loads the i18n before the rest of the UI.
 * @private
 */
cwc.ui.Builder.prototype.loadI18n_ = function() {
  var i18nInstance = new cwc.utils.I18n();
  if (!i18nInstance) {
    this.loadUI();
    return;
  }
  this.helper.setInstance('i18n', i18nInstance);

  var blacklistFile = '../js/locales/blacklist.js';
  var language = 'en';
  var languageFile = '../js/locales/en.js';
  var blocklyLanguageFile = '';
  var userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    var userLanguage = userConfigInstance.get(cwc.userConfigType.GENERAL,
          cwc.userConfigName.LANGUAGE);
    if (userLanguage && userLanguage != language) {
      console.log('Using user preferred language:', userLanguage);
      language = userLanguage;

      if (language != cwc.config.Default.LANGUAGE) {
        // Coding with Chrome language file.
        languageFile = '../js/locales/' + language + '.js';

        // Blockly language file.
        blocklyLanguageFile = '../external/blockly/msg/' + language + '.js';
      }
    }
  }
  if (blocklyLanguageFile) {
    cwc.ui.Helper.insertScript(blocklyLanguageFile, 'blockly-language');
  }
  i18nInstance.prepare(
    this.loadUI.bind(this), language, languageFile, blacklistFile);
};


/**
 * Loads and construct the main ui screen.
 */
cwc.ui.Builder.prototype.loadUI = function() {

  if (!this.error) {
    this.setProgress('Checking requirements ...', 10, 100);
    this.checkRequirements();
  }

  if (!this.error) {
    this.setProgress('Prepare debug ...', 20, 100);
    this.prepareDebug_();
  }

  if (!this.error) {
    this.setProgress('Prepare experimental ...', 23, 100);
    this.prepareExperimental_();
  }

  if (!this.error) {
    this.setProgress('Prepare dialog ...', 25, 100);
    this.prepareDialog();
  }

  if (!this.error) {
    this.setProgress('Prepare protocols ...', 28, 100);
    this.prepareProtocols();
  }

  if (!this.error) {
    this.setProgress('Prepare helpers ...', 30, 100);
    this.prepareHelper();
  }

  if (!this.error && this.helper.checkChromeFeature('manifest.oauth2')) {
    this.setProgress('Prepare OAuth2 Helpers ...', 35, 100);
    this.prepareOauth2Helper();
  }

  if (!this.error) {
    this.setProgress('Loading frameworks ...', 40, 100);
    this.loadFrameworks();
  }

  if (!this.error) {
    this.setProgress('Render editor GUI ...', 50, 100);
    this.renderGui();
  }

  if (!this.error) {
    this.setProgress('Prepare Bluetooth support ...', 60, 100);
    this.prepareBluetooth();
  }

  if (!this.error) {
    this.setProgress('Prepare Serial support ...', 70, 100);
    this.prepareSerial();
  }

  if (!this.error && this.helper.checkChromeFeature('manifest.oauth2')) {
    this.setProgress('Prepare account support ...', 80, 100);
    this.prepareAccount();
  }

  if (!this.error) {
    this.setProgress('Loading select screen ...', 90, 100);
    this.showSelectScreen();
  }

  if (!this.error) {
    this.setProgress('Done.', 100, 100);
    this.closeLoader();
    if (typeof window.componentHandler !== 'undefined') {
      window.componentHandler.upgradeDom();
    }
    if (this.nodeOverlayer) {
      goog.dom.removeNode(this.nodeOverlayer);
    }
    this.helper.removeEventListeners(this.listener, this.name);
  }
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {!number} total
 */
cwc.ui.Builder.prototype.setProgress = function(text, current, total) {
  this.log_.info('[' + current + '%] ' + text);
  var loader = this.chromeApp_ && chrome.app.window.get('loader');
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
  var loader = this.chromeApp_ && chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({'command': 'close'}, '*');
  }
};


/**
 * @param {!string} error_msg
 * @param {boolean=} opt_skip_throw
 * @return {throw}
 */
cwc.ui.Builder.prototype.raiseError = function(error_msg, opt_skip_throw) {
  this.error = true;
  var loader = this.chromeApp_ && chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({
      'command': 'error', 'msg': error_msg}, '*');
  }
  if (!opt_skip_throw) {
    throw error_msg;
  }
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

  if (!this.helper.checkJavaScriptFeature('blockly')) {
    this.raiseError('Unable to find Blockly !\n' +
        'Please check if you have included the Blockly files.');
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
  }
};


/**
 * Prepare serial interface if needed.
 */
cwc.ui.Builder.prototype.prepareSerial = function() {
  var serialInstance = this.helper.getInstance('serial');
  if (this.helper.checkChromeFeature('serial') && serialInstance) {
    serialInstance.prepare();
  }
};


/**
 * Prepare debug mode if needed.
 * @private
 */
cwc.ui.Builder.prototype.prepareDebug_ = function() {
  var debugInstance = new cwc.ui.Debug(this.helper);
  if (debugInstance) {
    debugInstance.prepare();
  }
  this.helper.setInstance('debug', debugInstance);
};


/**
 * Prepare experimental mode if needed.
 * @private
 */
cwc.ui.Builder.prototype.prepareExperimental_ = function() {
  var experimentalInstance = new cwc.ui.Experimental(this.helper);
  if (experimentalInstance) {
    experimentalInstance.prepare();
  }
  this.helper.setInstance('experimental', experimentalInstance);
};


/**
 * Prepare dialog.
 */
cwc.ui.Builder.prototype.prepareDialog = function() {
  var dialogInstance = new cwc.utils.Dialog();
  if (dialogInstance) {
    dialogInstance.setDefaultCloseHandler(
      function() {
        this.helper.getInstance('navigation').hide();
      }.bind(this)
    );
  }
  this.helper.setInstance('dialog', dialogInstance);
};


/**
 * Prepare and load the supported protocols.
 */
cwc.ui.Builder.prototype.prepareProtocols = function() {
  this.log_.debug('Prepare Protocols instances ...');
  var protocols = cwc.ui.supportedProtocols;
  var numOfProtocols = Object.keys(protocols).length;
  var counter = 1;
  for (let protocol in protocols) {
    if (protocols.hasOwnProperty(protocol)) {
      this.setProgress('Loading protocol: ' + protocol, counter,
        numOfProtocols);
      this.loadHelper(protocols[protocol], protocol);
      counter++;
    }
  }
  this.prepared = true;
};


/**
 * Prepare the UI and load the needed additional extensions.
 */
cwc.ui.Builder.prototype.prepareHelper = function() {
  this.log_.debug('Prepare Helper instances ...');
  var helpers = cwc.ui.BuilderHelpers;
  var numOfHelpers = Object.keys(helpers).length;
  var counter = 1;
  for (let helper in helpers) {
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
  this.log_.debug('Prepare OAuth2 Helper instances ...');
  var helpers = cwc.ui.oauth2Helpers;
  var numOfHelpers = Object.keys(helpers).length;
  var counter = 1;
  for (let helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      this.setProgress('Loading OAuth2 helper: ' + helper, counter,
          numOfHelpers);
      this.loadHelper(helpers[helper], helper);
      counter++;
    }
  }
  this.prepared = true;
};


/**
 * @param {!cwc.utils.HelperInstance} instance
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
  var rendererInstance = this.helper.getInstance('renderer', true);

  this.setProgress('Pre-loading external frameworks ...', 50, 100);
  rendererInstance.loadFrameworks(cwc.framework.External,
    '../frameworks/external/');

  this.setProgress('Pre-loading internal frameworks ...', 50, 100);
  rendererInstance.loadFrameworks(cwc.framework.Internal,
    '../frameworks/internal/');
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
    guiInstance.decorate(this.node);
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
};


/**
 * Shows select screen.
 */
cwc.ui.Builder.prototype.showSelectScreen = function() {
  var selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.showSelectScreen();
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.ui.Builder.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
