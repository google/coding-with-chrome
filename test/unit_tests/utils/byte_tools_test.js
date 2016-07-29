/**
 * @fileoverview ByteTools tests.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.require('cwc.utils.ByteTools');


describe('ByteTools', function() {

  it('bytesToInt', function() {
    expect(cwc.utils.ByteTools.bytesToInt([0x00000000, 0x00000001]))
      .toEqual(1);
    expect(cwc.utils.ByteTools.bytesToInt([0x00000001, 0x00000000]))
      .toEqual(256);
    expect(cwc.utils.ByteTools.bytesToInt([0x00000001, 0x00000001]))
      .toEqual(257);
    expect(cwc.utils.ByteTools.bytesToInt([0x00000011, 0x00000001]))
      .toEqual(4353);
    expect(cwc.utils.ByteTools.bytesToInt([0x10101010, 0x10101010]))
      .toEqual(269488144);
  });

  it('signedBytesToInt', function() {
    expect(cwc.utils.ByteTools.signedBytesToInt([0xF0F0F0F0, 0xF0F0F0F0]))
      .toBe(-3856);
    expect(cwc.utils.ByteTools.signedBytesToInt([0xFFFFFFFF, 0x00000000]))
      .toBe(-256);
    expect(cwc.utils.ByteTools.signedBytesToInt([0xFFFFFFFF, 0xFFFFFFFF]))
      .toBe(-1);
    expect(cwc.utils.ByteTools.signedBytesToInt([0x00000000, 0x00000001]))
      .toBe(1);
    expect(cwc.utils.ByteTools.signedBytesToInt([0x00000001, 0x00000000]))
      .toBe(256);
    expect(cwc.utils.ByteTools.signedBytesToInt([0x00000001, 0x00000001]))
      .toBe(257);
    expect(cwc.utils.ByteTools.signedBytesToInt([0x00000011, 0x00000001]))
      .toBe(4353);
    expect(cwc.utils.ByteTools.signedBytesToInt([0x10101010, 0x10101010]))
      .toBe(4112);
  });

  it('joinUint8Array', function() {
    var data1 = cwc.utils.ByteTools.toUint8Array([0x10101010]);
    var data2 = cwc.utils.ByteTools.toUint8Array([0x10101010]);
    var result = cwc.utils.ByteTools.toUint8Array([0x10101010, 0x10101010]);
    expect(cwc.utils.ByteTools.joinUint8Array(data1, data2))
      .toEqual(result);
  });

  it('getHeaderPosition', function() {
    var data = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 21, 4, 255, 254, 0, 231]);
    var data2 = cwc.utils.ByteTools.toUint8Array([255, 255]);
    var header1 = [21];
    var header2 = [255, 255];
    var header3 = [255, 254];
    var header4 = [255, 253];
    var header5 = [0, 231];
    var header6 = [231];
    var header7 = [232];
    var header8 = [255, 254, 0];
    var header9 = [254, 0, 231];
    var header10 = [255, 255, 0];
    var header11 = [255, 255, 255];
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header1)).toBe(3);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header2)).toBe(0);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header3)).toBe(5);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header4)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header5)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header6)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header7)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header8)).toBe(5);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header9)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header10)).toBe(0);
    expect(cwc.utils.ByteTools.getHeaderPosition(data, header11)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data2, header1)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data2, header2)).toBe(null);
    expect(cwc.utils.ByteTools.getHeaderPosition(data2, header11)).toBe(null);
  });

  it('getUint8Data', function() {
    var packet1 = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 21, 4, 255, 0, 0, 231]);
    var packet1_shifted = cwc.utils.ByteTools.toUint8Array(
        [0, 255, 0, 255, 255, 0, 21, 4, 255, 0, 0, 231]);
    var packet1_broken = cwc.utils.ByteTools.toUint8Array(
        [255, 0, 21, 4, 255, 0, 0, 231]);
    var packet2 = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 21, 4, 0, 255, 0, 231]);
    var packet3 = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 21, 4, 0, 0, 255, 231]);
    var packet4 = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 16, 11, 255, 250, 255, 252, 0, 0, 0, 0, 0, 0, 240]);
    var packet5 = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 16, 11, 255, 253, 255, 250, 0, 24, 255, 247, 0, 25, 200]);
    var packet6 = cwc.utils.ByteTools.toUint8Array(
        [255, 255, 0, 16, 11, 0, 4, 255, 235, 0, 0, 0, 0, 0, 0, 246]);
    var headers1 = [0xff, 0xff];
    var headers2 = [0xff, 0xfe];
    var size1 = 9;
    var size2 = 16;
    var buffer1 = cwc.utils.ByteTools.toUint8Array([0, 255]);
    expect(cwc.utils.ByteTools.getUint8Data(packet1, headers1, size1))
      .toEqual(packet1);
    expect(cwc.utils.ByteTools.getUint8Data(packet1, headers1, 8))
      .toEqual(packet1);
    expect(cwc.utils.ByteTools.getUint8Data(packet1, headers1, 9))
      .toEqual(packet1);
    expect(cwc.utils.ByteTools.getUint8Data(packet1, headers1, 10))
      .toEqual(null);
    expect(cwc.utils.ByteTools.getUint8Data(packet1, headers2, size1))
      .toEqual(null);
    expect(cwc.utils.ByteTools.getUint8Data(packet1_shifted, headers1, size1))
      .toEqual(packet1);
    expect(cwc.utils.ByteTools.getUint8Data(packet1_shifted, headers1, size1,
        buffer1))
      .toEqual(packet1);
    expect(cwc.utils.ByteTools.getUint8Data(packet1_broken, headers1, size1))
      .toEqual(null);
    expect(cwc.utils.ByteTools.getUint8Data(packet1_broken, headers1, size1,
        buffer1))
      .toEqual(packet1);
    expect(cwc.utils.ByteTools.getUint8Data(packet2, headers1, size1))
      .toEqual(packet2);
    expect(cwc.utils.ByteTools.getUint8Data(packet3, headers1, size1))
      .toEqual(packet3);
    expect(cwc.utils.ByteTools.getUint8Data(packet4, headers1, size2))
      .toEqual(packet4);
    expect(cwc.utils.ByteTools.getUint8Data(packet5, headers1, size2))
      .toEqual(packet5);
    expect(cwc.utils.ByteTools.getUint8Data(packet6, headers1, size2))
      .toEqual(packet6);
  });


});
