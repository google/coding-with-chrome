/**
 * @fileoverview Event Types.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 * Constants for event names.
 * @enum {String}
 */
export const EventType = {
  // Mouse events
  CLICK: 'click',
  RIGHTCLICK: 'rightclick',
  DBLCLICK: 'dblclick',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEOVER: 'mouseover',
  MOUSEOUT: 'mouseout',
  MOUSEMOVE: 'mousemove',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',

  // Forms events
  CHANGE: 'change',
  RESET: 'reset',
  SELECT: 'select',
  SUBMIT: 'submit',
  INPUT: 'input',

  // Misc Events
  ERROR: 'error',

  // Service Worker Events
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch'
};
