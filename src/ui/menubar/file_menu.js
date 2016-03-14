/**
 * @fileoverview File menu for the Coding with Chrome editor.
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
goog.provide('cwc.ui.FileMenu');

goog.require('cwc.file.Type');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.PopupMenu');
goog.require('goog.ui.Separator');
goog.require('goog.ui.SubMenu');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.FileMenu = function(helper) {
  /** @type {cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!goog.ui.MenuItem} */
  this.menuNew = cwc.ui.Helper.getMenuItem('New',
      this.requestShowSelectScreen, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuOpen = cwc.ui.Helper.getMenuItem('from local drive',
      this.requestOpenFile, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuOpenGDrive = cwc.ui.Helper.getMenuItem('from Google Drive …',
      this.openGDrive, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuClose = cwc.ui.Helper.getMenuItem('Close');

  /** @type {!goog.ui.MenuItem} */
  this.menuSave = cwc.ui.Helper.getMenuItem('Save',
      this.saveFile, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuSaveAs = cwc.ui.Helper.getMenuItem('local file',
      this.saveFileAs, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuSaveGDrive = cwc.ui.Helper.getMenuItem('Google Drive file',
      this.saveGDrive, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuExportHtml = cwc.ui.Helper.getMenuItem('Export As HTML',
      this.exportHtmlFile, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuExportJavaScript = cwc.ui.Helper.getMenuItem(
      'Export As JavaScript');

  /** @type {!goog.ui.MenuItem} */
  this.menuExportObject = cwc.ui.Helper.getMenuItem(
      'Export As <object>', this.exportObjectTag, this);

  /** @type {!goog.ui.MenuItem} */
  this.menuExportIframe = cwc.ui.Helper.getMenuItem(
      'Export As <iframe>');

  /** @type {!goog.ui.MenuItem} */
  this.menuProperties = cwc.ui.Helper.getMenuItem('Properties',
      this.showProperties, this);
};


/**
 * Decorates the file menu.
 * @param {goog.ui.PopupMenu} menu
 * @export
 */
cwc.ui.FileMenu.prototype.decorate = function(menu) {
  if (!menu) {
    console.log('Was not able to decorate file menu!');
    return;
  }

  var submenuOpen = new goog.ui.SubMenu('Open …');
  submenuOpen.addItem(this.menuOpen);
  if (this.helper.checkChromeFeature('oauth2')) {
    submenuOpen.addItem(this.menuOpenGDrive);
  }

  this.menuClose.setEnabled(false);

  var submenuSaveAs = new goog.ui.SubMenu('Save as …');
  submenuSaveAs.addItem(this.menuSaveAs);
  if (this.helper.checkChromeFeature('oauth2')) {
    submenuSaveAs.addItem(this.menuSaveGDrive);
  }

  var submenuExport = new goog.ui.SubMenu('Export');
  this.menuExportIframe.setEnabled(false);
  this.menuExportJavaScript.setEnabled(false);
  submenuExport.addItem(this.menuExportHtml);
  submenuExport.addItem(this.menuExportObject);
  submenuExport.addItem(this.menuExportIframe);
  submenuExport.addItem(this.menuExportJavaScript);

  menu.addChild(this.menuNew, true);
  menu.addChild(submenuOpen, true);
  menu.addChild(this.menuClose, true);
  menu.addChild(new goog.ui.Separator, true);
  menu.addChild(this.menuSave, true);
  menu.addChild(submenuSaveAs, true);
  if (this.helper.debugEnabled('EXPORT')) {
    menu.addChild(new goog.ui.Separator, true);
    menu.addChild(submenuExport, true);
  }
  if (this.helper.debugEnabled('PROPERTIES')) {
    menu.addChild(new goog.ui.Separator, true);
    menu.addChild(this.menuProperties, true);
  }
};


/**
 * @param {!boolean} auth
 */
cwc.ui.FileMenu.prototype.setAuthenticated = function(auth) {
  this.menuOpenGDrive.setEnabled(auth);
  this.menuSaveGDrive.setEnabled(auth);
};


/**
 * @param {!Element} elem
 * @param {!function()} func
 */
cwc.ui.FileMenu.prototype.addAction = function(elem, func) {
  goog.events.listen(elem, goog.ui.Component.EventType.ACTION, func,
      false, this);
};


/**
 * Creates a new Blockly file.
 */
cwc.ui.FileMenu.prototype.newBlocklyFile = function() {
  var fileCreatorInstance = this.helper.getInstance('fileCreator');
  if (fileCreatorInstance) {
    fileCreatorInstance.create(
        cwc.file.Type.CHROGRAMMING_BLOCKLY);
    this.menuSave.setEnabled(false);
  }
};


/**
 * Creates a new simple file.
 */
cwc.ui.FileMenu.prototype.newSimpleFile = function() {
  var fileCreatorInstance = this.helper.getInstance('fileCreator');
  if (fileCreatorInstance) {
    fileCreatorInstance.create(
        cwc.file.Type.CHROGRAMMING_SIMPLE);
    this.menuSave.setEnabled(false);
  }
};


/**
 * Creates a new advanced file.
 */
cwc.ui.FileMenu.prototype.newAdvancedFile = function() {
  var fileCreatorInstance = this.helper.getInstance('fileCreator');
  if (fileCreatorInstance) {
    fileCreatorInstance.create(
        cwc.file.Type.CHROGRAMMING_ADVANCED);
    this.menuSave.setEnabled(false);
  }
};


/**
 * Creates a new EV3 file.
 */
cwc.ui.FileMenu.prototype.newEV3File = function() {
  var fileCreatorInstance = this.helper.getInstance('fileCreator');
  if (fileCreatorInstance) {
    fileCreatorInstance.create(
        cwc.file.Type.EV3);
    this.menuSave.setEnabled(false);
  }
};


/**
 * Shows new file dialog.
 */
cwc.ui.FileMenu.prototype.requestShowSelectScreen = function() {
  var selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen();
  }
};


/**
 * Opens a existing file from the local drive.
 */
cwc.ui.FileMenu.prototype.openFile = function() {
  var fileLoaderInstance = this.helper.getInstance('fileLoader');
  if (fileLoaderInstance) {
    fileLoaderInstance.loadFile();
    this.menuSave.setEnabled(true);
  }
};


/**
 * Request to open a existing file from the local drive.
 */
cwc.ui.FileMenu.prototype.requestOpenFile = function() {
  this.helper.handleUnsavedChanges(this.openFile.bind(this));
};


/**
 * Opens a existing file from the Google drive.
 */
cwc.ui.FileMenu.prototype.openGDrive = function() {
  var gDriveInstance = this.helper.getInstance('gDrive');
  if (gDriveInstance) {
    gDriveInstance.getFile();
  }
};


/**
 * Saves the currently open file.
 */
cwc.ui.FileMenu.prototype.saveFile = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile();
  }
};


/**
 * Saves the current projects as a new file on the local drive.
 */
cwc.ui.FileMenu.prototype.saveFileAs = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFileAs();
    this.menuSave.setEnabled(true);
  }
};


/**
 * Saves the current project as a new file on Google drive.
 */
cwc.ui.FileMenu.prototype.saveGDrive = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveGDriveFile();
  }
};


/**
 * Exports rendered output as HTML file.
 */
cwc.ui.FileMenu.prototype.exportHtmlFile = function() {
  var fileExporterInstance = this.helper.getInstance('fileExporter');
  if (fileExporterInstance) {
    fileExporterInstance.exportHtmlFile();
  }
};


/**
 * Exports rendered output as Object tag.
 */
cwc.ui.FileMenu.prototype.exportObjectTag = function() {
  console.log('Export Object tag …');
  var rendererInstance = this.helper.getInstance('renderer');
  if (rendererInstance) {
    var objectTag = rendererInstance.getObjectTag();
    var dialog = new goog.ui.Dialog();
    dialog.setTitle('Object Tag');
    dialog.setContent(objectTag);
    dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
    dialog.setDisposeOnHide(true);
    dialog.render();
    dialog.setVisible(true);
  }
};


/**
 * Shows document properties.
 */
cwc.ui.FileMenu.prototype.showProperties = function() {
  // ToDo
};
