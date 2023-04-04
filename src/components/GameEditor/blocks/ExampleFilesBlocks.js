/**
 * @fileoverview Phaser Create Blocks for Blockly.
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

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

const basePath = location.host.endsWith('.github.io') ? location.pathname : '/';

/**
 * Sample image: 50px_red.png
 */
Blocks['phaser_sample_image_50px_red'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/50px_red.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: 50px_red.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_50px_red'] = function () {
  return [
    basePath + 'assets/phaser/samples/50px_red.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: 50px_green.png
 */
Blocks['phaser_sample_image_50px_green'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/50px_green.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: 50px_green.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_50px_green'] = function () {
  return [
    basePath + 'assets/phaser/samples/50px_green.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: 50px_blue.png
 */
Blocks['phaser_sample_image_50px_blue'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/50px_blue.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: 50px_blue.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_50px_blue'] = function () {
  return [
    basePath + 'assets/phaser/samples/50px_blue.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: ball_red.png
 */
Blocks['phaser_sample_image_ball_red'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/ball_red.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: ball_red.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_ball_red'] = function () {
  return [
    basePath + 'assets/phaser/samples/ball_red.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: ball_green.png
 */
Blocks['phaser_sample_image_ball_green'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/ball_green.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: ball_green.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_ball_green'] = function () {
  return [
    basePath + 'assets/phaser/samples/ball_green.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: ball_blue.png
 */
Blocks['phaser_sample_image_ball_blue'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/ball_blue.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: ball_blue.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_ball_blue'] = function () {
  return [
    basePath + 'assets/phaser/samples/ball_blue.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: paddle.png
 */
Blocks['phaser_sample_image_paddle'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/paddle.png',
        100,
        30,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: paddle.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_paddle'] = function () {
  return [
    basePath + 'assets/phaser/samples/paddle.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: player.png
 */
Blocks['phaser_sample_image_player'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/player.png',
        42,
        42,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: player.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_player'] = function () {
  return [
    basePath + 'assets/phaser/samples/player.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: bg/bg_01.png
 */
Blocks['phaser_sample_image_bg_01'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/bg/bg_01.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: bg/bg_01.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_bg_01'] = function () {
  return [
    basePath + 'assets/phaser/samples/bg/bg_01.png',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Sample image: bg/bg_02.png
 */
Blocks['phaser_sample_image_bg_02'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage(
        basePath + 'assets/phaser/samples/bg/bg_02.png',
        50,
        50,
        ''
      )
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Sample image: bg/bg_02.png
 * @return {any[]}
 */
javascriptGenerator['phaser_sample_image_bg_02'] = function () {
  return [
    basePath + 'assets/phaser/samples/bg/bg_02.png',
    javascriptGenerator.ORDER_NONE,
  ];
};
