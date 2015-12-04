/**
 * @fileoverview Launches the Coding with Chrome editor.
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


chrome.app.runtime.onLaunched.addListener(function(launchData) {
  console.log('launchData', launchData);
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  console.log('Screensize', screenWidth, 'x', screenHeight);
  var editorWidth = 1280;
  var editorHeight = 720;
  var editorConfig = {
    frame: 'none',
    id: 'editor',
    outerBounds: {
      width: editorWidth,
      height: editorHeight
    },
    minWidth: 800,
    minHeight: 600,
    hidden: true
  };
  var loaderWidth = 500;
  var loaderHeight = 170;
  var loaderConfig = {
    frame: 'chrome',
    id: 'loader',
    focused: true,
    resizable: false,
    outerBounds: {
      width: loaderWidth,
      height: loaderHeight,
      left: Math.round((screenWidth - loaderWidth) / 2),
      top: Math.round((screenHeight - loaderHeight) / 2)
    },
    minWidth: loaderWidth,
    minHeight: loaderHeight
  };
  chrome.app.window.create('html/loader.html', loaderConfig, function(
      opt_createdWindow) {
        chrome.app.window.create('html/editor.html', editorConfig);});
});


chrome.runtime.onInstalled.addListener(function() {
  console.log('Thanks for installing Coding with Chrome!');
});
