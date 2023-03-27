/**
 * @fileoverview General template definition.
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

import Blockly from 'blockly';

/**
 * Simple Blocks templates.
 */
export class BlocksTemplate {
  /**
   * @return {!Blockly.FieldImage}
   */
  static point = function () {
    return new Blockly.FieldImage('/assets/icons/circle_20pt.png', 15, 17, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static pointTop = function () {
    return new Blockly.FieldImage(
      '/assets/icons/circle_20pt_top.png',
      15,
      17,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static addCircle = function () {
    return new Blockly.FieldImage(
      '/assets/icons/add_circle_20pt.png',
      18,
      18,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static collide = function () {
    return new Blockly.FieldImage(
      '/assets/icons/collide_20pt.png',
      18,
      18,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static event = function () {
    return new Blockly.FieldImage('/assets/icons/event_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static runningMan = function () {
    return new Blockly.FieldImage(
      '/assets/icons/running_man_20pt.png',
      18,
      18,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static adjust = function () {
    return new Blockly.FieldImage('/assets/icons/adjust_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static image = function () {
    return new Blockly.FieldImage('/assets/icons/image_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static mouse = function () {
    return new Blockly.FieldImage('/assets/icons/mouse_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static keyboard = function () {
    return new Blockly.FieldImage(
      '/assets/icons/keyboard_20pt.png',
      18,
      18,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static repeat = function () {
    return new Blockly.FieldImage('/assets/icons/repeat_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static fileDownload = function () {
    return new Blockly.FieldImage(
      '/assets/icons/file_download_20pt.png',
      18,
      18,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static storage = function () {
    return new Blockly.FieldImage(
      '/assets/icons/storage_20pt.png',
      18,
      18,
      '▼'
    );
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static audio = function () {
    return new Blockly.FieldImage('/assets/icons/audio_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static timer = function () {
    return new Blockly.FieldImage('/assets/icons/timer_20pt.png', 18, 18, '▼');
  };

  /**
   * @return {!Blockly.FieldImage}
   */
  static timelapse = function () {
    return new Blockly.FieldImage(
      '/assets/icons/timelapse_20pt.png',
      18,
      18,
      '▼'
    );
  };
}
