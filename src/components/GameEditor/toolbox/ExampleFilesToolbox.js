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

import '../blocks/ExampleFilesBlocks.js';

/**
 * @type {array}
 */
export const defaultBlocks = [
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">50px_red</field>
      <value name="image">
        <block type="phaser_sample_image_50px_red"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">50px_green</field>
      <value name="image">
        <block type="phaser_sample_image_50px_green"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">50px_blue</field>
      <value name="image">
        <block type="phaser_sample_image_50px_blue"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">ball_red</field>
      <value name="image">
        <block type="phaser_sample_image_ball_red"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">ball_green</field>
      <value name="image">
        <block type="phaser_sample_image_ball_green"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">ball_blue</field>
      <value name="image">
        <block type="phaser_sample_image_ball_blue"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">paddle</field>
      <value name="image">
        <block type="phaser_sample_image_paddle"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">player</field>
      <value name="image">
        <block type="phaser_sample_image_player"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">bg_01</field>
      <value name="image">
        <block type="phaser_sample_image_bg_01"></block>
    </value>
  </block>`,
  },
  {
    kind: 'block',
    blockxml: `
  <block type="phaser_load_image">
    <field name="name">bg_02</field>
      <value name="image">
        <block type="phaser_sample_image_bg_02"></block>
    </value>
  </block>`,
  },
];

export default {
  defaultBlocks,
};
