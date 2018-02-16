/**
 * @fileoverview List of known and supported Bluetooth LE devices.
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
goog.provide('cwc.protocol.bluetoothLE.supportedDevices');


/**
 * @enum {!Object.<!Object>}
 */
cwc.protocol.bluetoothLE.supportedDevices = {
  SPHERO_SPRK_PLUS: {
    name: 'Sphero SPRK+',
    namePrefix: 'SK-',
    icon: 'adjust',
    characteristic: {
      robotControl: {
        commands: '22bb746f-2ba1-7554-2d6f-726568705327',
        response: '22bb746f-2ba6-7554-2d6f-726568705327',
      },
      spheroBLE: {
        antiDOS: '22bb746f-2bbd-7554-2d6f-726568705327',
        antiDOSTimeout: '22bb746f-2bbe-7554-2d6f-726568705327',
        rssi: '22bb746f-2bb6-7554-2d6f-726568705327',
        sleep: '22bb746f-2bb7-7554-2d6f-726568705327',
        txPower: '22bb746f-2bb2-7554-2d6f-726568705327',
        wake: '22bb746f-2bbf-7554-2d6f-726568705327',
      },
    },
    services: {
      robotControl: '22bb746f-2ba0-7554-2d6f-726568705327',
      spheroBLE: '22bb746f-2bb0-7554-2d6f-726568705327',
    },
  },
/*
  SPHERO_OLLIE: {
    namePrefix: '2B-',
  },
  SPHERO_BB8: {
    namePrefix: 'BB-',
  },
  SPHERO_WEBALL {
    namePrefix: '1C-',
  },
*/
};
