/**
 * @fileoverview Editor Types of Code Editor.
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
goog.provide('cwc.ui.EditorType');


/**
 * @enum {!Object.<string>|string}
 */
cwc.ui.EditorType = {
  COFFEESCRIPT: 'text/coffeescript',
  CSS: 'text/css',
  HTML: 'text/html',
  JAVASCRIPT: 'text/javascript',
  PYTHON: 'text/x-python',
  TEXT: 'text/plain',
  UNKNOWN: 'unknown'
};


/**
 * Guesses the editor type on the given content.
 * @param {!string} content
 * @return {cwc.ui.EditorType}
 */
cwc.ui.guessEditorType = function(content) {
  if (content.includes('<html')) {
    return cwc.ui.EditorType.HTML;
  }

  if (content.includes('var ') || content.includes('// ')) {
    return cwc.ui.EditorType.JAVASCRIPT;
  }

  if (content.includes('display:') != -1 || content.includes('color:')) {
    return cwc.ui.EditorType.CSS;
  }

  return cwc.ui.EditorType.UNKNOWN;
};
