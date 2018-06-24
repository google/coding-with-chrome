/**
 * @fileoverview Sphero API tests.
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
goog.require('cwc.protocol.sphero.classic.Api');
goog.require('cwc.protocol.virtual.Device');


describe('Sphero api protocol', function() {
  it('constructor', function() {
    let api = new cwc.protocol.sphero.classic.Api();
    expect(typeof api).toEqual('object');
  });

  describe('Connect', function() {
    it('disconnected device', function() {
      let device = new cwc.protocol.virtual.Device();
      expect(device.isConnected()).toEqual(false);
      let api = new cwc.protocol.sphero.classic.Api();
      expect(api.connect(device)).toEqual(false);
      expect(api.isConnected()).toEqual(false);
    });

    it('connected device', function() {
      let device = new cwc.protocol.virtual.Device();
      device.connect();
      expect(device.isConnected()).toEqual(true);
      let api = new cwc.protocol.sphero.classic.Api();
      expect(api.connect(device)).toEqual(true);
      expect(api.isConnected()).toEqual(true);
    });
  });

  describe('commands', function() {
    let api = new cwc.protocol.sphero.classic.Api();
    it('setRGB', function() {
      api.exec('setRGB', {'red': 255});
      api.exec('setRGB', {'red': 255, 'green': 255});
      api.exec('setRGB', {'red': 255, 'green': 255, 'blue': 255});
    });
    it('setBackLed', function() {
      api.exec('setBackLed', {'brightness': 100});
    });
    it('roll', function() {
      api.exec('roll', {'heading': 180});
    });
  });

  it('Disconnect', function() {
    let api = new cwc.protocol.sphero.classic.Api();
    api.disconnect();
    expect(api.isConnected()).toEqual(false);
  });
});
