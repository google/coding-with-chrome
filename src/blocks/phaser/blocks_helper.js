/**
 * @fileoverview Phaser Blocks Helper for Blockly.
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


/**
 * JavaScript to get all sprites in the workspace.
 * @param {string} name
 * @return {!Array}
 */
Blockly.BlocksHelper['phaser_image'] = function(name) {
  return Blockly.BlocksHelper['phaser_images'](name);
};


/**
 * Returns an sorted list of all used phaser images or an placeholder.
 * @param {string=} name
 * @return {!Array}
 */
Blockly.BlocksHelper['phaser_images'] = function(name = '') {
  let foundName = false;
  let spriteList = [];
  let blocks = Blockly.getMainWorkspace().getAllBlocks();
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i]['type'] === 'phaser_load_image') {
      let imageName = blocks[i]['inputList'][0]['fieldRow'][2]['text_'];
      let childInputList = blocks[i]['childBlocks_'][0]['inputList'];
      let imageSrc = childInputList [0]['fieldRow'][0]['src_'] ||
        childInputList [1]['fieldRow'][0]['src_'];
      let imageEntry = [
        imageSrc ? {'src': imageSrc, 'width': 50, 'height': 50} : imageName,
        imageName,
      ];
      if (name && imageName === name) {
        spriteList.unshift(imageEntry);
        foundName = true;
      } else {
        spriteList.push(imageEntry);
      }
    }
  }
  if (name && !foundName) {
    spriteList.unshift([name, name]);
  }
  if (!spriteList.length) {
    spriteList.push(['none', 'none']);
  }
  return spriteList;
};


/**
 * @param {string} name
 * @return {string}
 */
Blockly.BlocksHelper['validate_text'] = function(name) {
  return name
    .replace(/'/g, '')
    .replace(/\\/g, '');
};
