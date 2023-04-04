/**
 * @fileoverview Phaser Audio Blocks for Blockly.
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

import '../blocks/MathBlocks.js';

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="variables_set">
    <field name="VAR">list</field>
    <value name="VALUE">
      <block type="lists_create_with">
        <mutation items="3"></mutation>
        <value name="ADD0">
          <block type="text">
            <field name="TEXT"></field>
          </block>
        </value>
        <value name="ADD1">
          <block type="text">
            <field name="TEXT"></field>
          </block>
        </value>
        <value name="ADD2">
          <block type="text">
            <field name="TEXT"></field>
          </block>
        </value>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_create_with">
    <mutation items="0"></mutation>
  </block>`,
  },
  {
    kind: 'block',
    type: 'lists_create_with',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_repeat">
    <value name="NUM">
      <shadow type="math_number">
        <field name="NUM">5</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'lists_length',
  },
  {
    kind: 'block',
    type: 'lists_isEmpty',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_indexOf">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">list</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_getIndex">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">list</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_setIndex">
    <value name="LIST">
      <block type="variables_get">
        <field name="VAR">list</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_getSublist">
    <value name="LIST">
      <block type="variables_get">
        <field name="VAR">list</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="lists_split">
    <value name="DELIM">
      <shadow type="text">
        <field name="TEXT">,</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'lists_sort',
  },
];

export default {
  defaultBlocks,
};
