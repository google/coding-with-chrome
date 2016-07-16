/**
 * @fileoverview ByteArray tests.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
'use strict';
goog.require('cwc.utils.ByteArray');
goog.require('cwc.utils.ByteArrayTypes');


describe('ByteArray', function() {
  var byteHeader = Math.random();
  var shortHeader = Math.random();
  var integerHeader = Math.random();
  var stringHeader = Math.random();
  var byteArray = new cwc.utils.ByteArray(byteHeader, shortHeader,
      integerHeader, stringHeader);

  it('opt_header', function() {
    expect(byteArray.getHeader(cwc.utils.ByteArrayTypes.BYTE))
        .toBe(byteHeader);
    expect(byteArray.getHeader(cwc.utils.ByteArrayTypes.SHORT))
        .toBe(shortHeader);
    expect(byteArray.getHeader(cwc.utils.ByteArrayTypes.INT))
        .toBe(integerHeader);
    expect(byteArray.getHeader(cwc.utils.ByteArrayTypes.STR))
        .toBe(stringHeader);
  });

  it('clearData', function() {
    byteArray.clearData();
    expect(byteArray.getData()).toEqual([]);
  });

});
