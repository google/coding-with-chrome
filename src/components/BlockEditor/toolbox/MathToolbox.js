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
 * @fileoverview Math Toolbox for Blockly.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/MathBlocks.js';

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    type: 'math_number',
  },
  {
    kind: 'block',
    type: 'math_input_angle',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_arithmetic">
    <value name="A">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_single">
    <value name="NUM">
      <shadow type="math_number">
        <field name="NUM">9</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_trig">
    <value name="NUM">
      <shadow type="math_number">
        <field name="NUM">45</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'math_constant',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_number_property">
    <value name="NUMBER_TO_CHECK">
      <shadow type="math_number">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_change">
    <value name="DELTA">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_round">
    <value name="NUM">
      <shadow type="math_number">
        <field name="NUM">3.1</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'math_on_list',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_modulo">
    <value name="DIVIDEND">
      <shadow type="math_number">
        <field name="NUM">64</field>
      </shadow>
    </value>
    <value name="DIVISOR">
      <shadow type="math_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_constrain">
    <value name="VALUE">
      <shadow type="math_number">
        <field name="NUM">50</field>
      </shadow>
    </value>
    <value name="LOW">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="HIGH">
      <shadow type="math_number">
        <field name="NUM">100</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="math_random_int">
    <value name="FROM">
      <shadow type="math_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="TO">
      <shadow type="math_number">
        <field name="NUM">100</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'math_random_float',
  },
];

export default {
  defaultBlocks,
};
