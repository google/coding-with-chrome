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
 * @fileoverview Kernel app tests.
 */

import { App } from './App';

describe('Kernel: App', function () {
  it('constructor', function () {
    const app = new App(null, null, 'test app');
    expect(typeof app).toEqual('object');
    expect(typeof app.env).toEqual('object');
    expect(app.terminal).toEqual(null);
    expect(app.name).toEqual('test app');
  });

  it('.initHandler()', function () {
    const app = new App();
    expect(app.initialized).toEqual(false);
    app.initHandler();
    expect(app.initialized).toEqual(true);
  });

  it('.register()', function () {
    const app = new App();
    expect(app.registered).toEqual(false);
    app.register();
    expect(app.registered).toEqual(true);
  });

  it('.registerEnv()', function () {
    const app = new App();
    expect(typeof app.env).toEqual('object');
    app.registerEnv(null);
    expect(app.env).toEqual(null);
  });

  it('.registerTerminal()', function () {
    const app = new App();
    const terminal = function () {
      return 123;
    };
    expect(app.terminal).toEqual(null);
    app.registerTerminal(terminal);
    expect(app.terminal).toEqual(terminal);
  });

  it('.runHandler(--help)', function () {
    const app = new App();
    app.runHandler('test', [], new Map([['help']])).then((result) => {
      expect(result).toEqual(`Usage: ${app.name} [OPTION]... [ARGS]...`);
    });
  });

  it('.runHandler(--version)', function () {
    const app = new App();
    app.runHandler('test', [], new Map([['version']])).then((result) => {
      expect(result).toEqual('Version: 1.0');
    });
  });

  it('.runHandler()', function () {
    const app = new App();
    app.runHandler('test', [1, 2, 3]).then((result) => {
      expect(result.input).toEqual('test');
      expect(result.args).toEqual([1, 2, 3]);
      expect(result.options).toEqual(new Map());
    });
  });

  it('.run()', function (done) {
    const app = new App();
    app.run('test', [1, 2, 3]).then((result) => {
      expect(result.input).toEqual('test');
      expect(result.args).toEqual([1, 2, 3]);
      expect(result.options).toEqual(new Map());
      done();
    });
  });

  it('.autocomplete()', function (done) {
    const app = new App();
    app.autocomplete('test', [1, 2, 3]).then((result) => {
      expect(result.input).toEqual('test');
      expect(result.args).toEqual([1, 2, 3]);
      expect(result.options).toEqual(new Map());
      done();
    });
  });

  it('.showHelp()', function () {
    const app = new App();
    let output = '';
    expect(output).toEqual('');
    app.write = (text) => {
      output = text;
    };
    app.showHelp();
    expect(output).toEqual(`Usage: ${app.name} [OPTION]... [ARGS]...`);
  });

  it('.showVersion()', function () {
    const app = new App();
    let output = '';
    expect(output).toEqual('');
    app.write = (text) => {
      output = text;
    };
    app.showVersion();
    expect(output).toEqual('Version: 1.0');
  });

  it('.write()', function () {
    const app = new App();
    let output = '';
    const terminal = function () {
      output = '';
    };
    terminal.write = function (text) {
      output = text;
    };
    app.registerTerminal(terminal);
    expect(output).toEqual('');
    app.write('test 123');
    expect(output).toEqual('test 123');
  });

  it('.append()', function () {
    const app = new App();
    let output = '';
    const terminal = function () {
      output = '';
    };
    terminal.append = function (text) {
      output += text;
    };
    app.registerTerminal(terminal);
    expect(output).toEqual('');
    app.append('test');
    expect(output).toEqual('test');
    app.append(' 123');
    expect(output).toEqual('test 123');
  });

  it('.writeln()', function () {
    const app = new App();
    let output = '';
    expect(output).toEqual('');
    app.write = (text) => {
      output = text;
    };
    app.writeln('test 123');
    expect(output).toEqual(`test 123
`);
  });
});
