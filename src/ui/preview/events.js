/**
 * @fileoverview Preview Event definitions.
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.ui.PreviewEvents');

goog.require('cwc.ui.PreviewState');
goog.require('cwc.utils.EventData');


/**
 * @enum {string}
 */
cwc.ui.PreviewEvents.Type = {
  CONTENT_LOAD: 'content_load',
  STATUS_CHANGE: 'status_change',
};


/**
 * @param {!string} preview
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.ui.PreviewEvents.contentLoad = function() {
  return new cwc.utils.EventData(
    cwc.ui.PreviewEvents.Type.CONTENT_LOAD);
};


/**
 * @param {!cwc.ui.PreviewState} status
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.ui.PreviewEvents.statusChange = function(status) {
  return new cwc.utils.EventData(
    cwc.ui.PreviewEvents.Type.STATUS_CHANGE, status);
};
