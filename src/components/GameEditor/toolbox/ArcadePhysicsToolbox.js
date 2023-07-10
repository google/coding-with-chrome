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
 * @fileoverview Arcade Physics Phaser Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import '../blocks/ArcadePhysicsBlocks.js';

/**
 * @return {array}
 */
export const createBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_ball_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">ball</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">100</field></block>
    </value>
    <statement name="CODE">
      <block type="phaser_physics_arcade_sprite_adjust_custom">
        <field name="property">velocity.x</field>
        <value name="value">
          <block type="math_number">
            <field name="NUM">50</field>
          </block>
        </value>
        <next>
          <block type="phaser_physics_arcade_sprite_adjust_custom">
            <field name="property">velocity.y</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM">100</field>
              </block>
            </value>
            <next>
              <block type="phaser_physics_arcade_sprite_adjust_custom">
                <field name="property">bounce.set</field>
                <value name="value">
                  <block type="math_number">
                    <field name="NUM">1</field>
                  </block>
                </value>
                <next>
                  <block type="phaser_physics_arcade_sprite_adjust_custom">
                    <field name="property">collideWorldBounds</field>
                    <value name="value">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_player_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">200</field></block>
    </value>
    <statement name="CODE">
      <block type="phaser_physics_arcade_sprite_adjust_custom">
        <value name="value">
          <block type="math_number"></block>
        </value>
      </block>
    </statement>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_paddle_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">paddle</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">500</field></block>
    </value>
    <statement name="CODE">
      <block type="phaser_physics_arcade_sprite_adjust_custom">
        <field name="property">immovable</field>
        <value name="value">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
        <next>
          <block type="phaser_physics_arcade_sprite_adjust_custom">
          <field name="property">bounce.set</field>
          <value name="value">
            <block type="math_number">
              <field name="NUM">1</field>
            </block>
          </value>
          <next>
            <block type="phaser_physics_arcade_sprite_adjust_custom">
              <field name="property">collideWorldBounds</field>
              <value name="value">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
            </block>
          </next>
        </block>
        </next>
      </block>
    </statement>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_adjust_custom">
    <value name="value">
      <block type="math_number"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_adjust_dimension_custom">
    <value name="width">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
    <value name="height">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_add">
    <value name="variable">
      <block type="phaser_variable_set">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="x">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
    <value name="y">
      <block type="math_number"><field name="NUM">100</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_out_of_bounds">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">ball</field>
      </block>
    </value>
  </block>`,
  },
];

export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_adjust">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="value">
      <block type="math_number"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_adjust_dimension">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="width">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
    <value name="height">
      <block type="math_number"><field name="NUM">50</field></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_enable">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_destroy">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_sprite_kill">
    <value name="variable">
      <block type="phaser_variable_get">
        <field name="VAR">sprite</field>
      </block>
    </value>
  </block>`,
  },
];

export const eventBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_overlap">
    <value name="object1">
      <block type="phaser_variable_get">
        <field name="VAR">ball</field>
      </block>
    </value>
    <value name="object2">
      <block type="phaser_variable_group_get">
        <field name="VAR">block_group</field>
      </block>
    </value>
    <statement name="CODE">
      <block type="phaser_physics_arcade_sprite_destroy">
        <value name="variable">
          <block type="phaser_variable_get">
            <field name="VAR">object2</field>
          </block>
        </value>
      </block>
    </statement>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_overlap">
    <value name="object1">
      <block type="phaser_variable_get">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="object2">
      <block type="phaser_variable_group_get">
        <field name="VAR">obstacle_group</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_overlap">
    <value name="object1">
      <block type="phaser_variable_get">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="object2">
      <block type="phaser_variable_get">
        <field name="VAR">coin</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_collide">
    <value name="object1">
      <block type="phaser_variable_get">
        <field name="VAR">ball</field>
      </block>
    </value>
    <value name="object2">
      <block type="phaser_variable_get">
        <field name="VAR">paddle</field>
      </block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_physics_arcade_collide">
    <value name="object1">
      <block type="phaser_variable_get">
        <field name="VAR">player</field>
      </block>
    </value>
    <value name="object2">
      <block type="phaser_variable_get">
        <field name="VAR">floor</field>
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
