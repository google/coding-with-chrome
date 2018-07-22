/**
 * @fileoverview Drawing manipulations for the simple Framework.
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
goog.provide('cwc.framework.simple.DrawManipulation');
goog.provide('cwc.framework.simple.ColorToHex');

goog.require('goog.color');
goog.require('goog.color.alpha');


/**
 * Class for representing manipulations of the canvas object.
 * @param {boolean=} opt_preset
 * @param {string=} opt_backgroundColor Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @param {string=} opt_borderColor Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @param {number=} opt_borderSize
 * @param {number=} opt_rotation
 * @constructor
 * @struct
 */
cwc.framework.simple.DrawManipulation = function(opt_preset,
    opt_backgroundColor, opt_borderColor, opt_borderSize, opt_rotation) {
  /** @private {boolean} */
  this.preset_ = opt_preset || false;

  /** @private {cwc.framework.simple.ColorToHex} */
  this.backgroundColor_ = new cwc.framework.simple.ColorToHex(
      opt_backgroundColor);

  /** @private {cwc.framework.simple.ColorToHex} */
  this.borderColor_ = new cwc.framework.simple.ColorToHex(
      opt_borderColor);

  /** @private {number} */
  this.borderSize_ = opt_borderSize || 0;

  /** @private {cwc.framework.simple.ColorToHex} */
  this.fillStyle_ = new cwc.framework.simple.ColorToHex();

  /** @private {cwc.framework.simple.ColorToHex} */
  this.strokeStyle_ = new cwc.framework.simple.ColorToHex();

  /** @private {number} */
  this.rotation_ = opt_rotation || 0;
};


/**
 * @return {boolean} Whether a preset of values has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasPreset = function() {
  return !!this.preset_;
};


/**
 * @param {boolean} preset Whether a preset of values has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.setPreset = function(preset) {
  this.preset_ = preset;
};


/**
 * @param {string} background_color Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @return {!cwc.framework.simple.DrawManipulation} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.DrawManipulation.prototype.setBgColor = function(
    background_color) {
  this.backgroundColor_ = new cwc.framework.simple.ColorToHex(
      background_color);
  return this;
};


/**
 * @return {boolean} Whether the background color has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasBgColor = function() {
  return !!this.backgroundColor_.hex;
};


/**
 * @return {string} A string containing a hex representation of the background
 *     color.
 */
cwc.framework.simple.DrawManipulation.prototype.getBgColor = function() {
  return this.backgroundColor_.hex;
};


/**
 * @param {string} border_color Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @return {!cwc.framework.simple.DrawManipulation} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.DrawManipulation.prototype.setBorderColor = function(
    border_color) {
  this.borderColor_ = new cwc.framework.simple.ColorToHex(
      border_color);
  return this;
};


/**
 * @return {boolean} Whether the border color has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasBorderColor = function() {
  return !!this.borderColor_.hex;
};


/**
 * @return {string} A string containing a hex representation of the border
 *     color.
 */
cwc.framework.simple.DrawManipulation.prototype.getBorderColor = function() {
  return this.borderColor_.hex;
};


/**
 * @param {number} border_size
 * @return {!cwc.framework.simple.DrawManipulation} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.DrawManipulation.prototype.setBorderSize = function(
    border_size) {
  this.borderSize_ = border_size;
  return this;
};


/**
 * @return {boolean} Whether the border size has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasBorderSize = function() {
  return !!this.borderSize_;
};


/**
 * @return {number} The border size.
 */
cwc.framework.simple.DrawManipulation.prototype.getBorderSize = function() {
  return this.borderSize_;
};


/**
 * @param {string} fill_style Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @return {!cwc.framework.simple.DrawManipulation} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.DrawManipulation.prototype.setFillStyle = function(
    fill_style) {
  this.fillStyle_ = new cwc.framework.simple.ColorToHex(fill_style);
  return this;
};


/**
 * @return {boolean} Whether the fill style has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasFillStyle = function() {
  return !!this.fillStyle_.hex;
};


/**
 * @return {string} A string containing a hex representation of the fill style.
 */
cwc.framework.simple.DrawManipulation.prototype.getFillStyle = function() {
  return this.fillStyle_.hex;
};


/**
 * @param {string} stroke_style Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @return {!cwc.framework.simple.DrawManipulation} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.DrawManipulation.prototype.setStrokeStyle = function(
    stroke_style) {
  this.strokeStyle_ = new cwc.framework.simple.ColorToHex(
      stroke_style);
  return this;
};


/**
 * @return {boolean} Whether the stroke style has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasStrokeStyle = function() {
  return !!this.strokeStyle_.hex;
};


/**
 * @return {string} A string containing a hex representation of the stroke
 *     style.
 */
cwc.framework.simple.DrawManipulation.prototype.getStrokeStyle = function() {
  return this.strokeStyle_.hex;
};


/**
 * @param {number} degrees The degrees for the rotation of object without the
 *     degree symbol e.g. 90 for a 90 degree rotation of the object.
 * @return {!cwc.framework.simple.DrawManipulation} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.DrawManipulation.prototype.setRotation = function(
      degrees) {
  this.rotation_ = degrees;
  return this;
};


/**
 * @return {boolean} Whether the object rotation has been set.
 */
cwc.framework.simple.DrawManipulation.prototype.hasRotation = function() {
  return !!this.rotation_;
};


/**
 * @return {number} The object rotation.
 */
cwc.framework.simple.DrawManipulation.prototype.getRotation = function() {
  return this.rotation_;
};


/**
 * Handles pre manipulations for the Canvas element.
 * @param {!CanvasRenderingContext2D} display
 */
cwc.framework.simple.DrawManipulation.prototype.doPre = function(display) {
  display.beginPath();

  if (this.hasRotation()) {
    display.save();
    display.rotate(this.getRotation() * Math.PI / 180);
  }

  if (this.hasFillStyle()) {
    display.fillStyle = this.getFillStyle();
  }

  if (this.hasStrokeStyle()) {
    display.strokeStyle = this.getStrokeStyle();
  }
};


/**
 * Handles post manipulations for the Canvas element.
 * @param {!CanvasRenderingContext2D} display
 */
cwc.framework.simple.DrawManipulation.prototype.doPost = function(display) {
  // Background Color
  if (this.hasBgColor()) {
    display.fillStyle = this.getBgColor();
    display.fill();
  } else {
    display.fillStyle = '#ccc';
    display.fill();
  }

  // Border Size
  if (this.hasBorderSize()) {
    display.lineWidth = this.getBorderSize();
  }

  // Border Color
  if (this.hasBorderColor()) {
    display.strokeStyle = this.getBorderColor();
    display.stroke();
  }

  // Rotation
  if (this.hasRotation()) {
    display.restore();
  }

  display.closePath();
};


/**
 * Class for representing colors.
 * @param {string=} opt_color Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 *     Alpha/transparent colors are supported as well.
 * @param {string=} opt_hex A a string containing a hex representation of the
 *     color.
 * @param {string=} optType A string containing the type of color format
 *     passed in ('hex', 'rgb', 'named').
 * @constructor
 * @struct
 */
cwc.framework.simple.ColorToHex = function(
    opt_color, opt_hex, optType) {
  /** @type {string} */
  this.type = '';

  /** @type {string} */
  this.hex = '';

  if (opt_hex && optType) {
    this.hex = opt_hex;
    this.type = optType;
  } else if (opt_color != null) {
    try {
      let normal_color = goog.color.parse(opt_color);
      this.hex = normal_color.hex;
      this.type = normal_color.type;
    } catch (err) {
      let alpha_color = goog.color.alpha.parse(opt_color);
      this.hex = alpha_color.hex;
      this.type = alpha_color.type;
    }
  }
};
