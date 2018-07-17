/**
 * @fileoverview Framework Sphero tests.
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
goog.require('cwc.framework.Sphero');


describe('Framework: Sphero', function() {
  let code = function() {
    console.log('Sphero ...');
  };
  let testFunction = function() {
    return 123;
  };
  let messengerBuffer = {};

  // Overwrite messenger send func for testing.
  messengerMock = function(name, value, delay) {
    messengerBuffer = {
      'name': name,
      'value': value,
      'delay': delay,
    };
  };

  it('constructor', function() {
    let framework = new cwc.framework.Sphero(code);
    expect(typeof framework).toEqual('object');
  });

  it('onCollision', function() {
    let framework = new cwc.framework.Sphero(code);
    framework.onCollision(testFunction);
    expect(framework.collisionEvent).toEqual(testFunction);
  });

  it('Command: setRGB', function() {
    let framework = new cwc.framework.Sphero(code);
    framework.messenger_.send = messengerMock;
    framework.setRGB(1, 2, 3, false, 4);
    expect(messengerBuffer.name).toEqual('setRGB');
    expect(messengerBuffer.value.red).toEqual(1);
    expect(messengerBuffer.value.green).toEqual(2);
    expect(messengerBuffer.value.blue).toEqual(3);
    expect(messengerBuffer.value.persistent).toEqual(false);
    expect(messengerBuffer.delay).toEqual(4);
  });
});
