/**
 * @fileoverview Mode Basic - Blockly
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


describe('[Mode Basic - Blockly]', function() {
  document.body.insertAdjacentHTML('afterbegin', '<div id="cwc-editor"></div>');
  let builder = new cwc.ui.Builder();

  describe('Prepare Mode', function() {
    beforeAll(function(done) {
      builder.decorate(null, function() {
        done();
      });
    });

    loadTemplateFile('basic/blank-blocks.cwc', builder, it);
    loadExampleFile('basic/blocks/Hello-World.cwc', builder, it);
    loadExampleFile('basic/blocks/Sunlights.cwc', builder, it);
    loadExampleFile('basic/blocks/Text-Loop.cwc', builder, it);
    loadTutorialFile('basic/blocks/blockly.cwct', builder, it);
    loadTourFile('basic/blocks/cwc.cwct', builder, it);
    loadTourFile('basic/blocks/blockly.cwct', builder, it);
  });
});
