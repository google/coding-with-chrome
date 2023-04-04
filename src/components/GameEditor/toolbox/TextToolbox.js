/**
 * @fileoverview Render toolbox.
 *
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
 * @author mbordihn@google.com (Markus Bordihn)
 */

import './../blocks/TextBlocks.js';

/**
 * @type {array}
 */
export const createBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_add">
    <value name="text">
      <block type="text">
        <field name="TEXT">Title</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">100</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_add">
    <value name="text">
      <block type="text">
        <field name="TEXT">Hello World</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_dynamic_text_highscore_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">highscore</field>
      </block>
    </value>
    <value name="score">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_dynamic_text_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
    <value name="text">
      <block type="text">
        <field name="TEXT">Text</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_action_text_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">start_text</field>
      </block>
    </value>
    <value name="text">
      <block type="text">
        <field name="TEXT">Start the Game!</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
  </block>`,
  },
];

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_change">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
    <value name="text">
      <block type="text">
        <field name="TEXT">Hello World</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_change">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">highscore</field>
      </block>
    </value>
    <value name="text">
      <block type="math_arithmetic">
        <field name="OP">ADD</field>
        <value name="A">
          <block type="phaser_text_get_number">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">highscore</field>
              </block>
            </value>
          </block>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_get">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_get_number">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">highscore</field>
      </block>
    </value>
  </block>`,
  },
];

/**
 * @type {array}
 */
export const eventBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_text_clicked">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">start_text</field>
      </block>
    </value>
  </block>`,
  },
];

export default {
  createBlocks,
  defaultBlocks,
  eventBlocks,
};
