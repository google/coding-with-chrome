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
 * @fileoverview Path tests.
 */
import { Path } from './Path';

describe('Path', function () {
  it('.sep', function () {
    expect(Path.sep()).toEqual('/');
  });

  it('.delimiter', function () {
    expect(Path.delimiter()).toEqual(':');
  });

  it('.split', function () {
    expect(Path.split('/home')).toEqual(['/', 'home']);
    expect(Path.split('/home/user')).toEqual(['/', 'home', 'user']);
    expect(Path.split('/home/user/file')).toEqual([
      '/',
      'home',
      'user',
      'file',
    ]);
    console.log(Path.split('/home/user/file'));
  });

  it('.basename', function () {
    expect(Path.basename('/etc')).toBe('etc');
    expect(Path.basename('/home')).toBe('home');
    expect(Path.basename('/home/user')).toBe('user');
    expect(Path.basename('/home/user/a')).toBe('a');
    expect(Path.basename('/home/user/b')).toBe('b');
  });

  it('.closet (direct)', function () {
    const paths = ['/home', '/home/user', '/home/user/a', '/home/user/b'];
    expect(Path.closest('/etc', paths)).toBe('');
    expect(Path.closest('/home', paths)).toBe('/home');
    expect(Path.closest('/home/user', paths)).toBe('/home/user');
    expect(Path.closest('/home/user/a', paths)).toBe('/home/user/a');
    expect(Path.closest('/home/user/b', paths)).toBe('/home/user/b');
    expect(Path.closest('/etc/', paths)).toBe('');
    expect(Path.closest('/home/', paths)).toBe('/home');
    expect(Path.closest('/home/user/', paths)).toBe('/home/user');
    expect(Path.closest('/home/user/a/', paths)).toBe('/home/user/a');
    expect(Path.closest('/home/user/b/', paths)).toBe('/home/user/b');
  });

  it('.closet (indirect)', function () {
    const paths = ['/home', '/home/user', '/home/user/a', '/home/user/b'];
    expect(Path.closest('/etc', paths)).toBe('');
    expect(Path.closest('/home/root', paths)).toBe('/home');
    expect(Path.closest('/home/user/a/1/2/3/4/5', paths)).toBe('/home/user/a');
    expect(Path.closest('/home/user/b/5/4/3/2/1', paths)).toBe('/home/user/b');
    expect(Path.closest('/home/user/c', paths)).toBe('/home/user');
  });

  it('.dirname', function () {
    expect(Path.dirname('/etc')).toBe('/');
    expect(Path.dirname('/a')).toBe('/');
    expect(Path.dirname('/a/b')).toBe('/a');
    expect(Path.dirname('/a/b/c')).toBe('/a/b');
    expect(Path.dirname('/a/b/c/d')).toBe('/a/b/c');
    expect(Path.dirname('/a/b/c/d/e')).toBe('/a/b/c/d');
  });

  it('.findPathInObject', function () {
    const obj = {
      '/': {
        a: { a1: 'a1', a2: 'a2' },
        b: { b1: 'b1', b2: 'b2' },
      },
    };
    expect(Path.findPathInObject('/', obj)).toBe(obj['/']);
    expect(Path.findPathInObject('/a', obj)).toBe(obj['/']['a']);
    expect(Path.findPathInObject('/b', obj)).toBe(obj['/']['b']);
    expect(Path.findPathInObject('/c', obj)).toBe(null);
    expect(Path.findPathInObject('/a/a1', obj)).toBe(obj['/']['a']['a1']);
    expect(Path.findPathInObject('/a/a2', obj)).toBe(obj['/']['a']['a2']);
    expect(Path.findPathInObject('/b/b1', obj)).toBe(obj['/']['b']['b1']);
    expect(Path.findPathInObject('/b/b2', obj)).toBe(obj['/']['b']['b2']);
    expect(Path.findPathInObject('/c/c1', obj)).toBe(null);
  });

  it('.parentDirname', function () {
    expect(Path.parentDirname('/etc')).toBe('');
    expect(Path.parentDirname('/a')).toBe('');
    expect(Path.parentDirname('/a/b')).toBe('a');
    expect(Path.parentDirname('/a/b/c')).toBe('b');
    expect(Path.parentDirname('/a/b/c/d')).toBe('c');
    expect(Path.parentDirname('/a/b/c/d/e')).toBe('d');
  });

  it('.join', function () {
    expect(Path.join()).toBe('');
    expect(Path.join('/etc')).toBe('/etc');
    expect(Path.join('/', 'etc')).toBe('/etc');
    expect(Path.join('a', 'b')).toBe('a/b');
    expect(Path.join('/a/b/c', 'd')).toBe('/a/b/c/d');
    expect(Path.join('/a', '..')).toBe('/');
    expect(Path.join('/a/b/..')).toBe('/a');
    expect(Path.join('/a/b', '..')).toBe('/a');
    expect(Path.join('/a/b/../c')).toBe('/a/c');
    expect(Path.join('/a/b', '..', 'c')).toBe('/a/c');
    expect(Path.join('/', '..')).toBe('/');
    expect(Path.join('/', '..', '..')).toBe('/');
    expect(Path.join('/home', '..')).toBe('/');
  });

  it('.normalize', function () {
    expect(Path.normalize()).toBe('');
    expect(Path.normalize('/etc')).toBe('/etc');
    expect(Path.normalize('a/b')).toBe('a/b');
    expect(Path.normalize('/a/b/c/d')).toBe('/a/b/c/d');
    expect(Path.normalize('/a/..')).toBe('/');
    expect(Path.normalize('/a/b/..')).toBe('/a');
    expect(Path.normalize('/a/b/../c')).toBe('/a/c');
    expect(Path.normalize('/a/b/../c/../d')).toBe('/a/d');
    expect(Path.normalize('/..')).toBe('/');
    expect(Path.normalize('/../..')).toBe('/');
    expect(Path.normalize('/../../..')).toBe('/');
  });

  it('.isAbsolute', function () {
    expect(Path.isAbsolute()).toBeFalse();
    expect(Path.isAbsolute('/etc')).toBeTrue();
    expect(Path.isAbsolute('/a/b/c')).toBeTrue();
    expect(Path.isAbsolute('etc')).toBeFalse();
    expect(Path.isAbsolute('a/b/c')).toBeFalse();
  });
});
