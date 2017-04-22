/**
 * @fileoverview General template definition.
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
Blockly.BlocksTemplate = {};


/** Drag and drop point */
Blockly.BlocksTemplate.point = function() {
  return new Blockly.FieldImage(
    '../images/icons/circle_20pt.png', 15, 17, '▼');
};


/** Top Drag and drop point */
Blockly.BlocksTemplate.pointTop = function() {
  return new Blockly.FieldImage(
    '../images/icons/circle_20pt_top.png', 15, 17, '▼');
};


/** Drag and drop point for variable setter */
Blockly.BlocksTemplate.addCircle = function() {
  return new Blockly.FieldImage(
    '../images/icons/add_circle_20pt.png', 18, 18, '▼');
};


/** Drag and drop point for variable setter */
Blockly.BlocksTemplate.event = function() {
  return new Blockly.FieldImage(
    '../images/icons/event_20pt.png', 18, 18, '▼');
};


/** Drag and drop point for variable setter */
Blockly.BlocksTemplate.runningMan = function() {
  return new Blockly.FieldImage(
    '../images/icons/running_man_20pt.png', 18, 18, '▼');
};


/** Drag and drop point for variable setter */
Blockly.BlocksTemplate.adjust = function() {
  return new Blockly.FieldImage(
    '../images/icons/adjust_20pt.png', 18, 18, '▼');
};
