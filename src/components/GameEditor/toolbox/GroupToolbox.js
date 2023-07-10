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
 * @fileoverview Group Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/GroupBlocks.js';

/**
 * @type {array}
 */
export const createBlocks = [
  {
    kind: 'block',
    blockxml: `
    <block type="phaser_group_add">
      <value name="variable">
        <block type="phaser_variable_group_set">
          <field name="VAR">default_group</field>
        </block>
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
  <block type="controls_if">
    <value name="IF0">
      <block type="logic_compare">
        <value name="A">
          <block type="phaser_group_count_living">
            <value name="variable">
              <block type="phaser_variable_group_get">
                <field name="VAR">block_group</field>
              </block>
            </value>
          </block>
        </value>
        <field name="OP">LTE</field>
        <value name="B">
          <block type="math_number">
            <field name="NUM">0</field>
          </block>
        </value>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_group_count_living">
    <value name="variable">
      <block type="phaser_variable_group_get">
        <field name="VAR">block_group</field>
      </block>
    </value>
  </block>`,
  },
];

export default {
  createBlocks,
  defaultBlocks,
};
