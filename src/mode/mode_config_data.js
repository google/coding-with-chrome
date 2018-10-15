/**
 * @fileoverview Editor mode config data for the Coding with Chrome editor.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.ConfigData');

goog.require('cwc.mode.boards.Config');
goog.require('cwc.mode.games.Config');
goog.require('cwc.mode.markup.Config');
goog.require('cwc.mode.programming.Config');
goog.require('cwc.mode.raw.Config');
goog.require('cwc.mode.robot.Config');


/**
 * enum {Object}
 */
cwc.mode.ConfigData = Object.assign({},
  cwc.mode.boards.Config,
  cwc.mode.games.Config,
  cwc.mode.markup.Config,
  cwc.mode.programming.Config,
  cwc.mode.raw.Config,
  cwc.mode.robot.Config,
);
