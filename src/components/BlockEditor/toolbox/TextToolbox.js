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
 * @fileoverview Text Toolbox for Blockly.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/MathBlocks.js';

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    type: 'text',
  },
  {
    kind: 'block',
    type: 'text_join',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_append">
    <value name="TEXT">
      <shadow type="text"></shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_length">
    <value name="VALUE">
      <shadow type="text">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_isEmpty">
    <value name="VALUE">
      <shadow type="text">
        <field name="TEXT"></field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_indexOf">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
    <value name="FIND">
      <shadow type="text">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_charAt">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_getSubstring">
    <value name="STRING">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_changeCase">
    <value name="TEXT">
      <shadow type="text">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="text_trim">
    <value name="TEXT">
      <shadow type="text">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>`,
  },
];

export default {
  defaultBlocks,
};
