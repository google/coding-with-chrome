/**
 * @fileoverview Coding with Chrome editor screen.
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


let cwcChromeSupport = (
  typeof chrome !== 'undefined' &&
  typeof chrome.app !== 'undefined' &&
  typeof chrome.app.window !== 'undefined');

let cwcBuildUi = function() {
  if (cwcChromeSupport) {
    let loader = chrome.app.window.get('loader');
    if (loader) {
      loader.contentWindow.postMessage({'command': 'progress',
        'text': 'Build the Coding with Chrome UI ...',
        'current': 1, 'total': 100}, '*');
    }
    if (typeof cwc == 'undefined') {
      if (loader) {
        loader.contentWindow.postMessage({'command': 'error',
          'msg': 'The cwc namespace is undefined!\n' +
            'Please make sure that the compiler runs without any errors!'},
          '*');
      }
      return null;
    } else if (typeof cwc.ui == 'undefined' ||
               typeof cwc.ui.Builder == 'undefined') {
      if (loader) {
        loader.contentWindow.postMessage({'command': 'error',
          'msg': 'cwc.ui.Builder is undefined!\n' +
            'Maybe an uncaught TypeError, SyntaxError, ... or missing files.'},
          '*');
      }
      return null;
    }
  }
  let uiBuilder = new cwc.ui.Builder();
  uiBuilder.decorate();
  return uiBuilder;
};


let cwcLoadScripts = function() {
  let header = document.getElementsByTagName('head')[0];
  if (header) {
    let loader = cwcChromeSupport && chrome.app.window.get('loader');
    let message = 'Loading additional JavaScripts ...';
    if (loader) {
      loader.contentWindow.postMessage({'command': 'progress',
        'text': message,
        'current': 0, 'total': 100}, '*');
    }
    // Adding main ui script.
    let uiScript = document.createElement('script');
    uiScript.type = 'text/javascript';
    uiScript.src = '../js/cwc_ui.js';
    uiScript.onload = function() {
      // Adding debugging script.
      let debugScript = document.createElement('script');
      debugScript.type = 'text/javascript';
      debugScript.src = '../js/debug.js';
      header.appendChild(debugScript);
    };
    header.appendChild(uiScript);

    if (loader) {
      loader.contentWindow.postMessage({'command': 'progress',
        'text': message,
        'current': 100, 'total': 100}, '*');
    }
  } else {
    console.error('Seems DOM content is not ready!');
  }
};


window.addEventListener('load', cwcBuildUi, false);
document.addEventListener('DOMContentLoaded', cwcLoadScripts, false);
