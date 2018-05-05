/**
 * @fileoverview Handling coverage files.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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

const escapeStringRegexp = require('escape-string-regexp');
const path = require('path');
const replace = require('replace-in-file');

const appDir = path.dirname(path.join(require.main.filename, '..', '..'));
const coverageDir = path.join(appDir, 'coverage');

if (!coverageDir) {
  console.warn('Unable to find coverage folder at', appDir);
  return;
}


/**
 * Replace absolute paths with relative paths.
 */
console.log('Processing coverage folder at', coverageDir);
let options = {
  files: path.join(coverageDir, 'lcov.info'),
  from: new RegExp(escapeStringRegexp(path.join(appDir, '/')), 'g'),
  to: '',
};
try {
  let changes = replace.sync(options);
  console.log('Modified file:', changes.join(', '));
} catch (error) {
  console.error('Error occurred:', error);
}
