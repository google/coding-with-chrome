/**
 * @fileoverview JavaScript for the Simple blocks.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
  return 'function preload() {\n' + statements_code + '\n};\n';
};


/**
 * Load Image.
 */
Blockly.JavaScript['phaser_load_image'] = function(block) {
  var text_name = block.getFieldValue('name');
  var text_image = block.getFieldValue('image');
  return 'game.load.image(\'' + text_name + '\', \'' + text_image + '\');\n';
};


/**
 * Phaser create section.
 */
Blockly.JavaScript['phaser_create'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function create() {\n' + statements_code + '\n};\n';
};


/**
 * Stage background color.
 */
Blockly.JavaScript['phaser_stage_background_color'] = function(block) {
  var colour_color = block.getFieldValue('color');
  return 'game.stage.backgroundColor = \'' + colour_color + '\';\n';
};


/**
 * Add sprite.
 */
Blockly.JavaScript['phaser_add_sprite'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_sprite = block.getFieldValue('sprite');
  var code = 'game.add.sprite(' + number_x + ', ' + number_y + ', \'' +
    text_sprite + '\')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Add text.
 */
Blockly.JavaScript['phaser_add_text'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_text = block.getFieldValue('text');
  var code = 'game.add.text(' + number_x + ', ' + number_y + ', \'' +
    text_text + '\')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Phaser update section.
 */
Blockly.JavaScript['phaser_update'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function update() {\n' + statements_code + '\n};\n';
};


/**
 * Phaser render section.
 */
Blockly.JavaScript['phaser_render'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function render() {\n' + statements_code + '\n};\n';
};


/**
 * Physics arcade enable.
 */
Blockly.JavaScript['phaser_physics_arcade_enable'] = function(block) {
  var value_object = Blockly.JavaScript.valueToCode(
    block, 'object', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.enable(' + value_object + ');\n';
};
