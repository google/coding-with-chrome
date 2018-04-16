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

goog.require('goog.dom');
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
  this.nodeSidebar = null;

  /** @type {Element} */
  this.nodeTitle = null;
};


/**
 * Decorates the given node and adds the editors gui.
 * @param {!Element} node The main node which should be used for the editor gui.
 */
cwc.ui.Gui.prototype.decorate = function(node) {
  if (!node) {
    console.error('Not able to render GUI with node:', node);
    return;
  }
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Gui.guiTemplate, {
        'prefix': this.prefix,
      });

  // Main nodes
  this.nodeHeader = goog.dom.getElement(this.prefix + 'header');
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeOverlay = goog.dom.getElement(this.prefix + 'overlay');
  this.nodeStatus = goog.dom.getElement(this.prefix + 'status');
  this.nodeSettings = goog.dom.getElement(this.prefix + 'settings');
  this.nodeSidebar = goog.dom.getElement(this.prefix + 'sidebar');
  this.nodeTitle = goog.dom.getElement(this.prefix + 'title');
  this.showOverlay(false);
  this.showSettings(false);

  // Decorates menubar
  let menubarInstance = this.helper.getInstance('menubar');
  let nodeMenubar = goog.dom.getElement(this.prefix + 'menubar');
  if (menubarInstance && nodeMenubar) {
    menubarInstance.decorate(nodeMenubar);
  }

  // Decorates notification
  let notificationInstance = this.helper.getInstance('notification');
  let nodeNotification = goog.dom.getElement(this.prefix + 'notification');
  if (notificationInstance && nodeNotification) {
    notificationInstance.decorate(nodeNotification);
  }

  // Decorates navigation
  let navigationInstance = this.helper.getInstance('navigation');
  let nodeNavigation = goog.dom.getElement(this.prefix + 'navigation');
  if (navigationInstance && nodeNavigation) {
    navigationInstance.decorate(nodeNavigation);
  }

  // Decorates sidebar
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance && this.nodeSidebar) {
    sidebarInstance.decorate(this.nodeSidebar);
  }

  // Add elements interactions.
  goog.events.listen(this.nodeTitle, goog.events.EventType.CHANGE,
      this.renameTitle, false, this);

  // Use user settings
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    if (userConfigInstance.get(
        cwc.userConfigType.GENERAL, cwc.userConfigName.FULLSCREEN)) {
      chrome.app.window.current()['maximize']();
    }
  }
};


/**
 * Sets the title of the gui.
 * @param {string} title Title to display in the gui.
 */
cwc.ui.Gui.prototype.setTitle = function(title) {
  if (this.nodeTitle && title !== undefined) {
    this.nodeTitle.value = title;
  }
};


/**
 * Enables or disables the title of the gui.
 * @param {boolean} enabled
 */
cwc.ui.Gui.prototype.enableTitle = function(enabled) {
  if (this.nodeTitle) {
    this.nodeTitle.disabled = !enabled;
  }
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
cwc.ui.Gui.prototype.getSidebarSize = function() {
  return goog.style.getSize(this.nodeSidebar);
};


/**
 * Refresh dom structure and trigger external frameworks.
 */
cwc.ui.Gui.prototype.refresh = function() {
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};
