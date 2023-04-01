/**
 * @license Copyright 2023 The Coding with Chrome Authors.
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

import './../blocks/ArcadePhysicsBlocks';
import './../blocks/CreateBlocks';
import './../blocks/SpriteBlocks';
import './../blocks/TimeBlocks';
import './../blocks/UpdateBlocks';

import GameToolbox from './GameToolbox';
import GeneratorToolbox from './GeneratorToolbox';
import PreloadToolbox from './PreLoadToolbox';
import RenderToolbox from './RenderToolbox';
import WorldToolbox from './WorldToolbox';

import getAudioToolbox from './AudioToolbox';
import getInputToolbox from './InputToolbox';
import getTextToolbox from './TextToolbox';
import getTileSpriteToolbox from './TileSpriteToolbox';

import i18next from 'i18next';

/**
 * ToolBox for the game editor.
 */
export class Toolbox {
  /**
   * @return {object}
   */
  static getToolbox() {
    let toolBox = {};
    toolBox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_GAME'),
          colour: '75',
          cssConfig: {
            container: 'icon_direction_run',
          },
          contents: GameToolbox,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_PRELOAD'),
          colour: '165',
          cssConfig: {
            container: 'icon_file_download',
          },
          contents: PreloadToolbox,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_CREATE'),
          colour: '30',
          contents: [
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TEXT'),
              colour: '255',
              contents: getTextToolbox(),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_GENERATOR'),
              colour: '105',
              contents: GeneratorToolbox,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_WORLD'),
              colour: '345',
              contents: WorldToolbox,
            },
          ],
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_INPUT'),
          colour: '165',
          contents: getInputToolbox().concat([
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_AUDIO'),
              colour: '245',
              contents: getAudioToolbox(),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_SPRITE'),
              colour: '225',
              contents: [],
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TILE_SPRITE'),
              colour: '285',
              contents: getTileSpriteToolbox(),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE'),
              colour: '0',
              contents: [],
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TEXT'),
              colour: '255',
              contents: [],
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_INPUTS'),
              colour: '255',
              contents: [],
            },
          ]),
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_UPDATE'),
          colour: '165',
          contents: [],
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_RENDERER'),
          colour: '165',
          contents: RenderToolbox,
        },
        {
          kind: 'separator',
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_FILES'),
          colour: '150',
          contents: [],
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES'),
          colour: '150',
          contents: [],
        },
        {
          kind: 'sep',
        },
        {
          kind: 'sep',
        },
      ],
    };
    return toolBox;
  }
}
