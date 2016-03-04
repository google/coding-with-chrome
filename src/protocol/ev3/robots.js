/**
 * @fileoverview Predefined settings for the different EV3 roboters.
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
goog.provide('cwc.protocol.ev3.Robots');



/**
 * EV3 TRACK3R
 * see http://www.lego.com/de-de/mindstorms/build-a-robot/track3r
 */
cwc.protocol.ev3.Robots['TRACK3R'] = {
  wheel_diameter: 32,
  wheelbase: 156
};


/**
 * GRYO BOY
 * see http://www.lego.com/de-de/mindstorms/build-a-robot/track3r
 */
cwc.protocol.ev3.Robots['GRYO BOY'] = {
  wheel_diameter: 55,
  wheelbase: 75
};
