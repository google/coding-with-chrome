/**
 * @fileoverview Bluetooth adapter constructor.
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
goog.provide('cwc.protocol.bluetooth.Adapter');



/**
 * @param {!cwc.ui.helper} helper
 * @param {!chrome.bluetooth} bluetooth
 * @constructor
 */
cwc.protocol.bluetooth.Adapter = function(helper, bluetooth) {

  /** @type {cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!chrome.bluetooth} */
  this.bluetooth = bluetooth;

  /** @type {!string} */
  this.address = '';

  /** @type {!string} */
  this.name = '';

  /** @type {!boolean} */
  this.powered = false;

  /** @type {!boolean} */
  this.available = false;

  /** @type {!boolean} */
  this.discovering = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!boolean} */
  this.enabled = false;
};


/**
 * @export
 */
cwc.protocol.bluetooth.Adapter.prototype.prepare = function() {
  if (!this.prepared) {
    console.log('Prepare Bluetooth adapter …');
    this.bluetooth.onAdapterStateChanged.addListener(
        this.handleAdapterState_.bind(this));
    this.updateAdapterState();
    this.prepared = true;
  }
};


/**
 * @export
 */
cwc.protocol.bluetooth.Adapter.prototype.updateAdapterState = function() {
  this.bluetooth.getAdapterState(this.handleAdapterState_.bind(this));
};


/**
 * @export
 */
cwc.protocol.bluetooth.Adapter.prototype.getState = function() {

};


/**
 * @param {?} adapter_info
 * @private
 */
cwc.protocol.bluetooth.Adapter.prototype.handleAdapterState_ = function(
    adapter_info) {
  if (!adapter_info) {
    console.log('Error receiving Bluetooth adapter state.');
    return;
  }
  this.address = adapter_info['address'];
  this.name = adapter_info['name'];
  this.powered = adapter_info['powered'];
  this.available = adapter_info['available'];
  this.discovering = adapter_info['discovering'];

  if (adapter_info && this.available && this.powered && !this.enabled) {
    console.log('Enable Bluetooth adapter:', adapter_info);
    this.enabled = true;
    var bluetoothInstance = this.helper.getInstance('bluetooth');
    if (bluetoothInstance) {
      bluetoothInstance.updateDevices();
    }
  } else if (this.enabled || !this.prepared) {
    console.log('Bluetooth adapter is not prepared:', adapter_info);
    this.enabled = false;
  } else if (!this.address) {
    console.log('Found no compatible Bluetooth adapter!');
    console.log(adapter_info);
    this.enabled = false;
  }
  var menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance) {
    menubarInstance.setBluetoothEnabled(this.enabled);
  }
};
