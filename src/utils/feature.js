/**
 * @fileoverview Simplified feature detection.
 *
 * This helper class provides shortcuts to get the different of UI elements.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.lib.utils.Feature');


/**
 * @param {string} name
 * @return {boolean|Object|Function}
 * @export
 */
cwc.lib.utils.Feature.getChromeFeature = function(name) {
  if (typeof chrome === 'undefined') {
    return false;
  }
  return cwc.lib.utils.Feature.getFeature(
    name.startsWith('chrome.') ? name : 'chrome.' + name);
};


/**
 * @param {string} name
 * @return {boolean|Object|Function}
 * @export
 */
cwc.lib.utils.Feature.getFeature = function(name) {
  try {
    let feature = Function('return ' + name)();
    if (typeof feature === 'object' || typeof feature === 'function') {
      return feature;
    }
  } catch (error) {
    return false;
  }
  return false;
};
