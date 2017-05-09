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
goog.require('cwc.fileFormat.AdvancedFile');
goog.require('cwc.fileFormat.BlocklyFile');
goog.require('cwc.fileFormat.CoffeeScriptFile');
goog.require('cwc.fileFormat.CustomFile');
goog.require('cwc.fileFormat.JavaScriptFile');
goog.require('cwc.fileFormat.RawFile');


describe('File format', function() {
  it('functions', function() {
    expect(typeof cwc.fileFormat.AdvancedFile).toEqual('function');
    expect(typeof cwc.fileFormat.BlocklyFile).toEqual('function');
    expect(typeof cwc.fileFormat.CoffeeScriptFile).toEqual('function');
    expect(typeof cwc.fileFormat.CustomFile).toEqual('function');
    expect(typeof cwc.fileFormat.JavaScriptFile).toEqual('function');
    expect(typeof cwc.fileFormat.RawFile).toEqual('function');
  });
});
