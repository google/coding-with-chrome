/**
 * @fileoverview Generator toolbox.
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
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import './../blocks/GeneratorBlocks';

export default [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_generator_vertical_obstacle">
    <value name="obstacles">
      <block type="math_number">
        <field name="NUM">12</field>
      </block>
    </value>
    <value name="spaces">
      <block type="math_number">
        <field name="NUM">5</field>
      </block>
    </value>
    <value name="x">
      <block type="phaser_world_attributes">
        <field name="attribute">width</field>
      </block>
    </value>
    <value name="y">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
    <value name="sprite">
      <block type="text">
        <field name="TEXT">obstacles</field>
      </block>
    </value>
    <value name="sprite_top">
      <block type="text"></block>
    </value>
    <value name="sprite_bottom">
      <block type="text"></block>
    </value>
    <value name="group">
      <block type="variables_get">
        <field name="VAR">obstacle_group</field>
      </block>
    </value>
    <field name="property">velocity.x</field>
    <value name="value">
      <block type="math_number">
        <field name="NUM">-200</field>
      </block>
    </value>
    <statement name="CODE">
      <block type="phaser_generator_physics_arcade_attributes">
        <field name="property">velocity.x</field>
        <value name="value">
          <block type="math_number">
            <field name="NUM">-200</field>
          </block>
        </value>
      </block>
    </statement>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_generator_random_vertical_obstacle">
    <value name="obstacles">
      <block type="math_number">
        <field name="NUM">3</field>
      </block>
    </value>
    <value name="x">
      <block type="phaser_world_attributes">
        <field name="attribute">width</field>
      </block>
    </value>
    <value name="y">
      <block type="phaser_world_attributes">
        <field name="attribute">height</field>
      </block>
    </value>
    <value name="sprite">
      <block type="text">
        <field name="TEXT">obstacles</field>
      </block>
    </value>
    <value name="sprite_optional">
      <block type="text">
        <field name="TEXT"></field>
      </block>
    </value>
    <field name="direction">bottom</field>
    <value name="group">
      <block type="variables_get">
        <field name="VAR">obstacle_group</field>
      </block>
    </value>
    <field name="property">velocity.x</field>
    <value name="value">
      <block type="math_number">
        <field name="NUM">-200</field>
      </block>
    </value>
    <statement name="CODE">
      <block type="phaser_generator_physics_arcade_attributes">
        <field name="property">velocity.x</field>
        <value name="value">
          <block type="math_number">
            <field name="NUM">-200</field>
          </block>
        </value>
      </block>
    </statement>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_generator_matrix_block">
    <value name="x">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="y">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="padding">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="group">
      <block type="variables_get">
        <field name="VAR">block_group</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_generator_physics_arcade_attributes">
    <value name="value">
      <block type="math_number"></block>
    </value>
  </block>`,
  },
];
