/**
 * @fileoverview File library to collect and access all files.
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
goog.provide('cwc.file.Files');

goog.require('cwc.file.File');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.file.Files = function() {
  /** @private {Object} */
  this.data_ = {};

  /** @private {number} */
  this.size_ = 0;
};


/**
 * @param {!string} filename
 * @return {boolean}
 */
cwc.file.Files.prototype.existFileName = function(filename) {
  return filename in this.data_;
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {string=} optType
 * @param {number=} opt_size
 * @param {string=} opt_group
 * @return {cwc.file.File}
 * @export
 */
cwc.file.Files.prototype.addFile = function(name, content,
    optType, opt_size, opt_group) {
  let new_file = new cwc.file.File(name, content, optType,
      opt_size, opt_group);
  let fileName = new_file.getFilename();
  let fileType = new_file.getType();
  if (this.getFile(fileName)) {
    console.warn('Overwrite existing file', fileName);
  }
  this.data_[fileName] = new_file;
  this.updateSize_();
  console.log('Added', fileName, 'with type', fileType);
  return this.data_[fileName];
};


/**
 * @param {!string} name
 * @param {string=} opt_group
 * @return {cwc.file.File}
 * @export
 */
cwc.file.Files.prototype.getFile = function(name, opt_group) {
  let fileName = ((opt_group) ? opt_group + '/' : '') + name;
  if (this.existFileName(fileName)) {
    return this.data_[fileName];
  }
  return null;
};


/**
 * @param {!string} name
 * @param {string=} opt_group
 * @return {string}
 * @export
 */
cwc.file.Files.prototype.getFileContent = function(name, opt_group) {
  let file = this.getFile(name, opt_group);
  if (file) {
    return file.getContent();
  }
  return '';
};


/**
 * @return {Object}
 */
cwc.file.Files.prototype.toJSON = function() {
  let data = {};
  for (let entry in this.data_) {
    if (this.data_.hasOwnProperty(entry)) {
      let file = this.data_[entry];
      data[entry] = file.toJSON();
    }
  }
  return data;
};


/**
 * @param {Object} data
 * @export
 */
cwc.file.Files.prototype.setData = function(data) {
  for (let entry in data) {
    if (data.hasOwnProperty(entry)) {
      let file = data[entry];
      this.addFile(
          file.name,
          file.content,
          file.type,
          file.size,
          file.group);
    }
  }
};


/**
 * @return {number} Number of files.
 * @export
 */
cwc.file.Files.prototype.getSize = function() {
  return this.size_;
};


/**
 * @return {boolean} Whether we have any files.
 * @export
 */
cwc.file.Files.prototype.hasFiles = function() {
  return this.size_ != 0;
};


/**
 * @return {Object}
 * @export
 */
cwc.file.Files.prototype.getFiles = function() {
  return this.data_;
};


/**
 * Clears all files.
 * @export
 */
cwc.file.Files.prototype.clear = function() {
  this.data_ = {};
  this.size_ = 0;
};


/**
 * @private
 */
cwc.file.Files.prototype.updateSize_ = function() {
  let newSize = 0;
  for (let key in this.data_) {
    if (this.data_.hasOwnProperty(key)) {
      newSize++;
    }
  }
  this.size_ = newSize;
};
