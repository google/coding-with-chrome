/* eslint-disable require-jsdoc */
/**
 * @fileoverview MountEntry tests.
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
import { MountEntry } from './MountEntry';

describe('MountEntry', function() {
  it('constructor', function() {
    const mountEntry = new MountEntry('/test', null);
    expect(typeof mountEntry).toBe('object');
    expect(mountEntry.path).toBe('/test');
    expect(mountEntry.target).toBe(null);
  });

  it('.executeCommand', function() {
    class MountTarget {
      static a() {
        return 'hello';
      }
      static b() {
        return 'world';
      }
      static c(path, param = '') {
        return 'c' + path + param;
      }
    }
    const mountEntry = new MountEntry('/test', MountTarget);
    expect(mountEntry.executeCommand('a')).toBe('hello');
    expect(mountEntry.executeCommand('b')).toBe('world');
    expect(mountEntry.executeCommand('c', '1')).toBe('c1');
    expect(mountEntry.executeCommand('c', '2')).toBe('c2');
    expect(mountEntry.executeCommand('c', '3')).toBe('c3');
    expect(mountEntry.executeCommand('c', '1', '1')).toBe('c11');
    expect(mountEntry.executeCommand('c', '2', '1')).toBe('c21');
    expect(mountEntry.executeCommand('c', '3', '1')).toBe('c31');
  });

  it('.getCommand', function() {
    class MountTarget {
      static a() {
        return 'hello';
      }

      static b() {
        return 'world';
      }

      static c() {
        return 'hello world!';
      }
    }
    const mountEntry = new MountEntry('/test', MountTarget);
    expect(mountEntry.getCommand('a')()).toBe('hello');
    expect(mountEntry.getCommand('b')()).toBe('world');
    expect(mountEntry.getCommand('c')()).toBe('hello world!');
  });

  it('.getTarget', function() {
    const mountTarget = {
      a: function() {
        return 'hello';
      },
      b: function() {
        return 'world';
      },
      c: function() {
        return this.a() + ' ' + this.b();
      }
    };
    const mountEntry = new MountEntry('/test', mountTarget);
    expect(mountEntry.getTarget()).toBe(mountTarget);
  });

  it('.getPath', function() {
    const mountEntry = new MountEntry('/test', null);
    expect(mountEntry.getPath('/test/a')).toBe('/a');
    expect(mountEntry.getPath('/test/b')).toBe('/b');
    expect(mountEntry.getPath('/test/c')).toBe('/c');
    expect(mountEntry.getPath('/test/a/b/c')).toBe('/a/b/c');
  });
});
