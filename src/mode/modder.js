/**
 * @fileoverview Modder for the Coding with Chrome editor.
 * The modder allows user to define custom editor views and custom features.
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
goog.provide('cwc.mode.Modder');

goog.require('cwc.mode.Config');
goog.require('cwc.mode.Type');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.mode.Modder = function(helper) {
  /** @type {string} */
  this.name = 'Modder';

  /** @type {cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.mode.Type} */
  this.mode = cwc.mode.Type.NONE;

  /** @type {Object} */
  this.modder = null;
};


/**
 * @param {cwc.mode.Type} mode
 */
cwc.mode.Modder.prototype.setMode = function(mode) {
  var modeConfig = cwc.mode.Config.get(mode, true);
  if (!modeConfig) {
    return;
  }
  console.log('Loading Mode', mode,
    (modeConfig.version ? 'version ' + modeConfig.version : ''),
    (modeConfig.name ? '(' + modeConfig.name + ')' : ''),
    (modeConfig.authors ? 'from ' + modeConfig.authors : ''),
    (modeConfig.description ? ':' + modeConfig.description : '')
  );

  if (modeConfig.title) {
    this.setNavHeader_(modeConfig.title, modeConfig.icon);
  }

  this.mode = mode;
  console.log('Initialize mode', mode, '…');
  this.modder = new modeConfig.mod(this.helper);
  console.log('Decorate UI for mode', mode);
  this.modder.decorate();
};


/**
 * @param {!string} name
 * @param {string=} opt_content
 * @param {cwc.ui.EditorType=} opt_type
 * @param {cwc.ui.EditorHint=} opt_hints
 * @param {cwc.ui.EditorFlags=} opt_flags
 */
cwc.mode.Modder.prototype.addEditorView = function(name, opt_content, opt_type,
    opt_hints, opt_flags) {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.addView(name, opt_content, opt_type, opt_hints, opt_flags);
  }
};


/**
 * Shows the editor and hides other possible overlapping elements.
 */
cwc.mode.Modder.prototype.showEditor = function() {
  var editor = this.helper.getInstance('editor');
  if (editor) {
    editor.showEditor(true);
  }

  var blockly = this.helper.getInstance('blockly');
  if (blockly) {
    blockly.showBlockly(false);
  }
};


/**
 * @param {!string} content
 */
cwc.mode.Modder.prototype.addBlocklyView = function(content) {
  var blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    blocklyInstance.addView(content);
  }
};


/**
 * Shows the blockly editor and hides other overlapping elements.
 */
cwc.mode.Modder.prototype.showBlockly = function() {
  var blockly = this.helper.getInstance('blockly');
  if (blockly) {
    blockly.showBlockly(true);
  }

  var editor = this.helper.getInstance('editor');
  if (editor) {
    editor.showEditor(false);
  }
};


/**
 * Syncs the editor JavaScript view.
 */
cwc.mode.Modder.prototype.syncJavaScript = function() {
  var editor = this.helper.getInstance('editor');
  if (editor) {
    editor.syncJavaScript();
  }
};


/**
 * Syncs the library with the existing files.
 */
cwc.mode.Modder.prototype.syncLibrary = function() {
  var fileInstance = this.helper.getInstance('file');
  var libraryInstance = this.helper.getInstance('library');
  if (fileInstance && libraryInstance) {
    libraryInstance.syncFiles();
    var editorInstance = this.helper.getInstance('editor');
    if (editorInstance) {
      editorInstance.updateMediaButton(fileInstance.getFiles().hasFiles());
    }
  }
};


/**
 * Runs the preview.
 */
cwc.mode.Modder.prototype.runPreview = function() {
  var previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.run();
  }
};


/**
 * Sets editor flags.
 * @param {!cwc.ui.EditorFlags} flags
 */
cwc.mode.Modder.prototype.setEditorFlags = function(flags) {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.setEditorFlags(flags);
  }
};


/**
 * @param {boolean} active
 */
cwc.mode.Modder.prototype.setAutoUpdate = function(active) {
  var previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.setAutoUpdate(active);
  }
};


/**
 * @param {string} title
 */
cwc.mode.Modder.prototype.setTitle = function(title) {
  var guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.enableTitle(true);
    guiInstance.setTitle(title);
  }
};


/**
 * @param {!string} title
 * @param {string=} opt_icon
 * @param {string=} opt_color_class
 * @private
 */
cwc.mode.Modder.prototype.setNavHeader_ = function(title,
    opt_icon, opt_color_class) {
  var navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.setHeader(title, opt_icon, opt_color_class);
  }
};
