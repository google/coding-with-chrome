/**
 * @fileoverview GUI for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Gui');

goog.require('cwc.soy.ui.Gui');
goog.require('cwc.utils.Helper');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.soy');
goog.require('goog.ui.Prompt');



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
  this.prefix = 'gui-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {goog.dom.ViewportSizeMonitor} */
  this.viewport_monitor = new goog.dom.ViewportSizeMonitor();

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeHeader = null;

  /** @type {Element} */
  this.nodeLayout = null;

  /** @type {Element} */
  this.nodeFooter = null;
};


/**
 * Decorates the given node and adds the editors gui.
 * @param {!Element} node The main node which should be used for the editor gui.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Gui.prototype.decorate = function(node, opt_prefix) {
  if (!node) {
    console.error('Not able to render GUI with node:', node);
    return;
  }
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  // Loads and install editor styles.
  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Gui.guiTemplate,
      {'prefix': this.prefix});

  this.nodeHeader = goog.dom.getElement(this.prefix + 'header');
  this.nodeLayout = goog.dom.getElement(this.prefix + 'layout');
  this.nodeFooter = goog.dom.getElement(this.prefix + 'footer');

  goog.style.installStyles(cwc.soy.ui.Gui.guiStyle({
    'prefix': this.prefix
  }));

  // Decorates additional modules
  var menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance) {
    menubarInstance.decorate(goog.dom.getElement(this.prefix + 'menubar'),
        this.generalPrefix);
  }
  var messageInstance = this.helper.getInstance('message');
  if (messageInstance) {
    messageInstance.decorate(goog.dom.getElement(this.prefix + 'message'),
        this.generalPrefix);
  }
  var statusbarInstance = this.helper.getInstance('statusbar');
  if (statusbarInstance) {
    statusbarInstance.decorate(goog.dom.getElement(this.prefix + 'statusbar'),
        this.generalPrefix);
  }
  var gDriveInstance = this.helper.getInstance('gDrive');
  if (gDriveInstance) {
    gDriveInstance.decorate(null, this.generalPrefix);
  }

  // Add elements interactions.
  var titleNode = goog.dom.getElement(this.prefix + 'title');
  goog.events.listen(titleNode, goog.events.EventType.CLICK,
      this.renameTitle, false, this);

  // Add default Events.
  goog.events.listen(this.viewport_monitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);

  this.adjustSize();
};


/**
 * Sets the title of the gui.
 * @param {string} title Title to display in the gui.
 */
cwc.ui.Gui.prototype.setTitle = function(title) {
  var node = goog.dom.getElement(this.prefix + 'title');
  if (node && title !== undefined) {
    goog.dom.setTextContent(node, title);
  }
};


/**
 * Sets the status of the gui.
 * @param {string} status Status to display in the gui.
 */
cwc.ui.Gui.prototype.setStatus = function(status) {
  var node = goog.dom.getElement(this.prefix + 'status');
  if (node && status !== undefined) {
    goog.dom.setTextContent(node, status);
  }
};


/**
 * Shows a prompt to rename the title.
 */
cwc.ui.Gui.prototype.renameTitle = function() {
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    var titleNode = goog.dom.getElement(this.prefix + 'title');
    var promptEvent = fileInstance.setFileTitle.bind(fileInstance);
    var prompt = new goog.ui.Prompt(
        'Rename file',
        'Please enter the new name for the file.',
        promptEvent);
    if (titleNode) {
      prompt.setDefaultValue(goog.dom.getTextContent(titleNode));
    }
    prompt.setVisible(true);
  }
};


/**
 * @return {Element}
 */
cwc.ui.Gui.prototype.getLayoutNode = function() {
  return this.nodeLayout;
};


/**
 * @return {!goog.math.Size}
 */
cwc.ui.Gui.prototype.getHeaderSize = function() {
  return goog.style.getSize(this.nodeHeader);
};


/**
 * Adjusts the UI to the correct size after resize.
 */
cwc.ui.Gui.prototype.adjustSize = function() {
  var viewportSize = this.viewport_monitor.getSize();
  var chrome = goog.dom.getElement(this.prefix + 'chrome');
  goog.style.setSize(chrome, viewportSize);
};
