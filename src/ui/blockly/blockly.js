/**
 * @fileoverview Blocky Editor for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Blockly');

goog.require('cwc.soy.ui.Blockly');
goog.require('cwc.ui.BlocklyToolbar');
goog.require('cwc.ui.Helper');

goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.dom.classlist');
goog.require('goog.math.Size');
goog.require('goog.style');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Blockly = function(helper) {
  /** @type {string} */
  this.name = 'Blockly';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('blockly');

  /** @type {string} */
  this.widgetClass = 'blocklyWidgetDiv';

  /** @type {boolean} */
  this.enabled = false;

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @private {Element} */
  this.nodeToolbox_ = null;

  /** @type {string} */
  this.mediaFiles = '../external/blockly/';

  /** @type {Array} */
  this.listener_ = [];

  /** @type {boolean} */
  this.modified = false;

  /** @type {!boolean} */
  this.zoomControl = true;

  /** @type {Blockly.Workspace} */
  this.workspace = null;

  /** @type {cwc.ui.BlocklyToolbar} */
  this.toolbar = null;

  /** @type {boolean} */
  this.toolboxAutocollapse = false;

  /** @type {Object} */
  this.toolboxTemplate = null;

  /** @type {!Object} */
  this.toolboxTemplateData = {type: '', files: []};

  /** @type {!cwc.utils.Logger} */
  this.log = this.helper.getLogger();

  /** @private {!boolean} */
  this.isVisible_ = true;

  /** @private {!boolean} */
  this.disableOrphansBlocks_ = false;

  /** @private {Function} */
  this.editorChangeHandler_ = null;

  /** @private {!string} */
  this.rowItemClass_ = 'blocklyTreeRowItem';

  /** @private {Object} */
  this.options_ = {
    'path': this.mediaFiles,
    'toolbox': '<xml><category><\/category><\/xml>',
    'trashcan': true,
    'grid': {
      'spacing': 20,
      'length': 3,
      'colour': '#ccc',
      'snap': true,
    },
    'zoom': {
      'controls': true,
      'startScale': 1.0,
      'maxScale': 3,
      'minScale': 0.3,
      'scaleSpeed': 1.2,
    },
  };
};


/**
 * Decorates the Blockly editor into the given node.
 * @param {!Element} node
 * @param {Object=} options Optional dictionary of options.
 */
cwc.ui.Blockly.prototype.decorate = function(node, options = this.options_) {
  this.node = node;

  // Template
  goog.soy.renderElement(this.node, cwc.soy.ui.Blockly.template, {
    experimental: this.helper.experimentalEnabled(),
    prefix: this.prefix,
  });

  // Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar-chrome');
  if (this.nodeToolbar) {
    this.toolbar = new cwc.ui.BlocklyToolbar(this.helper);
    this.toolbar.decorate(this.nodeToolbar, this.node, this.prefix);
  }

  // Modal window
  let dialogInstance = this.helper.getInstance('dialog');
  if (dialogInstance) {
    Blockly['alert'] = function(message, callback) {
      dialogInstance.showAlert('Blockly alert', message).then(callback);
    };
    Blockly['confirm'] = function(message, callback) {
      dialogInstance.showYesNo('Blockly confirm', message).then(callback);
    };
    Blockly['prompt'] = function(message, defaultValue, callback) {
      dialogInstance.showPrompt(
        'Blockly prompt', message, defaultValue).then(callback);
    };
  }

  // Adding start hat
  Blockly.BlockSvg.START_HAT = true;

  // Change color-space
  Blockly.HSV_SATURATION = 0.5;
  Blockly.HSV_VALUE = 0.7;

  // Loading user defined settings.
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    this.zoomControl = userConfigInstance.get(cwc.userConfigType.BLOCKLY,
      cwc.userConfigName.ZOOM);
  }

  // Blockly Editor
  this.nodeEditor = goog.dom.getElement(this.prefix + 'code');
  this.log.info('Decorating Blockly node', this.nodeEditor, 'with', options);
  this.workspace = Blockly.inject(this.nodeEditor, options);

  // Blockly Toolbox
  if (this.toolboxTemplate) {
    this.updateToolboxTemplate();
  } else if (this.nodeToolbox_) {
    this.updateToolbox();
  } else {
    this.adjustSize();
  }
  this.decorateToolbox_();

  // Monitor changes
  let viewportMonitor = new goog.dom.ViewportSizeMonitor();
  if (viewportMonitor) {
    this.addEventListener_(viewportMonitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);
  }

  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.addEventListener_(eventHandler, goog.events.EventType.RESIZE,
        this.adjustSize, false, this);
    this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp_, false, this);
  }

  // Event Handling
  this.addChangeListener(this.handleChangeEvent_.bind(this));

  // Library button
  let libraryInstance = this.helper.getInstance('library');
  if (this.workspace && libraryInstance) {
    this.workspace.registerButtonCallback('FILE_LIBRARY_MANAGMENT', function() {
      libraryInstance.showLibrary();
    });
  }

  this.enabled = true;
};


/**
 * @param {!function(?)} func
 */
cwc.ui.Blockly.prototype.addChangeListener = function(func) {
  let workspace = this.getWorkspace();
  if (workspace) {
    workspace.addChangeListener(func);
  }
};


/**
 * @param {!function(?)} func
 */
cwc.ui.Blockly.prototype.addEditorChangeHandler = function(func) {
  this.editorChangeHandler_ = func;
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} tooltip
 */
cwc.ui.Blockly.prototype.addOption = function(name, func, tooltip) {
  if (this.toolbar) {
    this.toolbar.addOption(name, func, tooltip);
  }
};


/**
 * @param {string} xml
 */
cwc.ui.Blockly.prototype.addView = function(xml) {
  if (!xml) {
    return;
  }
  let workspace = this.getWorkspace();
  if (workspace) {
    let xmlDom = Blockly.Xml.textToDom(xml);
    try {
      Blockly.Xml.domToWorkspace(xmlDom, workspace);
      this.resetZoom();
      workspace.undoStack_ = [];
      workspace.redoStack_ = [];
    } catch (e) {
      this.helper.showError('Error by loading Blockly file!');
      console.error(e);
      console.log(xml);
    }
  }
};


/**
 * Adjusts size after resize or on size change.
 */
cwc.ui.Blockly.prototype.adjustSize = function() {
  if (!this.node || !this.enabled) {
    return;
  }

  let parentElement = goog.dom.getParentElement(this.node);
  if (parentElement) {
    let parentSize = goog.style.getSize(parentElement);
    let newHeight = parentSize.height;
    if (this.nodeToolbar) {
      let toolbarSize = goog.style.getSize(this.nodeToolbar);
      newHeight = newHeight - toolbarSize.height;
    }
    let contentSize = new goog.math.Size(parentSize.width, newHeight);
    goog.style.setSize(this.nodeEditor, contentSize);
  }
  this.resize();
};


/**
 * Collapse Toolbox without the optional label.
 * @param {string=} ignoreLabel
 */
cwc.ui.Blockly.prototype.collapseToolbox = function(ignoreLabel = '') {
  let treeRoot = document.getElementsByClassName('blocklyTreeRoot')[0];
  if (!treeRoot) {
    return;
  }
  let itemClassName = this.rowItemClass_ + '_' + ignoreLabel.replace(
    /([^a-z0-9 ]+)/gi, '').replace(/( )+/g, '_').toLowerCase();
  let skipItem = treeRoot.getElementsByClassName(itemClassName)[0];
  if (ignoreLabel && !skipItem) {
    return;
  }

  let items = treeRoot.getElementsByClassName(this.rowItemClass_);
  for (let name in items) {
    if (Object.prototype.hasOwnProperty.call(items, name)) {
      let item = items[name];
      if (item !== skipItem) {
        if (item.getAttribute && item.getAttribute('aria-expanded') == 'true') {
          if (item.id && this.getToolboxTree()) {
            this.getToolboxTree().childIndex_[item.id].collapse();
          }
        }
      }
    }
  }
};


/**
 * Clear selection of the toolbox of the current workspace.
 */
cwc.ui.Blockly.prototype.clearSelection = function() {
  let toolbox = this.getToolbox();
  if (toolbox) {
    toolbox.clearSelection();
  }
};


/**
 * Request to create new variable.
 */
cwc.ui.Blockly.prototype.createVariable = function() {
  let workspace = this.getWorkspace();
  if (workspace) {
    Blockly.Variables.createVariable(workspace);
  }
};


/**
 * Disabled blocks not attached to base block.
 * @param {!boolean} enabled
 */
cwc.ui.Blockly.prototype.disableOrphansBlocks = function(enabled) {
  this.disableOrphansBlocks_ = enabled;
};


/**
 * Update the toolbox with the template
 */
cwc.ui.Blockly.prototype.enableToolboxAutocollapse = function() {
  this.toolboxAutocollapse = true;
};


/**
 * Enable/Disable the media button.
 * @param {boolean} enable
 */
cwc.ui.Blockly.prototype.enableMediaButton = function(enable) {
  if (this.toolbar) {
    this.toolbar.enableMediaButton(enable);
  }
};


/**
 * @return {Blockly.Workspace}
 */
cwc.ui.Blockly.prototype.getWorkspace = function() {
  if (!this.workspace) {
    this.log.warn('Blockly workspace is not ready yet!');
  }
  return this.workspace;
};


/**
 * @return {Blockly.Toolbox}
 */
cwc.ui.Blockly.prototype.getToolbox = function() {
  let workspace = this.getWorkspace();
  if (workspace) {
    return workspace.toolbox_;
  }
  return null;
};


/**
 * @return {Blockly.Toolbox.TreeControl}
 */
cwc.ui.Blockly.prototype.getToolboxTree = function() {
  let toolbox = this.getToolbox();
  if (toolbox) {
    return toolbox.tree_;
  }
  return null;
};


/**
 * @return {!string}
 */
cwc.ui.Blockly.prototype.getJavaScript = function() {
  let workspace = this.getWorkspace();
  if (workspace) {
    try {
      return Blockly.JavaScript.workspaceToCode(workspace);
    } catch (e) {
      this.helper.showError('Error getting Blockly workspace code!');
    }
  }
  return '';
};


/**
 * @return {!string}
 */
cwc.ui.Blockly.prototype.getXML = function() {
  let workspace = this.getWorkspace();
  if (workspace) {
    let xml = Blockly.Xml.workspaceToDom(workspace, true);
    try {
      return Blockly.Xml.domToPrettyText(xml);
    } catch (e) {
      this.helper.showError('Error getting Blockly XML!');
      console.error(e);
      console.log(xml);
    }
  }
  return '';
};


/**
 * Shows/Hides the Blockly editor.
 * @param {boolean} visible
 */
cwc.ui.Blockly.prototype.showBlockly = function(visible) {
  this.isVisible_ = visible;
  goog.style.setElementShown(this.node, visible);
  if (visible) {
    window.dispatchEvent(new Event('resize'));
    this.resetZoom();
  }
};


/**
 * Undo the last change in the editor.
 * @return {Object}
 */
cwc.ui.Blockly.prototype.undoChange = function() {
  let workspace = this.getWorkspace();
  let undo = 0;
  let redo = 0;
  if (workspace) {
    workspace.undo();
    undo = workspace.undoStack_.length;
    redo = workspace.redoStack_.length;
  }
  return {
    'undo': undo,
    'redo': redo,
  };
};


/**
 * Redo the last change in the editor.
 * @return {Object}
 */
cwc.ui.Blockly.prototype.redoChange = function() {
  let workspace = this.getWorkspace();
  let undo = 0;
  let redo = 0;
  if (workspace) {
    workspace.undo(true);
    undo = workspace.undoStack_.length;
    redo = workspace.redoStack_.length;
  }
  return {
    'undo': undo,
    'redo': redo,
  };
};


/**
 * Updates the media button appearance.
 * @param {boolean} hasFiles
 */
cwc.ui.Blockly.prototype.updateMediaButton = function(hasFiles) {
  if (this.toolbar) {
    this.toolbar.updateMediaButton(hasFiles);
  }
};


/**
 * @param {!Element} toolbox
 */
cwc.ui.Blockly.prototype.setToolbox = function(toolbox) {
  this.nodeToolbox_ = toolbox;
};


/**
 * Updates the toolbox.
 * @param {Element=} toolbox
 */
cwc.ui.Blockly.prototype.updateToolbox = function(
    toolbox = this.nodeToolbox_) {
  let workspace = this.getWorkspace();
  if (workspace) {
    workspace.updateToolbox(toolbox);
    this.decorateToolbox_();
  }
  this.resize();
};


/**
 * Update the toolbox with the template
 * @param {Object=} template
 * @param {Object=} data
 */
cwc.ui.Blockly.prototype.updateToolboxTemplate = function(
    template = this.toolboxTemplate, data = this.toolboxTemplateData) {
  if (template) {
    let toolbox = template(data).content;
    this.updateToolbox(toolbox);
  } else {
    console.warn('Was unable to update Blockly toolbox.');
  }
};


/**
 * @param {!Array} files
 */
cwc.ui.Blockly.prototype.updateFiles = function(files) {
  if (!this.toolboxTemplate) {
    return;
  }
  let data = this.toolboxTemplateData || {};
  data.files = files;
  this.toolboxTemplateData = data;
  this.updateToolboxTemplate();
};


/**
 * @param {!Object} template
 * @param {Object=} data
 */
cwc.ui.Blockly.prototype.setToolboxTemplate = function(template,
    data = undefined) {
  this.toolboxTemplate = template;
  if (data) {
    this.toolboxTemplateData = data;
  }
};


/**
 * @param {!string} name
 * @param {!string|object} value
 */
cwc.ui.Blockly.prototype.setWorkspaceOption = function(name, value) {
  let workspace = this.getWorkspace();
  if (workspace) {
    workspace.options[name] = value;
  }
};


/**
 * @param {!boolean} modified
 */
cwc.ui.Blockly.prototype.setModified = function(modified) {
  this.modified = modified;
};


/**
 * @return {boolean}
 */
cwc.ui.Blockly.prototype.isModified = function() {
  return this.modified;
};


/**
 * @return {boolean}
 */
cwc.ui.Blockly.prototype.isVisible = function() {
  return this.isVisible_;
};


/**
 * Resizes the workspace.
 */
cwc.ui.Blockly.prototype.resize = function() {
  let workspace = this.getWorkspace();
  if (workspace) {
    Blockly.svgResize(workspace);
  }
};


/**
 * Reset zoom and center blocks.
 */
cwc.ui.Blockly.prototype.resetZoom = function() {
  let workspace = this.getWorkspace();
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
 * @param {boolean=} useCapture
 * @param {Object=} listenerScope
 * @private
 */
cwc.ui.Blockly.prototype.addEventListener_ = function(src, type,
    listener, useCapture = false, listenerScope = undefined) {
  let eventListener = goog.events.listen(src, type, listener, useCapture,
      listenerScope);
  goog.array.insert(this.listener_, eventListener);
};


/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.Blockly.prototype.cleanUp_ = function() {
  this.enabled = false;
  this.listener_ = this.helper.removeEventListeners(this.listener_, this.name);
  cwc.ui.Helper.hideElements(this.widgetClass);
  this.modified = false;
};


/**
 * Enables additional DOM manipulations.
 * @private
 */
cwc.ui.Blockly.prototype.decorateToolbox_ = function() {
  let treeRoot = document.getElementsByClassName('blocklyTreeRoot')[0];
  if (!treeRoot) {
    return;
  }

  let treeLabels = treeRoot.getElementsByClassName('blocklyTreeLabel');
  for (let name in treeLabels) {
    if (Object.prototype.hasOwnProperty.call(treeLabels, name)) {
      let treeLabel = treeLabels[name];
      if (!treeLabel.textContent) {
        continue;
      }
      let label = treeLabel.textContent.replace(/([^a-z0-9 ]+)/gi, '')
        .replace(/( )+/g, '_').toLowerCase();
      let blocklyTreeRowItem = treeLabel.parentNode.parentNode;
      if (blocklyTreeRowItem) {
        goog.dom.classlist.add(blocklyTreeRowItem, this.rowItemClass_);
        goog.dom.classlist.add(blocklyTreeRowItem,
          this.rowItemClass_ + '_' + label);
      }
    }
  }
};


/**
 * @param {goog.events.EventLike} e
 * @private
 */
cwc.ui.Blockly.prototype.handleChangeEvent_ = function(e) {
  switch (e.type) {
    case Blockly.Events.UI:
      if (this.toolboxAutocollapse && e.newValue) {
        this.collapseToolbox(e.newValue);
      }
      break;

    case Blockly.Events.CHANGE:
    case Blockly.Events.CREATE:
    case Blockly.Events.DELETE:
    case Blockly.Events.MOVE:
      if (this.disableOrphansBlocks_) {
        Blockly.Events.disableOrphans(e);
      }
      if (this.editorChangeHandler_) {
        this.editorChangeHandler_(e);
      }
      break;
  }
};
