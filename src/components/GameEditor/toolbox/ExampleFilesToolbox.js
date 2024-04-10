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
const floorImagePath = APP_BASE_PATH + 'assets/phaser/samples/floor/';
const floorImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['floor_50px_blue', floorImagePath + 'floor_50px_blue.png'],
  ['floor_50px_green', floorImagePath + 'floor_50px_green.png'],
  ['floor_50px_red', floorImagePath + 'floor_50px_red.png'],
  ['floor_01', floorImagePath + 'floor_01.png'],
]);

// Ceiling images.
const ceilingImagePath = APP_BASE_PATH + 'assets/phaser/samples/ceiling/';
const ceilingImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['ceiling_50px_blue', ceilingImagePath + 'ceiling_50px_blue.png'],
  ['ceiling_50px_green', ceilingImagePath + 'ceiling_50px_green.png'],
  ['ceiling_50px_red', ceilingImagePath + 'ceiling_50px_red.png'],
]);

// Background images.
const backgroundImagePath = APP_BASE_PATH + 'assets/phaser/samples/bg/';
const backgroundImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['bg_01', backgroundImagePath + 'bg_01.png'],
  ['bg_02', backgroundImagePath + 'bg_02.png'],
  ['bg_sky_01', backgroundImagePath + 'bg_sky_01.png'],
  ['bg_city_01', backgroundImagePath + 'bg_city_01.png'],
]);

// Paddle images.
const paddleImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['paddle', APP_BASE_PATH + 'assets/phaser/samples/paddle.png'],
]);

// Player images.
const playerImagePath = APP_BASE_PATH + 'assets/phaser/samples/player/';
const playerImageBlocks = BlocksHelper.phaserImagesToBlock([
  ['dragon_01', playerImagePath + 'dragon_01.png'],
  ['fighter_aircraft_01', playerImagePath + 'fighter_aircraft_01.png'],
  ['robot_01', playerImagePath + 'robot_01.png'],
  ['spaceship_01', playerImagePath + 'spaceship_01.png'],
  ['ufo_01', playerImagePath + 'ufo_01.png'],
  ['ufo_02', playerImagePath + 'ufo_02.png'],
  ['witch_01', playerImagePath + 'witch_01.png'],
  ['wizard_01', playerImagePath + '/wizard_01.png'],
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
