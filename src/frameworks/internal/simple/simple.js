/**
 * @fileoverview Simple JavaScript Framework for Coding with Chrome.
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
goog.provide('cwc.framework.simple.Loader');

goog.require('cwc.framework.simple.Command');
goog.require('cwc.framework.simple.Draw');



/**
 * @export
 */
cwc.framework.simple.Loader.mapFramework = function() {

  /** @type {cwc.framework.simple.Command} */
  var commandFramework = new cwc.framework.simple.Command();

  /** @type {cwc.framework.simple.Draw} */
  var drawFramework = new cwc.framework.simple.Draw();

  if (commandFramework) {
    commandFramework.mapGlobal();
  }
  if (drawFramework) {
    drawFramework.mapGlobal();
  }
};


cwc.framework.simple.Loader.mapFramework();
