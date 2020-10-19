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
 * @fileoverview Shell tests.
 */
import { Shell } from './Shell';

describe('Shell', function () {
  it('.handleInput (test)', function () {
    const shell = new Shell();
    const input = 'test';
    const { args, options } = shell.handleInput(input);
    expect(args).toEqual(['test']);
    expect(options.size).toBe(0);
  });

  it('.handleInput (--help)', function () {
    const shell = new Shell();
    const input = '--help';
    const { args, options } = shell.handleInput(input);
    expect(args).toEqual([]);
    expect(options.size).toBe(1);
    expect(options.has('help')).toBe(true);
  });

  it('.handleInput (--help test123 --version test321)', function () {
    const shell = new Shell();
    const input = '--help test123 --version test321';
    const { args, options } = shell.handleInput(input);
    expect(args).toEqual(['test123', 'test321']);
    expect(options.size).toBe(2);
    expect(options.has('help')).toBe(true);
    expect(options.has('version')).toBe(true);
  });
});
