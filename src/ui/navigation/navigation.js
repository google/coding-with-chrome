/**
 * @fileoverview Navigation for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Navigation');

goog.require('cwc.soy.ui.Navigation');
goog.require('cwc.ui.Helper');
goog.require('cwc.ui.HelpMenu');

goog.require('goog.ui.Button');
goog.require('goog.ui.KeyboardShortcutHandler');



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
  this.prefix = 'navigation-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {!cwc.ui.HelpMenu} */
  this.helpMenu = new cwc.ui.HelpMenu(this.helper);

  /** @type {!goog.ui.MenuItem} */
  this.menuNew = cwc.ui.Helper.getNavigationItem('New project',
      'Start a new project', this.requestShowSelectScreenOverview, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuNewFile = cwc.ui.Helper.getNavigationItem('New file',
      'Start a file', this.requestShowSelectScreen, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuOpenFile = cwc.ui.Helper.getNavigationItem('Open file',
      'Open a local file ...', this.requestOpenFile, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuSaveAsFile = cwc.ui.Helper.getNavigationItem('Save as new file',
      'Save as new file ...', this.saveFileAs, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuAbout = cwc.ui.Helper.getLinkButton('About',
      'Learn more about Coding with Chrome', this.showAbout.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuDebug = cwc.ui.Helper.getIconButton('build',
      'Open Debug', this.showDebug.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuSettings = cwc.ui.Helper.getIconButton('settings',
      'Open settings', this.showSettings.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuHelp = cwc.ui.Helper.getIconButton('help',
      'Help', this.showHelp.bind(this));

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeItems = null;

  /** @type {Element} */
  this.nodeFooterLeft = null;

  /** @type {Element} */
  this.nodeFooterRight = null;

  /** @type {!goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;
};


/**
 * Decorates the given node and adds the navigation.
 * @param {Element} node The target node to add the navigation.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 * @export
 */
cwc.ui.Navigation.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.ui.Navigation.style({ 'prefix': this.prefix }));
  }

  goog.soy.renderElement(
      this.node, cwc.soy.ui.Navigation.template, {'prefix': this.prefix});

  this.nodeItems = goog.dom.getElement(this.prefix + 'items');
  this.nodeFooterLeft = goog.dom.getElement(this.prefix + 'footer_left');
  this.nodeFooterRight = goog.dom.getElement(this.prefix + 'footer_right');


  this.menuNew.render(this.nodeItems);

  this.menuNewFile.render(this.nodeItems);
  this.menuOpenFile.render(this.nodeItems);
  this.menuSaveAsFile.render(this.nodeItems);

  this.menuAbout.render(this.nodeFooterLeft);

  if (this.helper.debugEnabled()) {
    this.menuDebug.render(this.nodeFooterRight);
  }
  this.menuSettings.render(this.nodeFooterRight);
  this.menuHelp.render(this.nodeFooterRight);

  // Add keyboard shortcuts.
  this.shortcutHandler.registerShortcut('new_file', 'ctrl+n');
  this.shortcutHandler.registerShortcut('open_file', 'ctrl+o');
  this.shortcutHandler.registerShortcut('save_file', 'ctrl+s');
  this.shortcutHandler.registerShortcut('save_file_as', 'ctrl+shift+s');
  goog.events.listen(this.shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut, false, this);
};


/**
 * Toggle the drawer.
 */
cwc.ui.Navigation.prototype.toggle = function() {
  var mdlLayout = document.querySelector('.mdl-layout');
  if (!mdlLayout) {
    return;
  }
  mdlLayout.MaterialLayout.toggleDrawer();
};


/**
 * Shows the drawer.
 */
cwc.ui.Navigation.prototype.show = function() {
  var mdlLayout = document.querySelector('.mdl-layout');
  if (!mdlLayout) {
    return;
  }
  var mdlLayoutClassName = mdlLayout.MaterialLayout.obfuscator_.className;
  if (mdlLayoutClassName.indexOf('is-visible') === -1) {
    this.toggle();
  }
};


/**
 * Hides the drawer.
 */
cwc.ui.Navigation.prototype.hide = function() {
  var mdlLayout = document.querySelector('.mdl-layout');
  if (!mdlLayout) {
    return;
  }
  var mdlLayoutClassName = mdlLayout.MaterialLayout.obfuscator_.className;
  if (mdlLayoutClassName.indexOf('is-visible') !== -1) {
    this.toggle();
  }
};


/**
 * Shows new file dialog.
 */
cwc.ui.Navigation.prototype.requestShowSelectScreenOverview = function() {
  var selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen(this.hide.bind(this), true);
  }
};


/**
 * Shows new file dialog.
 */
cwc.ui.Navigation.prototype.requestShowSelectScreen = function() {
  var selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen(this.hide.bind(this));
  }
};


/**
 * Request to open a existing file from the local drive.
 */
cwc.ui.Navigation.prototype.requestOpenFile = function() {
  var fileLoaderInstance = this.helper.getInstance('fileLoader');
  if (fileLoaderInstance) {
    fileLoaderInstance.requestLoadFile(this.hide.bind(this));
  }
};


/**
 * Shows about screen.
 */
cwc.ui.Navigation.prototype.showSettings = function() {
  var settingScreenInstance = this.helper.getInstance('settingScreen');
  if (settingScreenInstance) {
    settingScreenInstance.show();
    this.hide();
  }
  console.log('Show settings screen');
  this.hide();
};


/**
 * Shows about screen.
 */
cwc.ui.Navigation.prototype.showAbout = function() {
  this.helpMenu.showAbout();
  this.hide();
};


/**
 * Shows help screen.
 */
cwc.ui.Navigation.prototype.showDebug = function() {
  this.helpMenu.showDebug();
  this.hide();
};


/**
 * Shows help screen.
 */
cwc.ui.Navigation.prototype.showHelp = function() {
  this.helpMenu.showHelp();
  this.hide();
};


/**
 * Saves the currently open file.
 */
cwc.ui.Navigation.prototype.saveFile = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile();
    this.hide();
  }
};


/**
 * Saves the current projects as a new file on the local drive.
 */
cwc.ui.Navigation.prototype.saveFileAs = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFileAs();
    this.hide();
  }
};


/**
 * Handles keyboard shortcuts.
 */
cwc.ui.Navigation.prototype.handleKeyboardShortcut = function(event) {
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
