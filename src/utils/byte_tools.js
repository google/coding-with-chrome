/**
 * @fileoverview General-purpose Byte Tools.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.ByteTools');


/**
 * @param {Object} data
 * @return {number}
 */
cwc.utils.ByteTools.bytesToInt = function(data) {
  return data[0] << 8 | data[1];
};


/**
 * @param {Object} data
 * @return {number}
 */
cwc.utils.ByteTools.signedBytesToInt = function(data) {
  return (cwc.utils.ByteTools.bytesToInt(data) << 16) >> 16;
};


/**
 * @param {Object} data
 * @return {number}
 */
cwc.utils.ByteTools.bytesToInt32 = function(data) {
  return (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
};


/**
 * @param {Object} data
 * @return {number}
 */
cwc.utils.ByteTools.Int32ToBytes = function(data) {
  var view = new DataView(data);
  view.setUint32(0);
  return data;
};


/**
  * @param {!ArrayBuffer|Array} data1
  * @param {!ArrayBuffer|Array} data2
  * @return {!boolean}
  */
cwc.utils.ByteTools.isArrayBufferEqual = function(data1, data2) {
  if (data1.length != data2.length) {
    return false;
  }
  for (let i = 0; i != data1.length; i++) {
    if (data1[i] != data2[i]) {
      return false;
    }
  }
  return true;
};


/**
 * @param {!Array} data
 * @return {!Uint8Array}
 */
cwc.utils.ByteTools.toUint8Array = function(data) {
  var dataLength = data.length;
  var dataBuffer = new Uint8Array(dataLength);
  for (let i=0; i < dataLength; i++) {
    dataBuffer[i] = data[i];
  }
  return dataBuffer;
};


/**
 * @param {!Uint8Array} data1
 * @param {!Uint8Array} data2
 * @return {!Uint8Array}
 */
cwc.utils.ByteTools.joinUint8Array = function(data1, data2) {
  var data = new Uint8Array(data1.length + data2.length);
  data.set(data1, 0);
  data.set(data2, data1.length);
  return data;
};


/**
 * @param {ArrayBuffer|Uint8Array} data
 * @param {Array=} opt_headers
 * @param {number=} opt_size
 * @param {ArrayBuffer|Uint8Array=} opt_buffer
 * @return {Uint8Array} result
 */
cwc.utils.ByteTools.getUint8Data = function(data,
    opt_headers, opt_size, opt_buffer) {
  var buffer = null;
  var parsedData = [];

  if (data) {
    // Prepare data buffer
    var dataView = data;
    if (dataView instanceof ArrayBuffer) {
      dataView = new Uint8Array(data);
    }

    // Additional length checks if needed.
    if (opt_size) {

      // Perpend buffer if needed.
      if (opt_buffer && dataView.length < opt_size) {
        buffer = opt_buffer;
        if (opt_buffer instanceof ArrayBuffer) {
          buffer =  new Uint8Array(opt_buffer);
        }
        dataView = cwc.utils.ByteTools.joinUint8Array(buffer, dataView);
      }

      if (dataView.length < opt_size) {
        buffer = dataView;
      }
    }

    // Data processing for data with headers.
    if (opt_headers) {
      var headers = cwc.utils.ByteTools.getHeaderPositions(dataView,
        opt_headers);
      if (headers) {
        let headersLength = headers.length;
        for (let headerPos = 0; headerPos < headersLength; headerPos++) {
          let dataFragment = dataView.slice(
            headers[headerPos], headers[headerPos+1]);
          if (dataFragment.length) {
            if (!opt_size || (opt_size && dataFragment.length >= opt_size)) {
              parsedData.push(dataFragment);
            } else {
              buffer = dataFragment;
            }
          }
        }
      } else {
        buffer = dataView;
      }
    } else {
      // Data processing for data without headers.
      parsedData.push(dataView);
    }
  }

  return {
    'data': parsedData,
    'buffer': buffer
  };

};


/**
 * Returns the header position in the given data stream.
 * @param {Uint8Array|Array} data
 * @param {Array} headers
 * @return {number}
 */
cwc.utils.ByteTools.getHeaderPositions = function(data, headers) {
  var dataLength = data.length;
  var headerLength = headers.length;
  var result = [];

  if (dataLength < headerLength) {
    return null;
  }

  for (let dataPos = 0; dataPos < dataLength; dataPos++) {
    if (data[dataPos] === headers[0]) {
      let foundHeaders = true;
      for (let headerPos = 0; headerPos < headerLength; headerPos++) {
        if (data[dataPos + headerPos] !== headers[headerPos]) {
          foundHeaders = false;
        }
      }
      if (foundHeaders && dataPos + headerLength <= dataLength) {
        result.push(dataPos);
      }
    }
  }
  return result.length ? result : null;
};
