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
    appendNode: '#select-screen-tab-advanced-graphic .mdl-grid',
    mode: cwc.mode.Type.BASIC,
    wbTagId: 915,
  },
  'CWC Advanced - AIY': {
    appendNode: '#select-screen-tab-advanced-aiy .mdl-grid',
    mode: cwc.mode.Type.AIY,
    wbTagId: 916,
  },
  'CWC Advanced - CoffeeScript': {
    appendNode: '#select-screen-tab-advanced-coffeescript .mdl-grid',
    mode: cwc.mode.Type.COFFEESCRIPT,
    wbTagId: 917,
  },
  'CWC Advanced - EV3': {
    appendNode: '#select-screen-tab-advanced-lego_ev3 .mdl-grid',
    mode: cwc.mode.Type.EV3,
    wbTagId: 918,
  },
  'CWC Advanced - Games': {
    appendNode: '#select-screen-tab-advanced-games .mdl-grid',
    mode: cwc.mode.Type.PHASER,
    wbTagId: 919,
  },
  'CWC Advanced - HTML5': {
    appendNode: '#select-screen-tab-advanced-html5 .mdl-grid',
    mode: cwc.mode.Type.HTML5,
    wbTagId: 540,
  },
  'CWC Advanced - JavaScript': {
    appendNode: '#select-screen-tab-advanced-javascript .mdl-grid',
    mode: cwc.mode.Type.JAVASCRIPT,
    wbTagId: 920,
  },
  'CWC Advanced - Pencil Code': {
    appendNode: '#select-screen-tab-advanced-pencil_code .mdl-grid',
    mode: cwc.mode.Type.PENCIL_CODE,
    wbTagId: 921,
  },
  'CWC Advanced - Python 2.7': {
    appendNode: '#select-screen-tab-advanced-python27 .mdl-grid',
    mode: cwc.mode.Type.PYTHON27,
    wbTagId: 922,
  },
  'CWC Advanced - Python 3.x': {
    appendNode: '#select-screen-tab-advanced-python .mdl-grid',
    mode: cwc.mode.Type.PYTHON,
    wbTagId: 923,
  },
  'CWC Advanced - Simple': {
    appendNode: '#select-screen-tab-advanced-basic .mdl-grid',
    mode: cwc.mode.Type.BASIC,
    wbTagId: 924,
  },
  'CWC Advanced - Sphero 2.0': {
    appendNode: '#select-screen-tab-advanced-sphero_classic .mdl-grid',
    mode: cwc.mode.Type.SPHERO,
    wbTagId: 925,
  },
  'CWC Advanced - Sphero BB-8': {
    appendNode: '#select-screen-tab-advanced-sphero_bb8 .mdl-grid',
    mode: 'sphero_bb8', // TODO: this is missing
    wbTagId: 926,
  },
  'CWC Advanced - Sphero SPRK+': {
    appendNode: '#select-screen-tab-advanced-sphero_sprk_plus .mdl-grid',
    mode: cwc.mode.Type.SPHERO_SPRK_PLUS,
    wbTagId: 927,
  },
  'CWC Beginner - Blocks': {
    appendNode: '#select-screen-tab-beginner-blocks .mdl-grid',
    mode: cwc.mode.Type.BASIC_BLOCKLY,
    wbTagId: 928,
  },
  'CWC Beginner - EV3': {
    appendNode: '#select-screen-tab-beginner-lego_ev3 .mdl-grid',
    mode: cwc.mode.Type.EV3_BLOCKLY,
    wbTagId: 929,
  },
  'CWC Beginner - Games': {
    appendNode: '#select-screen-tab-beginner-games .mdl-grid',
    mode: cwc.mode.Type.PHASER_BLOCKLY,
    wbTagId: 930,
  },
  'CWC Beginner - Sphero 2.0': {
    appendNode: '#select-screen-tab-beginner-sphero_classic .mdl-grid',
    mode: cwc.mode.Type.SPHERO_BLOCKLY,
    wbTagId: 931,
  },
  'CWC Beginner - Sphero BB-8': {
    appendNode: '#select-screen-tab-beginner-sphero_bb8 .mdl-grid',
    mode: cwc.mode.Type.SPHERO_BB8_BLOCKLY,
    wbTagId: 932,
  },
  'CWC Beginner - Sphero SPRK+': {
    appendNode: '#select-screen-tab-beginner-sphero_sprk_plus .mdl-grid',
    mode: cwc.mode.Type.SPHERO_SPRK_PLUS_BLOCKLY,
    wbTagId: 933,
  },
  'CWC Beginner - mBot Blue': {
    appendNode: '#select-screen-tab-beginner-makeblock_mbot .mdl-grid',
    mode: cwc.mode.Type.MBOT_BLOCKLY,
    wbTagId: 934,
  },
  'CWC Beginner - mBot Ranger': {
    appendNode: '#select-screen-tab-beginner-makeblock_mbot_ranger .mdl-grid',
    mode: cwc.mode.Type.MBOT_RANGER_BLOCKLY,
    wbTagId: 935,
  },
};
