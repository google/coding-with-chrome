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
  var serialInstance = this.helper.getInstance('serial', true);
  var serialDevices = serialInstance.getDevices();
  var devices = {};
  console.log(serialDevices);
  for (let serialDevice in serialDevices) {
    if (serialDevices.hasOwnProperty(serialDevice)) {
      var device = serialDevices[serialDevice];
      devices[device.getPath()] = this.parseDeviceData_(device);
    }
  }

  this.showTemplate_('Connect Serial device',
    cwc.soy.connectScreen.Serial.devices, {
      prefix: this.prefix,
      devices: devices
    });

  var deviceList = goog.dom.getElement(this.prefix + 'device-list');
  goog.events.listen(deviceList, goog.events.EventType.CLICK,
    this.handleAction_.bind(this));
};


/**
 * @param {Event} e
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.handleAction_ = function(e) {
  var target = e.target;
  if (!target || !target.dataset || !target.hasAttribute('data-action')) {
    return;
  }
  var serialInstance = this.helper.getInstance('serial');
  var action = target.dataset['action'];
  var path = target.dataset['path'];
  var device = serialInstance.getDevice(path);
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
  var dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.close();
};


/**
 * @param {!cwc.protocol.serial.Device} device
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.connectDevice_ = function(device) {
  this.close_();
  this.showTemplate_('Connecting serial device',
    cwc.soy.connectScreen.Serial.connect, {
      device: this.parseDeviceData_(device)
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
      device: this.parseDeviceData_(device)
    });
  device.disconnect(true, this.close_.bind(this));
};


/**
 * @param {!string} title
 * @param {Object} template
 * @param {Object} opt_context
 * @private
 */
cwc.ui.connectScreen.Serial.prototype.showTemplate_ = function(title,
    template, opt_context) {
  var dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.showTemplate(title, template, opt_context);
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
    'icon': ''
  };
};
