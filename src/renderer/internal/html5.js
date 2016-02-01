/**
 * @fileoverview Renderer for HTML5 modification.
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
goog.provide('cwc.renderer.internal.HTML5');

goog.require('cwc.file.ContentType');
goog.require('cwc.file.Files');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.internal.HTML5 = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.simpleFramework = 'simple_framework.js';

  /** @type {string} */
  this.coffeeScriptFramework = 'coffee-script.js';

  /** @type {string} */
  this.jQueryFramework = 'jquery.min.js';
};


/**
 * Initializes and defines the HTML5 renderer.
 */
cwc.renderer.internal.HTML5.prototype.init = function() {
  var rendererInstance = this.helper.getInstance('renderer', true);
  var renderer = this.render.bind(this);
  rendererInstance.setRenderer(renderer);
};


/**
 * @param {Object} editor_content
 * @param {Object} editor_flags
 * @param {!cwc.file.Files} library_files
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} renderer_helper
 * @return {string}
 * @export
 */
cwc.renderer.internal.HTML5.prototype.render = function(
    editor_content,
    editor_flags,
    library_files,
    frameworks,
    renderer_helper) {

  var css = editor_content[cwc.file.ContentType.CSS] || '';
  var html = editor_content[cwc.file.ContentType.HTML] || '';
  var javascript = editor_content[cwc.file.ContentType.JAVASCRIPT] || '';
  var headers = [];

  // Coffeescript framework.
  if (html) {
    if (html.indexOf('text/coffeescript') != -1) {
      headers.push(this.coffeeScriptFramework);
    }
  }

  // Additional frameworks.
  var script = javascript || html || '';
  if (script.indexOf('draw.') != -1 || script.indexOf('write(') != -1) {
    headers.push(this.simpleFramework);
  }
  if (script.indexOf('jQuery.') != -1 || script.indexOf('jQuery(') != -1 ||
      script.indexOf('$(document).ready') != -1) {
    headers.push(this.jQueryFramework);
  }

  var header = renderer_helper.getFrameworkHeaders(headers, frameworks);
  if (((css || javascript) && html) || (javascript && !html && !css)) {
    return renderer_helper.getHTML(html, header, css, javascript);
  }
  return renderer_helper.getRawHTML(html, header);
};
