/**
 * @fileoverview Mode Python - Python 2.7
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


describe('[Mode Python - Python 2.7]', function() {
  document.body.insertAdjacentHTML('afterbegin', '<div id="cwc-editor"></div>');
  describe('Prepare Mode', function() {
    loadTemplateFile('python27/blank.py', it);
    loadExampleFile('python27/guess-number.py', it);
    loadExampleFile('python27/turtle-graphics.py', it);
  });
});
