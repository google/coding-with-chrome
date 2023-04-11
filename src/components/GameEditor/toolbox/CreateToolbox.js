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
 * @fileoverview Create Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/CreateBlocks.js';
import '../blocks/GroupBlocks.js';

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    type: 'phaser_create',
  },
  {
    kind: 'block',
    type: 'phaser_stage_background_color',
  },
  {
    kind: 'block',
    type: 'phaser_add_background',
  },
  {
    kind: 'block',
    type: 'phaser_add_background_scaled',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_group_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">obstacle_group</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_time_loop_event">
    <value name="time">
      <block type="math_number"><field name="NUM">1500</field></block>
    </value>
  </block>`,
  },
];

export default {
  defaultBlocks,
};
