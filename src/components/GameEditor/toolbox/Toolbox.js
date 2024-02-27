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
 * @fileoverview Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import ArcadePhysicsToolbox from './ArcadePhysicsToolbox';
import AudioToolbox from './AudioToolbox';
import CreateToolbox from './CreateToolbox';
import DynamicFilesToolbox from './DynamicFilesToolbox';
import EventToolbox from './EventToolbox';
import ExampleFilesToolbox from './ExampleFilesToolbox';
import GameToolbox from './GameToolbox';
import GeneratorToolbox from './GeneratorToolbox';
import GroupToolbox from './GroupToolbox';
import InputToolbox from './InputToolbox';
import PreloadToolbox from './PreloadToolbox';
import RenderToolbox from './RenderToolbox';
import SpriteToolbox from './SpriteToolbox';
import TextToolbox from './TextToolbox';
import TileSpriteToolbox from './TileSpriteToolbox';
import TimeToolbox from './TimeToolbox';
import UpdateToolbox from './UpdateToolbox';
import WorldToolbox from './WorldToolbox';

import DefaultColorsToolbox from '../../BlockEditor/toolbox/ColorsToolbox';
import DefaultListsToolbox from '../../BlockEditor/toolbox/ListsToolbox';
import DefaultLogicToolbox from '../../BlockEditor/toolbox/LogicToolbox';
import DefaultLoopToolbox from '../../BlockEditor/toolbox/LoopToolbox';
import DefaultMathToolbox from '../../BlockEditor/toolbox/MathToolbox';
import DefaultTextToolbox from '../../BlockEditor/toolbox/TextToolbox';

import i18next from 'i18next';

/**
 * ToolBox for the game editor.
 */
export class Toolbox {
  /**
   * @param {Map} audioFiles
   * @param {Map} imageFiles
   * @return {object}
   */
  static getToolbox(audioFiles = new Map(), imageFiles = new Map()) {
    return {
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
            container: 'icon_file_download blocklyTreeRoot',
          },
          expanded: 'false',
          contents: PreloadToolbox.concat([
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_FILES_CUSTOM'),
              colour: '150',
              cssConfig: {
                container: 'icon_perm_media blocklyTreeChild',
              },
              contents: DynamicFilesToolbox.getDynamicImageFilesToolbox(
                imageFiles,
              ).concat(
                DynamicFilesToolbox.getDynamicAudioFilesToolbox(audioFiles),
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_BACKGROUND'),
              colour: '150',
              cssConfig: {
                container: 'icon_wallpaper blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.backgroundImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_BALL'),
              colour: '150',
              cssConfig: {
                container: 'icon_sports_soccer blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.ballImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_CEILING'),
              colour: '150',
              cssConfig: {
                container: 'icon_border_top blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.ceilingImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_FLOOR'),
              colour: '150',
              cssConfig: {
                container: 'icon_border_bottom blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.floorImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_OBSTACLE'),
              colour: '150',
              cssConfig: {
                container: 'icon_oil_barrel blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.obstacleImageBlocksImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_PADDLE'),
              colour: '150',
              cssConfig: {
                container: 'icon_sports_cricket blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.paddleImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_PLAYER'),
              colour: '150',
              cssConfig: {
                container: 'icon_boy blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.playerImageBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_EXAMPLE_FILES_SYMBOL'),
              colour: '150',
              cssConfig: {
                container: 'icon_category blocklyTreeChild',
              },
              contents: ExampleFilesToolbox.symbolImageBlocks,
            },
          ]),
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_CREATE'),
          colour: '30',
          cssConfig: {
            container: 'icon_add_circle blocklyTreeRoot',
          },
          expanded: 'false',
          contents: CreateToolbox.defaultBlocks.concat([
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_AUDIO'),
              colour: '245',
              cssConfig: {
                container: 'icon_audiotrack blocklyTreeChild',
              },
              contents: AudioToolbox.createBlocks.concat(
                AudioToolbox.defaultBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_SPRITE'),
              colour: '225',
              cssConfig: {
                container: 'icon_portrait blocklyTreeChild',
              },
              contents: SpriteToolbox.createBlocks.concat(
                SpriteToolbox.defaultBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TILE_SPRITE'),
              colour: '285',
              cssConfig: {
                container: 'icon_burst_mode blocklyTreeChild',
              },
              contents: TileSpriteToolbox.createBlocks.concat(
                TileSpriteToolbox.defaultBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE'),
              colour: '0',
              cssConfig: {
                container: 'icon_rotate_90_degrees_ccw blocklyTreeChild',
              },
              contents: ArcadePhysicsToolbox.createBlocks.concat(
                ArcadePhysicsToolbox.defaultBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TEXT'),
              colour: '255',
              cssConfig: {
                container: 'icon_format_shapes blocklyTreeChild',
              },
              contents: TextToolbox.createBlocks.concat(
                TextToolbox.eventBlocks,
                TextToolbox.defaultBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_INPUTS'),
              colour: '255',
              cssConfig: {
                container: 'icon_keyboard blocklyTreeChild',
              },
              contents: InputToolbox.createBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_GENERATOR'),
              colour: '105',
              cssConfig: {
                container: 'icon_extension blocklyTreeChild',
              },
              contents: GeneratorToolbox,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_GROUP'),
              colour: '260',
              cssConfig: {
                container: 'icon_group_work blocklyTreeChild',
              },
              contents: GroupToolbox.createBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_WORLD'),
              colour: '345',
              cssConfig: {
                container: 'icon_computer blocklyTreeChild',
              },
              contents: WorldToolbox.createBlocks.concat(
                WorldToolbox.defaultBlocks,
              ),
            },
          ]),
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_INPUT'),
          colour: '135',
          cssConfig: {
            container: 'icon_keyboard blocklyTreeRoot',
          },
          expanded: 'false',
          contents: InputToolbox.eventBlocks.concat([
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_INPUT_LOGIC'),
              colour: '255',
              cssConfig: {
                container: 'icon_call_split blocklyTreeChild',
              },
              contents: InputToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_AUDIO'),
              colour: '245',
              cssConfig: {
                container: 'icon_audiotrack blocklyTreeChild',
              },
              contents: AudioToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_SPRITE'),
              colour: '225',
              cssConfig: {
                container: 'icon_portrait blocklyTreeChild',
              },
              contents: SpriteToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TILE_SPRITE'),
              colour: '285',
              cssConfig: {
                container: 'icon_burst_mode blocklyTreeChild',
              },
              contents: TileSpriteToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE'),
              colour: '0',
              cssConfig: {
                container: 'icon_rotate_90_degrees_ccw blocklyTreeChild',
              },
              contents: ArcadePhysicsToolbox.defaultBlocks.concat(
                ArcadePhysicsToolbox.eventBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TEXT'),
              colour: '255',
              cssConfig: {
                container: 'icon_format_shapes blocklyTreeChild',
              },
              contents: TextToolbox.eventBlocks.concat(
                TextToolbox.defaultBlocks,
              ),
            },
          ]),
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_EVENT'),
          colour: '315',
          cssConfig: {
            container: 'icon_repeat blocklyTreeRoot',
          },
          expanded: 'false',
          contents: EventToolbox.defaultBlocks.concat([
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE'),
              colour: '0',
              cssConfig: {
                container: 'icon_rotate_90_degrees_ccw blocklyTreeChild',
              },
              contents: ArcadePhysicsToolbox.defaultBlocks.concat(
                ArcadePhysicsToolbox.eventBlocks,
              ),
            },
          ]),
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_UPDATE'),
          colour: '315',
          cssConfig: {
            container: 'icon_repeat blocklyTreeRoot',
          },
          expanded: 'false',
          contents: UpdateToolbox.defaultBlocks.concat([
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_AUDIO'),
              colour: '245',
              cssConfig: {
                container: 'icon_audiotrack blocklyTreeChild',
              },
              contents: AudioToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_SPRITE'),
              colour: '225',
              cssConfig: {
                container: 'icon_portrait blocklyTreeChild',
              },
              contents: SpriteToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TILE_SPRITE'),
              colour: '285',
              cssConfig: {
                container: 'icon_burst_mode blocklyTreeChild',
              },
              contents: TileSpriteToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE'),
              colour: '0',
              cssConfig: {
                container: 'icon_rotate_90_degrees_ccw blocklyTreeChild',
              },
              contents: ArcadePhysicsToolbox.defaultBlocks.concat(
                ArcadePhysicsToolbox.eventBlocks,
              ),
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TEXT'),
              colour: '255',
              cssConfig: {
                container: 'icon_format_shapes blocklyTreeChild',
              },
              contents: TextToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_INPUTS'),
              colour: '255',
              cssConfig: {
                container: 'icon_keyboard blocklyTreeChild',
              },
              contents: InputToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_TIME'),
              colour: '350',
              cssConfig: {
                container: 'icon_access_time blocklyTreeChild',
              },
              contents: TimeToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_GROUP'),
              colour: '260',
              cssConfig: {
                container: 'icon_group_work blocklyTreeChild',
              },
              contents: GroupToolbox.defaultBlocks,
            },
            {
              kind: 'category',
              name: i18next.t('BLOCKS_PHASER_WORLD'),
              colour: '345',
              cssConfig: {
                container: 'icon_computer blocklyTreeChild',
              },
              contents: WorldToolbox.updateBlocks.concat(
                WorldToolbox.defaultBlocks,
              ),
            },
          ]),
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_PHASER_RENDERER'),
          colour: '195',
          cssConfig: {
            container: 'icon_computer',
          },
          contents: RenderToolbox,
        },
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_LOGIC'),
          colour: '210',
          cssConfig: {
            container: 'icon_call_split',
          },
          contents: DefaultLogicToolbox.defaultBlocks,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_LOOPS'),
          colour: '210',
          cssConfig: {
            container: 'icon_loop',
          },
          contents: DefaultLoopToolbox.defaultBlocks,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_MATH'),
          colour: '230',
          cssConfig: {
            container: 'icon_iso',
          },
          contents: DefaultMathToolbox.defaultBlocks,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_TEXT'),
          colour: '160',
          cssConfig: {
            container: 'icon_text_fields',
          },
          contents: DefaultTextToolbox.defaultBlocks,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_LISTS'),
          colour: '260',
          cssConfig: {
            container: 'icon_list',
          },
          contents: DefaultListsToolbox.defaultBlocks,
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_COLORS'),
          colour: '260',
          cssConfig: {
            container: 'icon_palette',
          },
          contents: DefaultColorsToolbox.defaultBlocks,
        },
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_VARIABLES'),
          colour: '330',
          cssConfig: {
            container: 'icon_attach_money',
          },
          custom: 'VARIABLE',
        },
        {
          kind: 'category',
          name: i18next.t('BLOCKS_FUNCTIONS'),
          colour: '330',
          cssConfig: {
            container: 'icon_functions',
          },
          custom: 'PROCEDURE',
        },
      ],
    };
  }
}

export default Toolbox;
