/**
 * @fileoverview Drawing library for the simple Framework.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.framework.simple.Draw');

goog.require('cwc.config.Number');
goog.require('goog.color');
goog.require('goog.color.alpha');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.style');



/**
 * Simple drawing framework.
 * @param {Element=} opt_target
 * @constructor
 * @struct
 * @final
 */
cwc.framework.simple.Draw = function(opt_target) {

  /** @type {Element} */
  this.target = opt_target;

  /** @type {Element} */
  this.stage = null;

  /** @type {Element} */
  this.canvas = null;

  /** @type {CanvasRenderingContext2D} */
  this.context2d = null;

  window.addEventListener('resize', this.handleResize_.bind(this), false);
};


/**
 * @private
 */
cwc.framework.simple.Draw.prototype.prepare_ = function() {
  var target = this.getTarget();
  if (!target) {
    return;
  }

  if (!this.stage) {
    this.stage = goog.dom.createDom('div');
    goog.style.setStyle(this.stage, 'position', 'relative');
    goog.dom.append(target, this.stage);
    this.handleResize_();
  }

  if (!this.canvas) {
    this.canvas = goog.dom.createDom('canvas');
    goog.style.setStyle(this.canvas, 'position', 'absolute');
    goog.style.setStyle(this.canvas, 'top', 0);
    goog.style.setStyle(this.canvas, 'left', 0);
    goog.dom.append(this.stage, this.canvas);
    this.handleResize_();
  }

  if (!this.context2d) {
    this.context2d = this.canvas.getContext('2d');
  }
};


/**
 * @private
 * @return {CanvasRenderingContext2D}
 */
cwc.framework.simple.Draw.prototype.getDisplay_ = function() {
  if (!this.context2d) {
    this.prepare_();
  }
  return this.context2d;
};


/**
 * @export
 */
cwc.framework.simple.Draw.prototype.getTarget = function() {
  return this.target || document.body;
};


/**
 * Maps function to the global window name space.
 * @export
 */
cwc.framework.simple.Draw.prototype.mapGlobal = function() {
  if (!window) {
    throw 'Window name space is not available in this instance.';
  }
  window['draw'] = {
    'circle': this.circle.bind(this),
    'line': this.line.bind(this),
    'rectangle': this.rectangle.bind(this),
    'point': this.point.bind(this),
    'ellipse': this.ellipse.bind(this),
    'triangle': this.triangle.bind(this)
  };
};


/**
 * Returns only a not empty string or undefined to avoid additional checks.
 *
 * This method is used to avoid additional checks or type casting for params
 * with shared types e.g. {({name: string|number}|string)=}.
 * It returns only a string or undefined to satisfy the JavaScript compiler.
 *
 * @param {({backgroundColor: string,
 *            borderColor: string,
 *            borderSize: number}|string)=} opt_content Content to check.
 * @return {string|undefined}
 * @private
 */
cwc.framework.simple.Draw.convertString_ = function(opt_content) {
  if (goog.isString(opt_content)) {
    if (!goog.string.isEmptyOrWhitespace(goog.string.makeSafe(opt_content))) {
      return opt_content;
    }
  }
  return undefined;
};



/**
 * Class for representing colors.
 * @param {string=} opt_color Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 *     Alpha/transparent colors are supported as well.
 * @param {string=} opt_hex A a string containing a hex representation of the
 *     color.
 * @param {string=} opt_type A string containing the type of color format
 *     passed in ('hex', 'rgb', 'named').
 * @constructor
 * @private
 * @struct
 */
cwc.framework.simple.Draw.Color_ = function(
    opt_color, opt_hex, opt_type) {

  /** @type {string} */
  this.type = '';

  /** @type {string} */
  this.hex = '';

  if (opt_hex && opt_type) {
    this.hex = opt_hex;
    this.type = opt_type;
  } else if (opt_color != null) {
    try {
      var normal_color = goog.color.parse(opt_color);
      this.hex = normal_color.hex;
      this.type = normal_color.type;
    } catch (err) {
      var alpha_color = goog.color.alpha.parse(opt_color);
      this.hex = alpha_color.hex;
      this.type = alpha_color.type;
    }
  }
};



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
 * @private
 * @struct
 */
cwc.framework.simple.Draw.Manipulation_ = function(
    opt_preset, opt_backgroundColor, opt_borderColor, opt_borderSize,
    opt_rotation) {

  /** @private {boolean} */
  this.preset_ = opt_preset || false;

  /** @private {cwc.framework.simple.Draw.Color_} */
  this.backgroundColor_ = new cwc.framework.simple.Draw.Color_(
      opt_backgroundColor);

  /** @private {cwc.framework.simple.Draw.Color_} */
  this.borderColor_ = new cwc.framework.simple.Draw.Color_(
      opt_borderColor);

  /** @private {number} */
  this.borderSize_ = opt_borderSize || 0;

  /** @private {number} */
  this.rotation_ = opt_rotation || 0;
};


/**
 * @return {boolean} Whether a preset of values has been set.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.hasPreset = function() {
  return !!this.preset_;
};


/**
 * @param {string} backgroundColor Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @return {!cwc.framework.simple.Draw.Manipulation_} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.setBgColor = function(
    backgroundColor) {
  this.backgroundColor_ = new cwc.framework.simple.Draw.Color_(
      backgroundColor);
  return this;
};


/**
 * @return {boolean} Whether the background color has been set.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.hasBgColor = function() {
  return !!this.backgroundColor_.hex;
};


/**
 * @return {string} A string containing a hex representation of the background
 *     color.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.getBgColor = function() {
  return this.backgroundColor_.hex;
};


/**
 * @param {string} borderColor Color in hex (e.g #3CA or #33CCAA),
 *     RGB(…), RGBA(…), HSLA(…), or named (e.g. blue) format.
 * @return {!cwc.framework.simple.Draw.Manipulation_} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.setBorderColor = function(
	borderColor) {
  this.borderColor_ = new cwc.framework.simple.Draw.Color_(
      borderColor);
  return this;
};


/**
 * @return {boolean} Whether the border color has been set.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.hasBorderColor = function() {
  return !!this.borderColor_.hex;
};


/**
 * @return {string} A string containing a hex representation of the border
 *     color.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.getBorderColor = function() {
  return this.borderColor_.hex;
};


/**
 * @param {number} borderSize
 * @return {!cwc.framework.simple.Draw.Manipulation_} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.setBorderSize = function(
	borderSize) {
  this.borderSize_ = borderSize;
  return this;
};


/**
 * @return {boolean} Whether the border size has been set.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.hasBorderSize = function() {
  return !!this.borderSize_;
};


/**
 * @return {number} The border size.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.getBorderSize = function() {
  return this.borderSize_;
};


/**
 * @param {number} degrees The degrees for the rotation of object without the
 *     degree symbol e.g. 90 for a 90 degree rotation of the object.
 * @return {!cwc.framework.simple.Draw.Manipulation_} This manipulation
 *     object, for chaining with other manipulation operations.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.setRotation = function(
	degrees) {
  this.rotation_ = degrees;
  return this;
};


/**
 * @return {boolean} Whether the object rotation has been set.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.hasRotation = function() {
  return !!this.rotation_;
};


/**
 * @return {number} The object rotation.
 */
cwc.framework.simple.Draw.Manipulation_.prototype.getRotation = function() {
  return this.rotation_;
};


/**
 * @typedef {({backgroundColor: string,
 *            borderColor: string,
 *            borderSize: number}|string)}
 */
cwc.framework.simple.Draw.ManipulationContent;


/**
 * Draws a circle on the stage.
 * @param {number} x The x value for the center of the circle.
 * @param {number} y The y value for the center of the circle.
 * @param {number} radius
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the circle or a
 *     hash of options for additional manipulation.
 * @param {string=} opt_borderColor
 * @param {number=} opt_borderSize
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.circle = function(
    x, y, radius, opt_colorOrManipulation, opt_borderColor, opt_borderSize) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    var background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setBgColor(background_color);
    }

    if (opt_borderColor) {
      manipulation.setBorderColor(opt_borderColor);
    }

    if (opt_borderSize) {
      manipulation.setBorderSize(opt_borderSize);
    }
  }

  var canvasInstructions = function() {
    display.arc(x, y, (radius || 25), 0, 2 * Math.PI, false);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Draws a line on the stage.
 * @param {number} from_x The x value for the start point of the line.
 * @param {number} from_y The y value for the start point of the line.
 * @param {number} to_x The x value for the end point of the line.
 * @param {number} to_y The y value for the end point of the line.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the line or a
 *     hash of options for additional manipulation.
 * @param {number=} opt_width The width of the line.
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.line = function(
    from_x, from_y, to_x, to_y, opt_colorOrManipulation, opt_width) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    var border_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (border_color) {
      manipulation.setBorderColor(border_color);
    } else {
      manipulation.setBorderColor('#000');
    }

    if (opt_width) {
      manipulation.setBorderSize(opt_width);
    } else {
      manipulation.setBorderSize(1);
    }
  }

  var canvasInstructions = function() {
    display.moveTo(from_x, from_y);
    display.lineTo(to_x, to_y);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Draws a rectangle on the stage.
 * @param {number} x The x value for the top left corner of the rectangle.
 * @param {number} y The y value for the top left corner of the rectangle.
 * @param {number} width The width of the rectangle.
 * @param {number} height The height of the rectangle.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the rectangle or
 *     a hash of options for additional manipulation.
 * @param {string=} opt_borderColor
 * @param {number=} opt_borderSize
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.rectangle = function(
    x, y, width, height,
    opt_colorOrManipulation, opt_borderColor, opt_borderSize) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);

  if (!manipulation.hasPreset()) {
    var background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setBgColor(background_color);
    }

    if (opt_borderColor) {
      manipulation.setBorderColor(opt_borderColor);
    }

    if (opt_borderSize) {
      manipulation.setBorderSize(opt_borderSize);
    }
  }

  var canvasInstructions = function() {
    display.rect(x, y, width, height);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Draws a point on the stage.
 * @param {number} x The x position of the point.
 * @param {number} y The y position of the point.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the point or a
 *     hash of options for additional manipulation.
 * @param {number=} opt_size The size of the point e.g. 2
 *     for a 2x2 point.
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.point = function(
    x, y, opt_colorOrManipulation, opt_size) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  var size = opt_size || 1;

  if (!manipulation.hasPreset()) {
    var background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setBgColor(background_color);
    }
  }
  var canvasInstructions = function() {
    display.fillRect(x, y, size, size);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Draws a ellipse on the stage.
 * @param {number} x The x value for the center of the ellipse.
 * @param {number} y The y value for the center of the ellipse.
 * @param {number} width The width of the ellipse.
 * @param {number} height The height of the ellipse.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the ellipse or a
 *     hash of options for additional manipulation.
 * @param {string=} opt_borderColor
 * @param {number=} opt_borderSize
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.ellipse = function(
    x, y, width, height,
    opt_colorOrManipulation, opt_borderColor, opt_borderSize) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    var background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setBgColor(background_color);
    }

    if (opt_borderColor) {
      manipulation.setBorderColor(opt_borderColor);
    }

    if (opt_borderSize) {
      manipulation.setBorderSize(opt_borderSize);
    }
  }
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var centerX = x - halfWidth;
  var centerY = y - halfHeight;
  var middleX = centerX + halfWidth;
  var middleY = centerY + halfHeight;
  var endX = centerX + width;
  var endY = centerY + height;
  var controlX = halfWidth * cwc.config.Number.CIRCULAR_ARCS;
  var controlY = halfHeight * cwc.config.Number.CIRCULAR_ARCS;
  var canvasInstructions = function() {
    display.moveTo(centerX, centerY + halfHeight);
    display.bezierCurveTo(  // Top-Left part
        centerX, middleY - controlY, middleX - controlX,
        centerY, middleX, centerY);
    display.bezierCurveTo(  // Top-Right part
        middleX + controlX, centerY, endX, middleY - controlY, endX, middleY);
    display.bezierCurveTo(  // Bottom-Right part
        endX, middleY + controlY, middleX + controlX, endY, middleX, endY);
    display.bezierCurveTo(  // Bottom-Left part
        middleX - controlX, endY, centerX,
        middleY + controlY, centerX, middleY);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Draws a triangle on the stage.
 * @param {number} x1 The x value for the first point of the triangle.
 * @param {number} y1 The y value for the first point of the triangle.
 * @param {number} x2 The x value for the second point of the triangle.
 * @param {number} y2 The y value for the second point of the triangle.
 * @param {number} x3 The x value for the third point of the triangle.
 * @param {number} y3 The y value for the third point of the triangle.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the triangle or a
 *     hash of options for additional manipulation.
 * @param {string=} opt_borderColor
 * @param {number=} opt_borderSize
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.triangle = function(
    x1, y1, x2, y2, x3, y3,
    opt_colorOrManipulation, opt_borderColor, opt_borderSize) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    var background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setBgColor(background_color);
    }

    if (opt_borderColor) {
      manipulation.setBorderColor(opt_borderColor);
    }

    if (opt_borderSize) {
      manipulation.setBorderSize(opt_borderSize);
    }
  }
  var canvasInstructions = function() {
    display.moveTo(x1, y1);
    display.lineTo(x2, y2);
    display.lineTo(x3, y3);
    display.lineTo(x1, y1);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Executes the canvas instructions and adds pre manipulations and post
 * manipulations which are defined in the manipulation object.
 * @param {!Function} drawFn Execute the canvas instructions.
 * @param {!CanvasRenderingContext2D} display
 * @param {!cwc.framework.simple.Draw.Manipulation_} manipulation
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @private
 */
cwc.framework.simple.Draw.prototype.execute_ = function(
    drawFn, display, manipulation) {
  cwc.framework.simple.Draw.doPreManipulations_(display,
      manipulation);
  drawFn.call(this);
  cwc.framework.simple.Draw.doPostManipulations_(display,
      manipulation);
  return this;
};


/**
 * Handles pre manipulations for the Canvas element.
 * @param {!CanvasRenderingContext2D} display
 * @param {!cwc.framework.simple.Draw.Manipulation_} manipulation
 * @private
 */
cwc.framework.simple.Draw.doPreManipulations_ = function(
    display, manipulation) {
  display.beginPath();

  if (manipulation.hasRotation()) {
    display.save();
    display.rotate(manipulation.getRotation() * Math.PI / 180);
  }
};


/**
 * Handles post manipulations for the Canvas element.
 * @param {!CanvasRenderingContext2D} display
 * @param {!cwc.framework.simple.Draw.Manipulation_} manipulation
 * @private
 */
cwc.framework.simple.Draw.doPostManipulations_ = function(
    display, manipulation) {
  // Background Color
  if (manipulation.hasBgColor()) {
    display.fillStyle = manipulation.getBgColor();
    display.fill();
  } else {
    display.fillStyle = '#ccc';
    display.fill();
  }

  // Border Size
  if (manipulation.hasBorderSize()) {
    display.lineWidth = manipulation.getBorderSize();
  }

  // Border Color
  if (manipulation.hasBorderColor()) {
    display.strokeStyle = manipulation.getBorderColor();
    display.stroke();
  }

  // Rotation
  if (manipulation.hasRotation()) {
    display.restore();
  }

  display.closePath();
};


/**
 * Returns the manipulation objects with or without defined presets.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_manipulation If used, a hash of options for additional manipulations.
 * @return {!cwc.framework.simple.Draw.Manipulation_}
 * @private
 */
cwc.framework.simple.Draw.getManipulations_ = function(
    opt_manipulation) {
  if (goog.isObject(opt_manipulation)) {
    return new cwc.framework.simple.Draw.Manipulation_(
        true,
        opt_manipulation['backgroundColor'],
        opt_manipulation['borderColor'],
        opt_manipulation['borderSize']
    );
  }
  return new cwc.framework.simple.Draw.Manipulation_();
};


/**
 * Adjusts canvas element by resize.
 * @private
 */
cwc.framework.simple.Draw.prototype.handleResize_ = function() {
  if (this.canvas) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
};
