/**
 * @fileoverview Stack Type unit tests.
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

import { StackType } from './StackType';

describe('StackType', function() {
  it('Type: Is valid object type', function() {
    expect(typeof StackType).toEqual('object');
  });

  it('Type: CMD', function() {
    expect(StackType.CMD).toEqual('cmd');
  });

  it('Type: DELAY', function() {
    expect(StackType.DELAY).toEqual('delay');
  });

  it('Type: PROMISE', function() {
    expect(StackType.PROMISE).toEqual('promise');
  });

  it('Type: PROMISE_RAISE_ERROR', function() {
    expect(StackType.PROMISE_RAISE_ERROR).toEqual('promise_raise_error');
  });

  it('Type: UNKNOWN', function() {
    expect(StackType.UNKNOWN).toEqual('');
  });
});
