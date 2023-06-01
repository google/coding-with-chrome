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

import '../../BlockEditor/blocks/StaticFilesBlocks.js';

import { APP_BASE_PATH } from '../../../constants/';
import { BlocksBuilder } from '../../BlockEditor/blocks/BlocksBuilder.js';
import { PhaserBlocksBuilder } from './../blocks/PhaserBlocksBuilder.js';

// Default sample images
const sampleImageData = [
  ['50px_blue', APP_BASE_PATH + 'assets/phaser/samples/50px_blue.png'],
  ['50px_green', APP_BASE_PATH + 'assets/phaser/samples/50px_green.png'],
  ['50px_red', APP_BASE_PATH + 'assets/phaser/samples/50px_red.png'],
  ['ball_blue', APP_BASE_PATH + 'assets/phaser/samples/ball_blue.png'],
  ['ball_green', APP_BASE_PATH + 'assets/phaser/samples/ball_green.png'],
  ['ball_red', APP_BASE_PATH + 'assets/phaser/samples/ball_red.png'],
  ['bg_01', APP_BASE_PATH + 'assets/phaser/samples/bg/bg_01.png'],
  ['bg_02', APP_BASE_PATH + 'assets/phaser/samples/bg/bg_02.png'],
  ['paddle', APP_BASE_PATH + 'assets/phaser/samples/paddle.png'],
  ['player', APP_BASE_PATH + 'assets/phaser/samples/player.png'],
];

// Processing sample images to get dataURL for static image blocks
const defaultBlocks = [];
for (const imageData of sampleImageData) {
  const imageURL = imageData[1];
  BlocksBuilder.getAsDataURL(imageData[0], imageURL).then((data) => {
    console.log('Add sample image ' + data.name + ' block.');
    defaultBlocks.push(
      PhaserBlocksBuilder.getStaticImageFileBlock(
        data.name,
        imageURL,
        data.dataURL
      )
    );
  });
}

export default {
  defaultBlocks,
};
