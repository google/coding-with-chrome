/**
 * @fileoverview Editor mode config data for the Coding with Chrome editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.robot.Config');

goog.require('cwc.mode.Mod');
goog.require('cwc.mode.Service');
goog.require('cwc.mode.Type');
goog.require('cwc.mode.lego.ev3.Mod');
goog.require('cwc.mode.lego.weDo2.Mod');
goog.require('cwc.mode.makeblock.mBot.Mod');
goog.require('cwc.mode.makeblock.mBotRanger.Mod');
goog.require('cwc.mode.sphero.bb8.Mod');
goog.require('cwc.mode.sphero.ollie.blockly.Mod');
goog.require('cwc.mode.sphero.sphero2.Mod');
goog.require('cwc.mode.sphero.sprkPlus.Mod');
goog.require('cwc.utils.mime.Type');


/**
 * enum {Object}
 */
cwc.mode.robot.Config = {};


/**
 * Mindstorms EV3 advanced mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.EV3] = new cwc.mode.Mod({
  authors: ['Markus Bordihn, Stefan Sauer'],
  icon: 'adb',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.lego.ev3.Mod,
  name: 'EV3',
  services: [cwc.mode.Service.BLUETOOTH, cwc.mode.Service.GAMEPAD],
  template: 'lego/ev3/blank.cwc',
});


/**
 * Mindstorms EV3 blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.EV3_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn, Stefan Sauer'],
  icon: 'adb',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.lego.ev3.Mod,
  name: 'EV3 blockly',
  services: [cwc.mode.Service.BLUETOOTH, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'lego/ev3/blank-blocks.cwc',
});


/**
 * Lego WeDo 2.0 blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.LEGO_WEDO2_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adb',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.lego.weDo2.Mod,
  name: 'Lego WeDo 2.0 blockly',
  services: [cwc.mode.Service.BLUETOOTH_WEB, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'lego/wedo2/blank-blocks.cwc',
});


/**
 * mBot blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.MBOT_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Yu Wang', 'Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.makeblock.mBot.Mod,
  name: 'mBot blockly',
  services: [cwc.mode.Service.BLUETOOTH, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'makeblock/mbot/blank-blocks.cwc',
});


/**
 * mBot Ranger blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.MBOT_RANGER_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Yu Wang', 'Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.makeblock.mBotRanger.Mod,
  name: 'mBot Ranger blockly',
  services: [cwc.mode.Service.BLUETOOTH, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'makeblock/mbot_ranger/blank-blocks.cwc',
});


/**
 * Sphero BB-8 blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.SPHERO_BB8_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.bb8.Mod,
  name: 'Sphero BB-8 blockly',
  services: [cwc.mode.Service.BLUETOOTH_WEB, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'sphero/bb_8/blank-blocks.cwc',
});


/**
 * Sphero 2.0 advanced mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.SPHERO] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sphero2.Mod,
  name: 'Sphero 2.0',
  services: [cwc.mode.Service.BLUETOOTH, cwc.mode.Service.GAMEPAD],
  template: 'sphero/classic/blank.cwc',
});


/**
 * Sphero 2.0 blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.SPHERO_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sphero2.Mod,
  name: 'Sphero 2.0 blockly',
  services: [cwc.mode.Service.BLUETOOTH, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'sphero/classic/blank-blocks.cwc',
});


/**
 * Sphero Ollie blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.SPHERO_OLLIE_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.ollie.blockly.Mod,
  name: 'Sphero Ollie blockly',
  services: [cwc.mode.Service.BLUETOOTH_WEB, cwc.mode.Service.GAMEPAD],
  template: 'sphero/ollie/blank-blocks.cwc',
});


/**
 * Sphero SRPK+ mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.SPHERO_SPRK_PLUS] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sprkPlus.Mod,
  name: 'Sphero SPRK+',
  services: [cwc.mode.Service.BLUETOOTH_WEB, cwc.mode.Service.GAMEPAD],
  template: 'sphero/sprk_plus/blank.cwc',
});


/**
 * Sphero SPRK+ blockly mode.
 */
cwc.mode.robot.Config[cwc.mode.Type.SPHERO_SPRK_PLUS_BLOCKLY] =
new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sprkPlus.Mod,
  name: 'Sphero SPRK+ blockly',
  services: [cwc.mode.Service.BLUETOOTH_WEB, cwc.mode.Service.GAMEPAD],
  show_blockly: true,
  template: 'sphero/sprk_plus/blank-blocks.cwc',
});
