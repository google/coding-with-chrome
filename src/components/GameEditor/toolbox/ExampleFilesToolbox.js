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
import { BlocksHelper } from '../blocks/BlocksHelper.js';

// Ball images.
const ballImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['ball_blue', APP_BASE_PATH + 'assets/phaser/samples/ball_blue.png'],
  ['ball_green', APP_BASE_PATH + 'assets/phaser/samples/ball_green.png'],
  ['ball_red', APP_BASE_PATH + 'assets/phaser/samples/ball_red.png'],
]);

// Floor mages.
const floorImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['50px_blue', APP_BASE_PATH + 'assets/phaser/samples/50px_blue.png'],
  ['50px_green', APP_BASE_PATH + 'assets/phaser/samples/50px_green.png'],
  ['50px_red', APP_BASE_PATH + 'assets/phaser/samples/50px_red.png'],
]);

// Ceiling images.
const ceilingImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['50px_blue', APP_BASE_PATH + 'assets/phaser/samples/50px_blue.png'],
  ['50px_green', APP_BASE_PATH + 'assets/phaser/samples/50px_green.png'],
  ['50px_red', APP_BASE_PATH + 'assets/phaser/samples/50px_red.png'],
]);

// Background images.
const backgroundImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['bg_01', APP_BASE_PATH + 'assets/phaser/samples/bg/bg_01.png'],
  ['bg_02', APP_BASE_PATH + 'assets/phaser/samples/bg/bg_02.png'],
]);

// Paddle images.
const paddleImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['paddle', APP_BASE_PATH + 'assets/phaser/samples/paddle.png'],
]);

// Player images.
const playerImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['dragon_01', APP_BASE_PATH + 'assets/phaser/samples/player/dragon_01.png'],
  [
    'fighter_aircraft_01',
    APP_BASE_PATH + 'assets/phaser/samples/player/fighter_aircraft_01.png',
  ],
  ['robot_01', APP_BASE_PATH + 'assets/phaser/samples/player/robot_01.png'],
  [
    'spaceship_01',
    APP_BASE_PATH + 'assets/phaser/samples/player/spaceship_01.png',
  ],
  ['ufo_01', APP_BASE_PATH + 'assets/phaser/samples/player/ufo_01.png'],
  ['ufo_02', APP_BASE_PATH + 'assets/phaser/samples/player/ufo_02.png'],
  ['witch_01', APP_BASE_PATH + 'assets/phaser/samples/player/witch_01.png'],
  ['wizard_01', APP_BASE_PATH + 'assets/phaser/samples/player/wizard_01.png'],
]);

// Symbol images.
const symbolImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['50px_red', APP_BASE_PATH + 'assets/phaser/samples/50px_red.png'],
]);

// images.
const obstacleImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['50px_red', APP_BASE_PATH + 'assets/phaser/samples/50px_red.png'],
]);

export default {
  backgroundImageBlocks,
  ballImageBlocks,
  ceilingImageBlocks,
  floorImageBlocks,
  obstacleImageBlocks,
  paddleImageBlocks,
  playerImageBlocks,
  symbolImageBlocks,
};
