 /**
 * @fileoverview File format tests.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.require('cwc.fileHandler.ConfigData');


describe('File Config', function() {
  let configData = cwc.fileHandler.ConfigData;

  it('constructor', function() {
    expect(typeof configData).toEqual('object');
  });

  describe('File formats', function() {
    for (let entry in configData) {
      if (Object.prototype.hasOwnProperty.call(configData, entry)) {
        let config = configData[entry];
        it(entry, function() {
          config.file(config.content, config.fileType, config.contentType);
        });
      }
    }
  });
});
