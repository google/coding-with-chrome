/**
 * @fileoverview Path for virtual file system.
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

/**
 * Virtual file class.
 */
export class Path {
  /**
   * @return {string}
   */
  static sep() {
    return '/';
  }

  /**
   * @return {string}
   */
  static root() {
    return '/';
  }

  /**
   * @return {string}
   */
  static delimiter() {
    return ':';
  }

  /**
   * @param {*} path
   * @return {Array}
   */
  static split(path) {
    if (!path.startsWith('/')) {
      console.error('Invalid absolute path.');
    }
    return ['/'].concat(path.substr(1).split(this.sep()));
  }

  /**
   * @param {string} workingDirectory
   * @param {string} path
   * @return {string}
   */
  static resolve(workingDirectory = '/', path) {
    if (path.startsWith('/')) {
      return path;
    }
    return workingDirectory + path.replace('./', '/');
  }

  /**
   * Returns the closest matching path, if any.
   * @param {string} path
   * @param {array} paths
   * @return {string}
   */
  static closest(path, paths) {
    if (paths.includes(path)) {
      return path;
    }
    let searchResult = path.lastIndexOf('/');
    let searchPath = path.substring(0, searchResult);
    while (searchResult > 0) {
      if (paths.includes(searchPath)) {
        return searchPath;
      } else {
        searchResult = searchPath.lastIndexOf('/');
        searchPath = searchPath.substring(0, searchResult);
      }
    }
    return '';
  }

  /**
   * Returns directory name of the path.
   * @param {string} path
   * @return {string}
   */
  static dirname(path) {
    if (path.lastIndexOf('/') <= 0) {
      return '/';
    }
    return path.substring(0, path.lastIndexOf('/'));
  }

  /**
   * Returns last portion of the path.
   * @param {string} path
   * @return {string}
   */
  static basename(path) {
    return path.substring(path.lastIndexOf('/') + 1);
  }

  /**
   * Returns parent directory name of the path.
   * @param {string} path
   * @return {string}
   */
  static parentDirname(path) {
    return this.basename(this.dirname(path));
  }

  /**
   * @param {string} path
   * @param {Object} obj
   * @return {Object}
   */
  static findPathInObject(path, obj) {
    if (path.lastIndexOf('/') <= 0 && path in obj) {
      return obj[path] || null;
    }
    const objectPath = this.split(path);
    const pathLength = objectPath.length;
    let result = obj;
    for (let i = 0; i < pathLength; i++) {
      if (objectPath[i] in result) {
        result = result[objectPath[i]];
      } else {
        return null;
      }
    }
    return result;
  }

  /**
   * @param  {...any} segments
   * @return {string}
   */
  static join(...segments) {
    if (!segments) {
      return '';
    }
    const path = [];
    segments.forEach(fragment => {
      if (fragment.includes(this.sep())) {
        Array.prototype.push.apply(path, fragment.split(this.sep()));
      } else {
        path.push(fragment);
      }
    });

    return this.normalize(path.join(this.sep()));
  }

  /**
   * @param  {string} path
   * @return {string}
   */
  static normalize(path = '') {
    const pathSegments = path.split(this.sep());
    const startsWithRoot = path.startsWith(this.root());
    if (startsWithRoot) {
      pathSegments.splice(0, 1);
    }
    pathSegments.forEach((fragment, index) => {
      if (fragment == '..') {
        pathSegments[index] = '';
        if (pathSegments[index - 1] !== undefined) {
          pathSegments[index - 1] = '';
        }
      }
    });

    const normalizedPathSegments = [];
    pathSegments.forEach(fragment => {
      if (fragment) {
        normalizedPathSegments.push(fragment);
      }
    });
    const result = normalizedPathSegments.join(this.sep());
    if (startsWithRoot) {
      return this.root() + result;
    }
    return result;
  }

  /**
   * @param  {string} path
   * @return {boolean}
   */
  static isAbsolute(path = '') {
    if (path.startsWith(this.root())) {
      return true;
    }
    return false;
  }
}
