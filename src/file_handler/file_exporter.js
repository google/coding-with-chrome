/**
 * @fileoverview File exporter for the file handler.
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
goog.provide('cwc.fileHandler.FileExporter');

goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.FileExporter = function(helper) {
  /** @type {string} */
  this.name = 'FileExporter';

  /** @type {cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Exports rendered content as html file.
 */
cwc.fileHandler.FileExporter.prototype.exportHtmlFile = function() {
  var fileInstance = this.helper.getInstance('file', true);
  var fileSaverInstance = this.helper.getInstance('fileSaver', true);
  var rendererInstance = this.helper.getInstance('renderer', true);
  console.info('Prepare export as HTML file');
  fileSaverInstance.selectFileToSave(
      fileInstance.getFileTitle() + '.html',
      rendererInstance.getRenderedContent());
};
