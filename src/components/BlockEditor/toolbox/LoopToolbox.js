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
 * @fileoverview Loop Toolbox for Blockly.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/LoopBlocks.js';

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="controls_repeat_ext">
    <value name="TIMES">
      <block type="math_number"><field name="NUM">10</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'controls_infinity_loop',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="controls_for">
    <value name="FROM">
      <block type="math_number"><field name="NUM">1</field></block>
    </value>
    <value name="TO">
      <block type="math_number"><field name="NUM">10</field></block>
    </value><value name="BY">
      <block type="math_number"><field name="NUM">1</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'controls_forEach',
  },
  {
    kind: 'block',
    type: 'controls_flow_statements',
  },
  {
    kind: 'block',
    type: 'controls_whileUntil',
  },
];

export default {
  defaultBlocks,
};
