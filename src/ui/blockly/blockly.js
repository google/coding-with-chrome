/**
 * @fileoverview Blockly Editor for the Coding with Chrome editor.
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
goog.require('cwc.ui.BlocklyToolbox');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

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

  /** @type {string} */
  this.mediaFiles = '../external/blockly/';

  /** @type {boolean} */
  this.modified = false;

  /** @type {!boolean} */
  this.zoomControl = true;

  /** @type {Blockly.WorkspaceSvg} */
  this.workspace = null;

  /** @type {cwc.ui.BlocklyToolbar} */
  this.toolbar = null;

  /** @type {cwc.ui.BlocklyToolbox} */
  this.toolbox = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!boolean} */
  this.isVisible_ = true;

  /** @private {!boolean} */
  this.disableOrphansBlocks_ = false;

  /** @private {Function} */
  this.editorChangeHandler_ = null;

  /** @private {!string} */
  this.viewName_ = '';

  /** @private {Object} */
  this.options_ = {
    'path': this.mediaFiles,
    'toolbox': '<xml><category></category></xml>',
    'trashcan': true,
    'grid': {
      'spacing': 20,
      'length': 3,
      'colour': '#ccc',
      'snap': true,
    },
    'zoom': {
      'controls': true,
      'wheel': true,
      'startScale': 1.0,
      'maxScale': 3,
      'minScale': 0.5,
      'scaleSpeed': 1.1,
    },
  };

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the Blockly editor into the given node.
 * @param {Element=} node
 * @param {Object=} options Optional dictionary of options.
 */
cwc.ui.Blockly.prototype.decorate = function(node, options = this.options_) {
  this.node = node || goog.dom.getElement(this.prefix + 'chrome');
  if (!this.node) {
    console.error('Invalid Blockly node:', this.node);
    return;
  }

  // Render blockly editor template.
  this.log_.debug('Decorate', this.name, 'into node', this.node);
  goog.soy.renderElement(this.node, cwc.soy.ui.Blockly.template, {
    prefix: this.prefix,
  });

  // Editor node
  this.nodeEditor = goog.dom.getElement(this.prefix + 'code');
  if (!this.nodeEditor) {
    this.log_.error('Unable to find Blockly node to decorate!');
    return;
  }

  // Decorate Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');
  if (this.nodeToolbar) {
    this.toolbar = new cwc.ui.BlocklyToolbar(this.helper);
    this.toolbar.decorate(this.nodeToolbar);
  }

  // Modal window
  let dialogInstance = this.helper.getInstance('dialog');
  if (dialogInstance) {
    Blockly['alert'] = function(message, callback) {
      dialogInstance.showAlert('Blockly alert', message).then(callback);
    };
    Blockly['confirm'] = function(message, callback) {
      dialogInstance.showActionCancel('Blockly confirm', message, 'Confirm')
        .then(callback);
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
  this.log_.info('Decorating Blockly node', this.nodeEditor, 'with', options);
  this.workspace = Blockly.inject(this.nodeEditor, options);

  // Blockly Toolbox
  this.toolbox = new cwc.ui.BlocklyToolbox(this.helper);
  this.toolbox.decorate();

  // Monitor changes
  let viewportMonitor = new goog.dom.ViewportSizeMonitor();
  if (viewportMonitor) {
    this.events_.listen(viewportMonitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);
  }

  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.RESIZE,
        this.adjustSize, false, this);
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
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

  this.adjustSize();
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
 * @param {!string} name
 * @param {string=} xml
 */
cwc.ui.Blockly.prototype.addView = function(name, xml) {
  this.viewName_ = name;
  if (!xml) {
    return;
  }
  let workspace = this.getWorkspace();
  if (workspace) {
    this.log_.info('Add view', name, '(', xml.length, ')');
    let xmlDom = Blockly.Xml.textToDom(xml);
    try {
      Blockly.Xml.domToWorkspace(xmlDom, workspace);
      this.resetZoom();
      workspace.undoStack_ = [];
      workspace.redoStack_ = [];
    } catch (e) {
      this.helper.showError('Error by loading Blockly file!');
      this.log_.error(e);
      this.log_.debug(xml);
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
 * @return {Blockly.WorkspaceSvg}
 */
cwc.ui.Blockly.prototype.getWorkspace = function() {
  if (!this.workspace) {
    this.log_.warn('Blockly workspace is not ready yet!');
  }
  return this.workspace;
};


/**
 * @return {!string}
 */
cwc.ui.Blockly.prototype.getViewName = function() {
  return this.viewName_;
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
      this.log_.error(e);
      this.log_.debug(xml);
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
 * @param {!string} name
 * @param {!string|Object} value
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
 * @param {boolean} enable
 */
cwc.ui.Blockly.prototype.enableToolboxAutoCollapse = function(enable) {
  this.toolbox.setAutoCollapse(enable);
};


/**
 * @param {!Function} template
 * @param {Object=} data
 */
cwc.ui.Blockly.prototype.setToolboxTemplate = function(template, data) {
  this.toolbox.setTemplate(template, data);
  this.toolbox.update();
  this.toolbox.decorate();
};


/**
 * @param {!Array} files
 */
cwc.ui.Blockly.prototype.setToolboxFiles = function(files) {
  this.toolbox.setFiles(files);
};

/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.Blockly.prototype.cleanUp_ = function() {
  this.enabled = false;
  this.events_.clear();
  cwc.ui.Helper.hideElements(this.widgetClass);
  this.modified = false;
};


/**
 * @param {goog.events.EventLike} e
 * @private
 */
cwc.ui.Blockly.prototype.handleChangeEvent_ = function(e) {
  switch (e.type) {
    case Blockly.Events.UI:
      this.toolbox.decorateThreeLabels();
      if (e.newValue) {
        if (this.toolbox.getAutoCollapse()) {
          this.toolbox.collapse(e.newValue);
        }
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
