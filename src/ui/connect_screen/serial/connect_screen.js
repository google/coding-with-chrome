/**
 * @fileoverview Connect Screen for serial devices.
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
goog.provide('cwc.ui.connectScreen.Serial');

goog.require('cwc.soy.connectScreen.Serial');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.ui.connectScreen.Serial = function(helper) {
  /** @type {string} */
  this.name = 'ConnectScreenSerial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('connectScreenSerial');
};


/**
 * Shows serial connect screen.
 */
cwc.ui.connectScreen.Serial.prototype.showDevices = function() {
  let serialInstance = this.helper.getInstance('serial', true);
  let serialDevices = serialInstance.getDevices();
  let devices = {};
  for (let serialDevice in serialDevices) {
    if (serialDevices.hasOwnProperty(serialDevice)) {
      let device = serialDevices[serialDevice];
      devices[device.getPath()] = this.parseDeviceData_(device);
    }
  }

  this.showTemplate_('Connect serial device',
    cwc.soy.connectScreen.Serial.devices, {
      prefix: this.prefix,
      devices: devices,
    });

  let deviceList = goog.dom.getElement(this.prefix + 'device-list');
  goog.events.listen(deviceList, goog.events.EventType.CLICK,
    this.handleAction_.bind(this));
};


/**
 * @param {Event} e
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.handleAction_ = function(e) {
  let target = e.target;
  if (!target || !target.dataset || !target.hasAttribute('data-action')) {
    return;
  }
  let serialInstance = this.helper.getInstance('serial');
  let action = target.dataset['action'];
  let path = target.dataset['path'];
  let device = serialInstance.getDevice(path);
  if (!device) {
    return;
  }
  switch (action) {
    case 'connect':
      this.connectDevice_(device);
      break;
    case 'disconnect':
      this.disconnectDevice_(device);
      break;
    default:
      console.log(target.dataset);
  }
};


/**
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.close_ = function() {
  this.helper.getInstance('dialog').close();
};


/**
 * @param {!cwc.protocol.serial.Device} device
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.connectDevice_ = function(device) {
  this.close_();
  this.showTemplate_('Connecting serial device',
    cwc.soy.connectScreen.Serial.connect, {
      device: this.parseDeviceData_(device),
    });
  device.connect(this.close_.bind(this));
};


/**
 * @param {!cwc.protocol.serial.Device} device
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.disconnectDevice_ = function(device) {
  this.close_();
  this.showTemplate_('Disconnecting serial device',
    cwc.soy.connectScreen.Serial.disconnect, {
      device: this.parseDeviceData_(device),
    });
  device.disconnect(true, this.close_.bind(this));
};


/**
 * @param {!string} title
 * @param {Object} template
 * @param {Object} context
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.showTemplate_ = function(title,
    template, context) {
  this.helper.getInstance('dialog').showTemplate(title, template, context);
};


/**
 * @param {!cwc.protocol.serial.Device} device
 * @return {Object}
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.parseDeviceData_ = function(device) {
  return {
    'name': device.getName(),
    'path': device.getPath(),
    'connected': device.isConnected(),
    'type': '',
    'icon': '',
  };
};
