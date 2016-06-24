/**
 * @fileoverview Editor mode config for the Coding with Chrome editor.
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
goog.provide('cwc.mode.Config');

goog.require('cwc.file.Type');
goog.require('cwc.mode.ConfigData');



/**
 * @constructor
 * @final
 */
cwc.mode.Config = function() {};


/**
 * @param {!cwc.mode.type} type
 * @param {boolean=} opt_required
 * @return {Object}
 */
cwc.mode.Config.get = function(type, opt_required) {
  if (type in cwc.mode.ConfigData) {
    return cwc.mode.ConfigData[type];
  } else {
    var error = 'Mode config for ' + type + ' is not defined !';
    if (opt_required) {
      throw 'Required ' + error;
    }
    console.warn(error);
  }
  return null;
};


/**
 * @param {cwc.file.Type} file_type
 * @return {cwc.mode.ConfigData}
 */
cwc.mode.Config.getModForFileType = function(file_type) {
  for (var mod in cwc.mode.ConfigData) {
    if (cwc.mode.ConfigData.hasOwnProperty(mod)) {
      var modConfig = cwc.mode.ConfigData[mod];
      if (file_type == modConfig.fileType) {
        return modConfig;
      }
    }
  }
  return null;
};
