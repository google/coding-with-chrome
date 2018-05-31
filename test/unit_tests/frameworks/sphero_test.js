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
  let framework = new cwc.framework.Sphero(code);
  let runnerBuffer = {};

  // Overwrite messenger send func for testing.
  framework.messenger_.send = function(name, value, delay) {
    runnerBuffer = {
      'name': name,
      'value': value,
      'delay': delay,
    };
  };

  it('constructor', function() {
    expect(typeof framework).toEqual('object');
  });

  it('onCollision', function() {
    framework.onCollision(testFunction);
    expect(framework.collisionEvent).toEqual(testFunction);
  });

  it('Command: setRGB', function() {
    framework.setRGB(1, 2, 3, false, 4);
    expect(runnerBuffer.name).toEqual('setRGB');
    expect(runnerBuffer.value.red).toEqual(1);
    expect(runnerBuffer.value.green).toEqual(2);
    expect(runnerBuffer.value.blue).toEqual(3);
    expect(runnerBuffer.value.persistent).toEqual(false);
    expect(runnerBuffer.delay).toEqual(4);
  });
});
