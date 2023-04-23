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
 * @fileoverview Example Files Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/DynamicFileBlocks.js';
import '../../BlockEditor/blocks/StaticFilesBlocks.js';

import { PhaserBlocksBuilder } from '../blocks/PhaserBlocksBuilder.js';

/**
 * @param {Map} files
 * @return {Array}
 */
export function getDynamicAudioFilesToolbox(files) {
  const getDynamicAudioFileBlocks = [];
  files.forEach((file) => {
    getDynamicAudioFileBlocks.push(
      PhaserBlocksBuilder.getDynamicAudioFileBlock(
        file.name,
        file.filename,
        file.url,
        file.urlData
      )
    );
  });
  return getDynamicAudioFileBlocks;
}

/**
 * @param {Map} files
 * @return {Array}
 */
export function getDynamicImageFilesToolbox(files) {
  const getDynamicImageFileBlocks = [];
  files.forEach((file) => {
    getDynamicImageFileBlocks.push(
      PhaserBlocksBuilder.getDynamicImageFileBlock(
        file.name,
        file.filename,
        file.url,
        file.urlData
      )
    );
  });
  return getDynamicImageFileBlocks;
}

export default {
  getDynamicImageFilesToolbox,
  getDynamicAudioFilesToolbox,
};
