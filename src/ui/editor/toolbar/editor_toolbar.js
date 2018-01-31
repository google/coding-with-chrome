/**
 * @fileoverview Toolbar of the Code Editor.
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
goog.provide('cwc.ui.EditorToolbar');

goog.require('cwc.file.MimeType');
goog.require('cwc.file.MimeType');
goog.require('cwc.soy.ui.EditorToolbar');
goog.require('cwc.ui.Helper');

goog.require('goog.dom.classlist');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Select');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.EditorToolbar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeSelectView = null;

  /** @type {Element} */
  this.nodeDebug = null;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {Element} */
  this.nodeLibrary = null;

  /** @type {Element} */
  this.nodeMedia = null;

  /** @type {Element} */
  this.nodeMore= null;

  /** @type {Element} */
  this.nodeMoreList = null;

  /** @type {Element} */
  this.nodeSave = null;

  /** @type {Element} */
  this.nodePublish = null;

  /** @type {Element} */
  this.nodeUndo = null;

  /** @type {Element} */
  this.nodeRedo = null;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('editor-toolbar');

  /** @type {!goog.ui.Select} */
  this.selectView = new goog.ui.Select();

  /** @type {string} */
  this.currentView = '';

  /** @type {boolean} */
  this.expandState = false;

  /** @private {cwc.utils.Dialog} */
  this.dialog_ = null;
};


/**
 * @param {Element} node
 * @param {Element} node_select_view
 */
cwc.ui.EditorToolbar.prototype.decorate = function(node, node_select_view) {
  this.node = node;
  this.nodeSelectView = node_select_view;

  // Render editor toolbar.
  goog.soy.renderElement(
    this.node,
    cwc.soy.ui.EditorToolbar.template, {
      experimental: this.helper.experimentalEnabled(),
      prefix: this.prefix,
    }
  );

  this.selectView.setTooltip('Change view');
  this.selectView.render(this.nodeSelectView);
  this.nodeDebug = goog.dom.getElement(this.prefix + 'debug');
  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeLibrary = goog.dom.getElement(this.prefix + 'library');
  this.nodeMedia = goog.dom.getElement(this.prefix + 'media');
  this.nodeMore = goog.dom.getElement(this.prefix + 'menu-more');
  this.nodeMoreList = goog.dom.getElement(this.prefix + 'menu-more-list');
  this.nodeRedo = goog.dom.getElement(this.prefix + 'redo');
  this.nodeSave = goog.dom.getElement(this.prefix + 'save');
  this.nodeUndo = goog.dom.getElement(this.prefix + 'undo');

  cwc.ui.Helper.enableElement(this.nodeUndo, false);
  cwc.ui.Helper.enableElement(this.nodeRedo, false);

  goog.style.setElementShown(this.nodeExpandExit, false);
  goog.style.setElementShown(this.nodeMore, false);
  goog.style.setElementShown(this.nodeMedia, false);

  if (this.helper.experimentalEnabled()) {
    this.nodePublish = goog.dom.getElement(this.prefix + 'publish');
    goog.events.listen(this.nodePublish, goog.events.EventType.CLICK,
      this.publish.bind(this));
  }

  // Events
  goog.events.listen(this.nodeDebug, goog.events.EventType.CLICK,
    this.setSyntaxCheck.bind(this));
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(this.nodeLibrary, goog.events.EventType.CLICK,
    this.showLibrary.bind(this));
  goog.events.listen(this.nodeMedia, goog.events.EventType.CLICK,
    this.insertMedia.bind(this));
  goog.events.listen(this.nodeRedo, goog.events.EventType.CLICK,
    this.redo.bind(this));
  goog.events.listen(this.nodeSave, goog.events.EventType.CLICK,
    this.save.bind(this));
  goog.events.listen(this.nodeUndo, goog.events.EventType.CLICK,
    this.undo.bind(this));

  goog.events.listen(this.selectView, goog.ui.Component.EventType.ACTION,
      this.editorChangeViewEvent, false, this);
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.EditorToolbar.prototype.addOption = function(name, func, opt_tooltip) {
  if (this.nodeMoreList) {
    let item = cwc.ui.Helper.getMenuItem(name, opt_tooltip, func);
    this.nodeMoreList.appendChild(item);
    goog.style.setElementShown(this.nodeMore, true);
    cwc.ui.Helper.mdlRefresh();
  }
};


/**
 * Saves the currently open file.
 */
cwc.ui.EditorToolbar.prototype.save = function() {
  let fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile(true);
  }
};


/**
 * Undo change to the editor.
 */
cwc.ui.EditorToolbar.prototype.undo = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let history = editorInstance.undoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Redo change to the editor.
 */
cwc.ui.EditorToolbar.prototype.redo = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let history = editorInstance.redoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Enable or disable debug.
 */
cwc.ui.EditorToolbar.prototype.setSyntaxCheck = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let active = goog.dom.classlist.contains(this.nodeDebug, 'active');
    goog.dom.classlist.enable(this.nodeDebug, 'active', !active);
    goog.dom.classlist.enable(this.nodeDebug, 'icon_24px_red', !active);
    editorInstance.setSyntaxCheck(!active);
  }
};


/**
 * Change editor view.
 * @param {Event} event
 */
cwc.ui.EditorToolbar.prototype.editorChangeViewEvent = function(event) {
  let eventTarget = /** @type {CodeMirror} */ (event.target);
  this.editorChangeView(eventTarget.getValue());
};


/**
 * Change editor view.
 * @param {string} name
 */
cwc.ui.EditorToolbar.prototype.editorChangeView = function(name) {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance && name) {
    this.currentView = name;
    editorInstance.changeView(name);
  }
};


/**
 * Insert a media.
 */
cwc.ui.EditorToolbar.prototype.insertMedia = function() {
  let dialogInstance = this.helper.getInstance('dialog', true);
  this.dialog_ = dialogInstance.showTemplate({
      title: 'Insert media file',
      icon: 'image',
    },
    cwc.soy.ui.EditorToolbar.uploadFile, {
      prefix: this.prefix,
    }
  );
  let nodeAddFile = goog.dom.getElement(this.prefix + 'add-file');
  let nodeUpload = goog.dom.getElement(this.prefix + 'upload');
  goog.events.listen(nodeAddFile, goog.events.EventType.CLICK, function() {
    nodeUpload.click();
  });
  goog.events.listen(nodeUpload, goog.events.EventType.CHANGE, function(e) {
    let file = e.target.files[0];
    this.insertFileContent_(file);
  }, false, this);
  goog.events.listen(nodeAddFile, goog.events.EventType.DRAGLEAVE, function(e) {
    e.stopPropagation();
    e.preventDefault();
    goog.dom.classlist.enable(e.target, 'active', false);
  });
  goog.events.listen(nodeAddFile, goog.events.EventType.DRAGOVER, function(e) {
    e.stopPropagation();
    e.preventDefault();
    goog.dom.classlist.enable(e.target, 'active', true);
  });
  goog.events.listen(nodeAddFile, goog.events.EventType.DROP, function(e) {
    e.stopPropagation();
    e.preventDefault();
    let file = e.getBrowserEvent().dataTransfer.files[0];
    this.insertFileContent_(file);
  }, false, this);
};


/**
 * Insert a media.
 */
cwc.ui.EditorToolbar.prototype.showLibrary = function() {
  let editorInstance = this.helper.getInstance('editor');
  let libraryInstance = this.helper.getInstance('library');
  if (editorInstance && libraryInstance) {
    libraryInstance.showLibrary();
  }
};


/**
 * Publish file.
 */
cwc.ui.EditorToolbar.prototype.publish = function() {
  let fileExporterInstance = this.helper.getInstance('fileExporter');
  fileExporterInstance.exportHtmlToGoogleCloud();
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enablePublishButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodePublish, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableDebugButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeDebug, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableUndoButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeUndo, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableRedoButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeRedo, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableLibraryButton = function(enable) {
  if (this.nodeLibrary) {
    cwc.ui.Helper.enableElement(this.nodeLibrary, enable);
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableMediaButton = function(enable) {
  if (this.nodeMedia) {
    cwc.ui.Helper.enableElement(this.nodeMedia, enable);
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.showLibraryButton = function(enable) {
  if (this.nodeLibrary) {
    goog.style.setElementShown(this.nodeLibrary, enable);
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.showMediaButton = function(enable) {
  if (this.nodeMedia) {
    goog.style.setElementShown(this.nodeMedia, enable);
  }
};


/**
 * @param {boolean} has_files
 */
cwc.ui.EditorToolbar.prototype.updateLibraryButton = function(has_files) {
  if (this.nodeMedia) {
    goog.dom.classlist.enable(this.nodeMedia, 'icon_24px', has_files);
    goog.dom.classlist.enable(this.nodeMedia, 'icon_24px_grey', !has_files);
  }
};


/**
 * Updates the options for the toolbar depending on the editor mode.
 * @param {string} editor_mode
 */
cwc.ui.EditorToolbar.prototype.updateToolbar = function(editor_mode) {
  if (editor_mode == cwc.file.MimeType.COFFEESCRIPT.type ||
      editor_mode == cwc.file.MimeType.CSS.type ||
      editor_mode == cwc.file.MimeType.HTML.type ||
      editor_mode == cwc.file.MimeType.JAVASCRIPT.type ||
      editor_mode == cwc.file.MimeType.JSON.type) {
    this.enableDebugButton(true);
  } else {
    let editorInstance = this.helper.getInstance('editor');
    if (editorInstance) {
      editorInstance.setSyntaxCheck(false);
    }
    this.enableDebugButton(false);
  }
  if (this.helper.experimentalEnabled()) {
    this.enablePublishButton(false);
  }
};


/**
 * Add editor view.
 * @param {!string} name
 * @export
 */
cwc.ui.EditorToolbar.prototype.addView = function(name) {
  let selectedView = new goog.ui.MenuItem(name);
  this.selectView.addItem(selectedView);

  if (!this.currentView) {
    this.editorChangeView(name);
    this.selectView.setSelectedItem(selectedView);
  }
};


/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.EditorToolbar.prototype.expand = function(e) {
  this.setExpand(true, e.target.closest('.goog-splitpane-second-container'));
};


/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.EditorToolbar.prototype.collapse = function(e) {
  this.setExpand(false, e.target.closest('.goog-splitpane-second-container'));
};


/**
 * Toggles the current expand state.
 */
cwc.ui.EditorToolbar.prototype.toggleExpand = function() {
  this.setExpand(!this.expandState);
};


/**
 * Expands or collapses the current window.
 * @param {boolean} expand
 * @param {boolean=} invert
 */
cwc.ui.EditorToolbar.prototype.setExpand = function(expand, invert = false) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    if (invert) {
      layoutInstance.setFullscreen(expand, 0);
    } else {
      layoutInstance.setFullscreen(expand);
    }
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.EditorToolbar.prototype.showExpandButton = function(visible) {
  goog.style.setElementShown(this.nodeExpand, visible);
};


/**
 * Reads file content as data URL and adds file to library.
 * @param {!Blob} file
 * @private
 */
cwc.ui.EditorToolbar.prototype.insertFileContent_ = function(file) {
  let editorInstance = this.helper.getInstance('editor');

  if (file && editorInstance && editorInstance.isVisible()) {
    let reader = new FileReader();

    reader.onload = function(event) {
      switch (editorInstance.getEditorMode()) {
        case cwc.file.MimeType.CSS.type:
          editorInstance.insertText(
            'url(\'' + event.target.result + '\');\n');
          break;
        case cwc.file.MimeType.HTML.type:
          editorInstance.insertText(
            '<img src="' + event.target.result + '">\n');
          break;
        default:
          editorInstance.insertText(event.target.result);
      }
      this.dialog_.close();
    }.bind(this);
    reader.readAsDataURL(file);
  }
};
