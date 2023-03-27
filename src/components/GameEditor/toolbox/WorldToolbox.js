/**
 * @fileoverview Preload toolbox.
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

import '../blocks/WorldBlocks';

export default [
  {
    kind: 'block',
    type: 'phaser_world_resize',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_world_arcade_physics">
    <value name="value">
      <block type="math_number"><field name="NUM">0</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_world_sort_direction">
    <field name="property">1</field>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_world_wrap">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
    <value name="value">
      <block type="math_number"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    type: 'phaser_world_attributes',
  },
];
