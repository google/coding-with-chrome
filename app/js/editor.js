/**
 * @fileoverview Coding with Chrome editor screen.
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


var cwcBuildUi = function() {
  var loader = chrome.app.window.get('loader');
  if (loader) {
    loader.contentWindow.postMessage({'command': 'progress',
      'text': 'Build the Coding with Chrome UI ...',
      'current': 1, 'total': 100 }, '*');
  }
  var editorNode = document.getElementById('cwc-editor');
  var uiBuilder = new cwc.ui.Builder();
  uiBuilder.decorate(editorNode);
};


var cwcLoadScripts = function() {
  var header = document.getElementsByTagName('head')[0];
  if (header) {
    var loader = chrome.app.window.get('loader');
    var message = 'Loading additional JavaScripts ...';
    if (loader) {
      loader.contentWindow.postMessage({'command': 'progress',
        'text': message,
        'current': 0, 'total': 100 }, '*');
    }
    var uiScript = document.createElement('script');
    uiScript.type = 'text/javascript';
    uiScript.src = '../js/cwc_ui.js';
    header.appendChild(uiScript);
    if (loader) {
      loader.contentWindow.postMessage({'command': 'progress',
        'text': message,
        'current': 100, 'total': 100 }, '*');
    }
  } else {
    console.error('Seems DOM content is not ready!');
  }
};


window.addEventListener('load', cwcBuildUi, false);
document.addEventListener('DOMContentLoaded', cwcLoadScripts, false);
