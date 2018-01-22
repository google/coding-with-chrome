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

goog.require('cwc.UserConfig');
goog.require('cwc.config');
goog.require('cwc.fileHandler.File');
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
goog.require('cwc.server.Server');
goog.require('cwc.ui.Account');
goog.require('cwc.ui.Debug');
goog.require('cwc.ui.Documentation');
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
goog.require('cwc.ui.SelectScreen');
goog.require('cwc.ui.SettingScreen');
goog.require('cwc.ui.connectScreen.Screens');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Storage');

goog.require('goog.dom');


/**
 * General helpers.
 * @enum {!Function}
 */
cwc.ui.BuilderHelpers = {
  'connectScreen': cwc.ui.connectScreen.Screens,
  'documentation': cwc.ui.Documentation,
  'file': cwc.fileHandler.File,
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
  'renderer': cwc.renderer.Renderer,
  'selectScreen': cwc.ui.SelectScreen,
  'settingScreen': cwc.ui.SettingScreen,
};


/**
 * General protocols.
 * @enum {!Function}
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
  'sphero': cwc.protocol.sphero.Api,
};


/**
 * Specific oAuth2 helpers.
 * @enum {!Function}
 */
cwc.ui.oauth2Helpers = {
  'account': cwc.ui.Account,
  'gcloud': cwc.ui.GCloud,
  'gdrive': cwc.ui.GDrive,
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

  /** @type {Array} */
  this.listener_ = [];

  /** @type {Function} */
  this.callback = null;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');
};


/**
 * Decorates the given node and adds the code editor.
 * @param {!Element|string} node
 * @param {Function=} callback
 * @export
 */
cwc.ui.Builder.prototype.decorate = function(node, callback = null) {
  this.setProgress('Loading Coding with Chrome editor ...', 1, 1);
  if (goog.isString(node)) {
    this.node = goog.dom.getElement(node);
  } else if (goog.isObject(node)) {
    this.node = node;
  } else {
    this.raiseError('Required node is neither a string or an object!');
  }

  if (callback && typeof callback === 'function') {
    this.callback = callback;
  }

  this.addEventListener_(window, goog.events.EventType.ERROR, function(e) {
    let browserEvent = e.getBrowserEvent();
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
  let storageInstance = new cwc.utils.Storage();
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
  let userConfigInstance = new cwc.UserConfig(this.helper);
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
  let i18nInstance = new cwc.utils.I18n();
  if (!i18nInstance) {
    this.loadUI();
    return;
  }
  this.helper.setInstance('i18n', i18nInstance);

  let language = cwc.config.Default.LANGUAGE;
  let languageFile = '../js/locales/eng.js';
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    let userLanguage = userConfigInstance.get(cwc.userConfigType.GENERAL,
          cwc.userConfigName.LANGUAGE);
    if (userLanguage && userLanguage != language) {
      if (userLanguage.length === 3) {
        console.log('Set user preferred language:', userLanguage);
        language = userLanguage;

        if (language != cwc.config.Default.LANGUAGE) {
          // Coding with Chrome language file.
          languageFile = '../js/locales/' + language + '.js';

          // Blockly language file.
          cwc.ui.Helper.insertScript(
            '../external/blockly/msg/' +
              cwc.utils.I18n.getISO639_1(language) + '.js',
            'blockly-language'
          );
        }
      } else {
        console.warn('Unsupported language', userLanguage, 'using',
          cwc.config.Default.LANGUAGE, 'instead!');
        userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.LANGUAGE, cwc.config.Default.LANGUAGE);
      }
    }
  }

  i18nInstance.prepare(
    this.loadUI.bind(this),
    language,
    languageFile,
    '../js/locales/blacklist.js',
    '../js/locales/supported.js'
  );
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
    this.setProgress('Prepare internal Server', 29, 100);
    this.prepareServer();
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
    if (this.callback) {
      this.callback();
    }
    this.helper.removeEventListeners(this.listener_, this.name);
  }
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {!number} total
 */
cwc.ui.Builder.prototype.setProgress = function(text, current, total) {
  this.log_.info('[' + current + '%] ' + text);
  let loader = this.chromeApp_ && chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({
      'command': 'progress', 'text': text, 'current': current, 'total': total,
    }, '*');
  }
};


/**
 * Closes the Loader window.
 */
cwc.ui.Builder.prototype.closeLoader = function() {
  let loader = this.chromeApp_ && chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({'command': 'close'}, '*');
  }
};


/**
 * @param {!string} error
 * @param {boolean=} skipThrow
 */
cwc.ui.Builder.prototype.raiseError = function(error, skipThrow = false) {
  this.error = true;
  let loader = this.chromeApp_ && chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({
      'command': 'error', 'msg': error}, '*');
  }
  if (this.callback) {
    this.callback();
  }
  if (!skipThrow) {
    throw error;
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
  let accountInstance = this.helper.getInstance('account');
  if (accountInstance) {
    accountInstance.prepare();
  } else {
    let menubarInstance = this.helper.getInstance('menubar');
    if (menubarInstance) {
      menubarInstance.setAuthenticated(false);
    }
  }
};


/**
 * Prepare Bluetooth interface if needed.
 */
cwc.ui.Builder.prototype.prepareBluetooth = function() {
  let bluetoothInstance = this.helper.getInstance('bluetooth');
  if (this.helper.checkChromeFeature('bluetooth') && bluetoothInstance) {
    bluetoothInstance.prepare();
  }
};


/**
 * Prepare serial interface if needed.
 */
cwc.ui.Builder.prototype.prepareSerial = function() {
  let serialInstance = this.helper.getInstance('serial');
  if (this.helper.checkChromeFeature('serial') && serialInstance) {
    serialInstance.prepare();
  }
};


/**
 * Prepare debug mode if needed.
 * @private
 */
cwc.ui.Builder.prototype.prepareDebug_ = function() {
  let debugInstance = new cwc.ui.Debug(this.helper);
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
  let experimentalInstance = new cwc.ui.Experimental(this.helper);
  if (experimentalInstance) {
    experimentalInstance.prepare();
  }
  this.helper.setInstance('experimental', experimentalInstance);
};


/**
 * Prepare dialog.
 */
cwc.ui.Builder.prototype.prepareDialog = function() {
  let dialogInstance = new cwc.utils.Dialog();
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
  this.log_.debug('Prepare Protocols support ...');
  let protocols = cwc.ui.supportedProtocols;
  let numOfProtocols = Object.keys(protocols).length;
  let counter = 1;
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
 * Prepare internal Servers.
 */
cwc.ui.Builder.prototype.prepareServer = function() {
  this.log_.debug('Prepare internal Servers ...');
  let serverInstance = new cwc.server.Server();
  if (serverInstance) {
    serverInstance.prepare();
  }
  this.helper.setInstance('server', serverInstance);
};


/**
 * Prepare the UI and load the needed additional extensions.
 */
cwc.ui.Builder.prototype.prepareHelper = function() {
  this.log_.debug('Prepare Helper instances ...');
  let helpers = cwc.ui.BuilderHelpers;
  let numOfHelpers = Object.keys(helpers).length;
  let counter = 1;
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
  let helpers = cwc.ui.oauth2Helpers;
  let numOfHelpers = Object.keys(helpers).length;
  let counter = 1;
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
 * @param {!string} instanceName
 */
cwc.ui.Builder.prototype.loadHelper = function(instance, instanceName) {
  if (!goog.isFunction(instance)) {
    this.raiseError('Helper ' + instanceName + ' is not defined!');
  }
  let helperInstance = new instance(this.helper);
  this.helper.setInstance(instanceName, helperInstance);
};


/**
 * Loads additional frameworks for the renderer.
 */
cwc.ui.Builder.prototype.loadFrameworks = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);

  this.setProgress('Pre-loading external frameworks ...', 52, 100);
  rendererInstance.loadFrameworks(cwc.framework.External,
    '../frameworks/external/');

  this.setProgress('Pre-loading internal frameworks ...', 54, 100);
  rendererInstance.loadFrameworks(cwc.framework.Internal,
    '../frameworks/internal/');

  this.setProgress('Pre-loading Style Sheets ...', 56, 100);
  rendererInstance.loadStyleSheets(cwc.framework.StyleSheet, '../css/');
};


/**
 * Renders the editors ui.
 */
cwc.ui.Builder.prototype.renderGui = function() {
  if (!this.prepared) {
    this.raiseError('Helper where not prepared!');
  }

  // Decorate GUI with all other components.
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance && !this.error) {
    this.setProgress('Decorate gui ...', 30, 100);
    guiInstance.decorate(this.node);
  } else {
    this.raiseError('The gui instance was not loaded!');
  }

  // Prepare Layout
  let layoutInstance = this.helper.getInstance('layout');
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
  let selectScreenInstance = this.helper.getInstance('selectScreen');
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
 * @param {Function} listener
 * @param {boolean=} useCapture
 * @param {Object=} listenerScope
 * @private
 */
cwc.ui.Builder.prototype.addEventListener_ = function(src, type, listener,
    useCapture = false, listenerScope = null) {
  let eventListener = goog.events.listen(src, type, listener, useCapture,
      listenerScope);
  goog.array.insert(this.listener_, eventListener);
};
