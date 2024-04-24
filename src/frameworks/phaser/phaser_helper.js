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
 * Helper class for different phaser parts.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, require-jsdoc, no-unused-vars
class PhaserHelper {
  /**
   * @param {object} game
   * @constructor
   */
  constructor(game) {
    this.game = game;
    this.sprite = new Set();
    this.tileSprite = new Set();
    this.arcadeSprite = new Set();
    window.phaserReloadProtection = window.phaserReloadProtection || {};
  }

  /**
   * @param {object} sprite
   */
  addSprite(sprite) {
    this.sprite.add(sprite);
  }

  /**
   * @param {object} tileSprite
   */
  addTileSprite(tileSprite) {
    this.tileSprite.add(tileSprite);
  }

  /**
   * @param {object} arcadeSprite
   */
  addArcadeSprite(arcadeSprite) {
    this.arcadeSprite.add(arcadeSprite);
  }

  /**
   * @param {string} id
   * @return {boolean}
   */
  checkReloadProtection(id) {
    if (window.phaserReloadProtection[id] < 5) {
      window.phaserReloadProtection[id] = window.phaserReloadProtection[id] + 1;
      return true;
    } else {
      console.error('⚠️ Reload protection triggered for', id);
      console.warn('💡 Please check your code for endless loops!');
    }
    return false;
  }

  /**
   * @param {string} id
   */
  resetReloadProtection(id) {
    // Reset reload protection.
    if (
      window.phaserReloadProtection[id] &&
      window.phaserReloadProtection[id] > 0
    ) {
      window.setTimeout(() => {
        window.phaserReloadProtection[id] = 0;
      }, 100);
    }
  }

  /**
   * Handles input specific functions, if needed.
   */
  handleInput() {
    if (!this.game || !this.game.input_) {
      return;
    }

    this.game.input_();
  }

  /**
   * Handles update specific functions.
   */
  handleUpdate() {
    if (!this.game) {
      return;
    }

    // Automatically scroll tile sprites, if any.
    this.tileSprite.forEach((tileSprite) => {
      PhaserHelper.scrollTileSprite(tileSprite);
    });
  }

  /**
   * @param {Object} tileObject
   */
  static scrollTileSprite(tileObject) {
    if (!tileObject) {
      return;
    }
    if (tileObject.scrollFactorX) {
      tileObject.tilePositionX += tileObject.scrollFactorX;
    }
    if (tileObject.scrollFactorY) {
      tileObject.tilePositionY += tileObject.scrollFactorY;
    }
  }
}
