/**
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Virtual Terminal for the kernel tests.
 */
import { Terminal } from './Terminal';

describe('Terminal', function () {
  it('constructor', function () {
    const terminal = new Terminal();
    expect(typeof terminal).toEqual('object');
  });

  it('writeResponse()', function () {
    const terminal = new Terminal();
    terminal.writeResponse('test 123');
    expect(typeof terminal).toEqual('object');
  });

  it('lock()', function () {
    const terminal = new Terminal();
    expect(terminal.locked).toEqual(false);
    terminal.lock();
    expect(terminal.locked).toEqual(true);
  });

  it('unlock()', function () {
    const terminal = new Terminal();
    terminal.locked = true;
    expect(terminal.locked).toEqual(true);
    terminal.unlock();
    expect(terminal.locked).toEqual(false);
  });
});
