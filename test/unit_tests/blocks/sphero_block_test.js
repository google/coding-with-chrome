/**
 * @fileoverview Sphero block tests.
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


describe('Sphero Blocks', function() {
  document.body.insertAdjacentHTML('afterbegin',
    '<div id="test-workspace"></div>');
  window['i18t'] = function(msg) {
return msg;
};

  let blockPrefix = 'sphero_';
  let blocks = [];
  for (let block in Blockly.Blocks) {
    if (block.startsWith(blockPrefix)) {
      blocks.push(block);
    }
  }

  let blockScripts = [];
  for (let blockScript in Blockly.JavaScript) {
    if (blockScript.startsWith(blockPrefix)) {
      blockScripts.push(blockScript);
    }
  }

  it('Block definition', function() {
    expect(typeof Blockly.Blocks).toEqual('object');
    expect(typeof blocks).toEqual('object');
    expect(blocks.length > 0).toBe(true);
  });

  it('JavaScript definition', function() {
    expect(typeof Blockly.JavaScript).toEqual('object');
    expect(typeof blockScripts).toEqual('object');
    expect(blockScripts.length > 0).toBe(true);
    expect(blockScripts.length).toEqual(blocks.length);
  });

  blocks.forEach(function(block) {
    it('Block ' + block + ' to workspace', function() {
      let code = getTestBlockCode(block);
      expect(code && code.length > 1).toBe(true);
    });
  });
});
