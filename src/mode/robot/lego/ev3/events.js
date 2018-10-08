/**
 * @fileoverview Events for the EV3 modification.
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
goog.provide('cwc.mode.lego.ev3.DeviceEvents');
goog.provide('cwc.mode.lego.ev3.SensorEvents');


/**
 * @enum {string}
 */
cwc.mode.lego.ev3.DeviceEvents = {
  CHANGED_DEVICES: 'CHANGED_DEVICES',
};


/**
 * @enum {string}
 */
cwc.mode.lego.ev3.SensorEvents = {
  COL_AMBIENT: 'COL-AMBIENT',
  COL_COLOR: 'COL-COLOR',
  COL_REFLECT: 'COL-REFLECT',
  GYRO_ANG: 'GYRO-ANG',
  GYRO_RATE: 'GYRO-RATE',
  IR_PROX: 'IR-PROX',
  IR_REMOTE: 'IR-REMOTE',
  IR_SEEK: 'IR-SEEK',
  L_MOTOR_DEG: 'L-MOTOR-DEG',
  L_MOTOR_ROT: 'L-MOTOR-ROT',
  M_MOTOR_DEG: 'M-MOTOR-DEG',
  M_MOTOR_ROT: 'M-MOTOR-ROT',
  TOUCH: 'TOUCH',
  US_DIST_CM: 'US-DIST-CM',
  US_DIST_IN: 'US-DIST-IN',
  US_LISTEN: 'US-LISTEN',
};
