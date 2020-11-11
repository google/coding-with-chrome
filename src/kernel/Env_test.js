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
 * @fileoverview Kernel env tests.
 */

import { Env } from './Env';

describe('Kernel: Env', function () {
  it('constructor', function () {
    const env = new Env();
    expect(typeof env).toEqual('object');
  });

  it('.USER', function () {
    const env = new Env();
    expect(env.USER).toEqual('guest');
  });

  it('.HOME', function () {
    const env = new Env();
    expect(env.HOME).toEqual('/home/guest');
  });

  it('.PWD', function () {
    const env = new Env();
    expect(env.PWD).toEqual('/home/guest');
  });

  it('.OLDPWD', function () {
    const env = new Env();
    expect(env.OLDPWD).toEqual('');
    env.setPWD('/home');
    expect(env.OLDPWD).toEqual('/home/guest');
  });

  it('.getEnv()', function () {
    const env = new Env();
    expect(env.getEnv('TERM')).toEqual('xterm-256color');
    expect(env.getEnv('$SHELL')).toEqual('/bin/shell');
  });

  it('.setPWD()', function () {
    const env = new Env();
    expect(env.PWD).toEqual('/home/guest');
    env.setPWD('/home');
    expect(env.PWD).toEqual('/home');
  });

  it('.getPath()', function () {
    const env = new Env();
    const path = env.getPath();
    expect(path[0]).toEqual('/sbin');
    expect(path[1]).toEqual('/bin');
    env.setEnv('PATH', '');
    expect(env.getPath()).toEqual(null);
  });
});
