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
 * Add ball sprite with bounce.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_ball_add'] = function(block) {
  let text_sprite = block.getFieldValue('sprite');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return variable + ' = game.add.sprite(' + value_x + ', ' + value_y +
    ', \'' + text_sprite + '\');\n' +
    'game.physics.arcade.enable(' + variable + ');\n' +
    '(function(arcadeSpriteCustom) {\n' + statements_code + '}(' +
    variable + '));\n';
};


/**
 * Add player sprite.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_player_add'] = function(
    block) {
  let text_sprite = block.getFieldValue('sprite');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return variable + ' = game.add.sprite(' + value_x + ', ' + value_y +
    ', \'' + text_sprite + '\');\n' +
    'game.physics.arcade.enable(' + variable + ');\n' +
    '(function(arcadeSpriteCustom) {\n' + statements_code + '}(' +
    variable + '));\n';
};


/**
 * Add paddle sprite.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_paddle_add'] = function(
    block) {
  let text_sprite = block.getFieldValue('sprite');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return variable + ' = game.add.sprite(' + value_x + ', ' + value_y +
    ', \'' + text_sprite + '\');\n' +
    'game.physics.arcade.enable(' + variable + ');\n' +
    '(function(arcadeSpriteCustom) {\n' + statements_code + '}(' +
    variable + '));\n';
};


/**
 * Add arcade sprite.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_add'] = function(block) {
  let text_sprite = block.getFieldValue('sprite');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return variable + ' = game.add.sprite(' + value_x + ', ' + value_y +
    ', \'' + text_sprite + '\');\n' +
    'game.physics.arcade.enable(' + variable + ');\n';
};


/**
 * Adjust arcade sprite.
 * @param {Blockly.Block} block
 * @param {string=} variableName
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_adjust'] = function(block,
    variableName = '') {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC) || variableName;
  let dropdown_property = block.getFieldValue('property');
  let value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  switch (dropdown_property) {
    case 'angle':
    case 'height':
    case 'width':
    case 'x':
    case 'y':
    case 'z':
      return variable + '.' + dropdown_property + ' = ' + value_value + ';\n';
    case 'acceleration.set':
    case 'bounce.set':
      return variable + '.body.' + dropdown_property +
        '(' + value_value + ');\n';
    case 'allowGravity':
    case 'checkCollision.down':
    case 'checkCollision.up':
    case 'collideWorldBounds':
    case 'immovable':
      return variable + '.body.' + dropdown_property + ' = ' +
        ((value_value && value_value !== '0') ? true : false) + ';\n';
    case 'moveUp':
      return variable + '.y -= ' + value_value + ';\n';
    case 'moveDown':
      return variable + '.y += ' + value_value + ';\n';
    case 'moveLeft':
      return variable + '.x -= ' + value_value + ';\n';
    case 'moveRight':
      return variable + '.x += ' + value_value + ';\n';
    default:
      return variable + '.body.' + dropdown_property +
       ' = ' + value_value + ';\n';
  }
};


/**
 * Adjust arcade sprite.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_adjust_custom'] = function(
    block) {
  return Blockly.JavaScript['phaser_physics_arcade_sprite_adjust'](
    block, 'arcadeSpriteCustom');
};


/**
 * Adjust arcade sprite dimension.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_adjust_dimension'] = function(
    block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_width = Blockly.JavaScript.valueToCode(
    block, 'width', Blockly.JavaScript.ORDER_ATOMIC) || 50;
  let value_height = Blockly.JavaScript.valueToCode(
    block, 'height', Blockly.JavaScript.ORDER_ATOMIC) || 50;
  return variable + '.width = ' + value_width + ';\n' +
    variable + '.height = ' + value_height + ';\n';
};


/**
 * Destroys arcade sprite.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_destroy'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.destroy();\n';
};


/**
 * Kills arcade sprite.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_sprite_kill'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.kill();\n';
};


/**
 * Physics arcade enable.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_enable'] = function(block) {
  let value_variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.enable(' + value_variable + ');\n';
};


/**
 * Physics arcade overlap.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_overlap'] = function(block) {
  let value_object1 = Blockly.JavaScript.valueToCode(
    block, 'object1', Blockly.JavaScript.ORDER_ATOMIC);
  let value_object2 = Blockly.JavaScript.valueToCode(
    block, 'object2', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'game.physics.arcade.overlap(' + value_object1 + ', ' +
    value_object2 + ', function(object1, object2) {\n' + statements_code +
    '}, null, this);\n';
};


/**
 * Physics arcade collide.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_collide'] = function(block) {
  let value_object1 = Blockly.JavaScript.valueToCode(
    block, 'object1', Blockly.JavaScript.ORDER_ATOMIC);
  let value_object2 = Blockly.JavaScript.valueToCode(
    block, 'object2', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.collide(' + value_object1 + ', ' +
    value_object2 + ');\n';
};


/**
 * Physics arcade out of bounds.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_physics_arcade_out_of_bounds'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return variable + '.checkWorldBounds = true;\n' +
    variable + '.events.onOutOfBounds.add(function() {\n' + statements_code +
    '}, this);\n';
};

