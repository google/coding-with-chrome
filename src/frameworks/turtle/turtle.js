/**
 * @fileoverview Turtle framework for the messenger instance.
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
goog.provide('cwc.framework.Turtle');


/**
 * @param {string=} target
 * @param {Object=} options
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Turtle = function(target, options) {
  /** @type {string} */
  this.name = 'Turtle Framework';

  /** @type {string|undefined} */
  this.target = target;

  /** @type {Object} */
  this.options = options || {
    'panel': false,
  };

  /** @type {number} */
  this.scale = 1/10;

  /** @type {Function} */
  this.turtle = $['turtle'];

  /** @type {Object} */
  this.turtleTarget = this.turtle(this.target, this.options);

  /** @private {Object} */
  this.listener_ = {};

  // Global mapping
  window['turtleTarget'] = this.turtleTarget;

  if (!this.turtle || !this.turtleTarget) {
    console.error('Turtle library is not ready!');
  }

  // Add turtle command listener
  this.addListener();

  // Message handler
  window.addEventListener('message', this.handleMessage_.bind(this), false);

  this.reset();
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.framework.Turtle.prototype.handleMessage_ = function(event) {
  if (!event) {
    throw new Error('Was not able to get browser event!');
  }
  this.listener_[event['data']['name']](event['data']['value']);
};


cwc.framework.Turtle.prototype.addListener = function() {
  // Mapping available commands.
  this.listener_['reset'] = this.reset.bind(this);
  this.listener_['fd'] = this.handleFd_.bind(this);
  this.listener_['bk'] = this.handleBk_.bind(this);
  this.listener_['rt'] = this.handleRt_.bind(this);
  this.listener_['lt'] = this.handleLt_.bind(this);
  this.listener_['slide'] = this.handleSlide_.bind(this);
  this.listener_['jump'] = this.handleJump_.bind(this);
  this.listener_['moveto'] = this.handleMoveto_.bind(this);
  this.listener_['jumpto'] = this.handleJumpto_.bind(this);
  this.listener_['turnto'] = this.handleTurnto_.bind(this);
  this.listener_['play'] = this.handlePlay_.bind(this);

  // Custom commands
  this.listener_['moveToXY'] = this.handleMoveToXY_.bind(this);

  // Methods below happen in an instant, but line up in the animation queue.
  this.listener_['home'] = this.handleHome_.bind(this);
  this.listener_['pen'] = this.handlePen_.bind(this);
  this.listener_['pu'] = this.handlePu_.bind(this);
  this.listener_['pd'] = this.handlePd_.bind(this);
  this.listener_['pe'] = this.handlePe_.bind(this);
  this.listener_['fill'] = this.handleFill_.bind(this);
  this.listener_['dot'] = this.handleDot_.bind(this);
  this.listener_['label'] = this.handleLabel_.bind(this);
  this.listener_['speed'] = this.handleSpeed_.bind(this);
  this.listener_['ht'] = this.handleHt_.bind(this);
  this.listener_['st'] = this.handleSt_.bind(this);
  this.listener_['wear'] = this.handleWear_.bind(this);
  this.listener_['scale'] = this.handleScale_.bind(this);
  this.listener_['twist'] = this.handleTwist_.bind(this);
  this.listener_['mirror'] = this.handleMirror_.bind(this);
  this.listener_['reload'] = this.handleReload_.bind(this);
  this.listener_['done'] = this.handleDone_.bind(this);
  this.listener_['plan'] = this.handlePlan_.bind(this);

  // Methods below this line do not queue for animation.
  this.listener_['getxy'] = this.handleGetxy_.bind(this);
  this.listener_['pagexy'] = this.handleFd_.bind(this);
  this.listener_['bearing'] = this.handleBearing_.bind(this);
  this.listener_['distance'] = this.handleDistance_.bind(this);
  this.listener_['shown'] = this.handleShown_.bind(this);
  this.listener_['hidden'] = this.handleHidden_.bind(this);
  this.listener_['touches'] = this.handleTouches_.bind(this);
  this.listener_['inside'] = this.handleInside_.bind(this);
  this.listener_['nearest'] = this.handleNearest_.bind(this);
  this.listener_['within'] = this.handleWithin_.bind(this);
  this.listener_['notwithin'] = this.handleNotwithin_.bind(this);
  this.listener_['cell'] = this.handleCell_.bind(this);
  this.listener_['hatch'] = this.handleHatch_.bind(this);

  // Global Methods
  this.listener_['cs'] = this.handleCs_.bind(this);
  this.listener_['cg'] = this.handleCg_.bind(this);
  this.listener_['ct'] = this.handleCt_.bind(this);
};


/**
 * Resets the turtle and the screen.
 * @export
 */
cwc.framework.Turtle.prototype.reset = function() {
  this.handleCg_();
  this.turtleTarget.show();
  this.handleHome_();
};


/**
 * Forward relative in local coordinates.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleFd_ = function(distance) {
  this.turtleTarget['fd'](distance);
};


/**
 * Backward relative in local coordinates.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleBk_ = function(distance) {
  this.turtleTarget['bk'](distance);
};


/**
 * Right turn  relative in local coordinates.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleRt_ = function(distance) {
  this.turtleTarget['rt'](distance);
};


/**
 * Left turn relative in local coordinates.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleLt_ = function(distance) {
  this.turtleTarget['lt'](distance);
};


/**
 * Slide right by x while sliding forward by y.
 * @param {number} x
 * @param {number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleSlide_ = function(x, y) {
  this.turtleTarget['slide'](x, y);
};


/**
 * Like slide, but without drawing.
 * @param {number} x
 * @param {number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleJump_ = function(x, y) {
  this.turtleTarget['jump'](x, y);
};


/**
 * Absolute motion on page.
 * @param {Object} data
 * @private
 */
cwc.framework.Turtle.prototype.handleMoveto_ = function(data) {
  this.turtleTarget['moveto']({
    'pageX': data['x'],
    'pageY': data['y'],
  });
};


/**
 * X/Y motion on page.
 * @param {Object} data
 * @private
 */
cwc.framework.Turtle.prototype.handleMoveToXY_ = function(data) {
  this.turtleTarget['moveto'](data['x'], data['y']);
};


/**
 * Like moveto, without drawing.
 * @param {number} x
 * @param {number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleJumpto_ = function(x, y) {
  this.turtleTarget['jumpto']({pageX: x, pageY: y});
};


/**
 * Absolute direction adjustment.
 * @param {!Object|number|string} target
 * @private
 */
cwc.framework.Turtle.prototype.handleTurnto_ = function(target) {
  this.turtleTarget['turnto'](target);
};


/**
 * Plays notes using ABC notation and waits until done.
 * @param {string} notes
 * @private
 */
cwc.framework.Turtle.prototype.handlePlay_ = function(notes) {
  this.turtleTarget['play'](notes);
};


/**
 * Jumps to the center of the document, with bearing 0.
 * @private
 */
cwc.framework.Turtle.prototype.handleHome_ = function() {
  this.turtleTarget['home']();
};


/**
 * Sets a pen style, or `none` for no drawing.
 * @param {string} color
 * @private
 */
cwc.framework.Turtle.prototype.handlePen_ = function(color) {
  this.turtleTarget['pen'](color);
};


/**
 * Pen up - temporarily disables the pen (also pen(false))
 * @private
 */
cwc.framework.Turtle.prototype.handlePu_ = function() {
  this.turtleTarget['pu']();
};


/**
 * Pen down - starts a new pen path.
 * @private
 */
cwc.framework.Turtle.prototype.handlePd_ = function() {
  this.turtleTarget['pd']();
};


/**
 * Uses the pen `erase` style.
 * @private
 */
cwc.framework.Turtle.prototype.handlePe_ = function() {
  this.turtleTarget['pe']();
};


/**
 * Fills a shape previously outlines using pen (`path`).
 * @param {string} color
 * @private
 */
cwc.framework.Turtle.prototype.handleFill_ = function(color) {
  this.turtleTarget['fill'](color);
};


/**
 * Draws a circular dot of diameter 12. Color second arg.
 * @param {number} diameter
 * @param {string=} color
 * @private
 */
cwc.framework.Turtle.prototype.handleDot_ = function(diameter, color) {
  this.turtleTarget['dot'](diameter, color);
};


/**
 * Prints an HRML label at the turtle location.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleLabel_ = function(distance) {
  this.turtleTarget['label'](distance);
};


/**
 * Sets turtle animation speed to 10 moves per sec.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleSpeed_ = function(distance) {
  this.turtleTarget['speed'](distance);
};


/**
 * Hides the turtle.
 * @private
 */
cwc.framework.Turtle.prototype.handleHt_ = function() {
  this.turtleTarget['ht']();
};


/**
 * Shows the turtle.
 * @private
 */
cwc.framework.Turtle.prototype.handleSt_ = function() {
  this.turtleTarget['st']();
};


/**
 * Switches to a blue shell. Use any image or color.
 * @param {string} color
 * @private
 */
cwc.framework.Turtle.prototype.handleWear_ = function(color) {
  this.turtleTarget['wear'](color);
};


/**
 * Scales turtle size and motion by scale.
 * @param {number} scale e.g. 1.5 for 150%
 * @private
 */
cwc.framework.Turtle.prototype.handleScale_ = function(scale) {
  this.turtleTarget['scale'](scale);
};


/**
 * Changes which direction is considered "forward".
 * @param {number} angle
 * @private
 */
cwc.framework.Turtle.prototype.handleTwist_ = function(angle) {
  this.turtleTarget['twist'](angle);
};


/**
 * Flips the turtle across its main axis.
 * @private
 */
cwc.framework.Turtle.prototype.handleMirror_ = function() {
  this.turtleTarget['mirror']();
};


/**
 * Reloads the turtles image (restarting animated gift)
 * @private
 */
cwc.framework.Turtle.prototype.handleReload_ = function() {
  this.turtleTarget['reload']();
};


/**
 * Like $(q).promise().done(fn). Calls after all animation.
 * @param {string} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleDone_ = function(distance) {
  this.turtleTarget['done'](distance);
};


/**
 * Like each, but this is set to $(elt) instead of alt,
 * and the callback fn can insert into the animation queue.
 * @param {string} distance
 * @private
 */
cwc.framework.Turtle.prototype.handlePlan_ = function(distance) {
  this.turtleTarget['plan'](distance);
};


/**
 * Local (center-y-up [x, y]) coordinates of the turtle.
 * @private
 */
cwc.framework.Turtle.prototype.handleGetxy_ = function() {
  this.turtleTarget['getxy']();
};


/**
 * Page (topleft-y-down {pageX:x, pageY:y}) coordinates.
 * @private
 */
cwc.framework.Turtle.prototype.handlePafexy_ = function() {
  this.turtleTarget['pagexy']();
};


/**
 * The turtles absolute direction (or direction toward p).
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleBearing_ = function(distance) {
  this.turtleTarget['bearing'](distance);
};


/**
 * Distance to p in page coordinates.
 * @param {?} target
 * @return {number}
 * @private
 */
cwc.framework.Turtle.prototype.handleDistance_ = function(target) {
  return this.turtleTarget['distance'](target);
};


/**
 * Shorthand for is(":visible")
 * @private
 */
cwc.framework.Turtle.prototype.handleShown_ = function() {
  this.turtleTarget['shown']();
};


/**
 * Shorthand for !is(":visible")
 * @private
 */
cwc.framework.Turtle.prototype.handleHidden_ = function() {
  this.turtleTarget['hidden']();
};


/**
 * Collision tests elements (uses turleHull if present).
 * @param {number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleTouches_ = function(y) {
  this.turtleTarget['touches'](y);
};


/**
 * Containment collision test.
 * @param {number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleInside_ = function(y) {
  this.turtleTarget['inside'](y);
};


/**
 * Filters to item (or items if tied) nearest pos.
 * @param {number} distance
 * @return {number}
 * @private
 */
cwc.framework.Turtle.prototype.handleNearest_ = function(distance) {
  return this.turtleTarget['nearest'](distance);
};


/**
 * Filters to item with centers within d of t.pagexy().
 * @param {number} d
 * @param {number} t
 * @private
 */
cwc.framework.Turtle.prototype.handleWithin_ = function(d, t) {
  this.turtleTarget['within'](d, t);
};


/**
 * The negation of within.
 * @param {number} d
 * @param {number} t
 * @private
 */
cwc.framework.Turtle.prototype.handleNotwithin_ = function(d, t) {
  this.turtleTarget['notwithin'](d, t);
};


/**
 * Selects the yth row and xth column cell in a table.
 * @param {number} x
 * @param {number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleCell_ = function(x, y) {
  this.turtleTarget['cell'](x, y);
};


/**
 * Creates and returns n turtles with the given img.
 * @param {number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleHatch_ = function(distance) {
  this.turtleTarget['hatch'](distance);
};


/**
 * Clears the screen, both the canvas and the body text.
 * @private
 */
cwc.framework.Turtle.prototype.handleCs_ = function() {
  this.turtle['cs']();
};


/**
 * Clears the graphics canvas without clearing the text.
 * @private
 */
cwc.framework.Turtle.prototype.handleCg_ = function() {
  this.turtle['cg']();
};


/**
 * Clears the text without clearing the canvas.
 * @private
 */
cwc.framework.Turtle.prototype.handleCt_ = function() {
  this.turtle['ct']();
};
