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

goog.require('cwc.utils.mime.Type');
goog.require('cwc.mode.Config');
goog.require('cwc.mode.Type');
goog.require('cwc.Tutorial');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


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

  /** @type {string} */
  this.filename = '';

  /** @type {cwc.mode.Type} */
  this.mode = cwc.mode.Type.NONE;

  /** @type {Object} */
  this.modder = null;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {string} */
  this.templatePath_ = '../resources/templates/';

  /** @private {cwc.Tutorial} */
  this.tutorial_ = null;
};


/**
 * @param {cwc.mode.Type} mode
 */
cwc.mode.Modder.prototype.loadMode = function(mode) {
  let modeConfig = cwc.mode.Config.get(mode);
  let loaderInstance = this.helper.getInstance('fileLoader', true);
  loaderInstance.loadLocalFile(this.templatePath_ + modeConfig.template);
};


/**
 * @param {cwc.mode.Type} mode
 */
cwc.mode.Modder.prototype.setMode = function(mode) {
  let modeConfig = cwc.mode.Config.get(mode);

  this.log_.info('Loading Mode', mode,
    (modeConfig.name ? '(' + modeConfig.name + ')' : ''),
    (modeConfig.authors ? 'from ' + modeConfig.authors : ''),
    'for MIME-types', modeConfig.mimeTypes
  );

  // Remove former informations.
  this.setFilename();

  // Remove former instances.
  this.helper.setInstance('blockly', null, true);
  this.helper.setInstance('editor', null, true);
  this.helper.setInstance('preview', null, true);
  this.helper.setInstance('runner', null, true);
  this.helper.setInstance('turtle', null, true);

  // Update navigation view
  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    if (modeConfig.title) {
      navigationInstance.setHeader(modeConfig.title, modeConfig.icon);
    }
    navigationInstance.enableSaveFile(true);
  }

  // End existing tours
  this.helper.endTour();

  // Clear Google Cloud publish settings.
  let gCloudInstance = this.helper.getInstance('gcloud');
  if (gCloudInstance) {
    gCloudInstance.clear();
  }

  // Close overlay before loading.
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.showOverlay(false);
  }

  // Close existing dialogs.
  let dialogInstance = this.helper.getInstance('dialog');
  if (dialogInstance) {
    dialogInstance.close();
  }

  // Remove custom sidebar button.
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.clear();
  }

  // Remove tutorial
  if (this.tutorial_) {
    this.tutorial_.clear();
    this.tutorial_ = null;
  }

  this.log_.info('Initialize mode and decorate UI for', mode, '…');
  this.mode = mode;
  this.modder = modeConfig.getMod(this.helper);
  this.modder.decorate();
};


/**
 * @param {string=} filename
 */
cwc.mode.Modder.prototype.setFilename = function(filename) {
  this.filename = filename || '';
};


/**
 * @param {cwc.mode.Type=} mode
 */
cwc.mode.Modder.prototype.postMode = function(mode = this.mode) {
  this.log_.info('Post handling for', mode);
  let modeConfig = cwc.mode.Config.get(mode);

  // Preview Handling
  if (modeConfig.autoPreview) {
    this.setAutoUpdate(true);
  } else if (modeConfig.runPreview) {
    this.runPreview();
    this.helper.getInstance('preview').focus();
  }

  // Handle file data, if needed.
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    // Setting file title
    let fileTitle = fileInstance.getFileTitle() || fileInstance.getFilename();
    if (fileTitle) {
      this.setTitle(fileTitle);
    }

    // Handle UI mode
    switch (fileInstance.getUi()) {
      case 'blockly':
        this.showBlockly();
        break;
      case 'editor':
        this.showEditor();
        break;
    }

    // Sync Library files
    if (fileInstance.hasLibraryFiles()) {
      this.syncLibrary();
    }

    // Enable tutorials
    this.tutorial_ = new cwc.Tutorial(this.helper);
    this.tutorial_.render();
  }

  // Event Handling
  this.eventHandler_.dispatchEvent(
    cwc.mode.Modder.Events.changeMode(this.mode, this.filename));
};


/**
 * @param {!string} name
 * @param {!string} content
 */
cwc.mode.Modder.prototype.addBlocklyView = function(name, content) {
  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    blocklyInstance.addView(name, content);
  }
};


/**
 * @param {!string} name
 * @param {string=} content
 * @param {cwc.ui.EditorType=} type
 * @param {cwc.ui.EditorHint=} hints
 */
cwc.mode.Modder.prototype.addEditorView = function(name, content, type, hints) {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.addView(name, content, type, hints);
  }
};


/**
 * Shows the editor and hides other possible overlapping elements.
 */
cwc.mode.Modder.prototype.showEditor = function() {
  let editor = this.helper.getInstance('editor');
  if (editor) {
    editor.showEditor(true);
  }

  let blockly = this.helper.getInstance('blockly');
  if (blockly) {
    blockly.showBlockly(false);
  }
};


/**
 * Shows the blockly editor and hides other overlapping elements.
 */
cwc.mode.Modder.prototype.showBlockly = function() {
  let blockly = this.helper.getInstance('blockly');
  if (blockly) {
    blockly.showBlockly(true);
  }

  let editor = this.helper.getInstance('editor');
  if (editor) {
    editor.showEditor(false);
  }
};


/**
 * Syncs the library with the existing files.
 */
cwc.mode.Modder.prototype.syncLibrary = function() {
  let libraryInstance = this.helper.getInstance('library');
  if (libraryInstance) {
    libraryInstance.syncFiles();
  }
};


/**
 * Runs the preview.
 * @param {boolean} focus
 */
cwc.mode.Modder.prototype.runPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.run();
  }
};


/**
 * @param {boolean} active
 */
cwc.mode.Modder.prototype.setAutoUpdate = function(active) {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.setAutoUpdate(active);
  }
};


/**
 * @param {string} title
 */
cwc.mode.Modder.prototype.setTitle = function(title) {
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.enableTitle(true);
    guiInstance.setTitle(title);
  }
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.mode.Modder.prototype.getEventHandler = function() {
  return this.eventHandler_;
};
