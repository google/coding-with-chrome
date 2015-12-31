/**
 * @fileoverview Code Editor for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Editor');

goog.require('cwc.file.ContentType');
goog.require('cwc.fileFormat.File');
goog.require('cwc.soy.ui.Editor');
goog.require('cwc.ui.EditorFlags');
goog.require('cwc.ui.EditorToolbar');
goog.require('cwc.ui.EditorType');
goog.require('cwc.ui.EditorView');
goog.require('cwc.utils.Helper');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.KeyCodes');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Select');
goog.require('goog.ui.ToolbarButton');



/**
 * Customizable Code Editor.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Editor = function(helper) {
  /** @type {CodeMirror} */
  this.editor = null;

  /** @type {string} */
  this.name = 'Editor';

  /** @type {cwc.ui.EditorFlags} */
  this.editorFlags = new cwc.ui.EditorFlags();

  /** @type {cwc.ui.EditorType|string} */
  this.editorType = cwc.ui.EditorType.UNKNOWN;

  /** @type {Object} */
  this.editorView = {};

  /** @type {string} */
  this.currentEditorView = '';

  /** @type {!string} */
  this.prefix = 'editor-';

  /** @type {!string} */
  this.generalPrefix = '';

  /** @type {!CodeMirror.CursorPosition|string} */
  this.cursorPosition = '';

  /** @type {boolean} */
  this.modified = false;

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {Element} */
  this.nodeInfobar = null;

  /** @type {Element} */
  this.nodeInfobarLineCol = null;

  /** @type {Element} */
  this.nodeInfobarMode = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element} */
  this.nodeSelectView = null;

  /** @type {!goog.ui.Select} */
  this.infobarModeSelect = new goog.ui.Select('Change the editor mode.');

  /** @type {!cwc.ui.EditorToolbar} */
  this.toolbar = new cwc.ui.EditorToolbar(helper);

  /** @type {!Array} */
  this.gutters = ['CodeMirror-linenumbers', 'CodeMirror-breakpoints',
                  'CodeMirror-foldgutter', 'CodeMirror-lint-markers'];

  /** @type {!Array} */
  this.rulers = [{color: '#ccc', column: 80, lineStyle: 'dashed'}];

  /** @type {!string} */
  this.theme = 'default';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {Array} */
  this.listener = [];
};


/**
 * Decorates the given node and adds the code editor.
 * @param {Element} node The target node to add the code editor.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Editor.prototype.decorate = function(node, opt_prefix) {
  this.editorFlags = new cwc.ui.EditorFlags();
  this.editorView = {};
  this.generalPrefix = opt_prefix || '';
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;
  this.modified = false;

  console.log('Decorate', this.name, 'into node', this.node);
  goog.soy.renderElement(
      this.node, cwc.soy.ui.Editor.template, {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.ui.Editor.style({ 'prefix': this.prefix }));
  }

  // Decorate editor toolbar.
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');
  this.nodeSelectView = goog.dom.getElement(this.prefix + 'view');
  this.toolbar.decorate(this.nodeToolbar, this.node, this.nodeSelectView);

  // Decorate code editor.
  this.nodeEditor = goog.dom.getElement(this.prefix + 'code');
  this.decorateEditor(this.nodeEditor);

  // Decorate editor infobar.
  this.nodeInfobar = goog.dom.getElement(this.prefix + 'infobar');
  this.nodeInfobarLineCol = goog.dom.getElement(this.prefix + 'info-line-col');
  this.nodeInfobarMode = goog.dom.getElement(this.prefix + 'info-mode');
  for (var editorType in CodeMirror.mimeModes) {
    this.infobarModeSelect.addItem(new goog.ui.MenuItem(editorType));
  }
  this.infobarModeSelect.render(this.nodeInfobarMode);
  this.infobarModeSelect.setEnabled(false);
  goog.style.setStyle(this.infobarModeSelect.getElement(), 'border', '0');
  this.addEventListener(this.infobarModeSelect,
      goog.ui.Component.EventType.ACTION,
      this.changeEditorType, false, this);

  // Add event listener to monitor changes like resize and unload.
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
  this.adjustSize();
};


/**
 * Decorates the Code Mirror editor with default options.
 * @param {Element} node
 */
cwc.ui.Editor.prototype.decorateEditor = function(node) {
  console.log('Decorate code editor …');
  if (!node) {
    console.error('Was unable to create editor at node ' + node);
    return;
  }

  var extraKeys = {
    'Ctrl-Q': function(cm) { cm.foldCode(cm.getCursor()); },
    'Ctrl-J': 'toMatchingTag',
    'Shift-Space': 'autocomplete'
  };
  var foldGutterEvent = {
    'rangeFinder': new CodeMirror.fold.combine(CodeMirror.fold.brace,
                                               CodeMirror.fold.comment)};
  var gutterClickEvent = function(cm, n) {
    var info = cm.lineInfo(n);
    cm.setGutterMarker(n,
        'CodeMirror-breakpoints',
        info.gutterMarkers ? null : cwc.ui.Editor.createMarker());
  };
  var cursorEvent = this.updateCursorPosition.bind(this);
  var changeEvent = this.handleChangeEvent.bind(this);
  this.editor = new CodeMirror(node);
  this.editor.setOption('autoCloseBrackets', true);
  this.editor.setOption('autoCloseTags', true);
  this.editor.setOption('extraKeys', extraKeys);
  this.editor.setOption('foldGutter', foldGutterEvent);
  this.editor.setOption('gutters', this.gutters);
  this.editor.setOption('highlightSelectionMatches', { showToken: /\w/});
  this.editor.setOption('lineNumbers', true);
  this.editor.setOption('matchTags', { bothTags: true });
  this.editor.setOption('rulers', this.rulers);
  this.editor.setOption('showTrailingSpace', true);
  this.editor.setOption('styleActiveLine', true);
  this.editor.setOption('styleActiveLine', true);
  this.editor.setOption('theme', this.theme);
  this.editor.on('cursorActivity', cursorEvent);
  this.editor.on('gutterClick', gutterClickEvent);
  this.editor.on('change', changeEvent);
};


/**
 * Changes the Editor code mode.
 * @param {Event} event
 */
cwc.ui.Editor.prototype.changeEditorType = function(event) {
  var selectTarget = event.target;
  var selectedValue = selectTarget.getValue();
  this.setEditorMode(selectedValue);
};


/**
 * Shows/Hides the editor.
 * @param {boolean} visible
 */
cwc.ui.Editor.prototype.showEditor = function(visible) {
  goog.style.setElementShown(this.node, visible);
  if (visible && this.editor) {
    this.editor.refresh();
  }
};


/**
 * Shows/Hides the editor views like CSS, HTML and JavaScript.
 * @param {boolean} visible
 */
cwc.ui.Editor.prototype.showEditorViews = function(visible) {
  goog.style.setElementShown(this.nodeSelectView, visible);
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.Editor.prototype.showExpandButton = function(visible) {
  this.toolbar.showExpandButton(visible);
};


/**
 * Shows/Hide the editor type like "text/javascript" inside the info bar.
 * @param {boolean} visible
 */
cwc.ui.Editor.prototype.showEditorTypeInfo = function(visible) {
  goog.style.setElementShown(this.nodeInfobarMode, visible);
};


/**
 * Enables/Disables the editor type like "text/javascript" inside the info bar.
 * @param {boolean} enable
 */
cwc.ui.Editor.prototype.enableModeSelect = function(enable) {
  this.infobarModeSelect.setEnabled(enable);
};


/**
 * Enable/Disable the media button.
 * @param {boolean} enable
 */
cwc.ui.Editor.prototype.enableMediaButton = function(enable) {
  if (this.toolbar) {
    this.toolbar.enableMediaButton(enable);
  }
};


/**
 * Updates the media button appearance.
 * @param {boolean} has_files
 */
cwc.ui.Editor.prototype.updateMediaButton = function(has_files) {
  if (this.toolbar) {
    this.toolbar.updateMediaButton(has_files);
  }
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.Editor.prototype.addOption = function(name, func,
    opt_tooltip) {
  if (this.toolbar) {
    this.toolbar.addOption(name, func, opt_tooltip);
  }
};


/**
 * @param {!goog.ui.ToolbarButton} button
 * @param {boolean=} opt_seperator
 */
cwc.ui.Editor.prototype.addToolbarButton = function(button,
    opt_seperator) {
  this.toolbar.addToolbarButton(button, opt_seperator);
};


/**
 * Returns Editor code mode.
 * @return {string}
 */
cwc.ui.Editor.prototype.getEditorMode = function() {
  return this.editor.getOption('mode');
};


/**
 * Sets the Editor Mode to the selected mode.
 * @param {!(cwc.ui.EditorType|string)} mode Editor code mode.
 */
cwc.ui.Editor.prototype.setEditorMode = function(mode) {
  if (mode && mode != this.editorType) {
    console.log('Set editor mode to: ' + mode);
    this.editor.setOption('mode', mode);
    this.editorType = mode;
    this.updateInfobar();
    this.updateToolbar();
    this.refreshEditor();
  }
};


/**
 * @param {string=} opt_name
 * @return {Object}
 */
cwc.ui.Editor.prototype.getEditorContent = function(opt_name) {
  var editorContent = {};

  if (opt_name) {
    if (opt_name in this.editorView) {
      return this.editorView[opt_name].getContent();
    } else {
      console.error('Editor content', opt_name, 'is not defined!');
    }
  } else {
    for (var view in this.editorView) {
      if (this.editorView.hasOwnProperty(view)) {
        editorContent[view] = this.editorView[view].getContent();
      }
    }
  }

  return editorContent;
};


/**
 * @param {!string} content
 * @param {string=} opt_view
 */
cwc.ui.Editor.prototype.setEditorContent = function(content,
    opt_view) {
  var view = opt_view || cwc.file.ContentType.CUSTOM;
  if (view in this.editorView) {
    this.editorView[view].setContent(content);
  } else {
    console.error('Editor view', view, 'is unknown!');
  }
};


/**
 * @param {!string} content
 */
cwc.ui.Editor.prototype.setEditorJavaScriptContent = function(
    content) {
  this.setEditorContent(content,
      cwc.file.ContentType.JAVASCRIPT);
};


/**
 * @return {cwc.ui.EditorFlags}
 */
cwc.ui.Editor.prototype.getEditorFlags = function() {
  return this.editorFlags;
};


/**
 * @param {!cwc.ui.EditorFlags} flags
 */
cwc.ui.Editor.prototype.setEditorFlags = function(flags) {
  this.editorFlags = flags;
};


/**
 * Syntax checks for supported formats.
 * @param {!boolean} active
 */
cwc.ui.Editor.prototype.setSyntaxCheck = function(active) {
  this.editor.setOption('lint', active);
};


/**
 * Autocomplete for supported formats.
 * @param {!boolean} active
 */
cwc.ui.Editor.prototype.setAutocomplete = function(active) {
  this.editor.setOption('autocomplete', active);
};


/**
 * Refreshes the Editor to avoid CSS issues.
 */
cwc.ui.Editor.prototype.refreshEditor = function() {
  this.editor.refresh();
};


/**
 * Undo the last change in the editor.
 */
cwc.ui.Editor.prototype.undoChange = function() {
  this.editor.undo();
};


/**
 * Redo the last change in the editor.
 */
cwc.ui.Editor.prototype.redoChange = function() {
  this.editor.redo();
};


/**
 * Selects all in the editor.
 */
cwc.ui.Editor.prototype.selectAll = function() {
  this.cursorPosition = this.editor.getCursor();
  this.editor.execCommand('selectAll');
};


/**
 * Clears selection in the editor.
 */
cwc.ui.Editor.prototype.selectNone = function() {
  var position = this.cursorPosition || this.editor.getCursor('start');
  this.editor.setCursor(position);
};


/**
 * Insert the text at the current cursor position.
 * @param {!string} text
 */
cwc.ui.Editor.prototype.insertText = function(text) {
  this.editor.replaceSelection(text);
  this.selectNone();
};


/**
 * Change editor view to the given name.
 * @param {!string} name
 */
cwc.ui.Editor.prototype.changeView = function(name) {
  if (!(name in this.editorView)) {
    console.error('Editor view "' + name + '" not exists!');
    return;
  }

  var editorView = this.editorView[name];
  this.editor.swapDoc(editorView.getDoc());
  this.currentEditorView = name;
  this.setEditorMode(editorView.getType());
};


/**
 * Adds a new editor view with the given name.
 * @param {!string} name
 * @param {string=} opt_content
 * @param {cwc.ui.EditorType=} opt_type
 * @param {cwc.ui.EditorFlags=} opt_flags
 */
cwc.ui.Editor.prototype.addView = function(name, opt_content,
    opt_type, opt_flags) {
  if (name in this.editorView) {
    console.error('View "' + name + '"" already exists!');
    return;
  }

  console.log('Create Editor view: ' + name + ' with type: ' + opt_type);
  console.log(opt_content);
  this.editorView[name] = new cwc.ui.EditorView(opt_content,
      opt_type, opt_flags);

  if (this.toolbar) {
    this.toolbar.addView(name);
    this.updateToolbar();
  }

  this.adjustSize();
};


/**
 * @return {string}
 */
cwc.ui.Editor.prototype.getCurrentView = function() {
  return this.currentEditorView;
};


/**
 * @param {Event=} opt_event
 */
cwc.ui.Editor.prototype.handleChangeEvent = function(opt_event) {
  if (!this.modified) {
    this.modified = true;
    if (this.toolbar) {
      this.toolbar.enableUndoButton(this.modified);
    }
  }
  this.eventHandler.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.ui.Editor.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @return {boolean}
 */
cwc.ui.Editor.prototype.isModified = function() {
  return this.modified;
};


/**
 * Adjusts size after resize or on size change.
 */
cwc.ui.Editor.prototype.adjustSize = function() {
  if (!this.node) {
    return;
  }

  var parentElement = goog.dom.getParentElement(this.node);
  var toolbarElement = goog.dom.getElement(this.prefix + 'toolbar');
  var infobarElement = goog.dom.getElement(this.prefix + 'infobar');
  if (parentElement) {
    var parentSize = goog.style.getSize(parentElement);
    var newHeight = parentSize.height;
    if (toolbarElement) {
      var toolbarSize = goog.style.getSize(toolbarElement);
      newHeight = newHeight - toolbarSize.height;
    }
    if (infobarElement) {
      var infobarSize = goog.style.getSize(infobarElement);
      newHeight = newHeight - infobarSize.height;
    }
    this.editor.setSize(parentSize.width, newHeight);
  }
  this.refreshEditor();
};


/**
 * @return {Element}
 */
cwc.ui.Editor.createMarker = function() {
  var marker = document.createElement('div');
  marker.className = 'CodeMirror-breakpoint';
  return marker;
};


/**
 * Updates the editor Infobar.
 */
cwc.ui.Editor.prototype.updateInfobar = function() {
  console.info('Update Infobar …');
  if (this.nodeInfobarMode) {
    if (this.infobarModeSelect) {
      this.infobarModeSelect.setValue(this.getEditorMode());
    }
  }

  if (this.nodeInfobarLineCol) {
    goog.dom.setTextContent(this.nodeInfobarLineCol, '1 : 0');
  }
};


/**
 * Updates the editor Toolbar.
 */
cwc.ui.Editor.prototype.updateToolbar = function() {
  var editorMode = this.getEditorMode();
  console.info('Update Toolbar for', editorMode);
  if (this.toolbar) {
    this.toolbar.updateToolbar(editorMode);
  }
};


/**
 * Updates the cursor position within the editor.
 * @param {CodeMirror} cm
 */
cwc.ui.Editor.prototype.updateCursorPosition = function(cm) {
  if (this.nodeInfobarLineCol) {
    var position = cm.getCursor();
    goog.dom.setTextContent(this.nodeInfobarLineCol,
        (position.line + 1) + ' : ' + (position.ch + 1));
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 */
cwc.ui.Editor.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.ui.Editor.prototype.cleanUp = function() {
  this.listener = this.helper.removeEventListeners(this.listener, this.name);
  this.styleSheet = this.helper.uninstallStyles(this.styleSheet);
  this.modified = false;
};
