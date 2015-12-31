/**
 * @fileoverview File creator for the file handler.
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
goog.provide('cwc.fileHandler.FileCreator');

goog.require('cwc.file.Type');
goog.require('cwc.fileFormat.File');
goog.require('cwc.fileHandler.Config');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.FileCreator = function(helper) {
  /** @type {string} */
  this.name = 'FileCreator';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.fileHandler.Config} */
  this.config = cwc.fileHandler.Config;
};


/**
 * @param {!cwc.file.Type} file_type
 * @export
 */
cwc.fileHandler.FileCreator.prototype.create = function(file_type) {
  var fileConfig = this.config.get(file_type);
  if (!fileConfig) {
    throw 'Filetype ' + file_type + ' is not supported!';
  }
  console.log('Create file for', file_type, ':', fileConfig);

  // Creates empty .cwc file with the given file_type.
  var file = fileConfig.file(fileConfig.content || '', file_type,
      fileConfig.contentType);

  if (fileConfig.contentType && fileConfig.content) {
    file.setContent(fileConfig.contentType, fileConfig.content);
  } else {
    if (fileConfig.blockly_views) {
      for (let i = 0; i < fileConfig.blockly_views.length; i++) {
        file.setContent(fileConfig.blockly_views[i], '');
      }
    }
    if (fileConfig.editor_views) {
      for (let i = 0; i < fileConfig.editor_views.length; i++) {
        file.setContent(fileConfig.editor_views[i], '');
      }
    }
  }

  if (fileConfig.mode) {
    file.setMode(fileConfig.mode);
  }
  if (fileConfig.ui) {
    file.setUi(fileConfig.ui);
  }
  if (fileConfig.title) {
    file.setTitle(fileConfig.title);
  }

  this.loadFile(file, fileConfig.name || 'Untitled file');
};


/**
 * @param {!cwc.fileFormat.File} file
 * @param {!string} name
 */
cwc.fileHandler.FileCreator.prototype.loadFile = function(file,
    name) {
  var fileLoaderInstance = this.helper.getInstance('fileLoader', true);
  var fileContent = file.getJson();
  if (!fileContent) {
    console.error('No valid file content:', fileContent, 'for', file);
  }
  fileLoaderInstance.handleFileData(fileContent, name);
};
