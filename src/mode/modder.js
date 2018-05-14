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
 * @return {!Promise}
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
  this.helper.setInstance('message', null, true);
  this.helper.setInstance('preview', null, true);
  this.helper.setInstance('runner', null, true);
  this.helper.setInstance('terminal', null, true);
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

  // Reset Render instance
  let rendererInstance = this.helper.getInstance('renderer');
  if (rendererInstance) {
    rendererInstance.setServerMode(false);
  }

  // Clear existing Tour
  let tourInstance = this.helper.getInstance('tour');
  if (tourInstance) {
    tourInstance.clear();
  }

  // Clear existing tutorial
  let tutorialInstance = this.helper.getInstance('tutorial');
  if (tutorialInstance) {
    tutorialInstance.clear();
  }

  this.log_.info('Initialize mode and decorate UI for', mode, '…');
  this.mode = mode;
  this.modder = modeConfig.getMod(this.helper);
  return this.modder.decorate();
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
  this.postModePreview(modeConfig);

  // Handle file data, if needed.
  this.postModeFileData();

  // Event Handling
  this.eventHandler_.dispatchEvent(
    cwc.mode.Modder.Events.changeMode(this.mode, this.filename));
};


/**
 * @param {!Object} modeConfig
 */
cwc.mode.Modder.prototype.postModePreview = function(modeConfig) {
  let previewInstance = this.helper.getInstance('preview');
  if (!previewInstance) {
    return;
  }

  if (modeConfig.autoPreview) {
    previewInstance.setAutoUpdate(modeConfig.autoPreview);
  } else {
    previewInstance.runPreview();
    previewInstance.focus();
  }
};


/**
 * Handle file data, if needed.
 */
cwc.mode.Modder.prototype.postModeFileData = function() {
  let fileInstance = this.helper.getInstance('file');
  if (!fileInstance) {
    return;
  }
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

  // Start tutorial for tutorial files .cwct automatically
  if (this.filename.toLowerCase().endsWith('.cwct')) {
    let tourInstance = this.helper.getInstance('tour');
    if (tourInstance) {
      tourInstance.startTour();
    }

    let tutorialInstance = this.helper.getInstance('tutorial');
    if (tutorialInstance) {
      tutorialInstance.startTutorial();
    }
  }
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
 * @param {!string} name
 */
cwc.mode.Modder.prototype.setEditorView = function(name) {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.changeView(name);
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
 */
cwc.mode.Modder.prototype.runPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.run();
  }
};


/**
 * @param {string} title
 */
cwc.mode.Modder.prototype.setTitle = function(title) {
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setTitle(title);
  }
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.mode.Modder.prototype.getEventHandler = function() {
  return this.eventHandler_;
};
