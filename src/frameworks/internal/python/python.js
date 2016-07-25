/**
 * @fileoverview Python framework for the runner instance.
 *
 * @license Copyright 2016 Google Inc. All Rights Reserved.
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
goog.provide('cwc.framework.Python');

goog.require('cwc.utils.Dialog');



/**
 * @constructor
 * @struct
 * @final
 */
cwc.framework.Python = function() {
  /** @type {string} */
  this.name = 'Python Framework';

  /** @type {!cwc.utils.Dialog} */
  this.dialog = new cwc.utils.Dialog();

  /** @type {!string} */
  this.lastMsg = '';
};


/**
 * @export
 */
cwc.framework.Python.prototype.run = function() {
  var pythonCode = document.getElementById('code').textContent.trim();
  var pythonVersion3 = false;

  if (pythonCode.startsWith('#!/usr/bin/python3')) {
    pythonVersion3 = true;
  } else if (pythonCode.startsWith('#!/usr/bin/python2')) {
    pythonVersion3 = false;
  }

  Sk['canvas'] = 'canvas-chrome';
  //Sk.outputfun = this.dialog.showContent;
  Sk.configure({
    'debugout': this.showDebug.bind(this),
    'inputfun': this.showInput.bind(this),
    'output': this.showOutput.bind(this),
    'uncaughtException': this.showError.bind(this),
    'python3': pythonVersion3,
    'read': this.builtinRead
  });

  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'content';
  var pythonPromise = Sk.misceval.asyncToPromise(function() {
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
 * @param {!string} text
 */
cwc.framework.Python.prototype.showDebug = function(text) {
  if (text && ! /^\s+$/g.test(text)) {
    this.lastMsg = text;
    console.debug(text);
  }
};


/**
 * @param {!string} text
 */
cwc.framework.Python.prototype.showError = function(text) {
  if (text && ! /^\s+$/g.test(text)) {
    this.lastMsg = text;
    console.error(text);
  }
};


/**
 * @param {!string} text
 */
cwc.framework.Python.prototype.showOutput = function(text) {
  if (text && ! /^\s+$/g.test(text)) {
    this.lastMsg = text;
    console.log(text);
  }
};


/**
 * @param {!string} text
 */
cwc.framework.Python.prototype.showInput = function() {
  var msg = this.lastMsg || '';
  this.lastMsg = '';
  return this.dialog.showPrompt('Input', msg);
};


/**
 * @param {!string} file_name
 */
cwc.framework.Python.prototype.builtinRead = function(file_name) {
  if (Sk.builtinFiles === undefined ||
      Sk.builtinFiles['files'][file_name] === undefined) {
    throw 'File not found: \'' + file_name + '\'';
  }
  return Sk.builtinFiles['files'][file_name];
};
