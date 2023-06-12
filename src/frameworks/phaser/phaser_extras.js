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
 * @fileoverview Additional Phaser functions.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Provide additional functions to the Phaser library.
 */
class PhaserExtras {
  /**
   * Prepare and clear the document for the game from any artifacts.
   */
  clear() {
    // Remove existing canvas elements, in the case this is an saved document.
    const canvasElements = document.getElementsByTagName('canvas');
    if (canvasElements) {
      for (const canvasElement of canvasElements) {
        if (
          canvasElement.style &&
          canvasElement.style['touchAction'] == 'none' &&
          canvasElement.style['userSelect'] == 'none'
        ) {
          canvasElement.remove();
        }
      }
    }

    // Remove possible extra fragments like Ghostery.
    document.getElementById('ghostery-tracker-tally')?.remove();
    document.getElementById('ghostery-box')?.remove();
    document.getElementById('ghostery-pb-background')?.remove();
  }

  /**
   * Add a new sprite to the game.
   * @param {Object} game
   * @param {number} x
   * @param {number} y
   * @param {string} sprite_name
   * @param {Object=} group
   * @param {Function=} manipulation
   */
  static addGroupSprite(game, x, y, sprite_name, group, manipulation) {
    const sprite = game.physics.add.sprite(x, y, sprite_name);
    if (group) {
      group.add(sprite);
    }
    sprite['checkWorldBounds'] = true;
    sprite['outOfBoundsKill'] = true;
    sprite['z'] = 100;
    if (manipulation && typeof manipulation === 'function') {
      manipulation(sprite);
    }
  }

  /**
   * Generates vertical obstacles.
   * @param {Object} game
   * @param {number} x
   * @param {number} y
   * @param {number} num_blocks
   * @param {number} space
   * @param {string} sprite
   * @param {string=} opt_sprite_top
   * @param {string=} opt_sprite_bottom
   * @param {Object=} group
   * @param {Function=} manipulation
   */
  static VerticalObstacleGenerator(
    game,
    x,
    y,
    num_blocks,
    space,
    sprite,
    opt_sprite_top,
    opt_sprite_bottom,
    group,
    manipulation
  ) {
    const spriteSize = PhaserExtras.getSpriteSize(game, sprite, manipulation);
    const spriteSpace = Phaser.Math.RND.integerInRange(
      0,
      num_blocks - space - 1
    );
    for (let i = 0; i < num_blocks; i++) {
      if (i < spriteSpace || i >= spriteSpace + space) {
        let groupSprite = sprite;
        if (i == spriteSpace + space && opt_sprite_bottom) {
          groupSprite = opt_sprite_bottom;
        } else if (i == spriteSpace - 1 && opt_sprite_top) {
          groupSprite = opt_sprite_top;
        }
        PhaserExtras.addGroupSprite(
          game,
          x,
          y + i * spriteSize.height,
          groupSprite,
          group,
          manipulation
        );
      }
    }
  }

  /**
   * Generates random vertical obstacles.
   * @param {Object} game
   * @param {number} x
   * @param {number} y
   * @param {number} num_blocks
   * @param {string} sprite
   * @param {string=} opt_sprite
   * @param {Object=} group
   * @param {string=} direction
   * @param {Function=} manipulation
   */
  static RandomVerticalObstacleGenerator(
    game,
    x,
    y,
    num_blocks,
    sprite,
    opt_sprite,
    group,
    direction,
    manipulation
  ) {
    const spriteSize = PhaserExtras.getSpriteSize(game, sprite, manipulation);
    const numBlocks = Phaser.Math.RND.integerInRange(0, num_blocks);
    if (direction === 'top') {
      y = y - spriteSize.height;
    }
    for (let i = 1; i <= numBlocks; i++) {
      if (direction === 'top') {
        PhaserExtras.addGroupSprite(
          game,
          x,
          y + i * spriteSize.height,
          opt_sprite && i === numBlocks ? opt_sprite : sprite,
          group,
          manipulation
        );
      } else {
        PhaserExtras.addGroupSprite(
          game,
          x,
          y - i * spriteSize.height,
          opt_sprite && i === numBlocks ? opt_sprite : sprite,
          group,
          manipulation
        );
      }
    }
  }

  /**
   * Generates sprite blocks based on the passed data.
   * @param {Object} game
   * @param {string} sprite
   * @param {!Array} data 8 x 8 matrix
   * @param {number=} x
   * @param {number=} y
   * @param {number=} padding
   * @param {Object=} group
   * @param {Function=} manipulation
   */
  static MatrixBlockGenerator(
    game,
    sprite,
    data,
    x = 0,
    y = 0,
    padding = 10,
    group,
    manipulation
  ) {
    let index = 0;
    const spriteSize = PhaserExtras.getSpriteSize(game, sprite, manipulation);
    for (let row = 0; row <= 7; row++) {
      for (let column = 0; column <= 7; column++) {
        if (data[index++]) {
          const block_x = column * (spriteSize.width + padding) + x;
          const block_y = row * (spriteSize.height + padding) + y;
          PhaserExtras.addGroupSprite(
            game,
            block_x,
            block_y,
            sprite,
            group,
            manipulation
          );
        }
      }
    }
  }

  /**
   * Gets the sprite size after possible manipulations.
   * @param {Object} game
   * @param {string} sprite
   * @param {Function=} manipulation
   * @return {Object}
   */
  static getSpriteSize(game, sprite, manipulation) {
    let width = game.textures.get(sprite).width;
    let height = game.textures.get(sprite).width;
    if (manipulation) {
      const testSprite = game.physics.add.sprite(0, 0, sprite);
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
  }

  /**
   * Take a screenshot of the game and return it as a data URL.
   * @param {Object} game
   * @return {string}
   */
  static takeScreenshot(game) {
    const aspectRatio = 270 / 152;
    let width = game.canvas.width;
    let height = game.canvas.height;

    // Scale down the screenshot to fit the preview.
    if (width / height > aspectRatio) {
      width = 270;
      height = (width / game.canvas.width) * game.canvas.height;
    } else {
      height = 152;
      width = (height / game.canvas.height) * game.canvas.width;
    }

    // Draw the screenshot on the preview canvas.
    const preview = document.createElement('canvas');
    preview.width = 270;
    preview.height = 152;
    const ctx = preview.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, preview.width, preview.height);
    ctx.drawImage(
      game.canvas,
      0,
      0,
      game.canvas.width,
      game.canvas.height,
      (270 - width) / 2,
      (152 - height) / 2,
      width,
      height
    );
    return preview.toDataURL();
  }

  /**
   * Opens a new window with the screenshot.
   * @param {Object} game
   */
  static showScreenshot(game) {
    const image = new Image();
    image.src = PhaserExtras.takeScreenshot(game);
    const screenshotWindow = window.open('');
    screenshotWindow.document.write(image.outerHTML);
  }

  /**
   * Sends the screenshot to the main window.
   * @param {Object} game
   */
  static sendScreenshot(game) {
    const data = PhaserExtras.takeScreenshot(game);
    if (data && window.parent) {
      window.parent.postMessage(
        {
          type: 'screenshot',
          value: data,
        },
        `${window.location.origin}`
      );
    }
  }
}

// Clear any existing fragments when the page is loaded.
document.addEventListener('DOMContentLoaded', function () {
  new PhaserExtras().clear();
});

// Send a screenshot after 500ms when the page is loaded.
if (window.location.pathname.endsWith('/screenshot')) {
  window.addEventListener('load', function () {
    window.setTimeout(() => {
      PhaserExtras.sendScreenshot(window.game);
    }, 750);
  });
}
