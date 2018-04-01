/**
 * @fileoverview MIME utils for Coding with Chrome.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.mime.getTypeByContent');
goog.provide('cwc.utils.mime.getTypeByExtension');
goog.provide('cwc.utils.mime.getTypeByName');
goog.provide('cwc.utils.mime.getTypeByNameAndContent');

goog.require('cwc.utils.mime.Type');


/**
 * @param {!string|Object} content
 * @return {!string}
 */
cwc.utils.mime.getTypeByContent = function(content) {
  let cwcHeader = 'Coding with Chrome File Format';

  // Coding with Chrome file format
  if (typeof content === 'object' && content['format'] &&
      content['format'].includes(cwcHeader)) {
    return cwc.utils.mime.Type.CWC.type;
  }

  // Ignore any content which is not string based and any empty string.
  if (content.constructor !== String || content.length === 0) {
    return '';
  }

  let text = /** @type {!string} */ (content);

  // Data-URL scheme
  if (content.startsWith('data:') &&
      content.includes('/') &&
      content.includes(';')) {
    let contentFileType = content.split(';')[0].split(':')[1];
    if (contentFileType) {
      return contentFileType;
    }
  }

  // JSON file format
  let jsonContent = cwc.utils.mime.isJSONContent(text);
  if (jsonContent) {
    return jsonContent;
  }

  // XML file format
  let xmlContent = cwc.utils.mime.isXMLContent(text);
  if (xmlContent) {
    return xmlContent;
  }

  // HTML file format
  if (content.startsWith('<!DOCTYPE html>') || (
      content.includes('<html') && content.includes('</html>'))) {
    return cwc.utils.mime.Type.HTML.type;

  // JavaScript file format
  } else if (
      // ES6 class definition
      (
        content.includes('class ') && content.includes('constructor') &&
        content.includes('(') && content.includes(')') &&
        content.includes('{') && content.includes('}')
      ) ||

      // Prototype definition
      (
        content.includes('.prototype.') && content.includes('function') &&
        content.includes('(') && content.includes(')') &&
        content.includes('{') && content.includes('}')
      ) ||

      // Variable declarations
      (
        (
          content.includes('let ') || content.includes('const ') ||
          content.includes('var ')
        ) && content.includes('=') && content.includes(';'))
      ) {
    return cwc.utils.mime.Type.JAVASCRIPT.type;
  } else if (content.startsWith('#!/usr/bin/python')) {
    return cwc.utils.mime.Type.PYTHON.text;
  } else if (content.constructor == String) {
    return cwc.utils.mime.Type.TEXT.type;
  }
  return '';
};


/**
 * @param {!string} content
 * @return {!string}
 */
cwc.utils.mime.isJSONContent = function(content) {
  if (content.startsWith('{') && content.includes('}') &&
      content.includes('"') && content.includes(':')) {
    let jsonData = null;
    try {
      jsonData = JSON.parse((content));
    } catch (error) {
      jsonData = null;
    }
    if (jsonData && typeof jsonData === 'object') {
      if (jsonData['format'] && jsonData['format'].includes(
          'Coding with Chrome File Format')) {
        return cwc.utils.mime.Type.CWC.type;
      } else {
        return cwc.utils.mime.Type.JSON.type;
      }
    }
  }
  return '';
};


/**
 * @param {!string} content
 * @return {!string}
 */
cwc.utils.mime.isXMLContent = function(content) {
  if ((content.startsWith('<xml') && content.includes('</xml>')) ||
       content.startsWith('<?xml version="1.0"')) {
    if (content.includes('//W3C//DTD XHTML')) {
      return cwc.utils.mime.Type.XHTML.type;
    } else if (content.includes('<block type=') &&
        content.includes(' x=') &&
        content.includes(' y=') &&
        content.includes('</block>') &&
        content.includes('<field name=') &&
        content.includes('</field>')) {
      return cwc.utils.mime.Type.BLOCKLY.type;
    }
    return cwc.utils.mime.Type.XML.type;
  }
  return '';
};


/**
 * @param {!string} extension
 * @return {!string}
 */
cwc.utils.mime.getTypeByExtension = function(extension) {
  let mimeExtension = extension;
  if (extension.includes('.')) {
    mimeExtension = '.' + extension.split('.').pop();
  } else {
    mimeExtension = '.' + extension;
  }
  for (let type in cwc.utils.mime.Type) {
    if (Object.prototype.hasOwnProperty.call(cwc.utils.mime.Type, type)) {
      let mimeType = cwc.utils.mime.Type[type];
      if (mimeType.ext.indexOf(mimeExtension) !== -1) {
        return mimeType.type;
      }
    }
  }
  return '';
};


/**
 * @param {!string} name
 * @return {!string}
 */
cwc.utils.mime.getTypeByName = function(name) {
  switch (name) {
    case 'blockly':
      return cwc.utils.mime.Type.BLOCKLY.type;
    case 'javascript':
    case '__javascript__':
      return cwc.utils.mime.Type.JAVASCRIPT.type;
    case 'coffeescript':
    case '__coffeescript__':
      return cwc.utils.mime.Type.COFFEESCRIPT.type;
    case 'html':
    case '__html__':
      return cwc.utils.mime.Type.HTML.type;
    case 'css':
    case '__css__':
      return cwc.utils.mime.Type.CSS.type;
  }
  return '';
};


/**
 * @param {!string} name
 * @param {string} content
 * @return {!string}
 */
cwc.utils.mime.getTypeByNameAndContent = function(name, content) {
  if (name) {
    let mimeTypeByName = cwc.utils.mime.getTypeByName(name);
    if (mimeTypeByName) {
      return mimeTypeByName;
    }

    let mimeTypeByExtension = cwc.utils.mime.getTypeByExtension(name);
    if (mimeTypeByExtension) {
      return mimeTypeByExtension;
    }
  }

  if (content) {
    let mimeTypeByContent = cwc.utils.mime.getTypeByContent(content);
    if (mimeTypeByContent) {
      return mimeTypeByContent;
    }
  }

  return '';
};
