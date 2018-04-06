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
goog.require('cwc.utils.Logger');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.file.Files = function() {
  /** @type {!string} */
  this.name = 'Files';

  /** @private {!Object} */
  this.data_ = {};

  /** @private {!number} */
  this.size_ = 0;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {string=} type
 * @param {number=} size
 * @return {!cwc.file.File}
 */
cwc.file.Files.prototype.addFile = function(name, content, type, size) {
  let file = new cwc.file.File(name, content, type, size);
  let filename = file.getName();
  if (this.existFileName(filename)) {
    this.log_.warn('Overwrite existing file', filename);
  } else {
    this.log_.info('Added file', filename);
  }
  this.data_[filename] = file;
  this.updateSize_();
  return this.data_[filename];
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
 * @param {string=} group
 * @return {cwc.file.File}
 */
cwc.file.Files.prototype.getFile = function(name, group) {
  let filename = this.getFilename_(name, group);
  if (this.existFileName(filename)) {
    return this.data_[filename];
  }
  this.log_.error('File not found:', filename);
  return null;
};


/**
 * @param {!string} name
 * @param {string=} opt_group
 * @return {string}
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
 */
cwc.file.Files.prototype.setData = function(data) {
  for (let entry in data) {
    if (Object.prototype.hasOwnProperty.call(data, entry)) {
      let file = data[entry];
      this.addFile(
          file.name,
          file.content,
          file.type,
          file.size);
    }
  }
  this.updateSize_();
  this.log_.info('Added', this.size_, 'files');
};


/**
 * @return {number} Number of files.
 */
cwc.file.Files.prototype.getSize = function() {
  return this.size_;
};


/**
 * @param {!string} name
 * @param {string=} group
 * @return {boolean} Whether we have this file.
 */
cwc.file.Files.prototype.hasFile = function(name, group) {
  let filename = this.getFilename_(name, group);
  return this.existFileName(filename);
};


/**
 * @return {boolean} Whether we have any files.
 */
cwc.file.Files.prototype.hasFiles = function() {
  return this.size_ !== 0;
};


/**
 * @return {Object}
 */
cwc.file.Files.prototype.getFiles = function() {
  return this.data_;
};


/**
 * Clears all files.
 */
cwc.file.Files.prototype.clear = function() {
  this.data_ = {};
  this.size_ = 0;
};


/**
 * @param {!string} name
 * @param {string=} group
 * @return {!string}
 * @private
 */
cwc.file.Files.prototype.getFilename_ = function(name, group) {
  return ((group) ? group + '/' : '') + name;
};


/**
 * @private
 */
cwc.file.Files.prototype.updateSize_ = function() {
  let newSize = 0;
  for (let key in this.data_) {
    if (Object.prototype.hasOwnProperty.call(this.data_, key)) {
      newSize++;
    }
  }
  this.size_ = newSize;
};
