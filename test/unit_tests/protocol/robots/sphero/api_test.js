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
goog.require('cwc.protocol.sphero.Api');
goog.require('cwc.protocol.virtual.Device');


describe('Sphero api protocol', function() {
  let device = new cwc.protocol.virtual.Device();
  let api = new cwc.protocol.sphero.Api();

  describe('Connect', function() {
    it('disconnected device', function() {
      expect(api.connect(device)).toEqual(false);
      expect(api.isConnected()).toEqual(false);
    });

    it('connected device', function() {
      device.connect();
      expect(api.connect(device)).toEqual(true);
      expect(api.isConnected()).toEqual(true);
    });
  });

  describe('commands', function() {
    it('setRGB', function() {
      api.setRGB(255, 0, 0);
      api.setRGB(255, 255, 0);
      api.setRGB(255, 255, 255);
    });
    it('setBackLed', function() {
      api.setBackLed(100);
    });
    it('roll', function() {
      api.roll(0, 180);
    });
  });

  it('Disconnect', function() {
    api.disconnect();
    expect(api.isConnected()).toEqual(false);
  });
});
