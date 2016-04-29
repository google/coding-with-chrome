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
goog.require('cwc.framework.simple.DrawManipulation');

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

  /** @type {Element|undefined} */
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
    throw 'Window name space is not available!';
  }
  window['draw'] = {
    'circle': this.circle.bind(this),
    'clear': this.clear.bind(this),
    'ellipse': this.ellipse.bind(this),
    'line': this.line.bind(this),
    'point': this.point.bind(this),
    'rectangle': this.rectangle.bind(this),
    'text': this.text.bind(this),
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
cwc.framework.simple.Draw.prototype.circle = function(x, y, radius,
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
    display.arc(x, y, (radius || 25), 0, 2 * Math.PI, false);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Clears the entire canvas.
 * @export
 */
cwc.framework.simple.Draw.prototype.clear = function() {
  var display = this.getDisplay_();
  display.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
cwc.framework.simple.Draw.prototype.line = function(from_x, from_y,
    to_x, to_y, opt_colorOrManipulation, opt_width) {
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
cwc.framework.simple.Draw.prototype.rectangle = function(x, y, width, height,
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
 * Draws a text on the stage.
 * @param {string} text
 * @param {number} x The x position of the text.
 * @param {number} y The y position of the text.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the point or a
 *     hash of options for additional manipulation.
 * @param {string=} opt_font The font face and size to use e.g.
 *     "48px serif"
 * @param {boolean=} opt_stroke Whenever to use the stroke style.
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.text = function(text, x, y,
    opt_colorOrManipulation, opt_font, opt_stroke) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  var font = opt_font || '24px serif';

  if (!manipulation.hasPreset()) {
    var textColor = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (textColor) {
      if (opt_stroke) {
        manipulation.setStrokeStyle(textColor);
      } else {
        manipulation.setFillStyle(textColor);
      }
    }
  }
  var canvasInstructions = function() {
    display.font = font;
    if (opt_stroke) {
      display.strokeText(text, x, y);
    } else {
      display.fillText(text, x, y);
    }
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
cwc.framework.simple.Draw.prototype.point = function(x, y,
    opt_colorOrManipulation, opt_size) {
  var display = this.getDisplay_();
  var manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  var size = opt_size || 1;

  if (!manipulation.hasPreset()) {
    var background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setFillStyle(background_color);
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
cwc.framework.simple.Draw.prototype.ellipse = function(x, y, width, height,
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
cwc.framework.simple.Draw.prototype.triangle = function(x1, y1, x2, y2, x3, y3,
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
 * @param {CanvasRenderingContext2D} display
 * @param {!cwc.framework.simple.DrawManipulation} manipulations
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @private
 */
cwc.framework.simple.Draw.prototype.execute_ = function(drawFn, display,
    manipulations) {
  if (!display) {
    return this;
  }
  manipulations.doPre(display);
  drawFn.call(this);
  manipulations.doPost(display);
  return this;
};


/**
 * Returns the manipulation objects with or without defined presets.
 * @param {cwc.framework.simple.DrawManipulationContent=}
 *     opt_manipulation If used, a hash of options for additional manipulations.
 * @return {!cwc.framework.simple.DrawManipulation}
 * @private
 */
cwc.framework.simple.Draw.getManipulations_ = function(opt_manipulation) {
  var manipulations = new cwc.framework.simple.DrawManipulation();
  if (goog.isObject(opt_manipulation)) {
    manipulations.setPreset(true);
    manipulations.setBgColor(opt_manipulation['backgroundColor']);
    manipulations.setBorderColor(opt_manipulation['borderColor']);
    manipulations.setBorderSize(opt_manipulation['borderSize']);
    manipulations.setFillStyle(opt_manipulation['fillStyle']);
  }
  return manipulations;
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
