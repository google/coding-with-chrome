/**
 * @fileoverview Memory tests.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
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
import { Memory } from './Memory';

describe('Memory', function() {
  it('.set (string)', function() {
    const testMemory = new Memory();
    expect(testMemory.getSize()).toEqual(0);
    testMemory.add('1', 'result1');
    expect(testMemory.getSize()).toEqual(1);
    expect(testMemory.get('1')).toEqual('result1');
    testMemory.add('2', 'result2');
    expect(testMemory.getSize()).toEqual(2);
    expect(testMemory.get('2')).toEqual('result2');
  });

  it('.set (string with expiration)', function() {
    const testMemory = new Memory();
    expect(testMemory.getSize()).toEqual(0);
    testMemory.add('1', 'result1', -1);
    testMemory.add('2', 'result2', 1);
    expect(testMemory.get('1')).toEqual(null);
    expect(testMemory.get('2')).toEqual('result2');
  });

  it('.set (number)', function() {
    const testMemory = new Memory();
    expect(testMemory.getSize()).toEqual(0);
    testMemory.add('1', 1);
    expect(testMemory.getSize()).toEqual(1);
    expect(testMemory.get('1')).toEqual(1);
    testMemory.add('2', 2);
    expect(testMemory.getSize()).toEqual(2);
    expect(testMemory.get('2')).toEqual(2);
  });

  it('.set (number with expiration)', function() {
    const testMemory = new Memory();
    expect(testMemory.getSize()).toEqual(0);
    testMemory.add('1', 1, -1);
    testMemory.add('2', 2, 1);
    expect(testMemory.get('1')).toEqual(null);
    expect(testMemory.get('2')).toEqual(2);
  });
});
