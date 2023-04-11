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
 * @fileoverview Render Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/DebugBlocks.js';
import '../blocks/RenderBlocks.js';

export default [
  {
    kind: 'block',
    type: 'phaser_render',
  },
  {
    kind: 'block',
    type: 'phaser_debug_camera',
  },
  {
    kind: 'block',
    type: 'phaser_debug_pointer',
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_debug_sprite">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
  </block>
    `,
  },
];
