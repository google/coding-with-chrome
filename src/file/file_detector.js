/**
 * @fileoverview File detector for the Coding with Chrome editor.
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
goog.provide('cwc.file.detector');

goog.require('cwc.file.Type');
goog.require('cwc.fileFormat.FILE_HEADER');


/**
 * @param {string|Object=} opt_content
 * @param {string=} opt_filename
 * @constructor
 * @struct
 * @final
 */
cwc.file.detector = function(opt_content, opt_filename) {
  if (opt_content) {
    return cwc.file.detector.detectType(opt_content,
        opt_filename);
  }
};


/**
 * Detects the file type of the given content and/or file_name.
 *
 * @param {!string|Object} content
 * @param {string=} opt_filename
 * @return {!cwc.file.Type}
 */
cwc.file.detector.detectType = function(content, opt_filename) {
  let filename = opt_filename || 'unknown';
  let data = content;
  let jsonData = cwc.file.detector.getJsonData(content);
  if (jsonData) {
    // JSON file
    let jsonFormat = jsonData['format'] || '';
    if (jsonFormat == cwc.fileFormat.FILE_HEADER) {
      return jsonData['type'] || cwc.file.Type.UNKNOWN;
    } else {
      return cwc.file.Type.JSON;
    }
  } else if (cwc.file.detector.isValidString(data)) {
    // CoffeeScript file
    if (filename.endsWith('.coffee')) {
      return cwc.file.Type.COFFEESCRIPT;

    // Python file
    } else if (filename.endsWith('.py')) {
      return cwc.file.Type.PYTHON;

    // HMTL file
    } else if (data.includes('<html') ||
               filename.endsWith('.htm') ||
               filename.endsWith('.html')) {
      return cwc.file.Type.HTML;

    // JavaScript file
    } else if (data.includes('document.body') ||
               data.includes('document.getElementById') ||
               filename.endsWith('.js')) {
      return cwc.file.Type.JAVASCRIPT;
    }

    // Text as default
    return cwc.file.Type.TEXT;
  }

  console.warn('Unable to detect file type.');
  console.warn('Filename:', filename);
  console.warn('Content:', data);
  return cwc.file.Type.RAW;
};


/**
 * @param {Object|string} content
 * @return {*}
 */
cwc.file.detector.getJsonData = function(content) {
  let jsonData = null;
  if (typeof content == 'object') {
    return content;
  } else {
    try {
      jsonData = JSON.parse(content);
    } catch (error) {
      return null;
    }
  }
  return jsonData;
};


/**
 * @param {string} content
 * @return {boolean}
 */
cwc.file.detector.isChrogFile = function(content) {
  let jsonData = cwc.file.detector.getJsonData(content);
  if (jsonData) {
    let jsonFormat = jsonData['format'] || '';
    if (jsonFormat == cwc.fileFormat.FILE_HEADER) {
      return true;
    }
  }
  return false;
};


/**
 * @param {Object|string|null} content
 * @return {boolean}
 */
cwc.file.detector.isValidJson = function(content) {
  try {
    JSON.parse(content);
  } catch (error) {
    return false;
  }
  return true;
};


/**
 * @param {Object|string|null} content
 * @return {boolean}
 */
cwc.file.detector.isValidString = function(content) {
  return goog.isString(content);
};
