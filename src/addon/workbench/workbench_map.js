/**
 * @fileoverview Workbench addon
 *
 * @license Copyright 2019 The Coding with Chrome Authors.
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
 * @author mdiehl@workbenchplatform.com (Matt Diehl)
 */
goog.provide('cwc.addon.WorkbenchMap');


cwc.addon.WorkbenchMap = {
  'CWC Advanced - 3D': {
    appendNode: '#select-screen-tab-graphic .cwc-tutorial-list',
    mode: cwc.mode.Type.BASIC,
  },
  'CWC Advanced - AIY': {
    appendNode: '#select-screen-tab-aiy .cwc-tutorial-list',
    mode: cwc.mode.Type.AIY,
  },
  'CWC Advanced - CoffeeScript': {
    appendNode: '#select-screen-tab-coffeescript .cwc-tutorial-list',
    mode: cwc.mode.Type.COFFEESCRIPT,
  },
  'CWC Advanced - EV3': {
    appendNode: '#select-screen-tab-lego_ev3 .cwc-tutorial-list',
    mode: cwc.mode.Type.EV3,
  },
  'CWC Advanced - Games': {
    appendNode: '#select-screen-tab-games .cwc-tutorial-list',
    mode: cwc.mode.Type.PHASER,
  },
  'CWC Advanced - HTML5': {
    appendNode: '#select-screen-tab-html5 .cwc-tutorial-list',
    mode: cwc.mode.Type.HTML5,
  },
  'CWC Advanced - JavaScript': {
    appendNode: '#select-screen-tab-javascript .cwc-tutorial-list',
    mode: cwc.mode.Type.JAVASCRIPT,
  },
  'CWC Advanced - Pencil Code': {
    appendNode: '#select-screen-tab-pencil_code .cwc-tutorial-list',
    mode: cwc.mode.Type.PENCIL_CODE,
  },
  'CWC Advanced - Python 2.7': {
    appendNode: '#select-screen-tab-python27 .cwc-tutorial-list',
    mode: cwc.mode.Type.PYTHON27,
  },
  'CWC Advanced - Python 3.x': {
    appendNode: '#select-screen-tab-python .cwc-tutorial-list',
    mode: cwc.mode.Type.PYTHON,
  },
  'CWC Advanced - Simple': {
    appendNode: '#select-screen-tab-basic .cwc-tutorial-list',
    mode: cwc.mode.Type.BASIC,
  },
  'CWC Advanced - Sphero 2.0': {
    appendNode: '#select-screen-tab-sphero_classic .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO,
  },
  'CWC Advanced - Sphero BB-8': {
    appendNode: '#select-screen-tab-sphero_bb8 .cwc-tutorial-list',
    mode: 'sphero_bb8', // TODO: this is missing
  },
  'CWC Advanced - Sphero SPRK+': {
    appendNode: '#select-screen-tab-sphero_sprk_plus .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_SPRK_PLUS,
  },
  'CWC Beginner - Blocks': {
    appendNode: '#select-screen-tab-blocks .cwc-tutorial-list',
    mode: cwc.mode.Type.BASIC_BLOCKLY,
  },
  'CWC Beginner - EV3': {
    appendNode: '#select-screen-tab-lego_ev3 .cwc-tutorial-list',
    mode: cwc.mode.Type.EV3_BLOCKLY,
  },
  'CWC Beginner - Games': {
    appendNode: '#select-screen-tab-games .cwc-tutorial-list',
    mode: cwc.mode.Type.PHASER_BLOCKLY,
  },
  'CWC Beginner - Sphero 2.0': {
    appendNode: '#select-screen-tab-sphero_classic .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_BLOCKLY,
  },
  'CWC Beginner - Sphero BB-8': {
    appendNode: '#select-screen-tab-sphero_bb8 .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_BB8_BLOCKLY,
  },
  'CWC Beginner - Sphero SPRK+': {
    appendNode: '#select-screen-tab-sphero_sprk_plus .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_SPRK_PLUS_BLOCKLY,
  },
  'CWC Beginner - mBot Blue': {
    appendNode: '#select-screen-tab-makeblock_mbot .cwc-tutorial-list',
    mode: cwc.mode.Type.MBOT_BLOCKLY,
  },
  'CWC Beginner - mBot Ranger': {
    appendNode: '#select-screen-tab-makeblock_mbot_ranger .cwc-tutorial-list',
    mode: cwc.mode.Type.MBOT_RANGER_BLOCKLY,
  },
};
