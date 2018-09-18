/**
 * @fileoverview Drawing definitions for the simple Framework.
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
goog.provide('cwc.framework.simple.DrawInstruction');

goog.require('goog.color');
goog.require('goog.color.alpha');


/**
 * Draws a circle on the stage.
 * @param {number} x The x value for the center of the circle.
 * @param {number} y The y value for the center of the circle.
 * @param {number} radius
 * @return {!Object} This draw instructions.
 * @export
 */
cwc.framework.simple.DrawInstruction.circle = function(x, y, radius) {
  return function(display) {
    display.arc(x, y, (radius || 25), 0, 2 * Math.PI, false);
  };
};
