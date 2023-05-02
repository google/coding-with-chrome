/**
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 */

/**
 * @fileoverview General Blocks helper definition.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly from 'blockly';

/**
 * Simple Blocks Helper
 */
export class BlocksHelper {
  /**
   * @param {string} name
   * @return {!Array}
   */
  static phaserImage(name) {
    let foundName = false;
    const phaserImageList = [];
    const blocks = Blockly.getMainWorkspace().getBlocksByType(
      'phaser_load_image',
      true
    );
    for (const block of blocks) {
      if (
        block &&
        !block['disabled'] &&
        block['childBlocks_'][0] !== undefined
      ) {
        const imageName =
          block['inputList'][0]['fieldRow'][2]['value_'] || 'unknown';
        const childInputList = block['childBlocks_'][0]['inputList'];
        const imageSrc =
          childInputList[0]['fieldRow'][0]['value_'] ||
          childInputList[1]['fieldRow'][0]['value_'];
        const imageEntry = [
          imageSrc ? { src: imageSrc, width: 50, height: 50 } : imageName,
          imageName,
        ];
        if (name && imageName === name) {
          phaserImageList.unshift(imageEntry);
          foundName = true;
        } else {
          phaserImageList.push(imageEntry);
        }
      }
    }
    if (name && !foundName) {
      phaserImageList.unshift([name, name]);
    }
    if (!phaserImageList.length) {
      phaserImageList.push(['none', 'none']);
    }
    return phaserImageList;
  }

  /**
   * @param {string} text
   * @return {string}
   */
  static validateText(text) {
    return text.replace(/'/g, '').replace(/\\/g, '');
  }

  /**
   * @param {string} value
   * @return {number}
   */
  static validateNumber(value) {
    return Number(value.replace(/[^\d.-]/g, ''));
  }
}