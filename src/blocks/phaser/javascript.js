/**
 * @fileoverview JavaScript for the Phaser Blocks.
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
 * Phaser Game block.
 */
Blockly.JavaScript['phaser_game'] = function(block) {
  var text_name = block.getFieldValue('name');
  var number_width = block.getFieldValue('width');
  var number_height = block.getFieldValue('height');
  return 'var game = new Phaser.Game(' +
    '  ' + number_width + ', ' + number_height + ', Phaser.CANVAS, \'' +
    text_name + '\' , {\n' +
    '  preload: typeof preload !== \'undefined\' ? preload : function() {},\n' +
    '  create: typeof create !== \'undefined\' ? create : null,\n' +
    '  update: typeof update !== \'undefined\' ? update : null,\n' +
    '  render: typeof render !== \'undefined\' ? render : null\n' +
    '});\n';
};


/**
 * Phaser preload section.
 */
Blockly.JavaScript['phaser_preload'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function preload() {\n' + statements_code + '};\n';
};


/**
 * Load Audio.
 */
Blockly.JavaScript['phaser_load_audio'] = function(block) {
  var text_name = block.getFieldValue('name');
  var value_audio =  Blockly.JavaScript.valueToCode(block, 'audio',
    Blockly.JavaScript.ORDER_NONE);
  return 'game.load.audio(\'' + text_name + '\', \'' + value_audio + '\');\n';
};


/**
 * Load Image.
 */
Blockly.JavaScript['phaser_load_image'] = function(block) {
  var text_name = block.getFieldValue('name');
  var value_image =  Blockly.JavaScript.valueToCode(block, 'image',
    Blockly.JavaScript.ORDER_NONE);
  return 'game.load.image(\'' + text_name + '\', \'' + value_image + '\');\n';
};


/**
 * Phaser update section.
 */
Blockly.JavaScript['phaser_update'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function update() {\n' + statements_code + '};\n';
};


/**
 * Phaser render section.
 */
Blockly.JavaScript['phaser_render'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function render() {\n' + statements_code + '};\n';
};


/**
 * Input keyboard create cursor keys.
 */
Blockly.JavaScript['phaser_input_keyboard_create_cursor_keys'] = function() {
  var code = 'this.input.keyboard.createCursorKeys()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Input keyboard add key.
 */
Blockly.JavaScript['phaser_input_keyboard_add_key'] = function(
    block) {
  var dropdown_keycode = block.getFieldValue('keycode');
  var code = 'this.input.keyboard.addKey(' + dropdown_keycode + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Input keyboard is pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_is_pressed'] = function(block) {
  var value_cursors = Blockly.JavaScript.valueToCode(
    block, 'cursors', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('direction');
  var code = value_cursors + '.' + dropdown_direction;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Adjust sprite.
 */
Blockly.JavaScript['phaser_sprite_adjust'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_property = block.getFieldValue('property');
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  switch (dropdown_property) {
    case 'anchor.set':
      return value_sprite + '.' + dropdown_property +
        '(' + value_value + ');\n';
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


/**
 * World wrap.
 */
Blockly.JavaScript['phaser_world_wrap'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.world.wrap(' + value_sprite + ', ' + (value_value || 0) + ');\n';
};
