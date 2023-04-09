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

/**
 * @fileoverview Game Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import './../blocks/GameBlocks.js';

export default [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_game">
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
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_game_state">
    <field name="name">game_over</field>
    <field name="autostart">false</field>
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
  </block>`,
  },
  {
    kind: 'block',
    type: 'phaser_game_start',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_game_start">
    <field name="name">game_over</field>
  </block>`,
  },
  {
    kind: 'block',
    type: 'phaser_game_restart',
  },
];
