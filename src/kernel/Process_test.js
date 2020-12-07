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
 * @fileoverview Process tests.
 */
import { ProcessManager } from './Process';

describe('ProcessManager', function () {
  it('constructor', function () {
    const process = new ProcessManager();
    expect(typeof process).toEqual('object');
  });

  it('.registerProcess()', function () {
    const processManager = new ProcessManager();
    const test = function () {
      return 'hello world!';
    };
    const process = processManager.registerProcess(test, 123);
    expect(process.process).toEqual(test);
    expect(process.pid).toEqual(1);
    expect(process.ppid).toEqual(123);
  });

  it('.updateProcess()', function () {
    const processManager = new ProcessManager();
    const test = function () {
      return 'hello world!';
    };
    let process = processManager.registerProcess(test, 123);
    expect(process.process).toEqual(test);
    expect(process.pid).toEqual(1);
    expect(process.ppid).toEqual(123);
    process = processManager.updateProcess(process.pid, test, 321);
    expect(process.process).toEqual(test);
    expect(process.pid).toEqual(1);
    expect(process.ppid).toEqual(321);
  });
});
