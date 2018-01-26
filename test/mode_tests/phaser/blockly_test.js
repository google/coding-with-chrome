/**
 * @fileoverview Mode Phaser - Blockly
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


describe('[Mode Phaser - Blockly]', function() {
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

  describe('Loading file', function() {
    it('block/blank.cwc', function(done) {
      builder.loadFile(
        'examples/../../resources/examples/phaser/blocks/blank.cwc'
      ).then(() => {
        expect(true).toEqual(true);
        done();
      }, () => {
        expect(false).toEqual(true);
        done();
      });
    });
  });
});
