/**
 * @fileoverview Number tools tests.
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
goog.require('cwc.utils.NumberTools');


describe('NumberTools: minMax', function() {
  it('function', function() {
    expect(typeof cwc.utils.NumberTools.minMax).toEqual('function');
  });

  it('min', function() {
    expect(cwc.utils.NumberTools.minMax(100, 1, 10)).toEqual(10);
  });

  it('middle', function() {
    expect(cwc.utils.NumberTools.minMax(5, 1, 10)).toEqual(5);
  });

  it('max', function() {
    expect(cwc.utils.NumberTools.minMax(-100, 1, 10)).toEqual(1);
  });

  it('fallback', function() {
    expect(cwc.utils.NumberTools.minMax(undefined, 1, 10, 5)).toEqual(5);
  });

  it('null', function() {
    expect(cwc.utils.NumberTools.minMax(null, 1, 10, 5)).toEqual(1);
  });
});
