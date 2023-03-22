/**
 * @fileoverview Input toolbox.
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

import './../blocks/InputBlocks.js';

/**
 * @param {*} showCreateBlocks
 * @param {*} hideEventBlocks
 * @return {array}
 */
export default function (showCreateBlocks = false, hideEventBlocks = false) {
  showCreateBlocks && hideEventBlocks;
  return [
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_cursor_keys_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">cursor_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_spacebar_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">spacebar</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_wasd_keys_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">wasd_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_shift_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">shift_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_key_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">keyboard_key</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_mouse_keys_add">
    <value name="variable">
      <block type="variables_get">
        <field name="VAR">mouse_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      type: 'phaser_input',
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_body">
    <statement name="CODE">
      <block type="controls_if">
        <mutation elseif="1" else="1"></mutation>
        <value name="IF0">
          <block type="phaser_input_keyboard_cursor_is_hold_pressed">
            <field name="direction">.left</field>
            <value name="cursors">
              <block type="variables_get">
                <field name="VAR">cursor_keys</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="phaser_physics_arcade_sprite_adjust">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">paddle</field>
              </block>
            </value>
            <field name="property">velocity.x</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM"></field>
              </block>
            </value>
          </block>
        </statement>
        <value name="IF1">
          <block type="phaser_input_keyboard_cursor_is_hold_pressed">
            <field name="direction">.right</field>
            <value name="cursors">
              <block type="variables_get">
                <field name="VAR">cursor_keys</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO1">
          <block type="phaser_physics_arcade_sprite_adjust">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">paddle</field>
              </block>
            </value>
            <field name="property">velocity.x</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM"></field>
              </block>
            </value>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="phaser_physics_arcade_sprite_adjust">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">paddle</field>
              </block>
            </value>
            <field name="property">velocity.x</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM"></field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_body">
    <statement name="CODE">
      <block type="controls_if">
        <value name="IF0">
          <block type="phaser_input_keyboard_key_is_pressed">
            <value name="key">
              <block type="variables_get">
                <field name="VAR">spacebar</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="phaser_physics_arcade_sprite_adjust">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">player</field>
              </block>
            </value>
            <field name="property">velocity.y</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM"></field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_body">
    <statement name="CODE">
      <block type="controls_if">
        <mutation elseif="1"></mutation>
        <value name="IF0">
          <block type="phaser_input_keyboard_code_is_pressed">
            <field name="code">ShiftLeft</field>
            <value name="key">
              <block type="variables_get">
                <field name="VAR">shift_keys</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="phaser_physics_arcade_sprite_adjust">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">player</field>
              </block>
            </value>
            <field name="property">velocity.y</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM"></field>
              </block>
            </value>
          </block>
        </statement>
        <value name="IF1">
          <block type="phaser_input_keyboard_code_is_pressed">
            <field name="code">ShiftRight</field>
            <value name="key">
              <block type="variables_get">
                <field name="VAR">shift_keys</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO1">
          <block type="phaser_physics_arcade_sprite_adjust">
            <value name="variable">
              <block type="variables_get">
                <field name="VAR">player2</field>
              </block>
            </value>
            <field name="property">velocity.y</field>
            <value name="value">
              <block type="math_number">
                <field name="NUM"></field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_cursor_is_pressed">
    <field name="direction">up.isDown</field>
    <value name="cursors">
      <block type="variables_get">
        <field name="VAR">cursor_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_cursor_is_hold_pressed">
    <field name="direction">up.isDown</field>
    <value name="cursors">
      <block type="variables_get">
        <field name="VAR">cursor_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_key_is_pressed">
    <value name="key">
      <block type="variables_get">
        <field name="VAR">spacebar</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_keyboard_key_is_hold_pressed">
    <value name="key">
      <block type="variables_get">
        <field name="VAR">spacebar</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_mouse_key_is_pressed">
    <field name="direction">leftButton.isDown</field>
    <value name="mouse">
      <block type="variables_get">
        <field name="VAR">mouse_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="phaser_input_mouse_key_is_hold_pressed">
    <field name="direction">leftButton.isDown</field>
    <value name="mouse">
      <block type="variables_get">
        <field name="VAR">mouse_keys</field>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="controls_if">
    <mutation elseif="0"></mutation>
    <value name="IF0">
      <block type="phaser_input_keyboard_key_is_pressed">
        <value name="key">
          <block type="variables_get">
            <field name="VAR">spacebar</field>
          </block>
        </value>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="controls_if">
    <mutation elseif="3"></mutation>
    <value name="IF0">
      <block type="phaser_input_keyboard_cursor_is_hold_pressed">
        <field name="direction">.up</field>
        <value name="cursors">
          <block type="variables_get">
            <field name="VAR">cursor_keys</field>
          </block>
        </value>
      </block>
    </value>
    <value name="IF1">
      <block type="phaser_input_keyboard_cursor_is_hold_pressed">
        <field name="direction">.down</field>
        <value name="cursors">
          <block type="variables_get">
            <field name="VAR">cursor_keys</field>
          </block>
        </value>
      </block>
    </value>
    <value name="IF2">
      <block type="phaser_input_keyboard_cursor_is_hold_pressed">
        <field name="direction">.left</field>
        <value name="cursors">
          <block type="variables_get">
            <field name="VAR">cursor_keys</field>
          </block>
        </value>
      </block>
    </value>
    <value name="IF3">
      <block type="phaser_input_keyboard_cursor_is_hold_pressed">
        <field name="direction">.right</field>
        <value name="cursors">
          <block type="variables_get">
            <field name="VAR">cursor_keys</field>
          </block>
        </value>
      </block>
    </value>
  </block>`,
    },
    {
      kind: 'block',
      blockxml: `
  <block type="controls_if">
    <mutation elseif="0"></mutation>
    <value name="IF0">
      <block type="phaser_input_mouse_key_is_pressed">
        <field name="direction">leftButton.isDown</field>
        <value name="mouse">
          <block type="variables_get">
            <field name="VAR">mouse_keys</field>
          </block>
        </value>
      </block>
    </value>
  </block>`,
    },
  ];
}
