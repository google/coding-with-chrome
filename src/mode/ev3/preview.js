/**
 * @fileoverview Preview (Graphics) for EV3 mode
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
 * @author soheiln@google.com (Soheil Norouzi)
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.mode.ev3.Preview');

goog.require('cwc.soy.mode.ev3.Preview');
goog.require('cwc.ui.Runner');
goog.require('cwc.utils.StackQueue');
goog.require('goog.Timer');
goog.require('goog.dom');

goog.require('goog.math');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.mode.ev3.Preview = function(helper) {

  /** @type {string} */
  this.name = 'EV3 Preview';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-preview');

  /** @type {Element} */
  this.node = null;

  /** @type {Object} */
  this.commands = {};

  /** @type {!number} */
  this.width = 400;

  /** @type {!number} */
  this.height = 400;

  /** @type {!boolean} */
  this.penDown = true;

  /**
   * Direction of the pen in degrees from right direction.
   *   e.g. angle 0 represents right direction and angle 90 represents
   *   up direction
   * @type {!number}
   */
  this.direction = -90;

  /** @type {!number} */
  this.lineWidth = 4;

  /** @type {!string} */
  this.lineColor = '#7FFF00';

  /** @type {!string} */
  this.gridColor = '#ECECEC';

  /** @type {!number} */
  this.gridWidth = 0.5;

  /** @type {!number} */
  this.gridSpace = 50;

  /** @type {!string} */
  this.bgColor = '#000000';

  /** @type {!number} */
  this.globalAlpha = 0.5;

  /** @type {!number} */
  this.xPos = 200; //x position

  /** @type {!number} */
  this.yPos = 200; //y position

  /** @type {Element} */
  this.scratchCanvas = null;

  /** @type {Element} */
  this.displayCanvas = null;

  /** @type {Element} */
  this.context2dScratch = null;

  /** @type {Element} */
  this.context2dDisplay = null;

  /** @type {!number} */
  this.pause = 25;

  /** @type {!number} */
  this.bufferIndex = 0;

  /** @type {Array.<Object>} */
  this.commandBuffer = [];

  /** @type {cwc.utils.StackQueue} */
  this.stackQueue = new cwc.utils.StackQueue(this.pause);

  /** @type {!number} */
  this.moveSpeed = 3;

  /** @type {!number} */
  this.rotateSpeed = 3;

  /** @type {!string} */
  this.status = '';

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

};


/**
 * Decorates the Graphics canvases.
 */
cwc.mode.ev3.Preview.prototype.decorate = function() {

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.mode.ev3.Preview.style({ 'prefix': this.prefix }));
  }

  this.displayCanvas = goog.dom.getElement(this.prefix + 'display');
  this.scratchCanvas = goog.dom.getElement(this.prefix + 'scratch');
  this.prepareDisplay();
};


/**
 * Prepares the canvases and draws the grid.
 */
cwc.mode.ev3.Preview.prototype.prepareDisplay = function() {
  this.displayCanvas.setAttribute('width', this.width);
  this.displayCanvas.setAttribute('height', this.height);
  this.scratchCanvas.setAttribute('width', this.width);
  this.scratchCanvas.setAttribute('height', this.height);

  this.context2dDisplay = this.displayCanvas.getContext('2d');
  this.context2dDisplay.globalAlpha = 1;
  this.context2dDisplay.rect(0, 0, this.width, this.height);
  this.context2dDisplay.fillStyle = this.bgColor;
  this.context2dDisplay.fill();

  this.context2dScratch = this.scratchCanvas.getContext('2d');
  this.context2dScratch.globalAlpha = 1;
  this.context2dScratch.rect(0, 0, this.width, this.height);
  this.context2dScratch.fillStyle = this.bgColor;
  this.context2dScratch.fill();
  this.context2dScratch.globalAlpha = this.globalAlpha;

  // draw the grid
  this.context2dScratch.lineWidth = this.gridWidth;
  this.context2dScratch.strokeStyle = this.gridColor;
  for (var x = 0; x < this.width; x = x + this.gridSpace) {
    this.context2dScratch.beginPath();
    this.context2dScratch.moveTo(x, 0);
    this.context2dScratch.lineTo(x, this.height);
    this.context2dScratch.stroke();
  }
  for (var y = 0; y < this.height; y = y + this.gridSpace) {
    this.context2dScratch.beginPath();
    this.context2dScratch.moveTo(0, y);
    this.context2dScratch.lineTo(this.width, y);
    this.context2dScratch.stroke();
  }
  this.context2dDisplay.drawImage(this.scratchCanvas, 0, 0);

  this.penDown = true;
  this.direction = -90;
  this.lineWidth = 4;
  this.lineColor = '#7FFF00';
  this.xPos = 200;
  this.yPos = 200;

  this.addCommands_(); //populates the commands dictionary
  this.drawTurtle_();
};


/**
 * @return {cwc.soy.mode.ev3.Preview.template}
 * @export
 */
cwc.mode.ev3.Preview.prototype.getTemplate = function() {
  return cwc.soy.mode.ev3.Preview.template;
};


/**
 * Sets the penDown attribute.
 * @param {!boolean} flag Boolean flag to set the penDown attribute
 */
cwc.mode.ev3.Preview.prototype.setPenDown = function(flag) {
  this.penDown = flag;
  this.status = 'stopped';
  this.bufferIndex = this.bufferIndex + 1;
  this.execute();
};


/**
 * Sets the line width.
 * @param {!number} width
 */
cwc.mode.ev3.Preview.prototype.setLineWidth = function(width) {
  this.lineWidth = width;
};


/**
 * Sets the line color.
 * @param {!string} color
 */
cwc.mode.ev3.Preview.prototype.setLineColor = function(color) {
  this.lineColor = color;
};


/**
 * Sets the speed of the pen movement.
 * @param {!number} speed
 */
cwc.mode.ev3.Preview.prototype.setSpeed = function(speed) {
  this.moveSpeed = speed;
};


/**
 * Sets the scratch canvas.
 * @param {!Element} canvas
 */
cwc.mode.ev3.Preview.prototype.setScratchCanvas = function(canvas) {
  if (!goog.dom.isElement(canvas)) {
    console.warn(canvas, 'is not an element!');
    return;
  }
  this.scratchCanvas = canvas;
  this.context2dScratch = canvas.getContext('2d');
  this.context2dScratch.globalAlpha = 1;
  this.context2dScratch.rect(0, 0, this.width, this.height);
  this.context2dScratch.fillStyle = this.bgColor;
  this.context2dScratch.fill();
  this.context2dScratch.globalAlpha = this.globalAlpha;
};


/**
 * Sets the display canvas.
 * @param {!Element} canvas
 */
cwc.mode.ev3.Preview.prototype.setDisplayCanvas = function(canvas) {
  if (!goog.dom.isElement(canvas)) {
    console.warn(canvas, 'is not an element!');
    return;
  }
  this.displayCanvas = canvas;
  this.context2dDisplay = canvas.getContext('2d');
  this.context2dDisplay.globalAlpha = 1;
  this.context2dDisplay.rect(0, 0, this.width, this.height);
  this.context2dDisplay.fillStyle = this.bgColor;
  this.context2dDisplay.fill();
};


/**
* Draws the turtle on display canvas.
* @private
*/
cwc.mode.ev3.Preview.prototype.drawTurtle_ = function() {
  var turtleRadius = 10;
  var turtleLineWidth = 2;
  var turtleColor = '#FFFAF0';
  var arcOffset = 30;
  var arcPi = 360 * 2 * Math.PI;
  var arcDirection = goog.math.modulo(this.direction, 360);
  var arcStart = (arcDirection + arcOffset) / arcPi;
  var arcEnd = (arcDirection - arcOffset) / arcPi;

  //draw the turtle arc
  this.context2dDisplay.beginPath();
  this.context2dDisplay.lineWidth = turtleLineWidth;
  this.context2dDisplay.strokeStyle = turtleColor;
  this.context2dDisplay.arc(this.xPos, this.yPos, turtleRadius, arcStart,
      arcEnd);
  this.context2dDisplay.stroke();

  //draw the turtle head
  this.context2dDisplay.beginPath();
  var dX = goog.math.angleDx(this.direction, turtleRadius / 2);
  var dY = goog.math.angleDy(this.direction, turtleRadius) / 2;
  this.context2dDisplay.moveTo(this.xPos + dX, this.yPos + dY);
  this.context2dDisplay.lineTo(this.xPos + 3 * dX, this.yPos + 3 * dY);
  this.context2dDisplay.stroke();

  //print asjusted coordinates and angle
  var adjustedAngle = goog.math.standardAngle(360 - this.direction);
  var coordinates = 'Location:' + Math.floor(this.xPos * 100) / 100.0 +
      ', ' + Math.floor(this.yPos * 100) / 100.0 + ' Angle:' + adjustedAngle;
  this.context2dDisplay.font = '10px';
  this.context2dDisplay.fillStyle = '#FFFFFF';
  this.context2dDisplay.fillText(coordinates, 10, 20);
};


/**
 * Adds commands applicable to graphics.
 * @private
 */
cwc.mode.ev3.Preview.prototype.addCommands_ = function() {
  this.commands = {
    'setPenDown': this.setPenDown.bind(this),
    'rotate': this.rotate.bind(this),
    'move': this.move.bind(this)
  };
};


/**
 * Adds a command to execution buffer and ensures execution.
 * @param {!Object} command command to be added to the execution buffer
 */
cwc.mode.ev3.Preview.prototype.addToBuffer = function(command) {
  this.commandBuffer.push(command);
  this.execute();
};


/**
 * Clears command buffer and resets position.
 */
cwc.mode.ev3.Preview.prototype.clearBuffer = function() {
  this.status = 'running';
  this.commandBuffer = [];
  this.bufferIndex = 0;
  this.direction = -90;
  this.xPos = 200;
  this.yPos = 200;
  this.status = '';
};


/**
 * Executes the commands in the execution buffer based on their order and
 * the index of the current running command until the buffer is empty.
 */
cwc.mode.ev3.Preview.prototype.execute = function() {
  if (this.status == 'running' || (this.status == 'stopped' &&
          this.bufferIndex >= this.commandBuffer.length)) {
    return;
  }

  var nextCommand = this.commandBuffer[this.bufferIndex];
  this.commands[nextCommand['name']](nextCommand['data']);
};


/**
 * Rotates the pen direction
 * @param {Object} data
 *   data['angle'] angle of rotation in degrees
 *   data['direction'] direction of rotation, true for right,
 *   false for left
 */
cwc.mode.ev3.Preview.prototype.rotate = function(data) {
  this.status = 'running';
  var isTurnRight = (data['direction']) ? -1 : 1;
  var numSteps = Math.floor(data['angle'] / this.rotateSpeed);
  var finalDirection = goog.math.standardAngle(this.direction + (
      data['angle'] * isTurnRight));

  var rotateStep = function() {
    this.direction = goog.math.standardAngle(
        this.direction + isTurnRight * this.rotateSpeed);
    this.context2dDisplay.drawImage(this.scratchCanvas, 0, 0);
    this.drawTurtle_();
  }.bind(this);

  var id = setInterval(function() {
    numSteps = numSteps - 1;
    rotateStep();
    if (numSteps <= 0) {
      // adjust the offset (i.e. final direction) for partial degrees
      this.direction = finalDirection;
      this.context2dDisplay.drawImage(this.scratchCanvas, 0, 0);
      this.drawTurtle_();

      //stop the animation loop and ensure execution of next command in buffer
      clearInterval(id);
      this.status = 'stopped';
      this.bufferIndex = this.bufferIndex + 1;
      this.execute();
    }
  }.bind(this), this.pause);
};


/**
 * Moves the pen
 * @param {Object} data
 *   data['distance'] distance of movement
 *   data['direction'] direction of rotation, true for forward,
 *   false for backward
 */
cwc.mode.ev3.Preview.prototype.move = function(data) {
  this.status = 'running';
  var distance = data['steps'];
  var isForward = (data['direction']) ? -1 : 1;
  var finalX = this.xPos + goog.math.angleDx(this.direction,
      distance * isForward);
  var finalY = this.yPos + goog.math.angleDy(this.direction,
      distance * isForward);
  var dX = goog.math.angleDx(this.direction, this.moveSpeed * isForward);
  var dY = goog.math.angleDy(this.direction, this.moveSpeed * isForward);
  var numSteps = Math.floor(distance / this.moveSpeed);
  var moveStep = function(dX, dY) {
    if (this.penDown) {
      this.context2dScratch.beginPath();
      this.context2dScratch.lineWidth = this.lineWidth;
      this.context2dScratch.strokeStyle = this.lineColor;
      this.context2dScratch.moveTo(this.xPos, this.yPos);
      this.context2dScratch.lineTo(this.xPos + dX, this.yPos + dY);
      this.context2dScratch.stroke();
    }
    this.xPos = this.xPos + dX;
    this.yPos = this.yPos + dY;

    //copy scratch canvas to display canvas
    this.context2dDisplay.drawImage(this.scratchCanvas, 0, 0);

    //draw turtle
    this.drawTurtle_();
  }.bind(this);

  var id = setInterval(function() {
    numSteps = numSteps - 1;
    moveStep(dX, dY);
    if (numSteps <= 0) {
      // adjust the offset (i.e. final location) for partial distances
      moveStep(finalX - this.xPos, finalY - this.yPos);

      //stop the animation loop and ensure execution of next command in buffer
      clearInterval(id);
      this.status = 'stopped';
      this.bufferIndex = this.bufferIndex + 1;
      this.execute();
    }
  }.bind(this), this.pause);
};
