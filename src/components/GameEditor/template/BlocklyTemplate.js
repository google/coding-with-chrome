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

import GameToolbox from '../toolbox/GameToolbox.js';

/**
 * @fileoverview Blockly Template for the Phaser Blockly modification.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @class
 */
class BlocklyTemplate {
  /**
   * @param {object} project
   * @return {string}
   */
  static render(project) {
    return `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="phaser_game" x="-250" y="-250">
    <field name="name">${project ? project.name : 'My first Game'}</field>
    <field name="width">0</field>
    <field name="height">0</field>
    <next>
      ${GameToolbox.defaultGameState}
    </next>
  </block>
</xml>`;
  }
}

export default BlocklyTemplate;
