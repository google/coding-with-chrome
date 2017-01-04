/**
 * @fileoverview Turtle framework for the runner instance.
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

goog.require('cwc.framework.Runner');



/**
 * @param {string=} opt_target
 * @param {Object=} opt_options
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Turtle = function(opt_target, opt_options) {
  /** @type {string} */
  this.name = 'Turtle Framework';

  /** @type {string|undefined} */
  this.target = opt_target;

  /** @type {Object} */
  this.options = opt_options || {
    'panel': false
  };

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner(null, this);

  /** @type {number} */
  this.scale = 1/10;

  /** @type {Function} */
  this.turtle = $['turtle'];

  /** @type {Object} */
  this.turtleTarget = this.turtle(this.target, this.options);

  // Mapping available commands.
  this.runner.addCommand('__reset__', this.reset);
  this.runner.addCommand('fd', this.handleFd_);
  this.runner.addCommand('bk', this.handleBk_);
  this.runner.addCommand('rt', this.handleRt_);
  this.runner.addCommand('lt', this.handleLt_);
  this.runner.addCommand('slide', this.handleSlide_);
  this.runner.addCommand('jump', this.handleJump_);
  this.runner.addCommand('moveto', this.handleMoveto_);
  this.runner.addCommand('jumpto', this.handleJumpto_);
  this.runner.addCommand('turnto', this.handleTurnto_);
  this.runner.addCommand('play', this.handlePlay_);

  // Methods below happen in an instant, but line up in the animation queue.
  this.runner.addCommand('home', this.handleHome_);
  this.runner.addCommand('pen', this.handlePen_);
  this.runner.addCommand('pu', this.handlePu_);
  this.runner.addCommand('pd', this.handlePd_);
  this.runner.addCommand('pe', this.handlePe_);
  this.runner.addCommand('fill', this.handleFill_);
  this.runner.addCommand('dot', this.handleDot_);
  this.runner.addCommand('label', this.handleLabel_);
  this.runner.addCommand('speed', this.handleSpeed_);
  this.runner.addCommand('ht', this.handleHt_);
  this.runner.addCommand('st', this.handleSt_);
  this.runner.addCommand('wear', this.handleWear_);
  this.runner.addCommand('scale', this.handleScale_);
  this.runner.addCommand('twist', this.handleTwist_);
  this.runner.addCommand('mirror', this.handleMirror_);
  this.runner.addCommand('reload', this.handleReload_);
  this.runner.addCommand('done', this.handleDone_);
  this.runner.addCommand('plan', this.handlePlan_);

  // Methods below this line do not queue for animation.
  this.runner.addCommand('getxy', this.handleGetxy_);
  this.runner.addCommand('pagexy', this.handleFd_);
  this.runner.addCommand('bearing', this.handleBearing_);
  this.runner.addCommand('distance', this.handleDistance_);
  this.runner.addCommand('shown', this.handleShown_);
  this.runner.addCommand('hidden', this.handleHidden_);
  this.runner.addCommand('touches', this.handleTouches_);
  this.runner.addCommand('inside', this.handleInside_);
  this.runner.addCommand('nearest', this.handleNearest_);
  this.runner.addCommand('within', this.handleWithin_);
  this.runner.addCommand('notwithin', this.handleNotwithin_);
  this.runner.addCommand('cell', this.handleCell_);
  this.runner.addCommand('hatch', this.handleHatch_);

  // Global Methods
  this.runner.addCommand('cs', this.handleCs_);
  this.runner.addCommand('cg', this.handleCg_);
  this.runner.addCommand('ct', this.handleCt_);
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
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleFd_ = function(distance) {
  this.turtleTarget['fd'](distance);
};


/**
 * Backward relative in local coordinates.
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleBk_ = function(distance) {
  this.turtleTarget['bk'](distance);
};


/**
 * Right turn  relative in local coordinates.
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleRt_ = function(distance) {
  this.turtleTarget['rt'](distance);
};


/**
 * Left turn relative in local coordinates.
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleLt_ = function(distance) {
  this.turtleTarget['lt'](distance);
};


/**
 * Slide right by x while sliding forward by y.
 * @param {!number} x
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleSlide_ = function(x, y) {
  this.turtleTarget['slide'](x, y);
};


/**
 * Like slide, but without drawing.
 * @param {!number} x
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleJump_ = function(x, y) {
  this.turtleTarget['jump'](x, y);
};


/**
 * Absolute motion on page.
 * @param {!number} x
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleMoveto_ = function(x, y) {
  this.turtleTarget['moveto']({pageX:x, pageY:y});
};


/**
 * Like moveto, without drawing.
 * @param {!number} x
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleJumpto_ = function(x, y) {
  this.turtleTarget['jumpto']({pageX:x, pageY:y});
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
 * @param {!string} notes
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
 * @param {!string} color
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
 * @param {!string} color
 * @private
 */
cwc.framework.Turtle.prototype.handleFill_ = function(color) {
  this.turtleTarget['fill'](color);
};


/**
 * Draws a circular dot of diameter 12. Color second arg.
 * @param {!number} diameter
 * @param {string=} color
 * @private
 */
cwc.framework.Turtle.prototype.handleDot_ = function(diameter, color) {
  this.turtleTarget['dot'](diameter, color);
};


/**
 * Prints an HRML label at the turtle location.
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleLabel_ = function(distance) {
  this.turtleTarget['label'](distance);
};


/**
 * Sets turtle animation speed to 10 moves per sec.
 * @param {!number} distance
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
 * @param {!string} color
 * @private
 */
cwc.framework.Turtle.prototype.handleWear_ = function(color) {
  this.turtleTarget['wear'](color);
};


/**
 * Scales turtle size and motion by scale.
 * @param {!number} scale e.g. 1.5 for 150%
 * @private
 */
cwc.framework.Turtle.prototype.handleScale_ = function(scale) {
  this.turtleTarget['scale'](scale);
};


/**
 * Changes which direction is considered "forward".
 * @param {!number} angle
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
 * @param {!string} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleDone_ = function(distance) {
  this.turtleTarget['done'](distance);
};


/**
 * Like each, but this is set to $(elt) instead of alt,
 * and the callback fn can insert into the animation queue.
 * @param {!string} distance
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
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleBearing_ = function(distance) {
  this.turtleTarget['bearing'](distance);
};


/**
 * Distance to p in page coordinates.
 * @param {?} target
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
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleTouches_ = function(y) {
  this.turtleTarget['touches'](y);
};


/**
 * Containment collision test.
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleInside_ = function(y) {
  this.turtleTarget['inside'](y);
};


/**
 * Filters to item (or items if tied) nearest pos.
 * @param {!number} distance
 * @private
 */
cwc.framework.Turtle.prototype.handleNearest_ = function(distance) {
  return this.turtleTarget['nearest'](distance);
};


/**
 * Filters to item with centers within d of t.pagexy().
 * @param {!number} d
 * @param {!number} t
 * @private
 */
cwc.framework.Turtle.prototype.handleWithin_ = function(d, t) {
  this.turtleTarget['within'](d, t);
};


/**
 * The negation of within.
 * @param {!number} d
 * @param {!number} t
 * @private
 */
cwc.framework.Turtle.prototype.handleNotwithin_ = function(d, t) {
  this.turtleTarget['notwithin'](d, t);
};


/**
 * Selects the yth row and xth column cell in a table.
 * @param {!number} x
 * @param {!number} y
 * @private
 */
cwc.framework.Turtle.prototype.handleCell_ = function(x, y) {
  this.turtleTarget['cell'](x, y);
};


/**
 * Creates and returns n turtles with the given img.
 * @param {!number} distance
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
