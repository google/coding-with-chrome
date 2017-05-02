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
goog.require('cwc.fileFormat.File');


describe('File format', function() {
  let fileFormat = new cwc.fileFormat.File();

  it('constructor', function() {
    expect(typeof fileFormat).toEqual('object');
  });

  it('functions', function() {
    expect(typeof cwc.fileFormat.File.getAdvancedFile).toEqual('function');
    expect(typeof cwc.fileFormat.File.getBlocklyFile).toEqual('function');
    expect(typeof cwc.fileFormat.File.getCustomFile).toEqual('function');
    expect(typeof cwc.fileFormat.File.getPencilCodeFile).toEqual('function');
    expect(typeof cwc.fileFormat.File.getPhaserFile).toEqual('function');
    expect(typeof cwc.fileFormat.File.getRawFile).toEqual('function');
    expect(typeof cwc.fileFormat.File.getSimpleFile).toEqual('function');
  });
});
