/**
 * @fileoverview GUI for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Gui');

goog.require('cwc.soy.ui.Gui');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');

goog.require('goog.dom');
goog.require('goog.dom.fullscreen');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.soy');


/**
 * Default constructor for the Coding with Chrome editor.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Gui = function(helper) {
  /** @type {string} */
  this.name = 'Gui';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('gui');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeHeader = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeOverlay = null;

  /** @type {Element} */
  this.nodeSettings = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @type {Element} */
  this.nodeStatusBar = null;

  /** @type {Element} */
  this.nodeSidebar = null;

  /** @type {Element} */
  this.nodeConsole = null;

  /** @type {Element} */
  this.nodeTitle = null;

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');
};


/**
 * Decorates the given node and adds the editors gui.
 * @param {!Element} node The main node which should be used for the editor gui.
 */
cwc.ui.Gui.prototype.decorate = function(node) {
  if (!node) {
    this.log_.error('Not able to render GUI with node:', node);
    return;
  }
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.ui.Gui.guiTemplate, {
      'prefix': this.prefix,
    });

  // Main nodes
  this.nodeConsole = goog.dom.getElement(this.prefix + 'console');
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeHeader = goog.dom.getElement(this.prefix + 'header');
  this.nodeOverlay = goog.dom.getElement(this.prefix + 'overlay');
  this.nodeSettings = goog.dom.getElement(this.prefix + 'settings');
  this.nodeSidebar = goog.dom.getElement(this.prefix + 'sidebar');
  this.nodeStatus = goog.dom.getElement(this.prefix + 'status');
  this.nodeStatusBar = goog.dom.getElement(this.prefix + 'status-bar');
  this.nodeTitle = goog.dom.getElement(this.prefix + 'title');
  this.nodeTitleBody = goog.dom.getElement(this.prefix + 'title-body');
  this.setFullscreen(false);
  this.showOverlay(false);
  this.showSettings(false);

  // Decorates Menu Bar
  this.helper.decorateInstance('menuBar', this.prefix + 'menu-bar');

  // Decorates Console
  this.helper.decorateInstance('console', this.nodeConsole);

  // Decorates Status Bar
  this.helper.decorateInstance('statusBar', this.nodeStatusBar);

  // Decorates Notification
  this.helper.decorateInstance('notification', this.prefix + 'notification');

  // Decorates Navigation
  this.helper.decorateInstance('navigation', this.prefix + 'navigation');

  // Decorates Sidebar
  this.helper.decorateInstance('sidebar', this.nodeSidebar);

  // Add elements interactions.
  goog.events.listen(this.nodeTitle, goog.events.EventType.CHANGE,
      this.renameTitle, false, this);

  // Use user settings
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    if (userConfigInstance.get(
        cwc.userConfigType.GENERAL, cwc.userConfigName.FULLSCREEN)) {
      this.setFullscreen(true);
    }
  }
};


/**
 * @param {boolean} fullscreen
 */
cwc.ui.Gui.prototype.setFullscreen = function(fullscreen = true) {
  if (fullscreen) {
    if (this.isChromeApp_ && chrome.app.window.current()) {
      chrome.app.window.current()['fullscreen']();
    } else if (goog.dom.fullscreen.isSupported()) {
      goog.dom.fullscreen.requestFullScreen(document.documentElement);
    }
  } else {
    // Make sure to end Chrome window mode, to avoid any user confusions.
    if (this.isChromeApp_ && chrome.app.window.current() &&
       (chrome.app.window.current()['isFullscreen']() ||
        chrome.app.window.current()['isMaximized']())) {
      chrome.app.window.current()['restore']();
    } else if (goog.dom.fullscreen.isSupported()) {
      goog.dom.fullscreen.exitFullScreen();
    }
  }
};


/**
 * Sets the title of the gui.
 * @param {string} title Title to display in the gui.
 */
cwc.ui.Gui.prototype.setTitle = function(title) {
  this.showTitle(title);
  if (title && this.nodeTitle && title !== undefined) {
    this.nodeTitle.value = title;
  }
};


/**
 * Shows or hide the title of the gui.
 * @param {boolean} visible
 */
cwc.ui.Gui.prototype.showTitle = function(visible) {
  goog.style.setElementShown(this.nodeTitleBody, visible);
};


/**
 * Sets the status of the gui.
 * @param {string} status Status to display in the gui.
 */
cwc.ui.Gui.prototype.setStatus = function(status) {
  if (this.nodeStatus && status !== undefined) {
    goog.dom.setTextContent(this.nodeStatus, status);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.Gui.prototype.showOverlay = function(visible = true) {
  goog.style.setElementShown(this.nodeOverlay, visible);
  if (visible) {
    this.refresh();
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.Gui.prototype.showSettings = function(visible = true) {
  goog.style.setElementShown(this.nodeSettings, visible);
  if (visible) {
    this.refresh();
  }
};


/**
 * Shows a prompt to rename the title.
 * @param {Event=} opt_event
 */
cwc.ui.Gui.prototype.renameTitle = function(opt_event) {
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    fileInstance.setFileTitle(this.nodeTitle.value);
  }
};


/**
 * @return {Element}
 */
cwc.ui.Gui.prototype.getContentNode = function() {
  return this.nodeContent;
};


/**
 * @return {Element}
 */
cwc.ui.Gui.prototype.getOverlayNode = function() {
  return this.nodeOverlay;
};


/**
 * @return {Element}
 */
cwc.ui.Gui.prototype.getSettingsNode = function() {
  return this.nodeSettings;
};


/**
 * @return {!goog.math.Size}
 */
cwc.ui.Gui.prototype.getHeaderSize = function() {
  return goog.style.getSize(this.nodeHeader);
};


/**
 * @return {!goog.math.Size}
 */
cwc.ui.Gui.prototype.getStatusBarSize = function() {
  return goog.style.getSize(this.nodeStatusBar);
};


/**
 * @return {!goog.math.Size}
 */
cwc.ui.Gui.prototype.getConsoleSize = function() {
  return goog.style.getSize(this.nodeConsole);
};


/**
 * @return {!goog.math.Size}
 */
cwc.ui.Gui.prototype.getSidebarSize = function() {
  return goog.style.getSize(this.nodeSidebar);
};


cwc.ui.Gui.prototype.close = function() {
  this.log_.info('Close Coding with Chrome editor ...');
  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (bluetoothInstance) {
    let featuresInstance = this.helper.getInstance('features');
    if (featuresInstance) {
      if (featuresInstance.getChromeFeature('bluetoothSocket')) {
        bluetoothInstance.closeSockets();
      }
    } else {
      this.log_.warn('Failed to get Features helper.'+
        'Can\'t check if bluetoothSocket is supported');
    }
  }
  chrome.app.window.current()['close']();
};


cwc.ui.Gui.prototype.minimize = function() {
  if (this.isChromeApp_ && chrome.app.window.current()) {
    chrome.app.window.current()['minimize']();
  }
};


cwc.ui.Gui.prototype.requestClose = function() {
  this.helper.handleUnsavedChanges(this.close.bind(this));
};


/**
 * Refresh dom structure and trigger external frameworks.
 */
cwc.ui.Gui.prototype.refresh = function() {
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};
