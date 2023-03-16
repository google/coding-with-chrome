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

import './../blocks/CreateBlocks';
import './../blocks/GameBlocks.js';
import './../blocks/InputBlocks';
import './../blocks/PreLoadBlocks';
import './../blocks/RenderBlocks';
import './../blocks/UpdateBlocks';

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
          name: 'BLOCKS_PHASER_GAME',
          colour: '75',
          contents: [
            {
              kind: 'block',
              type: 'phaser_game',
            },
            {
              kind: 'block',
              blockxml: `<block type="phaser_game">
              <next>
                <block type="phaser_game_state">
                  <field name="name">main</field>
                  <field name="autostart">true</field>
                  <statement name="state">
                    <block type="phaser_preload">
                      <next>
                        <block type="phaser_create">
                          <next>
                             <block type="phaser_input">
                                <next>
                                  <block type="phaser_update">
                                    <next>
                                      <block type="phaser_render" collapsed="true"></block>
                                    </next>
                                  </block>
                                </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </statement>
                </block>
              </next>
            </block>`,
            },
          ],
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_PRELOAD',
          colour: '165',
          contents: [],
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_CREATE',
          colour: '30',
          contents: [
            {
              kind: 'category',
              name: 'BLOCKS_PHASER_GENERATOR',
              colour: '105',
              contents: [],
            },
            {
              kind: 'category',
              name: 'BLOCKS_PHASER_WORLD',
              colour: '345',
              contents: [],
            },
          ],
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_INPUT',
          colour: '165',
          contents: [],
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_UPDATE',
          colour: '165',
          contents: [],
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_RENDERER',
          colour: '165',
          contents: [],
        },
        {
          kind: 'separator',
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_FILES',
          colour: '150',
          contents: [],
        },
        {
          kind: 'category',
          name: 'BLOCKS_PHASER_EXAMPLE_FILES',
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
