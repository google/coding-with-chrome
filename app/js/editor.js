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
  if (typeof cwc == 'undefined') {
    if (loader) {
      loader.contentWindow.postMessage({'command': 'error',
        'msg': 'The cwc namespace is undefined!\n' +
          'Please make sure that the compiler runs without any errors!'},
        '*');
    }
    return null;
  } else if (typeof cwc.ui.Builder == 'undefined') {
    if (loader) {
      loader.contentWindow.postMessage({'command': 'error',
        'msg': 'cwc.ui.Builder is undefined!\n' +
          'Maybe an uncaught TypeError, SyntaxError, ...'},
        '*');
    }
    return null;
  }
  var uiBuilder = new cwc.ui.Builder();
  uiBuilder.decorate(editorNode);
  return uiBuilder;
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
    // Adding main ui script.
    var uiScript = document.createElement('script');
    uiScript.type = 'text/javascript';
    uiScript.src = '../js/cwc_ui.js';
    uiScript.onload = function() {
      // Adding debugging script.
      var debugScript = document.createElement('script');
      debugScript.type = 'text/javascript';
      debugScript.src = '../js/debug.js';
      header.appendChild(debugScript);
    };
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
