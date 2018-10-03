/**
 * @fileoverview Blockly Legacy support for Blockly blocks.
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
goog.provide('cwc.ui.BlocklyLegacy');


/**
 * Parse xml and perform specific fixes for typing errors or for larger changes.
 * @param {!string} xml
 * @return {!string}
 */
cwc.ui.BlocklyLegacy.parse = function(xml = '') {
  let result = xml;

  // Fix typing error like pyhsics instead of physics.
  result = result
    .replace(/phaser_pyhsics_/g, 'phaser_physics_');

  // Fix former block names
  result = result
    .replace(/phaser_physics_ball_sprite/g, 'phaser_physics_arcade_sprite_ball')
    .replace(/phaser_physics_player_sprite/g,
      'phaser_physics_arcade_sprite_player')
    .replace(/phaser_physics_paddle_sprite/g,
      'phaser_physics_arcade_sprite_paddle')
    .replace(/sphero_start/g, 'sphero_sphero2_start')
    .replace(/sphero_roll/g, 'sphero_sphero2_roll')
    .replace(/sphero_roll_step/g, 'sphero_sphero2_roll_step')
    .replace(/sphero_roll_time/g, 'sphero_sphero2_roll_time')
    .replace(/sphero_heading/g, 'sphero_sphero2_heading')
    .replace(/sphero_rgb/g, 'sphero_sphero2_rgb')
    .replace(/sphero_backlight/g, 'sphero_sphero2_backlight')
    .replace(/sphero_stop/g, 'sphero_sphero2_stop')
    .replace(/sphero_collision/g, 'sphero_sphero2_collision');

  return result || '';
};
