/**
 * @fileoverview Phaser framework.
 * This frameworks adds additional functionality for Phaser.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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

goog.provide('cwc.framework.Phaser');



/**
 * @param {!number} x
 * @param {!number} y
 * @param {!string} sprite_name
 * @param {Object=} opt_group
 * @param {string=} opt_manipulation
 * @param {string=} opt_manipulation_value
 * @export
 */
cwc.framework.Phaser.addGroupSprite = function(x, y, sprite_name,
    opt_group, opt_manipulation, opt_manipulation_value) {
  var sprite = game.add.sprite(x, y, sprite_name);
  if (opt_group) {
    opt_group.add(sprite);
  }
  game.physics.arcade.enable(sprite);
  sprite['checkWorldBounds'] = true;
  sprite['outOfBoundsKill'] = true;
  if (opt_manipulation && opt_manipulation_value) {
    if (opt_manipulation.includes('.')) {
      var attributes = opt_manipulation.split('.');
      sprite['body'][attributes[0]][attributes[1]] = opt_manipulation_value;
    } else {
      sprite['body'][opt_manipulation] = opt_manipulation_value;
    }
  }
};


/**
 * @param {!number} x
 * @param {!number} y
 * @param {!number} num_blocks
 * @param {!number} space
 * @param {!string} sprite
 * @param {string=} opt_sprite_top
 * @param {string=} opt_sprite_bottom
 * @param {Object=} opt_group
 * @param {string=} opt_manipulation
 * @param {string=} opt_manipulation_value
 * @export
 */
cwc.framework.Phaser.VerticalObstacleGenerator = function(x, y, num_blocks,
    space, sprite, opt_sprite_top, opt_sprite_bottom, opt_group,
    opt_manipulation = '', opt_manipulation_value = '') {
  var spriteSpace = game.rnd.integerInRange(1, num_blocks - space - 1);
  var height = game.cache.getImage(sprite).height;
  for (let i = 0; i < num_blocks; i++) {
    if (i < spriteSpace || i >= spriteSpace + space) {
      if (i == spriteSpace + space && opt_sprite_bottom) {
        cwc.framework.Phaser.addGroupSprite(
          x, y + i * height, opt_sprite_bottom, opt_group, opt_manipulation,
          opt_manipulation_value);
      } else if (i == spriteSpace - 1 && opt_sprite_top) {
        cwc.framework.Phaser.addGroupSprite(
          x, y + i * height, opt_sprite_top, opt_group, opt_manipulation,
          opt_manipulation_value);
      } else {
        cwc.framework.Phaser.addGroupSprite(
          x, y + i * height, sprite, opt_group, opt_manipulation,
          opt_manipulation_value);
      }
    }
  }
};
