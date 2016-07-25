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
var cwcLoader = function() {
  /** @type {element} */
  this.versionNode = document.getElementById('cwc-version-text');

  /** @type {element} */
  this.progressBarNode = document.getElementById(
      'cwc-preloader-progress-bar');

  /** @type {element} */
  this.progressTextNode = document.getElementById(
      'cwc-preloader-progress-text');

  /** @type {element} */
  this.progressThumbNode = document.getElementById(
      'cwc-preloader-progress-bar-thumb');

  /** @type {Object} */
  this.manifest = chrome.runtime.getManifest();
};


/**
 *
 */
cwcLoader.prototype.prepare = function() {
  console.log('Loading the Coding with Chrome UI ...');

  if (this.manifest && this.versionNode) {
    this.versionNode.innerText = this.manifest.version;
  }

  document.addEventListener('keypress', this.keyHandler.bind(this), false);
  window.addEventListener('message', this.messageHandler.bind(this), false);
};


/**
 * @param {Event} event
 */
cwcLoader.prototype.keyHandler = function(event) {
  switch (event.keyCode) {
    case 100:
      var editor = chrome.app.window.get('editor');
      if (editor) {
        editor.show(true);
        editor.drawAttention();
      }
      break;
  }
};


/**
 * @param {Event} event
 */
cwcLoader.prototype.messageHandler = function(event) {
  if (!event.data) {
    return;
  }
  var data = event.data;
  var command = data.command;
  switch (command) {
    case 'progress':
      this.setProgress(data.text, data.current, data.total);
      break;
    case 'close':
      setTimeout(function() {
        var editor = chrome.app.window.get('editor');
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
cwcLoader.prototype.setProgress = function(text, current, total) {
  var percent = Math.round((100 / total) * current);
  console.log('[', percent, '\%]', text);
  this.setProgressText(text);
  this.setProgressThumb(percent);
};


/**
 * @param {!number} progress
 */
cwcLoader.prototype.setProgressThumb = function(progress) {
  if (this.progressThumbNode) {
    this.progressThumbNode.style.width = progress + '\%';
  }
};


/**
 * @param {!string} text
 */
cwcLoader.prototype.setProgressText = function(text) {
  if (this.progressTextNode) {
    this.progressTextNode.innerText = text;
  }
};


/**
 * @param {!string} class_name
 */
cwcLoader.prototype.setProgressTextClass = function(class_name) {
  if (this.progressTextNode) {
    this.progressTextNode.className = class_name;
  }
};


/**
 * @param {!string} text
 */
cwcLoader.prototype.setError = function(text) {
  this.setProgressText(text);
  this.setProgressTextClass('error');
  if (this.progressBarNode) {
    this.progressBarNode.style.display = 'none';
  }
};



document.addEventListener('DOMContentLoaded', function() {
  new cwcLoader().prepare();
}, false);
