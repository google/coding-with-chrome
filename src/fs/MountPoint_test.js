/**
 * @fileoverview MountPoint tests.
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
import { MountPoint } from './MountPoint';
import { Files } from './Files';

describe('MountPoint', function() {
  it('.mount (/) - Error', function() {
    const mountPoint = new MountPoint();
    expect(function() {
      mountPoint.mount('/', null);
    }).toThrow();
  });

  it('.mount (missing /) - Error', function() {
    const mountPoint = new MountPoint();
    expect(function() {
      mountPoint.mount('test', null);
    }).toThrow();
  });

  it('.mount (same mount point) - Error', function() {
    const mountPoint = new MountPoint();
    mountPoint.mount('/test', null);
    expect(function() {
      mountPoint.mount('/test', null);
    }).toThrow();
  });

  it('.mount (/test)', function() {
    const mountPoint = new MountPoint();
    mountPoint.mount('/test', null);
    expect(mountPoint.exist('/test')).toBe(true);
  });

  it('.mount (/test /test/a /test/b)', function() {
    const mountPoint = new MountPoint();
    mountPoint.mount('/test', null);
    mountPoint.mount('/test/a', null);
    mountPoint.mount('/test/b', null);
    expect(mountPoint.exist('/test')).toBe(true);
    expect(mountPoint.exist('/test/a')).toBe(true);
    expect(mountPoint.exist('/test/b')).toBe(true);
    expect(mountPoint.exist('/test/c')).toBe(false);
  });

  it('.umount', function() {
    const mountPoint = new MountPoint();
    mountPoint.mount('/test', null);
    expect(mountPoint.exist('/test')).toBe(true);
    mountPoint.umount('/test');
    expect(mountPoint.exist('/test')).toBe(false);
    mountPoint.umount('/test2');
    expect(mountPoint.exist('/test2')).toBe(false);
  });

  it('.get', function() {
    const mountPoint = new MountPoint();
    const mountTarget = function test() {
      return 'Hello World';
    };
    mountPoint.mount('/test', mountTarget);
    expect(mountPoint.get('/test').path).toBe('/test');
    expect(mountPoint.get('/test').target).toBe(mountTarget);
  });

  it('.get (indirect)', function() {
    const mountPoint = new MountPoint();
    mountPoint.mount('/test', null);
    expect(mountPoint.get('/test/a').path).toBe('/test');
    expect(mountPoint.get('/test/b').path).toBe('/test');
    expect(mountPoint.get('/test/c').path).toBe('/test');
    expect(mountPoint.get('/test/a/b/c').path).toBe('/test');
  });

  it('.getMount', function() {
    const mountPoint = new MountPoint();
    const mountTarget = function test() {
      return 'Hello World';
    };
    mountPoint.mount('/test', mountTarget);
    expect(mountPoint.getMount('/test').path).toBe('/test');
    expect(mountPoint.getMount('/test').target).toBe(mountTarget);
  });

  it('.getTarget', function() {
    const mountPoint = new MountPoint();
    const mountTarget = function test() {
      return 'Hello World';
    };
    mountPoint.mount('/test', mountTarget);
    expect(mountPoint.getTarget('/test')).toBe(mountTarget);
  });

  it('.mkdir', function() {
    const mountPoint = new MountPoint();
    const mountTarget = new Files();
    mountPoint.mount('/test', mountTarget);
    mountPoint.mkdir('/test/a');
    mountPoint.mkdir('/test/b');
    mountPoint.mkdir('/test/c');
    expect(mountPoint.exec('/test/a', 'exist')).toBeTrue;
    expect(mountPoint.exec('/test/b', 'exist')).toBeTrue;
    expect(mountPoint.exec('/test/c', 'exist')).toBeTrue;
    expect(mountPoint.exec('/test/d', 'exist')).toBeFalse;
  });

  it('.writeFile', function() {
    const mountPoint = new MountPoint();
    const mountTarget = new Files();
    mountPoint.mount('/test', mountTarget);
    mountPoint.mkdir('/test/a');
    mountPoint.mkdir('/test/b');
    mountPoint.mkdir('/test/c');
    mountPoint.writeFile('/test/0', '0');
    mountPoint.writeFile('/test/a/1', '1');
    mountPoint.writeFile('/test/b/2', '2');
    mountPoint.writeFile('/test/c/3', '3');
    expect(mountPoint.exec('/test/0', 'exist')).toBeTrue;
    expect(mountPoint.exec('/test/a/1', 'exist')).toBeTrue;
    expect(mountPoint.exec('/test/b/2', 'exist')).toBeTrue;
    expect(mountPoint.exec('/test/c/3', 'exist')).toBeTrue;
  });
});
