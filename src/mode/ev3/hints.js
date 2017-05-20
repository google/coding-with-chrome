/**
 * @fileoverview Hints for the EV3 modification.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.ev3.Hints');


/**
 * @enum {!Object.<Function>}
 */
cwc.mode.ev3.Hints = {
  'ev3': {
    'customMoveSteps': function() {},
    'customRotateAngle': function() {},
    'drawImage': function() {},
    'getColorSensorValue': function() {},
    'getGyroSensorValue': function() {},
    'getIrSensorValue': function() {},
    'getTouchSensorValue': function() {},
    'getUltrasonicSensorValue': function() {},
    'moveDistance': function() {},
    'movePen': function() {},
    'movePower': function() {},
    'moveServo': function() {},
    'moveSteps': function() {},
    'onColorSensorChange': function() {},
    'onGyroSensorChange': function() {},
    'onIrSensorChange': function() {},
    'onTouchSensorChange': function() {},
    'onUltrasonicSensorChange': function() {},
    'playSound': function() {},
    'playTone': function() {},
    'rotateAngle': function() {},
    'rotatePower': function() {},
    'rotateSteps': function() {},
    'setColorSensorMode': function() {},
    'setIrSensorMode': function() {},
    'setLed': function() {},
    'setRobotModel': function() {},
    'setRobotType': function() {},
    'setStepSpeed': function() {},
    'setUltrasonicSensorMode': function() {},
    'setWheelDiameter': function() {},
    'setWheelbase': function() {},
    'stop': function() {},
    'stopUltrasonicSensorEvent': function() {},
    'wait': function() {},
  },
};
