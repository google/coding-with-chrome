/**
 * @fileoverview JavaScript for the Phaser Create Blocks.
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
 * Phaser create section.
 */
Blockly.JavaScript['phaser_create'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'create: function () {\n' +
    '  if (navigator.userAgent == \'CwC sandbox\') {' +
    'game.time.desiredFps = 30;}\n' + statements_code + '},\n';
};


/**
 * Stage background color.
 */
Blockly.JavaScript['phaser_stage_background_color'] = function(block) {
  var colour_color = block.getFieldValue('color');
  return 'game.stage.backgroundColor = \'' + colour_color + '\';\n';
};


/**
 * Add audio.
 */
Blockly.JavaScript['phaser_add_audio'] = function(block) {
  var text_audio = block.getFieldValue('audio');
  var number_volume = block.getFieldValue('volume');
  var dropdown_loop = block.getFieldValue('loop');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.audio(' + text_audio + ', ' +
    number_volume / 100 + ', \'' + dropdown_loop + '\');\n';
};


/**
 * Add background.
 */
Blockly.JavaScript['phaser_add_background'] = function(block) {
  var text_sprite = block.getFieldValue('sprite');
  return 'game.add.sprite(0, 0, \'' + text_sprite + '\')\n';
};


/**
 * Add sprite.
 */
Blockly.JavaScript['phaser_add_sprite'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_sprite = block.getFieldValue('sprite');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.sprite(' + number_x + ', ' + number_y +
    ', \'' + text_sprite + '\');\n';
};


/**
 * Add arcade sprite.
 */
Blockly.JavaScript['phaser_add_arcade_sprite'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_sprite = block.getFieldValue('sprite');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.sprite(' + number_x + ', ' + number_y +
    ', \'' + text_sprite + '\');\n' +
    'game.physics.arcade.enable(' + variable + ');\n';
};


/**
 * Add text.
 */
Blockly.JavaScript['phaser_add_text'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_color = block.getFieldValue('color');
  var text_font = block.getFieldValue('font');
  var text_size = block.getFieldValue('size');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.text(' + number_x + ', ' + number_y + ', ' +
    value_text + ', { font: \'' + text_size + ' ' +  text_font + '\', ' +
    'fill: \'' + text_color + '\'});\n';
};


/**
 * Add tile sprite.
 */
Blockly.JavaScript['phaser_add_tile_sprite'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var number_width = block.getFieldValue('width');
  var number_height = block.getFieldValue('height');
  var text_sprite = block.getFieldValue('sprite');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.tileSprite(' + number_x + ', ' + number_y +
    ', ' + number_width + ', ' + number_height + ', \'' + text_sprite +
    '\');\n';
};


/**
 * Add keyboard cursor keys.
 */
Blockly.JavaScript['phaser_add_input_keyboard_cursor_keys'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = this.input.keyboard.createCursorKeys();\n' +
    variable + '.onDown.add(this.input_, this);\n';
};


/**
 * Add keyboard spacebar.
 */
Blockly.JavaScript['phaser_add_input_keyboard_spacebar'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable +
    ' = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);\n' +
    variable + '.onDown.add(this.input_, this);\n';
};


/**
 * Add keyboard key.
 */
Blockly.JavaScript['phaser_add_input_keyboard_key'] = function(block) {
  var dropdown_keycode = block.getFieldValue('keycode');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = this.input.keyboard.addKey(' + dropdown_keycode +
    ');\n' + variable + '.onDown.add(this.input_, this);\n';
};


/**
 * Add mouse keys.
 */
Blockly.JavaScript['phaser_add_input_mouse_keys'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = this.input.mouse.input;\n' +
    variable + '.onDown.add(this.input_, this);\n';
};


/**
 * Add group.
 */
Blockly.JavaScript['phaser_add_group'] = function(block) {
  var text_name = block.getFieldValue('name');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.group(undefined, \'' + text_name + '\')\n;';
};


/**
 * Timer Loop Event
 */
Blockly.JavaScript['phaser_time_loop_event'] = function(block) {
  var value_time = Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return 'game.time.events.loop(' + value_time + ', ' +
    'function() {\n' + statements_func + '}, this);\n';
};
