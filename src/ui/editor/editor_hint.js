/**
 * @fileoverview Editor Hints of Code Editor.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.EditorHint');


/**
 * @enum {!Object.<string>|function}
 */
cwc.ui.EditorHint = {
  COFFEESCRIPT: CodeMirror['hint']['coffeescript'],
  CSS: CodeMirror['hint']['css'],
  HTML: CodeMirror['hint']['html'],
  JAVASCRIPT: CodeMirror['hint']['javascript'],
  SQL: CodeMirror['hint']['sql'],
  XML: CodeMirror['hint']['xml'],
  UNKNOWN: CodeMirror['hint']['anyword']
};
