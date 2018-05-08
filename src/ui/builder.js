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

goog.require('cwc.Cache');
goog.require('cwc.UserConfig');
goog.require('cwc.addon.Message');
goog.require('cwc.config');
goog.require('cwc.fileHandler.File');
goog.require('cwc.fileHandler.FileExporter');
goog.require('cwc.fileHandler.FileLoader');
goog.require('cwc.fileHandler.FileSaver');
goog.require('cwc.mode.Modder');
goog.require('cwc.protocol.arduino.Api');
goog.require('cwc.protocol.bluetooth.classic.Api');
goog.require('cwc.protocol.bluetooth.lowEnergy.Api');
goog.require('cwc.protocol.lego.ev3.Api');
goog.require('cwc.protocol.makeblock.mbot.Api');
goog.require('cwc.protocol.makeblock.mbotRanger.Api');
goog.require('cwc.protocol.raspberryPi.Api');
goog.require('cwc.protocol.serial.Api');
goog.require('cwc.protocol.sphero.classic.Api');
goog.require('cwc.protocol.tcp.HTTPServer');
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
goog.require('cwc.ui.LoadingScreen');
goog.require('cwc.ui.Menubar');
goog.require('cwc.ui.Navigation');
goog.require('cwc.ui.Notification');
goog.require('cwc.ui.SelectScreen');
goog.require('cwc.ui.SettingScreen');
goog.require('cwc.ui.Sidebar');
goog.require('cwc.ui.Tour');
goog.require('cwc.ui.Tutorial');
goog.require('cwc.ui.connectScreen.Screens');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Gamepad');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');
goog.require('cwc.utils.Storage');

goog.require('goog.dom');


/**
 * Addons.
 * @enum {!Function}
 */
cwc.ui.Addons = {
  'message': cwc.addon.Message,
};


/**
 * General helpers.
 * @enum {!Function}
 */
cwc.ui.BuilderHelpers = {
  'cache': cwc.Cache,
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
  'mode': cwc.mode.Modder,
  'navigation': cwc.ui.Navigation,
  'notification': cwc.ui.Notification,
  'renderer': cwc.renderer.Renderer,
  'selectScreen': cwc.ui.SelectScreen,
  'settingScreen': cwc.ui.SettingScreen,
  'sidebar': cwc.ui.Sidebar,
  'tour': cwc.ui.Tour,
  'tutorial': cwc.ui.Tutorial,
};


/**
 * General protocols.
 * @enum {!Function}
 */
cwc.ui.supportedProtocols = {
  // Low-level
  'bluetooth': cwc.protocol.bluetooth.classic.Api,
  'bluetoothLE': cwc.protocol.bluetooth.lowEnergy.Api,
  'serial': cwc.protocol.serial.Api,

  // Boards
  'arduino': cwc.protocol.arduino.Api,
  'raspberryPi': cwc.protocol.raspberryPi.Api,

  // Robots
  'mbot': cwc.protocol.makeblock.mbot.Api,
  'mbotRanger': cwc.protocol.makeblock.mbotRanger.Api,
  'sphero': cwc.protocol.sphero.classic.Api,
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

  /** @type {!cwc.utils.Helper} */
  this.helper = new cwc.utils.Helper();

  /** @type {boolean} */
  this.prepared = false;

  /** @type {boolean} */
  this.loaded = false;

  /** @type {string} */
  this.prefix = cwc.config.Prefix.GENERAL;

  /** @type {Element} */
  this.node = null;

  /** @type {Function} */
  this.callback = null;

  /** @private {!boolean} */
  this.chromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!cwc.ui.LoadingScreen} */
  this.loadingScreen_ = new cwc.ui.LoadingScreen(this.helper, this);

  if (window['CWC_BUILDER']) {
    this.log_.warn('Found an existing CWC Builder instance!');
  } else {
    window['CWC_BUILDER'] = true;
  }
};


/**
 * Decorates the given node and adds the code editor.
 * @param {Element|string=} node
 * @param {Function=} callback
 * @export
 */
cwc.ui.Builder.prototype.decorate = function(node = null, callback = null) {
  if (goog.isString(node)) {
    this.node = goog.dom.getElement(node);
  } else if (goog.isObject(node)) {
    this.node = node;
  } else if (goog.dom.getElement('cwc-editor')) {
    this.node = goog.dom.getElement('cwc-editor');
  }

  if (!this.node) {
    this.raiseError('Required node is neither a string or an object!');
  }

  // Decorate loading screen
  this.loadingScreen_.decorate();
  this.setProgress('Loading ...', 0);

  // Storing callback
  if (callback && typeof callback === 'function') {
    this.callback = callback;
  }

  // Register Error handler
  this.events_.listen(window, goog.events.EventType.ERROR, function(e) {
    let browserEvent = e.getBrowserEvent();
    this.raiseError('Runtime Error\n' + browserEvent.message, true);
  }, false, this);

  // Prepare and load Storage
  this.loadStorage_();
};


/**
 * @return {boolean}
 * @export
 */
cwc.ui.Builder.prototype.isPrepared = function() {
  return this.prepared;
};


/**
 * @return {boolean}
 * @export
 */
cwc.ui.Builder.prototype.isLoaded = function() {
  return this.loaded;
};


/**
 * @return {boolean}
 * @export
 */
cwc.ui.Builder.prototype.isReady = function() {
  return this.prepared && this.loaded;
};


/**
 * @param {!string} filename
 * @return {Promise}
 * @export
 */
cwc.ui.Builder.prototype.loadFile = function(filename) {
  return this.helper.getInstance('fileLoader').loadLocalFile(filename);
};


/**
 * Loads and construct the main ui screen.
 */
cwc.ui.Builder.prototype.loadUI = function() {
  if (this.loaded) {
    this.log_.error('UI was already loaded!');
    return;
  }

  this.setProgress('Checking requirements ...', 5);
  this.checkRequirements_('blockly');
  this.checkRequirements_('codemirror');
  this.checkRequirements_('coffeelint');
  this.checkRequirements_('coffeescript');
  this.checkRequirements_('htmlhint');
  this.checkRequirements_('jshint');

  // Track progressing status
  this.setProgressFunc('Prepare debug ...', this.prepareDebug_);
  this.setProgressFunc('Prepare experimental ...', this.prepareExperimental_);
  this.setProgressFunc('Prepare dialog ...', this.prepareDialog);
  this.setProgressFunc('Prepare protocols ...', this.prepareProtocols);
  if (this.helper.checkChromeFeature('sockets.tcpServer')) {
    this.setProgressFunc('Prepare internal Server', this.prepareServer);
  }
  this.setProgressFunc('Prepare helpers ...', this.prepareHelper);
  this.setProgressFunc('Gamepad support ...', this.prepareGamepad);
  this.setProgressFunc('Prepare addons ...', this.prepareAddons);
  if (this.helper.checkChromeFeature('manifest.oauth2')) {
    this.setProgressFunc('Prepare OAuth2 Helpers ...',
      this.prepareOauth2Helper);
  }
  this.setProgressFunc('Render editor GUI ...', this.renderGui);
  this.setProgressFunc('Prepare Bluetooth / Bluetooth LE support ...',
    this.prepareBluetooth);
  if (this.helper.checkChromeFeature('serial')) {
    this.setProgressFunc('Prepare Serial support ...', this.prepareSerial);
  }
  if (this.helper.checkChromeFeature('manifest.oauth2')) {
    this.setProgressFunc('Prepare account support ...', this.prepareAccount);
  }
  this.setProgressFunc('Loading select screen ...', this.showSelectScreen);
  this.setProgressFunc('Loading cache ...', this.loadCache).then(() => {
    // Done.
    this.setProgress('Starting Coding with Chrome', 100);
    this.loaded = true;
    if (typeof window.componentHandler !== 'undefined') {
      window.componentHandler.upgradeDom();
    }
    if (this.callback) {
      this.log_.info('Executing external callback ...');
      this.callback(this);
    }
    this.events_.clear();
    this.loadingScreen_.hideSecondsAfterStart(3000);
  });
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {number=} total
 */
cwc.ui.Builder.prototype.setProgress = function(text, current, total = 100) {
  this.loadingScreen_.setProgress(text, current, total);
};


/**
 * @param {!string} text
 * @param {!Function} func
 * @param {number=} steps
 * @return {Function|Promise}
 */
cwc.ui.Builder.prototype.setProgressFunc = function(text, func, steps) {
  return this.loadingScreen_.setProgressFunc(text, func, steps);
};


/**
 * @param {!string} error
 * @param {boolean=} skipThrow
 */
cwc.ui.Builder.prototype.raiseError = function(error, skipThrow = false) {
  if (this.callback) {
    this.callback(this);
  }
  if (!skipThrow) {
    throw error;
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
 * Prepare addons.
 */
cwc.ui.Builder.prototype.prepareAddons = function() {
  this.log_.debug('Prepare Addons ...');
  for (let addon in cwc.ui.Addons) {
    if (cwc.ui.Addons.hasOwnProperty(addon)) {
      this.log_.info('Loading addon: ' + addon);
      this.loadAddon_(cwc.ui.Addons[addon], addon);
    }
  }
};


/**
 * Prepare Bluetooth / Bluetooth LE interface if needed.
 */
cwc.ui.Builder.prototype.prepareBluetooth = function() {
  let bluetoothInstance = this.helper.getInstance('bluetooth');
  if (this.helper.checkChromeFeature('bluetooth') && bluetoothInstance) {
    bluetoothInstance.prepare();
  }

  let bluetoothLEInstance = this.helper.getInstance('bluetoothLE');
  if (this.helper.checkBrowserFeature('bluetooth') && bluetoothLEInstance) {
    bluetoothLEInstance.prepare();
  }
};


/**
 * Prepare Serial interface if needed.
 */
cwc.ui.Builder.prototype.prepareSerial = function() {
  let serialInstance = this.helper.getInstance('serial');
  if (serialInstance) {
    serialInstance.prepare();
  }
};


/**
 * Prepare internal Servers if needed.
 */
cwc.ui.Builder.prototype.prepareServer = function() {
  this.helper.setInstance('http-server', new cwc.protocol.tcp.HTTPServer());
  let serverInstance = new cwc.server.Server(this.helper);
  this.helper.setInstance('server', serverInstance).prepare();
};


/**
 * Prepare debug mode if needed.
 * @private
 */
cwc.ui.Builder.prototype.prepareDebug_ = function() {
  let debugInstance = new cwc.ui.Debug(this.helper);
  this.helper.setInstance('debug', debugInstance).prepare();
};


/**
 * Prepare experimental mode if needed.
 * @private
 */
cwc.ui.Builder.prototype.prepareExperimental_ = function() {
  let experimentalInstance = new cwc.ui.Experimental(this.helper);
  this.helper.setInstance('experimental', experimentalInstance).prepare();
};


/**
 * Prepare dialog.
 */
cwc.ui.Builder.prototype.prepareDialog = function() {
  let dialogInstance = new cwc.utils.Dialog();
  dialogInstance.setDefaultCloseHandler(function() {
      this.helper.getInstance('navigation').hide();
    }.bind(this)
  );
  this.helper.setInstance('dialog', dialogInstance).prepare();
};


/**
 * Prepare and load the supported protocols.
 */
cwc.ui.Builder.prototype.prepareProtocols = function() {
  for (let protocol in cwc.ui.supportedProtocols) {
    if (cwc.ui.supportedProtocols.hasOwnProperty(protocol)) {
      this.setProgressFunc('Loading ' + protocol + ' protocol...', () => {
        this.loadHelper_(cwc.ui.supportedProtocols[protocol], protocol);
      }, 1);
    }
  }
  this.prepared = true;
};


/**
 * Prepare the UI and load the needed additional extensions.
 */
cwc.ui.Builder.prototype.prepareHelper = function() {
  for (let helper in cwc.ui.BuilderHelpers) {
    if (cwc.ui.BuilderHelpers.hasOwnProperty(helper)) {
      this.setProgressFunc('Loading ' + helper + ' helper...', () => {
        this.loadHelper_(cwc.ui.BuilderHelpers[helper], helper);
      }, 1);
    }
  }
  this.prepared = true;
};


/**
 * Preparing general Gamepad support
 */
cwc.ui.Builder.prototype.prepareGamepad = function() {
  let gamepadInstance = new cwc.utils.Gamepad();
  this.helper.setInstance('gamepad', gamepadInstance).prepare();
};


/**
 * Load additional oauth2 helpers.
 */
cwc.ui.Builder.prototype.prepareOauth2Helper = function() {
  for (let helper in cwc.ui.oauth2Helpers) {
    if (cwc.ui.oauth2Helpers.hasOwnProperty(helper)) {
      this.setProgressFunc('Loading ' + helper + ' OAuth2 helper ...', () => {
        this.loadHelper_(cwc.ui.oauth2Helpers[helper], helper);
      }, 1);
    }
  }
  this.prepared = true;
};


/**
 * @param {!cwc.utils.AddonInstance} instance
 * @param {!string} instanceName
 * @private
 */
cwc.ui.Builder.prototype.loadAddon_ = function(instance, instanceName) {
  if (!goog.isFunction(instance)) {
    this.raiseError('Addon ' + instanceName + ' is not defined!');
  }
  this.helper.setAddon(instanceName, new instance(this.helper));
  this.helper.prepareAddon(instanceName);
};


/**
 * @param {!cwc.utils.HelperInstance} instance
 * @param {!string} instanceName
 * @private
 */
cwc.ui.Builder.prototype.loadHelper_ = function(instance, instanceName) {
  if (!goog.isFunction(instance)) {
    this.raiseError('Helper ' + instanceName + ' is not defined!');
  }
  this.helper.setInstance(instanceName, new instance(this.helper));
};


/**
 * Loads additional frameworks for the renderer.
 * @return {Promise}
 */
cwc.ui.Builder.prototype.loadCache = function() {
  this.helper.getInstance('renderer').prepare();
  return this.helper.getInstance('cache').prepare();
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
  if (guiInstance) {
    this.log_.info('Decorate gui ...');
    guiInstance.decorate(this.node);
  } else {
    this.raiseError('The gui instance was not loaded!');
  }

  // Prepare Layout
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.log_.info('Prepare layout ...');
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
  this.helper.setInstance('i18n', i18nInstance);

  let language = cwc.config.Default.LANGUAGE;
  let languageFile = 'js/locales/eng.js';
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    let userLanguage = userConfigInstance.get(cwc.userConfigType.GENERAL,
          cwc.userConfigName.LANGUAGE);
    if (userLanguage && userLanguage != language) {
      if (userLanguage.length === 3) {
        this.log_.info('Set user preferred language:', userLanguage);
        language = userLanguage;

        if (language != cwc.config.Default.LANGUAGE) {
          // Coding with Chrome language file.
          languageFile = '../js/locales/' + language + '.js';

          // Blockly language file.
          cwc.utils.Resources.getUriAsJavaScriptTag(
            'external/blockly/msg/' +
              cwc.utils.I18n.getISO639_1(language) + '.js',
            'blockly-language'
          );
        }
      } else {
        this.log_.warn('Unsupported language', userLanguage, 'using',
          cwc.config.Default.LANGUAGE, 'instead!');
        userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.LANGUAGE, cwc.config.Default.LANGUAGE);
      }
    }
  }

  this.loadingScreen_.setUserLangauge(language);
  cwc.utils.Resources.getUriAsJavaScriptTag(
    languageFile, 'cwc-i18n-language').then(() => {
      i18nInstance.setLanguage(language);
      this.loadUI();
  });
};


/**
 * @param {string} name
 * @private
 */
cwc.ui.Builder.prototype.checkRequirements_ = function(name) {
  if (!this.helper.checkJavaScriptFeature(name)) {
    this.raiseError('Unable to find ' + name + ' !\n' +
        'Please check if you have included the ' + name + ' files.');
  }
};
