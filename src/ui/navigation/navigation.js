/**
 * @fileoverview Navigation for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Navigation');

goog.require('cwc.soy.ui.Navigation');
goog.require('cwc.ui.Helper');

goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('goog.dom');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Navigation = function(helper) {
  /** @type {string} */
  this.name = 'Navigation';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('navigation');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeNewProject = null;

  /** @type {Element} */
  this.nodeNewFile = null;

  /** @type {Element} */
  this.nodeOpenFile = null;

  /** @type {Element} */
  this.nodeSaveFile = null;

  /** @type {Element} */
  this.nodeAbout = null;

  /** @type {Element} */
  this.nodeDebug = null;

  /** @type {Element} */
  this.nodeSettings = null;

  /** @type {Element} */
  this.nodeHelp = null;

  /** @type {Element} */
  this.nodeOpenGoogleDriveFile = null;

  /** @type {Element} */
  this.nodeSaveGoogleDriveFile = null;

  /** @type {!goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
};


/**
 * Decorates the given node and adds the navigation.
 * @param {Element} node The target node to add the navigation.
 * @export
 */
cwc.ui.Navigation.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(this.node, cwc.soy.ui.Navigation.template, {
    'prefix': this.prefix,
  });

  // Navigation Items
  this.nodeNewProject = goog.dom.getElement(this.prefix + 'new-project');
  this.nodeNewFile = goog.dom.getElement(this.prefix + 'new-file');
  this.nodeOpenFile = goog.dom.getElement(this.prefix + 'open-file');
  this.nodeOpenGoogleDriveFile = goog.dom.getElement(
      this.prefix + 'open-google-drive');
  this.nodeSaveFile = goog.dom.getElement(this.prefix + 'save-file');
  this.nodeSaveGoogleDriveFile = goog.dom.getElement(
      this.prefix + 'save-google-drive');

  // Footer Items
  this.nodeAbout = goog.dom.getElement(this.prefix + 'about');
  this.nodeDebug = goog.dom.getElement(this.prefix + 'debug');
  this.nodeSettings = goog.dom.getElement(this.prefix + 'settings');
  this.nodeHelp = goog.dom.getElement(this.prefix + 'help');

  // Default stats
  goog.style.setElementShown(this.nodeDebug, this.helper.debugEnabled());
  this.enableOpenGoogleDriveFile(false);
  this.enableSaveGoogleDriveFile(false);

  // Events
  goog.events.listen(this.nodeNewProject, goog.events.EventType.CLICK,
    this.requestShowSelectScreenOverview.bind(this));
  goog.events.listen(this.nodeNewFile, goog.events.EventType.CLICK,
    this.requestShowSelectScreen.bind(this));
  goog.events.listen(this.nodeOpenFile, goog.events.EventType.CLICK,
    this.requestOpenFile.bind(this));
  goog.events.listen(this.nodeOpenGoogleDriveFile, goog.events.EventType.CLICK,
    this.requestOpenGoogleDrive.bind(this));
  goog.events.listen(this.nodeSaveFile, goog.events.EventType.CLICK,
    this.saveFileAs.bind(this));
  goog.events.listen(this.nodeSaveGoogleDriveFile, goog.events.EventType.CLICK,
    this.saveGDriveFile.bind(this));

  goog.events.listen(this.nodeAbout, goog.events.EventType.CLICK,
    this.showAbout.bind(this));
  goog.events.listen(this.nodeDebug, goog.events.EventType.CLICK,
    this.showDebug.bind(this));
  goog.events.listen(this.nodeSettings, goog.events.EventType.CLICK,
    this.showSettings.bind(this));
  goog.events.listen(this.nodeHelp, goog.events.EventType.CLICK,
    this.showHelp.bind(this));

  // Keyboard shortcuts events.
  this.shortcutHandler.registerShortcut('new_file', 'ctrl+n');
  this.shortcutHandler.registerShortcut('open_file', 'ctrl+o');
  this.shortcutHandler.registerShortcut('save_file', 'ctrl+s');
  this.shortcutHandler.registerShortcut('save_file_as', 'ctrl+shift+s');
  goog.events.listen(this.shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_, false, this);
};


/**
 * Toggle the drawer.
 */
cwc.ui.Navigation.prototype.toggle = function() {
  let mdlLayout = document.querySelector('.mdl-layout');
  if (!mdlLayout) {
    return;
  }
  mdlLayout['MaterialLayout']['toggleDrawer']();
};


/**
 * Shows the drawer.
 */
cwc.ui.Navigation.prototype.show = function() {
  let mdlLayout = document.querySelector('.mdl-layout');
  if (!mdlLayout) {
    return;
  }
  let mdlLayoutClassName = mdlLayout['MaterialLayout']['obfuscator_'].className;
  if (!mdlLayoutClassName.includes('is-visible')) {
    this.toggle();
  }
  this.helper.tourEvent('navigation-show');
};


/**
 * Hides the drawer.
 */
cwc.ui.Navigation.prototype.hide = function() {
  let mdlLayout = document.querySelector('.mdl-layout');
  if (!mdlLayout) {
    return;
  }
  let mdlLayoutClassName = mdlLayout['MaterialLayout']['obfuscator_'].className;
  if (mdlLayoutClassName.includes('is-visible')) {
    this.toggle();
  }
  this.helper.tourEvent('navigation-hide');
};


/**
 * @param {!string} title
 * @param {string=} opt_icon
 * @param {string=} opt_color_class
 */
cwc.ui.Navigation.prototype.setHeader = function(title,
    opt_icon, opt_color_class) {
  let headerNode = goog.dom.getElement(this.prefix + 'header');
  if (headerNode) {
    goog.soy.renderElement(
      headerNode, cwc.soy.ui.Navigation.header, {
        'title': title,
        'opt_icon': opt_icon,
        'opt_color_class': opt_color_class});
  }
};


/**
 * Shows new file dialog.
 */
cwc.ui.Navigation.prototype.requestShowSelectScreenOverview = function() {
  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen(this.hide.bind(this), true);
  }
};


/**
 * Shows new file dialog.
 */
cwc.ui.Navigation.prototype.requestShowSelectScreen = function() {
  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen(this.hide.bind(this));
  }
};


/**
 * Request to open a existing file from the local drive.
 */
cwc.ui.Navigation.prototype.requestOpenFile = function() {
  let fileLoaderInstance = this.helper.getInstance('fileLoader');
  if (fileLoaderInstance) {
    fileLoaderInstance.requestLoadFile(this.hide.bind(this));
  }
};

/**
 * Request to open an existing file from Google Drive.
 */
cwc.ui.Navigation.prototype.requestOpenGoogleDrive = function() {
  let gdriveInstance = this.helper.getInstance('gdrive');
  if (gdriveInstance) {
    gdriveInstance.openDialog();
    this.hide();
  }
};


/**
 * Shows about screen.
 */
cwc.ui.Navigation.prototype.showSettings = function() {
  let settingScreenInstance = this.helper.getInstance('settingScreen');
  if (settingScreenInstance) {
    settingScreenInstance.show();
    this.hide();
  }
  this.hide();
};


/**
 * Shows about screen.
 */
cwc.ui.Navigation.prototype.showAbout = function() {
  this.helper.getInstance('help').showAbout();
  this.hide();
};


/**
 * Shows debug screen.
 */
cwc.ui.Navigation.prototype.showDebug = function() {
  this.helper.getInstance('help').showDebug();
  this.hide();
};


/**
 * Shows help screen.
 */
cwc.ui.Navigation.prototype.showHelp = function() {
  this.helper.getInstance('help').showHelp();
  this.hide();
};


/**
 * Saves the currently open file.
 */
cwc.ui.Navigation.prototype.saveFile = function() {
  this.helper.getInstance('fileSaver').saveFile();
  this.hide();
};


cwc.ui.Navigation.prototype.saveGDriveFile = function() {
  let fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveGDriveFile();
    this.hide();
  }
};


/**
 * Saves the current projects as a new file on the local drive.
 */
cwc.ui.Navigation.prototype.saveFileAs = function() {
  let fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFileAs();
    this.hide();
  }
};


/**
 * @param {!boolean} enable
 */
cwc.ui.Navigation.prototype.enableOpenGoogleDriveFile = function(enable) {
  if (this.nodeOpenGoogleDriveFile) {
    goog.style.setElementShown(this.nodeOpenGoogleDriveFile, enable);
  }
};


/**
 * @param {!boolean} enable
 */
cwc.ui.Navigation.prototype.enableSaveGoogleDriveFile = function(enable) {
  if (this.nodeSaveGoogleDriveFile) {
    goog.style.setElementShown(this.nodeSaveGoogleDriveFile, enable);
  }
};


/**
 * @param {boolean} enable
 * @export
 */
cwc.ui.Navigation.prototype.enableSaveFile = function(enable) {
  goog.style.setElementShown(this.nodeSaveFile, enable);
};


/**
 * Handles keyboard shortcuts.
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.ui.Navigation.prototype.handleKeyboardShortcut_ = function(event) {
  switch (event.identifier) {
    case 'new_file':
      this.requestShowSelectScreen();
      break;
    case 'open_file':
      this.requestOpenFile();
      break;
    case 'save_file':
      this.saveFile();
      break;
    case 'save_file_as':
      this.saveFileAs();
      break;
    default:
      console.info(event.identifier);
  }
};
