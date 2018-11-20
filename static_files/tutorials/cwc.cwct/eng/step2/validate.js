/**
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
 * @author carheden@google.com (Adam Carheden)
 */

/**
 * @param {!string} code
 * @return {Array<Object>}
 */
function checkBlueFill(code) {
  let matches = code.match(
    /draw.circle\(([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+)\)/);
  if (matches) {
    if (matches[4].includes('#33ccff') ||
        matches[4].includes('#3366ff') ||
        matches[4].includes('#3333ff') ||
        matches[4].includes('#000099') ||
        matches[4].includes('#333399')) {
      return {
        message: 'That\'s my favorite shade of blue too! '+
          'Let\'s continue to the next step.',
        solved: true,
      };
    }
    return {
      solved: false,
    };
  }
  return {
    message: 'Where did the circle go?',
    solved: false,
  };
}
