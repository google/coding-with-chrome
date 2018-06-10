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

goog.require('cwc.framework.Messenger');


/**
 * @param {!number} x
 * @param {!number} y
 * @param {!string} sprite_name
 * @param {Object=} group
 * @param {string=} manipulation
 * @export
 */
cwc.framework.Phaser.addGroupSprite = function(x, y, sprite_name, group,
    manipulation) {
  let sprite = game.add.sprite(x, y, sprite_name);
  if (group) {
    group.add(sprite);
  }
  game.physics.arcade.enable(sprite);
  sprite['checkWorldBounds'] = true;
  sprite['outOfBoundsKill'] = true;
  sprite['z'] = 100;
  if (manipulation && typeof manipulation === 'function') {
    manipulation(sprite);
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
 * @param {Object=} group
 * @param {Function=} manipulation
 * @export
 */
cwc.framework.Phaser.VerticalObstacleGenerator = function(x, y, num_blocks,
    space, sprite, opt_sprite_top, opt_sprite_bottom, group, manipulation) {
  let spriteSize = cwc.framework.Phaser.getSpriteSize(sprite, manipulation);
  let spriteSpace = game.rnd.integerInRange(0, num_blocks - space - 1);
  for (let i = 0; i < num_blocks; i++) {
    if (i < spriteSpace || i >= spriteSpace + space) {
      let groupSprite = sprite;
      if (i == spriteSpace + space && opt_sprite_bottom) {
        groupSprite = opt_sprite_bottom;
      } else if (i == spriteSpace - 1 && opt_sprite_top) {
        groupSprite = opt_sprite_top;
      }
      cwc.framework.Phaser.addGroupSprite(
        x, y + i * spriteSize.height, groupSprite, group, manipulation);
    }
  }
};


/**
 * @param {!number} x
 * @param {!number} y
 * @param {!number} num_blocks
 * @param {!string} sprite
 * @param {string=} opt_sprite
 * @param {Object=} group
 * @param {string=} direction
 * @param {Function=} manipulation
 * @export
 */
cwc.framework.Phaser.RandomVerticalObstacleGenerator = function(x, y,
    num_blocks, sprite, opt_sprite, group, direction, manipulation) {
  let spriteSize = cwc.framework.Phaser.getSpriteSize(sprite, manipulation);
  let numBlocks = game.rnd.integerInRange(0, num_blocks);
  if (direction === 'top') {
    y = y - spriteSize.height;
  }
  for (let i = 1; i <= numBlocks; i++) {
    if (direction === 'top') {
      cwc.framework.Phaser.addGroupSprite(x, y + i * spriteSize.height,
        (opt_sprite && i === numBlocks) ? opt_sprite : sprite,
        group, manipulation);
    } else {
      cwc.framework.Phaser.addGroupSprite(x, y - i * spriteSize.height,
        (opt_sprite && i === numBlocks) ? opt_sprite : sprite,
        group, manipulation);
    }
  }
};


/**
 * Generates sprite blocks based on the passed data.
 * @param {!string} sprite
 * @param {!Array} data 8 x 8 matrix
 * @param {number=} x
 * @param {number=} y
 * @param {number=} padding
 * @param {Object=} group
 * @param {Function=} manipulation
 * @export
 */
cwc.framework.Phaser.MatrixBlockGenerator = function(sprite, data,
    x = 0, y = 0, padding = 10, group, manipulation) {
  let index = 0;
  let spriteSize = cwc.framework.Phaser.getSpriteSize(sprite, manipulation);
  for (let row = 0; row <= 7; row++) {
    for (let column = 0; column <= 7; column++) {
      if (data[index++]) {
        let block_x = (column * (spriteSize.width + padding)) + x;
        let block_y = (row * (spriteSize.height + padding)) + y;
        cwc.framework.Phaser.addGroupSprite(
          block_x, block_y, sprite, group, manipulation);
      }
    }
  }
};


/**
 * Gets the sprite size after possible manipulations.
 * @param {!string} sprite
 * @param {Function=} manipulation
 * @return {Object}
 */
cwc.framework.Phaser.getSpriteSize = function(sprite, manipulation) {
  let width = game.cache.getImage(sprite).width;
  let height = game.cache.getImage(sprite).width;
  if (manipulation) {
    let testSprite = game.add.sprite(0, 0, sprite);
    game.physics.arcade.enable(testSprite);
    testSprite['visible'] = false;
    manipulation(testSprite);
    width = testSprite.width;
    height = testSprite.height;
    testSprite['destroy']();
  }
  return {
    width: width,
    height: height,
  };
};


/**
 * @private
 * @export
 */
cwc.framework.Phaser.init = function() {
  new cwc.framework.Messenger(true);
  document.addEventListener('DOMContentLoaded', cwc.framework.Phaser.prepare_);
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

  // Cleanup possible extra fragments like Ghostery
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


cwc.framework.Phaser.init();
