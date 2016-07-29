/**
 * @fileoverview mbot renderer.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.renderer.external.mbot');

goog.require('cwc.file.ContentType');
goog.require('cwc.file.Files');
goog.require('cwc.framework.Internal');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.mbot = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the mbot renderer.
 */
cwc.renderer.external.mbot.prototype.init = function() {
  var rendererInstance = this.helper.getInstance('renderer', true);
  var renderer = this.render.bind(this);
  rendererInstance.setRenderer(renderer);
};


/**
 * @param {Object} editor_content
 * @param {Object} editor_flags
 * @param {cwc.file.Files} library_files
 * @param {cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} renderer_helper
 * @return {string}
 * @export
 */
cwc.renderer.external.mbot.prototype.render = function(
    editor_content,
    editor_flags,
    library_files,
    frameworks,
    renderer_helper) {

  var header = renderer_helper.getFrameworkHeader(
    cwc.framework.Internal.MBOT, frameworks);
  var body = '\n<script>' +
      '  var code = function(mbot) {\n' +
      editor_content[cwc.file.ContentType.JAVASCRIPT] +
      '\n};\n'+
      '  new cwc.framework.mBot(code);\n' +
      '</script>\n';

  var html = renderer_helper.getHTML(body, header);
  return html;
};
