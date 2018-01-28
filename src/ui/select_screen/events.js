/**
 * @fileoverview Select screen Event definitions.
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
goog.provide('cwc.ui.SelectScreen.Events');


/**
 * @enum {string}
 */
cwc.ui.SelectScreen.Events.Type = {
  VIEW_CHANGE: 'view_change',
};


/**
 * @param {Object} data
 * @return {!cwc.ui.SelectScreen.Events.Data_}
 * @final
 */
cwc.ui.SelectScreen.Events.changeView = function(data) {
  return new cwc.ui.SelectScreen.Events.Data_(
      cwc.ui.SelectScreen.Events.Type.VIEW_CHANGE, data);
};


/**
 * @param {!cwc.ui.SelectScreen.Events.Type} type
 * @param {Object|number=} data
 * @constructor
 * @final
 * @private
 */
cwc.ui.SelectScreen.Events.Data_ = function(type, data = {}) {
  /** @type {!cwc.ui.SelectScreen.Events.Type} */
  this.type = type;

  /** @type {Object|number} */
  this.data = data;
};
