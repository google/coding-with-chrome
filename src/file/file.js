/**
 * @fileoverview Custom file definition to handle file data.
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
goog.provide('cwc.file.File');



/**
 * @param {string} name
 * @param {string} content
 * @param {string=} opt_type
 * @param {number=} opt_size
 * @param {string=} opt_group
 * @constructor
 * @struct
 * @final
 */
cwc.file.File = function(name, content, opt_type, opt_size, opt_group) {

  /** @private {string} */
  this.name_ = name;

  /** @private {string} */
  this.content_ = content || '';

  /** @private {string} */
  this.type_ = opt_type || 'unknown';

  /** @private {number} */
  this.size_ = opt_size || this.content_.length || 0;

  /** @private {string} */
  this.group_ = opt_group || '';

  /** @private {number} */
  this.version_ = 1;

  if (!opt_type) {
    if (this.content_.includes('data:')) {
      var contentFileType = this.content_.split(';')[0].split(':')[1];
      if (contentFileType) {
        this.type_ = contentFileType;
      }
    }
  }

};


/**
 * @return {string}
 */
cwc.file.File.prototype.getContent = function() {
  return this.content_;
};


/**
 * @return {string}
 */
cwc.file.File.prototype.getName = function() {
  return this.name_;
};


/**
 * @return {string}
 */
cwc.file.File.prototype.getType = function() {
  return this.type_;
};


/**
 * @return {number}
 */
cwc.file.File.prototype.getSize = function() {
  return this.size_;
};


/**
 * @return {string}
 */
cwc.file.File.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @return {string}
 */
cwc.file.File.prototype.getFilename = function() {
  return ((this.group_) ? this.group_ + '/' : '') + this.name_;
};


/**
 * @return {Object}
 */
cwc.file.File.prototype.toJSON = function() {
  return {
    'name': this.name_,
    'type': this.type_,
    'size': this.size_,
    'content': this.content_,
    'group': this.group_,
    'version': this.version_,
    'filename': this.getFilename()
  };
};


/**
 * @return {string}
 */
cwc.file.File.prototype.getJson = function() {
  return JSON.stringify(this.toJSON(), null, 2);
};
