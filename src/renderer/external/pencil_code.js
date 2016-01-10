/**
 * @fileoverview Renderer for Pencil Code modification.
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
goog.provide('cwc.renderer.external.PencilCode');

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
cwc.renderer.external.PencilCode = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.coffeeScriptFramework = 'coffee-script.js';

  /** @type {string} */
  this.jqueryFramework = 'jquery.min.js';

  /** @type {string} */
  this.jqueryTurtleFramework = 'jquery-turtle.js';
};


/**
 * Initializes and defines the simple renderer.
 */
cwc.renderer.external.PencilCode.prototype.init = function() {
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
cwc.renderer.external.PencilCode.prototype.render = function(
    editor_content,
    editor_flags,
    library_files,
    frameworks,
    renderer_helper) {

  var javascript =
      editor_content[cwc.file.ContentType.JAVASCRIPT];
  var html = (cwc.file.ContentType.HTML in editor_content) ?
      editor_content[cwc.file.ContentType.HTML] : '';
  var css = (cwc.file.ContentType.CSS in editor_content) ?
      editor_content[cwc.file.ContentType.CSS] : '';
  var header = renderer_helper.getFrameworkHeaders([this.coffeeScriptFramework,
    this.jqueryFramework, this.jqueryTurtleFramework], frameworks);
  var body = '\n<script type="text\/coffeescript">\n' +
    '$.turtle();\n' + javascript + '\n</script>\n';
  html = renderer_helper.getHTMLGrid(body, header, css);
  return html;
};
