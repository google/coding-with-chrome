/**
 * @fileoverview Tutorial Utilities
 *
 * @license Copyright 2019 The Coding with Chrome Authors.
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.ui.TutorialUtils');

/** @const {string} */
cwc.ui.TutorialUtils.databaseReferenceKey = 'dbref';
/** @const {string} */
cwc.ui.TutorialUtils.objectStoreName_ = '__tutorial__';

/** @const {Array<string>} */
cwc.ui.TutorialUtils.videoExtensions = ['mp4', 'webm', 'ogg'];

/**
 * @param {!cwc.utils.Helper} helper
 * @param {cwc.utils.Database} imagesDb
 * @constructor
 * @struct
 * @final
 */
cwc.ui.TutorialUtils = function(helper, imagesDb) {
  /** @type {string} */
  this.name = 'TutorialUtils';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorialUtils');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @type {!cwc.utils.Database} */
  this.imagesDb = imagesDb || null;
};

/**
 * @param {cwc.utils.Database} imagesDb
 */
cwc.ui.TutorialUtils.prototype.initImagesDb = async function(imagesDb) {
  if (imagesDb) {
    this.imagesDb = imagesDb;
  } else if (!this.imagesDb) {
    this.imagesDb = new cwc.utils.Database('Tutorial')
      .setObjectStoreName(cwc.ui.TutorialUtils.objectStoreName_);
    await this.imagesDb.open({'objectStoreNames':
      [cwc.ui.TutorialUtils.objectStoreName_]});
  }
};

/**
 * Caches a set of binary specs. Adds a database key to any successfully cached
 * specs.
 * @param {Array<Object|string>} specs
 */
cwc.ui.TutorialUtils.prototype.cacheEmbeddedBinaries = async function(specs) {
  for (let key in specs) {
    if (typeof specs[key] === 'string') {
      specs[key] = {
        'url': specs[key],
      };
    }
  }

  await Promise.all(specs.map(async (spec) => {
    await this.cacheEmbeddedBinary(spec);
  }));
};

/**
 * Adds binary spec (json object with either a url or mime type and base64
 * encoded blob) to the cache and adds the database key to the object.
 * @param {Object|string} spec
 */
cwc.ui.TutorialUtils.prototype.cacheEmbeddedBinary = async function(spec) {
  await this.initImagesDb();
  if ('url' in spec) {
    spec[cwc.ui.TutorialUtils.databaseReferenceKey] =
      await this.ensureUrlInDb_(spec['url']);
      return;
  }
  spec[cwc.ui.TutorialUtils.databaseReferenceKey] =
    await this.ensureObjectInDb_(spec);
};

/**
 * Downloads and caches the url content using the url as the database key.
 * On succes, it will return the URL. On failure (offline, etc.) it will
 * return the boolean 'false'.
 * @param {!string} url
 * @return {string|boolean}
 * @private
 */
cwc.ui.TutorialUtils.prototype.ensureUrlInDb_ = async function(url) {
  let existingData = await this.imagesDb.get(url);
  if (existingData) {
    this.log_.info('Not downloading', url,
      'because it is already in the database');
    return url;
  }

  if (!this.helper.checkFeature('online')) {
    this.log_.warn('Not downloading', url, 'because we are offline');
    return false;
  }

  let blob;
  try {
    blob = await cwc.utils.Resources.getUriAsBlob(url);
  } catch (e) {
    this.log_.warn('Failed to get', url, ':', e);
    return false;
  }
  return await this.ensureBlobInDb_(url, blob);
};

/**
 * @param {!Object} spec
 * @return {!string|boolean}
 * @private
 */
cwc.ui.TutorialUtils.prototype.ensureObjectInDb_ = async function(spec) {
   if (!('mime_type' in spec)) {
    this.log_.warn('No mime_type key in media spec', spec);
    return false;
  }
  if (!('data' in spec)) {
    this.log_.warn('No mime_type data key in media spec', spec);
    return false;
  }
  const binaryData = atob(spec['data']);
  const encodedData = new Uint8Array(binaryData.length);
  for (let i=0; i<binaryData.length; i++) {
    encodedData[i] = binaryData.charCodeAt(i);
  }
  const blob = new Blob([encodedData], {'type': spec['mime_type']});
  let key = goog.string.createUniqueString();
  return await this.ensureBlobInDb_(key, blob, true);
};

/**
 * @param {!string} key
 * @param {!Object} data
 * @param {boolean} warnOnOverwrite
 * @return {string|boolean}
 * @private
 */
cwc.ui.TutorialUtils.prototype.ensureBlobInDb_ =
  async function(key, data, warnOnOverwrite = false) {
  if (warnOnOverwrite) {
    let existingData = await this.imagesDb.get(key);
    if (existingData) {
      this.log_.warn('Overwriting', key);
    }
  }
  if (await this.imagesDb.set(key, data)) {
    return key;
  }
  return false;
};


/**
 * Filters an array of filenames or URLs for those that are videos
 * @param {Array<Objects>} items
 * @param {bool} cachedOnly
 * @return {Array<string>}
 * @export
 */
cwc.ui.TutorialUtils.prototype.getVideoKeys = function(items,
  cachedOnly = true) {
  return this.getKeys(items.filter(this.isVideo_), cachedOnly);
};

/**
 * Filters an array of filenames or URLs for those that are images
 * @param {Array<Objects>} items
 * @param {bool} cachedOnly
 * @return {Array<string>}
 * @export
 */
cwc.ui.TutorialUtils.prototype.getImageKeys = function(items,
  cachedOnly = true) {
  return this.getKeys(items.filter((i) => {
    return !this.isVideo_(i);
  }), cachedOnly);
};

/**
 * Translates an array of media specs into the database keys, filtering items
 * that have no keys.
 * @param {Array<Objects>} items
 * @param {bool} cachedOnly
 * @return {Array<string>}
 * @export
 */
cwc.ui.TutorialUtils.prototype.getKeys = function(items, cachedOnly = true) {
  if (cachedOnly) {
    items = items.filter((item) => {
      return cwc.ui.TutorialUtils.databaseReferenceKey in item;
    });
  }
  return items.map((item) => {
      return item[cwc.ui.TutorialUtils.databaseReferenceKey];
    });
};

/**
 * @param {object|string} item
 * @return {bool}
 * @private
 */
cwc.ui.TutorialUtils.prototype.isVideo_ = function(item) {
  if (typeof item === 'string') {
    item = {
      'url': item,
    };
  }
  if ('url' in item) {
    return cwc.ui.TutorialUtils.videoExtensions.some((ext) => {
      return item['url'].endsWith(ext);
    });
  }
  if ('mime_type' in item) {
    return item['mime_type'].toLowerCase().startsWith('video/');
  }
  this.log_.warn(item, 'is not a media spec');
  return false;
};
