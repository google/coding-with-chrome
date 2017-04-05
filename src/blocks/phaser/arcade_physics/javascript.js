/**
 * @fileoverview JavaScript for the Phaser Physics Blocks.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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



/**
 * Physics arcade enable.
 */
Blockly.JavaScript['phaser_physics_arcade_enable'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(
    block, 'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.enable(' + value_sprite + ');\n';
};


/**
 * Physics arcade overlap.
 */
Blockly.JavaScript['phaser_physics_arcade_overlap'] = function(block) {
  var value_object1 = Blockly.JavaScript.valueToCode(
    block, 'object1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_object2 = Blockly.JavaScript.valueToCode(
    block, 'object2', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return 'game.physics.arcade.overlap(' + value_object1 + ', ' +
    value_object2 + ', function() {\n' + statements_func +
    '}, null, this);\n';
};


/**
 * Physics arcade collide.
 */
Blockly.JavaScript['phaser_physics_arcade_collide'] = function(block) {
  var value_object1 = Blockly.JavaScript.valueToCode(
    block, 'object1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_object2 = Blockly.JavaScript.valueToCode(
    block, 'object2', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.collide(' + value_object1 + ', ' +
    value_object2 + ');\n';
};


/**
 * Adjust arcade sprite.
 */
Blockly.JavaScript['phaser_pyhsics_arcade_sprite'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_property = block.getFieldValue('property');
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  switch (dropdown_property) {
    case 'body.acceleration.set':
    case 'body.bounce.set':
      return value_sprite + '.' + dropdown_property +
        '(' + value_value + ');\n';
    case 'body.allowGravity':
    case 'body.checkCollision.down':
    case 'body.checkCollision.up':
    case 'body.collideWorldBounds':
    case 'body.immovable':
      return value_sprite + '.' + dropdown_property + ' = ' +
        ((value_value) ? true : false) + ';\n';
    case 'moveUp':
      return value_sprite + '.y -= ' + value_value + ';\n';
    case 'moveDown':
      return value_sprite + '.y += ' + value_value + ';\n';
    case 'moveLeft':
      return value_sprite + '.x -= ' + value_value + ';\n';
    case 'moveRight':
      return value_sprite + '.x += ' + value_value + ';\n';
    default:
      return value_sprite + '.' + dropdown_property +
      ' = ' + value_value + ';\n';
  }
};
