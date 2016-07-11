/**
 * @fileoverview Connection Manager for different types of connections.
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
goog.provide('cwc.ui.ConnectionManager');

goog.require('cwc.soy.ConnectionManager');
goog.require('cwc.soy.ConnectionManager.Arduino');

goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.object');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.Select');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.ui.ConnectionManager = function(helper) {
  /** @type {string} */
  this.name = 'ConnectionManager';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('connection-manager');

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeToolbar = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {goog.ui.Toolbar} */
  this.toolbar = new goog.ui.Toolbar();

  /** @type {cwc.protocol.bluetooth.Devices} */
  this.bluetoothDevices = null;

  /** @type {cwc.protocol.bluetooth.Device} */
  this.bluetoothDevice = null;

  /** @type {cwc.protocol.Serial.Device} */
  this.serialDevice = null;

  /** @type {function(?)} */
  this.serialDeviceCallback = null;

};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node The target node to add the menu bar.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 * @export
 */
cwc.ui.ConnectionManager.prototype.decorate = function(node,
    opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ConnectionManager.template,
      {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.ConnectionManager.style({ 'prefix': this.prefix }));
  }

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');

  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.render(this.nodeToolbar);
};


/**
 * @param {function(?)=} opt_callback
 * @export
 */
cwc.ui.ConnectionManager.prototype.getMindstorms = function(
    opt_callback) {
  this.prepare_();
  this.showTemplate_('Mindstorms', 'template');
  this.setClickEvent('link-next', this.showMindstormsSelect_);
  this.serialDeviceCallback = opt_callback;
};


/**
 * @param {function(?)=} opt_callback
 * @export
 */
cwc.ui.ConnectionManager.prototype.getArduino = function(
    opt_callback) {
  this.prepare_();
  this.showTemplate_('Arduino', 'template');
  this.setClickEvent('link-next', this.showArduinoPortSelect_);
  this.serialDeviceCallback = opt_callback;
};


/**
 * @private
 */
cwc.ui.ConnectionManager.prototype.showArduinoPortSelect_ = function() {
  this.showTemplate_('Arduino', 'port_select');
  this.updateSerialDevices_();
};


/**
 * @private
 */
cwc.ui.ConnectionManager.prototype.updateSerialDevices_ = function() {
  var serialInstance = this.helper.getInstance('serial');
  if (serialInstance) {
    var serialDeviceNode = goog.dom.getElement(this.prefix +
        'select-serial-device');
    if (serialDeviceNode) {
      goog.soy.renderElement(
          serialDeviceNode,
          cwc.soy.ConnectionManager.serialDeviceWait,
          {'prefix': this.prefix}
      );
    }
    serialInstance.updateDevices();
  }
};


/**
 * @private
 */
cwc.ui.ConnectionManager.prototype.setSerialDeviceOffline_ = function() {
  this.serialDevice = null;
  if (goog.isFunction(this.serialDeviceCallback)) {
    this.serialDeviceCallback(this.serialDevice);
  }
  this.closeWindow_();
};


/**
 * @param {!cwc.protocol.Serial.Devices.devices} devices
 * @export
 */
cwc.ui.ConnectionManager.prototype.setSerialDevices = function(
    devices) {
  var nodeSelectSerialDevice = goog.dom.getElement(this.prefix +
      'select-serial-device');

  if (!nodeSelectSerialDevice) {
    return;
  }

  if (goog.object.isEmpty(devices)) {
    goog.soy.renderElement(
        nodeSelectSerialDevice,
        cwc.soy.ConnectionManager.serialDeviceNone,
        {'prefix': this.prefix}
    );
    this.setClickEvent('link-refresh', this.updateSerialDevices_);
    this.setClickEvent('link-offline', this.setSerialDeviceOffline_);
  } else {
    goog.soy.renderElement(
        nodeSelectSerialDevice,
        cwc.soy.ConnectionManager.serialDevice,
        {'prefix': this.prefix});
    var nodeSerialDevices = goog.dom.getElement(this.prefix + 'serial-devices');
    var deviceList = new goog.ui.Select('Select device …');
    for (var deviceEntry in devices) {
      var device = devices[deviceEntry];
      var menuItem = new goog.ui.MenuItem(
          (device.isSupported()) ? device.getDisplayName() : device.getPath());
      menuItem.setValue(deviceEntry);
      deviceList.addItem(menuItem);
      console.log(device);
    }
    deviceList.render(nodeSerialDevices);

    goog.events.listen(deviceList, goog.ui.Component.EventType.ACTION,
        this.connectSerialDevice_.bind(this));
  }
};


/**
 * @param {Event} event
 * @private
 */
cwc.ui.ConnectionManager.prototype.connectSerialDevice_ = function(
    event) {
  var select = event.target;
  var connection = select.getValue();
  var serialInstance = this.helper.getInstance('serial');
  if (connection && serialInstance) {
    if (this.serialDevice) {
      this.serialDevice.disconnect();
    }
    this.serialDevice = serialInstance.getDevice(connection);
    if (goog.isFunction(this.serialDeviceCallback)) {
      this.serialDeviceCallback(this.serialDevice);
    } else {
      this.serialDevice.connect();
    }
    this.closeWindow_();
  }
};


/**
 * @return {cwc.protocol.Serial.Device}
 */
cwc.ui.ConnectionManager.prototype.getSerialDevice = function() {
  return this.serialDevice;
};


/**
 * @param {!cwc.protocol.Serial.Devices.devices} devices
 * @export
 */
cwc.ui.ConnectionManager.prototype.setBluetoothDevices = function(
    devices) {
  this.bluetoothDevices = devices;
};


/**
 * @private
 */
cwc.ui.ConnectionManager.prototype.prepare_ = function() {
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.decorate(layoutInstance.getOverlay());
  } else {
    console.error('Was not able to get layout instance.');
  }
};


/**
 * @param {!string} template_type
 * @param {!string} template_name
 * @private
 */
cwc.ui.ConnectionManager.prototype.showTemplate_ = function(
    template_type, template_name) {
  if (this.nodeContent && template_type && template_name) {
    /** @type {cwc.soy.ConnectionManager.Arduino} */
    var template = cwc.soy.ConnectionManager[template_type][template_name];

    goog.soy.renderElement(
        this.nodeContent,
        template,
        {'prefix': this.prefix});
    var layoutInstance = this.helper.getInstance('layout');
    if (layoutInstance) {
      layoutInstance.showOverlay(true);
      layoutInstance.setOverlayBackground(
          cwc.ui.LayoutOverlayBackground.TRANSPARENT_50);
    }
  } else {
    console.error('Unable to render template', template_type, template_name);
  }
};


/**
 * @private
 */
cwc.ui.ConnectionManager.prototype.closeWindow_ = function() {
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.showOverlay(false);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function()} event
 * @param {string=} opt_prefix
 * @return {function()}
 */
cwc.ui.ConnectionManager.prototype.setClickEvent = function(name,
    event, opt_prefix) {
  var prefix = opt_prefix || this.prefix;
  var elementName = prefix + name;
  var element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Was not able to find element ' + elementName + '!');
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      event, false, this);
};
