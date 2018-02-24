/**
 * @fileoverview Coding with Chrome loading screen.
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


/**
 * @constructor
 * @struct
 * @final
 */
let CwcLoader = function() {
  /** @type {Element} */
  this.versionNode = document.getElementById('cwc-version-text');

  /** @type {Element} */
  this.progressBarNode = document.getElementById(
      'cwc-preloader-progress-bar');

  /** @type {Element} */
  this.progressTextNode = document.getElementById(
      'cwc-preloader-progress-text');

  /** @type {Element} */
  this.progressThumbNode = document.getElementById(
      'cwc-preloader-progress-bar-thumb');
};


/**
 *
 */
CwcLoader.prototype.prepare = function() {
  console.log('Loading the Coding with Chrome UI ...');

  if (this.versionNode && chrome.runtime.getManifest) {
    this.versionNode.innerText = chrome.runtime.getManifest();
  }

  document.addEventListener('keypress', this.keyHandler.bind(this), false);
  window.addEventListener('message', this.messageHandler.bind(this), false);
};


/**
 * @param {Event} event
 */
CwcLoader.prototype.keyHandler = function(event) {
  if (event.keyCode == 100) {
    let editor = chrome.app.window.get('editor');
    if (editor) {
      editor.show(true);
      editor.drawAttention();
    }
  }
};


/**
 * @param {Event} event
 */
CwcLoader.prototype.messageHandler = function(event) {
  if (!event.data) {
    return;
  }
  let data = event.data;
  let command = data.command;
  switch (command) {
    case 'progress':
      this.setProgress(data.text, data.current, data.total);
      break;
    case 'close':
      setTimeout(function() {
        let editor = chrome.app.window.get('editor');
        if (editor) {
          editor.show(true);
          editor.drawAttention();
        }
        chrome.app.window.current().close();
      }, 1000);
      break;
    case 'error':
      this.setError(data.msg);
      break;
    default:
      console.log('Command', command, 'is not recognized!');
  }
};


/**
 * @param {!string} text
 * @param {!number} current
 * @param {!number} total
 */
CwcLoader.prototype.setProgress = function(text, current, total) {
  let percent = Math.round((100 / total) * current);
  console.log('[', percent, '%]', text);
  this.setProgressText(text);
  this.setProgressThumb(percent);
};


/**
 * @param {!number} progress
 */
CwcLoader.prototype.setProgressThumb = function(progress) {
  if (this.progressThumbNode) {
    this.progressThumbNode.style.width = progress + '%';
  }
};


/**
 * @param {!string} text
 */
CwcLoader.prototype.setProgressText = function(text) {
  if (this.progressTextNode) {
    this.progressTextNode.innerText = text;
  }
};


/**
 * @param {!string} className
 */
CwcLoader.prototype.setProgressTextClass = function(className) {
  if (this.progressTextNode) {
    this.progressTextNode.className = className;
  }
};


/**
 * @param {!string} text
 */
CwcLoader.prototype.setError = function(text) {
  this.setProgressText(text);
  this.setProgressTextClass('error');
  if (this.progressBarNode) {
    this.progressBarNode.style.display = 'none';
  }
};


document.addEventListener('DOMContentLoaded', function() {
  new CwcLoader().prepare();
}, false);
