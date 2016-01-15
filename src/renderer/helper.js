/**
 * @fileoverview Renderer for the Coding with Chrome editor.
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
goog.provide('cwc.renderer.Helper');

goog.require('cwc.soy.Renderer');
goog.require('goog.string');



/**
 * @constructor
 * @struct
 * @final
 */
cwc.renderer.Helper = function() {};


/**
 * @param {string} content Content to mofify.
 * @param {string} text Text to prepend if not already in content.
 * @return {string}
 * @export
 */
cwc.renderer.Helper.prototype.prependText = function(content, text) {
  if (content && text) {
    if (content.indexOf(text) == -1) {
      return text + '\n' + content;
    }
  }
  return content;
};


/**
 * @param {!string} body
 * @param {string=} opt_header
 * @param {string=} opt_css
 * @param {string=} opt_javascript
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTML = function(body, opt_header,
    opt_css, opt_javascript) {
  return cwc.soy.Renderer.html({
    'body': body,
    'head': opt_header,
    'css': opt_css,
    'js': opt_javascript
  });
};


/**
 * @param {!string} body
 * @param {string=} opt_header
 * @return {string}
 */
cwc.renderer.Helper.prototype.getHTMLCanvas = function(body,
    opt_header) {
  return cwc.soy.Renderer.htmlCanvas({
    'body': body,
    'head': opt_header || ''
  });
};


/**
 * @param {!string} body
 * @param {string=} opt_header
 * @param {string=} opt_css
 * @param {string=} opt_javascript
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLGrid = function(body, opt_header,
    opt_css, opt_javascript) {
  return cwc.soy.Renderer.htmlGrid({
    'body': body,
    'head': opt_header,
    'css': opt_css,
    'js': opt_javascript
  });
};


/**
 * @param {!string} data_url
 * @param {number=} opt_width
 * @param {number=} opt_height
 * @return {string} Rendered content as object.
 * @export
 */
cwc.renderer.Helper.prototype.getObjectTag = function(data_url,
    opt_width, opt_height) {
  return cwc.soy.Renderer.objectTemplate({
    'data_url': data_url,
    'type': 'text/html',
    'width': opt_width || 400,
    'height': opt_height || 400
  });
};


/**
 * Returns data encoded content.
 * @param {!string} content
 * @param {string=} opt_type
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.getDataUrl = function(content,
    opt_type) {
  var dataUrl = '';
  var dataType = opt_type || 'text/html';

  try {
    dataUrl = 'data:' + dataType + ';base64,' + btoa(content);
  } catch(err) {
    dataUrl = 'data:' + dataType + ';charset=utf-8,' +
      encodeURIComponent(content);
  }

  return dataUrl;
};


/**
 * @param {!string} content
 * @param {string=} opt_url
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScript = function(content,
    opt_url) {
  return cwc.soy.Renderer.javascript({
    'content': content,
    'url': opt_url
  });
};


/**
 * @param {!string} filename
 * @param {!cwc.file.Files} renderer_frameworks
 * @return {string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeader = function(filename,
    renderer_frameworks) {
  var framework = renderer_frameworks.getFile(filename);
  if (!framework) {
    console.warn('Was unable to get framework file:', filename);
    return '';
  }
  return this.getJavaScript('', framework.getContent());
};


/**
 * @param {!array} filenames
 * @param {!cwc.file.Files} renderer_frameworks
 * @return {string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeaders = function(filenames,
    renderer_frameworks) {
  var headers = '';
  for (var filename in filenames) {
    headers += this.getFrameworkHeader(filenames[filename],
      renderer_frameworks);
  }
  return headers;
};



