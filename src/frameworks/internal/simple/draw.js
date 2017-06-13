/**
 * @fileoverview Drawing library for the simple Framework.
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
goog.provide('cwc.framework.simple.Draw');

goog.require('cwc.config.Number');
goog.require('cwc.framework.simple.DrawManipulation');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
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
  let target = this.getTarget();
  if (!target) {
    return;
  }

  if (!this.stage) {
    this.stage = goog.dom.createDom(goog.dom.TagName.DIV);
    goog.style.setStyle(this.stage, 'position', 'relative');
    goog.dom.append(target, this.stage);
    this.handleResize_();
  }

  if (!this.canvas) {
    this.canvas = goog.dom.createDom(goog.dom.TagName.CANVAS);
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
 * @return {Element}
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
    throw new Error('Window name space is not available!');
  }
  window['draw'] = {
    'circle': this.circle.bind(this),
    'clear': this.clear.bind(this),
    'ellipse': this.ellipse.bind(this),
    'image': this.image.bind(this),
    'line': this.line.bind(this),
    'point': this.point.bind(this),
    'rectangle': this.rectangle.bind(this),
    'text': this.text.bind(this),
    'triangle': this.triangle.bind(this),
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
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    let background_color = cwc.framework.simple.Draw.convertString_(
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

  let canvasInstructions = function() {
    display.arc(x, y, (radius || 25), 0, 2 * Math.PI, false);
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Clears the entire canvas.
 * @export
 */
cwc.framework.simple.Draw.prototype.clear = function() {
  let display = this.getDisplay_();
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
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    let border_color = cwc.framework.simple.Draw.convertString_(
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

  let canvasInstructions = function() {
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
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);

  if (!manipulation.hasPreset()) {
    let background_color = cwc.framework.simple.Draw.convertString_(
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

  let canvasInstructions = function() {
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
 * @param {string=} font The font face and size to use e.g. "48px serif"
 * @param {boolean=} opt_stroke Whenever to use the stroke style.
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.text = function(text, x, y,
    opt_colorOrManipulation, font = '24px serif', opt_stroke) {
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);

  if (!manipulation.hasPreset()) {
    let textColor = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (textColor) {
      if (opt_stroke) {
        manipulation.setStrokeStyle(textColor);
      } else {
        manipulation.setFillStyle(textColor);
      }
    }
  }
  let canvasInstructions = function() {
    display.font = font || '24px serif';
    if (opt_stroke) {
      display.strokeText(text, x, y);
    } else {
      display.fillText(text, x, y);
    }
  };
  return this.execute_(canvasInstructions, display, manipulation);
};


/**
 * Draws a image on the stage.
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|string} image
 * @param {number} x The x position of the image.
 * @param {number} y The y position of the image.
 * @param {number=} opt_width The width of the image.
 * @param {number=} opt_height The height of the image.
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.image = function(image, x, y,
    opt_width, opt_height) {
  let display = this.getDisplay_();
  let imageElement = null;
  if ((typeof image == 'string' || image instanceof String) &&
      image.includes('data:')) {
    imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = function() {
      this.execute_(canvasInstructions, display);
    };
    return this;
  } else {
    imageElement = /** @type {HTMLCanvasElement|HTMLImageElement|
      HTMLVideoElement} */ (image);
  }
  let canvasInstructions = function() {
    if (opt_width && opt_height) {
      display.drawImage(imageElement, x, y, opt_width, opt_height);
    } else {
      display.drawImage(imageElement, x, y);
    }
  };
  return this.execute_(canvasInstructions, display);
};


/**
 * Draws a point on the stage.
 * @param {number} x The x position of the point.
 * @param {number} y The y position of the point.
 * @param {cwc.framework.simple.Draw.ManipulationContent=}
 *     opt_colorOrManipulation Either a string of the color of the point or a
 *     hash of options for additional manipulation.
 * @param {number} size The size of the point e.g. 2 for a 2x2 point.
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @export
 */
cwc.framework.simple.Draw.prototype.point = function(x, y,
    opt_colorOrManipulation, size = 1) {
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);

  if (!manipulation.hasPreset()) {
    let background_color = cwc.framework.simple.Draw.convertString_(
        opt_colorOrManipulation);
    if (background_color) {
      manipulation.setFillStyle(background_color);
    }
  }
  let canvasInstructions = function() {
    display.fillRect(x, y, size || 1, size || 1);
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
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    let background_color = cwc.framework.simple.Draw.convertString_(
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
  let halfWidth = width / 2;
  let halfHeight = height / 2;
  let centerX = x - halfWidth;
  let centerY = y - halfHeight;
  let middleX = centerX + halfWidth;
  let middleY = centerY + halfHeight;
  let endX = centerX + width;
  let endY = centerY + height;
  let controlX = halfWidth * cwc.config.Number.CIRCULAR_ARCS;
  let controlY = halfHeight * cwc.config.Number.CIRCULAR_ARCS;
  let canvasInstructions = function() {
    display.moveTo(centerX, centerY + halfHeight);
    display.bezierCurveTo( // Top-Left part
        centerX, middleY - controlY, middleX - controlX,
        centerY, middleX, centerY);
    display.bezierCurveTo( // Top-Right part
        middleX + controlX, centerY, endX, middleY - controlY, endX, middleY);
    display.bezierCurveTo( // Bottom-Right part
        endX, middleY + controlY, middleX + controlX, endY, middleX, endY);
    display.bezierCurveTo( // Bottom-Left part
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
  let display = this.getDisplay_();
  let manipulation = cwc.framework.simple.Draw.getManipulations_(
      opt_colorOrManipulation);
  if (!manipulation.hasPreset()) {
    let background_color = cwc.framework.simple.Draw.convertString_(
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
  let canvasInstructions = function() {
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
 * @param {!cwc.framework.simple.DrawManipulation=} opt_manipulations
 * @return {!cwc.framework.simple.Draw} This draw object, for chaining
 *     with other draw operations.
 * @private
 */
cwc.framework.simple.Draw.prototype.execute_ = function(drawFn, display,
    opt_manipulations) {
  if (!display) {
    return this;
  }
  if (opt_manipulations) {
    opt_manipulations.doPre(display);
  }
  drawFn.call(this);
  if (opt_manipulations) {
    opt_manipulations.doPost(display);
  }
  return this;
};


/**
 * Returns the manipulation objects with or without defined presets.
 * @param {cwc.framework.simple.Draw.ManipulationContent|Object=}
 *     opt_manipulation If used, a hash of options for additional manipulations.
 * @return {!cwc.framework.simple.DrawManipulation}
 * @private
 */
cwc.framework.simple.Draw.getManipulations_ = function(opt_manipulation) {
  let manipulations = new cwc.framework.simple.DrawManipulation();
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
