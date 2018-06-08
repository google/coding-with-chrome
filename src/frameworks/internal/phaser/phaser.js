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
 * @param {Object=} group
 * @param {string=} opt_manipulation
 * @param {string=} opt_manipulation_value
 * @export
 */
cwc.framework.Phaser.addGroupSprite = function(x, y, sprite_name,
    group, opt_manipulation, opt_manipulation_value) {
  let sprite = game.add.sprite(x, y, sprite_name);
  if (group) {
    group.add(sprite);
  }
  game.physics.arcade.enable(sprite);
  sprite['checkWorldBounds'] = true;
  sprite['outOfBoundsKill'] = true;
  sprite['z'] = 100;
  if (opt_manipulation && opt_manipulation_value) {
    if (opt_manipulation.includes('.')) {
      let attributes = opt_manipulation.split('.');
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
  let spriteSpace = game.rnd.integerInRange(0, num_blocks - space - 1);
  let height = game.cache.getImage(sprite).height;
  for (let i = 0; i < num_blocks; i++) {
    if (i < spriteSpace || i >= spriteSpace + space) {
      let groupSprite = sprite;
      if (i == spriteSpace + space && opt_sprite_bottom) {
        groupSprite = opt_sprite_bottom;
      } else if (i == spriteSpace - 1 && opt_sprite_top) {
        groupSprite = opt_sprite_top;
      }
      cwc.framework.Phaser.addGroupSprite(
        x, y + i * height, groupSprite, opt_group, opt_manipulation,
        opt_manipulation_value);
    }
  }
};


/**
 * @param {!number} x
 * @param {!number} y
 * @param {!number} num_blocks
 * @param {!string} sprite
 * @param {string=} opt_sprite
 * @param {Object=} opt_group
 * @param {string=} opt_direction
 * @param {string=} opt_manipulation
 * @param {string=} opt_manipulation_value
 * @export
 */
cwc.framework.Phaser.RandomVerticalObstacleGenerator = function(x, y,
    num_blocks, sprite, opt_sprite, opt_group, opt_direction,
    opt_manipulation = '', opt_manipulation_value = '') {
  let height = game.cache.getImage(sprite).height;
  let numBlocks = game.rnd.integerInRange(0, num_blocks);
  if (opt_direction === 'top') {
    y = y - height;
  }

  for (let i = 1; i <= numBlocks; i++) {
    if (opt_direction === 'top') {
      cwc.framework.Phaser.addGroupSprite(x, y + i * height,
        (opt_sprite && i === numBlocks) ? opt_sprite : sprite,
        opt_group, opt_manipulation,
        opt_manipulation_value);
    } else {
      cwc.framework.Phaser.addGroupSprite(x, y - i * height,
        (opt_sprite && i === numBlocks) ? opt_sprite : sprite,
        opt_group, opt_manipulation,
        opt_manipulation_value);
    }
  }
};


/**
 * @param {!string} sprite
 * @param {!Array} data
 * @param {number=} x
 * @param {number=} y
 * @param {number=} padding
 * @param {Object=} group
 * @export
 */
cwc.framework.Phaser.MatrixBlockGenerator = function(sprite, data,
    x = 0, y = 0, padding = 10, group) {
  let index = 0;
  let spriteWidth = game.cache.getImage(sprite).width;
  let spriteHeight = game.cache.getImage(sprite).height;
  for (let row = 0; row <= 7; row++) {
    for (let column = 0; column <= 7; column++) {
      if (data[index]) {
        let block_x = (column * (spriteWidth + padding)) + x;
        let block_y = (row * (spriteHeight + padding)) + y;
        cwc.framework.Phaser.addGroupSprite(block_x, block_y, sprite, group);
      }
      index++;
    }
  }
};


/**
 * Prepares Phaser framework.
 * @private
 */
cwc.framework.Phaser.prepare_ = function() {
  if (navigator && navigator.userAgent == 'CwC sandbox') {
    return;
  }

  if (document.location.href.includes('127.0.0.1:') &&
      document.location.href.includes('/preview/')) {
    console.log('Pre-caching files for export ...');
    return;
  }

  // Cleanup existing canvas elements, in the case this is an saved document.
  let canvasElements = document.getElementsByTagName('canvas');
  if (canvasElements) {
    for (let canvaElement of canvasElements) {
      if (canvaElement.style &&
          canvaElement.style['touchAction'] == 'none' &&
          canvaElement.style['userSelect'] == 'none') {
        canvaElement.remove();
      }
    }
  }

  // Cleanup possible add on fragments like Ghostery
  if (document.getElementById('ghostery-purple-box')) {
    document.getElementById('ghostery-purple-box').remove();
  } else {
    if (document.getElementById('ghostery-box')) {
      document.getElementById('ghostery-box').remove();
    }
    if (document.getElementById('ghostery-pb-background')) {
      document.getElementById('ghostery-pb-background').remove();
    }
  }
};


document.addEventListener('DOMContentLoaded', cwc.framework.Phaser.prepare_);
