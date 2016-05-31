/**
 * @fileoverview Blocky Editor for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Blockly');

goog.require('Blockly');
goog.require('Blockly.Blocks');

goog.require('cwc.soy.ui.Blockly');
goog.require('cwc.ui.BlocklyToolbar');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.ToolbarButton');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Blockly = function(helper) {

  /** @type {boolean} */
  this.css = false;

  /** @type {string} */
  this.name = 'Blockly';

  /** @type {string} */
  this.prefix = 'blockly-';

  /** @type {boolean} */
  this.enabled = false;

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {Element} */
  this.nodeEditorToolbox = null;

  /** @type {!Blockly} */
  this.blockly = Blockly;

  /** @type {!Blockly} */
  this.blocks_ = Blockly.Blocks;

  /** @type {string} */
  this.mediaFiles = '../../external/blockly/';

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {Array} */
  this.listener = [];

  /** @type {boolean} */
  this.modified = false;

  /** @type {cwc.ui.BlocklyToolbar} */
  this.toolbar = null;

  /** @type {goog.ui.ToolbarButton} */
  this.toolbarExpandButton = null;

  /** @type {!array} */
  this.autoHideElements = ['blocklyToolboxDiv', 'blocklyWidgetDiv',
                           'blocklyTooltipDiv'];

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.utils.Logger} */
  this.log = this.helper.getLogger();
};


/**
 * Decorates the Blockly editor into the given node.
 * @param {!Element} node
 * @param {!Element} toolbox
 * @param {string=} opt_prefix
 * @param {boolean=} opt_trashcan
 */
cwc.ui.Blockly.prototype.decorate = function(node, toolbox,
    opt_prefix, opt_trashcan) {
  this.node = node;
  this.nodeEditorToolbox = toolbox;
  this.prefix = (opt_prefix || '') + this.prefix;
  this.log.info('Decorate', this.name, 'into node', this.node);
  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Blockly.template,
      {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.ui.Blockly.style({ 'prefix': this.prefix }));
  }

  // Show previously hidden Elements
  cwc.ui.Helper.showElements(this.autoHideElements);

  // Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');
  if (this.nodeToolbar) {
    this.toolbar = new cwc.ui.BlocklyToolbar(this.helper);
    this.toolbar.decorate(this.nodeToolbar, this.node);
  }

  // Editor
  this.nodeEditor = goog.dom.getElement(this.prefix + 'code');
  this.blockly.inject(this.nodeEditor, {
    css: this.css,
    path: this.mediaFiles,
    toolbox: this.nodeEditorToolbox,
    trashcan: opt_trashcan,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    }});

  // Monitor changes
  var viewportMonitor = new goog.dom.ViewportSizeMonitor();
  this.addEventListener(viewportMonitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);

  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.RESIZE,
        this.adjustSize, false, this);
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
  this.enabled = true;
  this.adjustSize();
};


/**
 * Shows/Hides the Blockly editor.
 * @param {boolean} visible
 */
cwc.ui.Blockly.prototype.showBlockly = function(visible) {
  goog.style.setElementShown(this.node, visible);
  if (visible) {
    cwc.ui.Helper.showElements(this.autoHideElements);
  } else {
    cwc.ui.Helper.hideElements(this.autoHideElements);
  }
  window.dispatchEvent(new Event('resize'));
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.Blockly.prototype.addOption = function(name, func,
    opt_tooltip) {
  if (this.toolbar) {
    this.toolbar.addOption(name, func, opt_tooltip);
  }
};


/**
 * @param {!goog.ui.ToolbarButton} button
 * @param {boolean=} opt_seperator
 * @param {string=} opt_hint
 */
cwc.ui.Blockly.prototype.addToolbarButton = function(button,
    opt_seperator, opt_hint) {
  this.toolbar.addToolbarButton(button, opt_seperator);
  if (opt_hint) {
    var elem = button.getContentElement().parentNode.parentNode;
    goog.dom.setProperties(elem, {'data-hint': opt_hint});
    goog.dom.classes.add(elem, 'hint--right');
    console.log(elem);
  }
};


/**
 * @param {!function(?)} func
 */
cwc.ui.Blockly.prototype.addChangeListener = function(func) {
  this.getWorkspace().addChangeListener(func);
};


/**
 * @return {string}
 */
cwc.ui.Blockly.prototype.getJavaScript = function() {
  return this.blockly.JavaScript.workspaceToCode(this.getWorkspace());
};


/**
 * @return {Object}
 */
cwc.ui.Blockly.prototype.getXML = function() {
  var xml = this.blockly.Xml.workspaceToDom(this.getWorkspace());
  return this.blockly.Xml.domToPrettyText(xml);
};


/**
 * @param {string} xml_text
 */
cwc.ui.Blockly.prototype.addView = function(xml_text) {
  if (!xml_text) {
    return;
  }
  var dom = this.blockly.Xml.textToDom(xml_text);
  try {
    this.blockly.Xml.domToWorkspace(this.getWorkspace(), dom);
    this.resetZoom();
  } catch (e) {
    this.helper.showError('Error by loading Blockly file!');
    console.error(e);
    console.log(dom);
  }
};


/**
 * Updates the toolbox.
 * @param {Element=} opt_toolbox
 */
cwc.ui.Blockly.prototype.updateToolbox = function(opt_toolbox) {
  var workspace = this.getWorkspace();
  if (opt_toolbox) {
    this.nodeEditorToolbox = opt_toolbox;
  }
  workspace.updateToolbox(this.nodeEditorToolbox);
};


/**
 * @return {Blockly.mainWorkspace}
 */
cwc.ui.Blockly.prototype.getWorkspace = function() {
  return this.blockly.getMainWorkspace();
};


/**
 * @return {boolean}
 */
cwc.ui.Blockly.prototype.isModified = function() {
  return this.modified;
};


/**
 * @param {!boolean} modified
 */
cwc.ui.Blockly.prototype.setModified = function(modified) {
  this.modified = modified;
};


/**
 * Adjusts size after resize or on size change.
 */
cwc.ui.Blockly.prototype.adjustSize = function() {
  if (!this.node || !this.enabled) {
    return;
  }

  var parentElement = goog.dom.getParentElement(this.node);
  var toolbarElement = goog.dom.getElement(this.prefix + 'toolbar');
  if (parentElement) {
    var parentSize = goog.style.getSize(parentElement);
    var newHeight = parentSize.height;
    if (toolbarElement) {
      var toolbarSize = goog.style.getSize(toolbarElement);
      newHeight = newHeight - toolbarSize.height;
    }
    var contentSize = new goog.math.Size(parentSize.width, newHeight);
    goog.style.setSize(this.nodeEditor, contentSize);
    window.dispatchEvent(new Event('resize'));  // Inform Blockly
  }
};


/**
 * Reset zoom and center blocks.
 */
cwc.ui.Blockly.prototype.resetZoom = function() {
  var workspace = this.getWorkspace();
  if (workspace) {
    workspace.setScale(1);
    workspace.scrollCenter();
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
 */
cwc.ui.Blockly.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.ui.Blockly.prototype.cleanUp = function() {
  this.enabled = false;
  this.listener = this.helper.removeEventListeners(this.listener, this.name);
  this.styleSheet = this.helper.uninstallStyles(this.styleSheet);
  cwc.ui.Helper.hideElements(this.autoHideElements);
  this.modified = false;
};
