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
 * @fileoverview Dynamic File parser for the Phaser Blockly modification.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @class
 */
export class DynamicFileParser {
  /**
   * @param {WorkspaceSvg} workspace
   * @return {Map}
   */
  static getPhaserAudioFiles(workspace) {
    const result = new Map();
    const blocks = workspace.getBlocksByType('phaser_load_audio', true);
    if (blocks.length > 0) {
      for (const block of blocks) {
        if (
          block &&
          block['childBlocks_'].length >= 1 &&
          block['childBlocks_'][0]['type'] == 'dynamic_audio_file'
        ) {
          // Read data from phaser load audio block.
          const name =
            block['inputList'][0]['fieldRow'][2]['value_'] || 'unknown';

          // Read data from dynamic audio file block.
          const childBlock = block['childBlocks_'][0];
          const filename = childBlock['inputList'][0]['fieldRow'][0]['value_'];
          const url = childBlock['inputList'][0]['fieldRow'][1]['value_'];
          const urlData = childBlock['inputList'][0]['fieldRow'][2]['value_'];
          result.set(name, {
            name,
            filename,
            url,
            urlData,
          });
        }
      }
    }
    return result;
  }

  /**
   * @param {WorkspaceSvg} workspace
   * @return {Map}
   */
  static getPhaserImageFiles(workspace) {
    const result = new Map();
    const blocks = workspace.getBlocksByType('phaser_load_image', true);
    if (blocks.length > 0) {
      for (const block of blocks) {
        if (
          block &&
          block['childBlocks_'].length >= 1 &&
          block['childBlocks_'][0]['type'] == 'dynamic_image_file'
        ) {
          // Read data from phaser load image block.
          const name =
            block['inputList'][0]['fieldRow'][2]['value_'] || 'unknown';

          // Read data from dynamic image file block.
          const childBlock = block['childBlocks_'][0];
          const urlData = childBlock['inputList'][0]['fieldRow'][0]['value_'];
          const filename = childBlock['inputList'][1]['fieldRow'][0]['value_'];
          const url = childBlock['inputList'][1]['fieldRow'][1]['value_'];

          result.set(name, {
            name,
            filename,
            url,
            urlData,
          });
        }
      }
    }
    return result;
  }
}
