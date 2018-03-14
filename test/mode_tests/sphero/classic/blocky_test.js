/**
 * @fileoverview Mode Sphero Classic - Blockly
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


describe('[Mode Sphero Classic - Blockly]', function() {
  document.body.insertAdjacentHTML('afterbegin', '<div id="cwc-editor"></div>');
  let builder = new cwc.ui.Builder();

  describe('Prepare UI', function() {
    it('export', function() {
      expect(typeof builder).toEqual('object');
      expect(typeof builder.decorate).toEqual('function');
    });

    it('decorate', function(done) {
      builder.decorate(null, function() {
        expect(builder.isPrepared()).toEqual(true);
        expect(builder.isLoaded()).toEqual(true);
        expect(builder.isReady()).toEqual(true);
        done();
      });
    });
  });

  describe('Loading files', function() {
    loadTemplateFile('sphero/classic/blank-blocks.cwc', builder, it);
    loadExampleFile('sphero/classic/blocks/Sphero-collision.cwc', builder, it);
    loadExampleFile('sphero/classic/blocks/Sphero-rectangle.cwc', builder, it);
  });
});
