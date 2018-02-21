/**
 * @fileoverview Sphero Commands tests.
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
goog.require('cwc.protocol.sphero.classic.Commands');
goog.require('cwc.utils.ByteTools');


describe('Sphero Commands', function() {
  let commands = new cwc.protocol.sphero.classic.Commands();

  it('constructor', function() {
    expect(typeof commands).toEqual('object');
  });
  it('setRGB', function() {
    let result1 = cwc.utils.ByteTools.toUint8Array([
      255, 254, 2, 32, 0, 5, 255, 0, 0, 0, 217]);
    let result2 = cwc.utils.ByteTools.toUint8Array([
      255, 254, 2, 32, 0, 5, 255, 255, 0, 0, 218]);
    let result3 = cwc.utils.ByteTools.toUint8Array([
      255, 254, 2, 32, 0, 5, 255, 255, 255, 0, 219]);
    expect(getTestBuffer(commands.setRGB(255, 0, 0)))
      .toEqual(result1);
    expect(getTestBuffer(commands.setRGB(255, 255, 0)))
      .toEqual(result2);
    expect(getTestBuffer(commands.setRGB(255, 255, 255)))
      .toEqual(result3);
  });
  it('setBackLed', function() {
    let result = cwc.utils.ByteTools.toUint8Array([
      255, 254, 2, 33, 0, 2, 100, 118]);
    expect(getTestBuffer(commands.setBackLed(100)))
      .toEqual(result);
  });
  it('roll', function() {
    let result = cwc.utils.ByteTools.toUint8Array([
      255, 254, 2, 48, 0, 5, 0, 0, 180, 1, 19]);
    expect(getTestBuffer(commands.roll(0, 180)))
      .toEqual(result);
  });
});
