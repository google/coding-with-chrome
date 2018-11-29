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
function checkGreenBorder(code) {
  let matches = code.match(
    /draw.circle\(([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+)\)/);
  if (matches) {
    if (matches[5].includes('#99ff99') ||
        matches[5].includes('#66ff99') ||
        matches[5].includes('#33ff33') ||
        matches[5].includes('#33cc00') ||
        matches[5].includes('#009900') ||
        matches[5].includes('#006600') ||
        matches[5].includes('#003300')) {
      return {
        message: 'Perfect. Now you\'re ready to program in blockly.',
        solved: true,
      };
    }
    return {
      solved: false,
    };
  }
  return {
    message: 'I don\'t see a circle. Try going back to step 1.',
    solved: false,
  };
}
