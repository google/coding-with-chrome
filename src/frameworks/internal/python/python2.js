/**
 * @fileoverview Python 2.x framework for the messenger instance.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.framework.Python2');

goog.require('cwc.utils.Dialog');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Python2 = function() {
  /** @type {string} */
  this.name = 'Python 2.x Framework';

  /** @type {!cwc.utils.Dialog} */
  this.dialog = new cwc.utils.Dialog();

  /** @type {string} */
  this.lastMsg = '';
};


/**
 * @export
 */
cwc.framework.Python2.prototype.run = function() {
  let pythonCode = document.getElementById('code').textContent.trim();
  let pythonVersion3 = false;

  if (pythonCode.startsWith('#!/usr/bin/python3')) {
    pythonVersion3 = true;
  } else if (pythonCode.startsWith('#!/usr/bin/python2')) {
    pythonVersion3 = false;
  }

  // Add turtle shortcuts, if needed.
  if (pythonCode.includes('from turtle import *\n') &&
      (pythonCode.includes('forward') || pythonCode.includes('backward')) &&
      !pythonCode.includes('Turtle()')) {
    let turtleShortHands = 'from turtle import *\n' +
      'cwcTurtle = Turtle()\n' +
      'def backward(*args): cwcTurtle.backward(*args)\n' +
      'def color(*args): cwcTurtle.color(*args)\n' +
      'def forward(*args): cwcTurtle.forward(*args)\n' +
      'def goto(*args): cwcTurtle.goto(*args)\n' +
      'def left(*args): cwcTurtle.left(*args)\n' +
      'def right(*args): cwcTurtle.right(*args)\n' +
      'def shape(*args): cwcTurtle.shape(*args)\n' +
      'def speed(*args): cwcTurtle.speed(*args)\n';
    pythonCode = pythonCode.replace('from turtle import *\n', turtleShortHands)
      .replace(/‘/g, '\'').replace(/’/g, '\'');
    console.warn('Note: Shortcuts for turtle graphics are enabled.');
  }

  Sk['canvas'] = 'canvas-chrome';
  Sk.configure({
    'debugout': this.showDebug.bind(this),
    'inputfun': this.showInput.bind(this),
    'inputfunTakesPrompt': true,
    'output': this.showOutput.bind(this),
    'uncaughtException': this.showError.bind(this),
    'python3': pythonVersion3,
    'read': this.builtinRead,
  });

  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'content';
  let pythonPromise = Sk.misceval.asyncToPromise(function() {
    return Sk.importMainWithBody('<stdin>', false, pythonCode, true);
  });
  pythonPromise.then(
    function(opt_mod) {
      console.log('Done.');
    },
    function(err) {
      console.error(err.toString());
    }
  );
};


/**
 * @param {string} text
 */
cwc.framework.Python2.prototype.showDebug = function(text) {
  if (text && ! /^\s+$/g.test(text)) {
    this.lastMsg = text;
    console.debug(text);
  }
};


/**
 * @param {string} text
 */
cwc.framework.Python2.prototype.showError = function(text) {
  if (text && ! /^\s+$/g.test(text)) {
    this.lastMsg = text;
    console.error(text);
  }
};


/**
 * @param {string} text
 */
cwc.framework.Python2.prototype.showOutput = function(text) {
  if (text && ! /^\s+$/g.test(text)) {
    this.lastMsg = text;
    console.log(text);
  }
};


/**
 * Prompt user for input.
 * @param {string=} opt_msg
 * @return {Promise}
 */
cwc.framework.Python2.prototype.showInput = function(opt_msg) {
  let msg = opt_msg || this.lastMsg || '';
  this.lastMsg = '';
  return this.dialog.showPrompt('Input', msg);
};


/**
 * @param {string} filename
 * @return {Object}
 */
cwc.framework.Python2.prototype.builtinRead = function(filename) {
  if (Sk.builtinFiles === undefined ||
      Sk.builtinFiles['files'][filename] === undefined) {
    throw new Error('File not found: \'' + filename + '\'');
  }
  return Sk.builtinFiles['files'][filename];
};
