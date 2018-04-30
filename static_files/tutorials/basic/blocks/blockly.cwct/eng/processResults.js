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


window.top['cwc-validated'] = function(code, res) {
  console.log({code: code, res: res});
  let matches = code.match(
    /draw.circle\(([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+)\)/);
  let msg = 'No circles yet, keep trying';
  let color = 'red';
  if (matches) {
    msg = 'Great circle. Now can you make it ' +
      '<span style="color: #3333ff">blue</span>?';
    color = 'orange';
    if (matches[4].includes('#3333ff')) {
      msg = 'Good job. Now make the border ' +
      '<span style="color: #009900">green</span>.';
    }
    if (matches[5].includes('#009900')) {
      msg = 'Perfect! Now you\'re ready to program in blockly.';
      color = 'green';
    }
  }
  document.getElementById('msg').innerHTML = '<h2 style="color: '+color+'">' +
    msg + '</h2>';
};
