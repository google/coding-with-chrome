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
  prepareEditor();
  describe('Prepare Mode', function() {
    loadTemplateFile('basic/blank-blocks.cwc', it);
    loadExampleFile('basic/blocks/Hello-World.cwc', it);
    loadExampleFile('basic/blocks/Sunlights.cwc', it);
    loadExampleFile('basic/blocks/Text-Loop.cwc', it);
    loadTutorialFile('basic/blocks/blockly.cwct', it);
    loadTourFile('basic/blocks/cwc.cwct', it);
    loadTourFile('basic/blocks/blockly.cwct', it);
  });
});
