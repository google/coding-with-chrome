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
  this.nodeBlocklyToolbox_ = null;

  /** @type {string} */
  this.mediaFiles = '../external/blockly/';

  /** @type {Array} */
  this.listener = [];

  /** @type {boolean} */
  this.modified = false;

  /** @type {!boolean} */
  this.zoomControl = true;

  /** @type {cwc.ui.BlocklyToolbar} */
  this.toolbar = null;

  /** @type {Blockly.Workspace} */
  this.workspace = null;

  /** @type {Object} */
  this.toolboxTemplate = null;

  /** @type {!Object} */
  this.toolboxTemplateData = {type: '', files: []};

  /** @type {!cwc.utils.Logger} */
  this.log = this.helper.getLogger();

  /** @private {!boolean} */
  this.isVisible_ = true;
};


/**
 * Decorates the Blockly editor into the given node.
 * @param {!Element} node
 * @param {Object=} opt_options Optional dictionary of options.
 */
cwc.ui.Blockly.prototype.decorate = function(node, opt_options) {
  this.node = node;

  // Template
  goog.soy.renderElement(this.node, cwc.soy.ui.Blockly.template, {
    experimental: this.helper.experimentalEnabled(),
    prefix: this.prefix
  });

  // Toolbar
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar-chrome');
  if (this.nodeToolbar) {
    this.toolbar = new cwc.ui.BlocklyToolbar(this.helper);
    this.toolbar.decorate(this.nodeToolbar, this.node, this.prefix);
  }

  // Modal window
  var dialogInstance = this.helper.getInstance('dialog');
  if (dialogInstance) {
    Blockly['alert'] = function(message, callback) {
      dialogInstance.showAlert('Blockly alert', message).then(callback);
    };
    Blockly['confirm'] = function(message, callback) {
      dialogInstance.showYesNo('Blockly confirm', message).then(callback);
    };
    Blockly['prompt'] = function(message, default_value, callback) {
      dialogInstance.showPrompt(
        'Blockly prompt', message, default_value).then(callback);
    };
  }

  // Blockly options
  var options = opt_options || {
    'path': this.mediaFiles,
    'toolbox': this.nodeBlocklyToolbox_ || '<xml><category><\/category><\/xml>',
    'trashcan': true,
    'grid': {
      'spacing': 20,
      'length': 3,
      'colour': '#ccc',
      'snap': true
    },
    'zoom': {
      'controls': true,
      'startScale': 1.0,
      'maxScale': 3,
      'minScale': 0.3,
      'scaleSpeed': 1.2
    }
  };

  // Loading user defined settings.
  var userConfigInstance = this.helper.getInstance('userConfig');
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
  } else {
    this.adjustSize();
  }

  // Monitor changes
  var viewportMonitor = new goog.dom.ViewportSizeMonitor();
  if (viewportMonitor) {
    this.addEventListener(viewportMonitor, goog.events.EventType.RESIZE,
      this.adjustSize, false, this);
  }

  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.RESIZE,
        this.adjustSize, false, this);
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
  this.enabled = true;
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
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.Blockly.prototype.addOption = function(name, func, opt_tooltip) {
  if (this.toolbar) {
    this.toolbar.addOption(name, func, opt_tooltip);
  }
};


/**
 * @param {!function(?)} func
 */
cwc.ui.Blockly.prototype.addChangeListener = function(func) {
  var workspace = this.getWorkspace();
  if (workspace) {
    workspace.addChangeListener(func);
  }
};


/**
 * Undo the last change in the editor.
 * @return {Object}
 */
cwc.ui.Blockly.prototype.undoChange = function() {
  var workspace = this.getWorkspace();
  var undo = 0;
  var redo = 0;
  if (workspace) {
    workspace.undo();
    undo = workspace.undoStack_.length;
    redo = workspace.redoStack_.length;
  }
  return {
    'undo': undo,
    'redo': redo
  };
};


/**
 * Redo the last change in the editor.
 * @return {Object}
 */
cwc.ui.Blockly.prototype.redoChange = function() {
  var workspace = this.getWorkspace();
  var undo = 0;
  var redo = 0;
  if (workspace) {
    workspace.undo(true);
    undo = workspace.undoStack_.length;
    redo =  workspace.redoStack_.length;
  }
  return {
    'undo': undo,
    'redo': redo
  };
};


/**
 * @return {!string}
 */
cwc.ui.Blockly.prototype.getJavaScript = function() {
  var workspace = this.getWorkspace();
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
  var workspace = this.getWorkspace();
  if (workspace) {
    try {
      var xml = Blockly.Xml.workspaceToDom(workspace, true);
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
 * @param {string} xml_text
 */
cwc.ui.Blockly.prototype.addView = function(xml_text) {
  if (!xml_text) {
    return;
  }
  var workspace = this.getWorkspace();
  if (workspace) {
    try {
      var xml = Blockly.Xml.textToDom(xml_text);
      Blockly.Xml.domToWorkspace(xml, workspace);
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
 * Enable/Disable the media button.
 * @param {boolean} enable
 */
cwc.ui.Blockly.prototype.enableMediaButton = function(enable) {
  if (this.toolbar) {
    this.toolbar.enableMediaButton(enable);
  }
};


/**
 * Updates the media button appearance.
 * @param {boolean} has_files
 */
cwc.ui.Blockly.prototype.updateMediaButton = function(has_files) {
  if (this.toolbar) {
    this.toolbar.updateMediaButton(has_files);
  }
};


/**
 * @param {!Element} toolbox
 */
cwc.ui.Blockly.prototype.setToolbox = function(toolbox) {
  this.nodeBlocklyToolbox_ = toolbox;
};


/**
 * Updates the toolbox.
 * @param {Element=} opt_toolbox
 */
cwc.ui.Blockly.prototype.updateToolbox = function(opt_toolbox) {
  var workspace = this.getWorkspace();
  if (workspace) {
    workspace.updateToolbox(opt_toolbox || this.nodeBlocklyToolbox_);
  }
  this.resize();
};


/**
 * @param {!Object} template
 * @param {Object=} opt_data
 */
cwc.ui.Blockly.prototype.setToolboxTemplate = function(template, opt_data) {
  this.toolboxTemplate = template;
  if (opt_data) {
    this.toolboxTemplateData = opt_data;
  }
};


/**
 * Update the toolbox with the template
 * @param {Object=} opt_template
 * @param {Object=} opt_data
 */
cwc.ui.Blockly.prototype.updateToolboxTemplate = function(
    opt_template, opt_data) {
  var template = opt_template || this.toolboxTemplate;
  var workspace = this.getWorkspace();
  if (template && workspace) {
    var toolbox = template(opt_data || this.toolboxTemplateData).content;
    workspace.updateToolbox(toolbox);
    this.resize();
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
  var data = this.toolboxTemplateData || {};
  data.files = files;
  console.log('Blockly files', data);
  this.toolboxTemplateData = data;
  this.updateToolboxTemplate();
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
 * @param {!string} name
 * @param {!string|object} value
 */
cwc.ui.Blockly.prototype.setWorkspaceOption = function(name, value) {
  var workspace = this.getWorkspace();
  if (workspace) {
    workspace.options[name] = value;
  }
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
  if (parentElement) {
    var parentSize = goog.style.getSize(parentElement);
    var newHeight = parentSize.height;
    if (this.nodeToolbar) {
      var toolbarSize = goog.style.getSize(this.nodeToolbar);
      newHeight = newHeight - toolbarSize.height;
    }
    var contentSize = new goog.math.Size(parentSize.width, newHeight);
    goog.style.setSize(this.nodeEditor, contentSize);
  }
  this.resize();
};


/**
 * Resizes the workspace.
 */
cwc.ui.Blockly.prototype.resize = function() {
  var workspace = this.getWorkspace();
  if (workspace) {
    Blockly.svgResize(workspace);
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
  cwc.ui.Helper.hideElements(this.widgetClass);
  this.modified = false;
};
