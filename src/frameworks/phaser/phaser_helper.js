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

    // Automatically scroll the background, ceiling, and floor.
    PhaserHelper.scrollTilePosition(this.game.background);
    PhaserHelper.scrollTilePosition(this.game.ceiling);
    PhaserHelper.scrollTilePosition(this.game.floor);
  }

  /**
   * @param {Object} tileObject
   */
  static scrollTilePosition(tileObject) {
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
