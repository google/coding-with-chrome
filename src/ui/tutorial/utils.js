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

goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Database');
goog.require('goog.html.sanitizer.HtmlSanitizer');

/** @const {string} */
cwc.ui.TutorialUtils.databaseReferenceKey = 'dbref';

/** @const {string} */
cwc.ui.TutorialUtils.objectStoreName_ = '__tutorial__';

/** @const {Array<string>} */
cwc.ui.TutorialUtils.videoExtensions = ['mp4', 'webm', 'ogg'];

/**
 * @param {!string} prefix
 * @param {!cwc.utils.Helper} helper
 * @param {cwc.utils.Database} imagesDb
 * @constructor
 * @struct
 * @final
 */
cwc.ui.TutorialUtils = function(prefix, helper, imagesDb) {
  /** @type {string} */
  this.name = 'TutorialUtils';

  /** @type {string} */
  this.tutorialPrefix = prefix;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @type {!cwc.utils.Database} */
  this.imagesDb = imagesDb || null;

  /** @private {Element} */
  this.nodeMediaOverlay_ = null;

  /** @private {Element} */
  this.nodeMediaOverlayClose_ = null;

  /** @private {Element} */
  this.nodeMediaOverlayContent_ = null;

  /** @private {!Array<DOMString>} */
  this.objectURLs_ = [];

   /** @private {boolean} */
   this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {goog.html.sanitizer.HtmlSanitizer} */
  this.sanitizer_ = new goog.html.sanitizer.HtmlSanitizer();
};


/**
 * @param {cwc.utils.Database} imagesDb
 */
cwc.ui.TutorialUtils.prototype.initImagesDb = async function(imagesDb) {
  if (imagesDb) {
    this.imagesDb = imagesDb;
  } else {
    this.imagesDb = new cwc.utils.Database('Tutorial')
      .setObjectStoreName(cwc.ui.TutorialUtils.objectStoreName_);
    await this.imagesDb.open({'objectStoreNames':
      [cwc.ui.TutorialUtils.objectStoreName_]});
  }
};


/**
 * Caches a set of binary specs. Adds a database key to any successfully cached
 * specs.
 * @param {Array<Object>} specs
 * @return {Array<Object>}
 */
cwc.ui.TutorialUtils.prototype.cacheMediaSet = async function(specs) {
  return await Promise.all(specs.map(async (spec) => {
    return await this.cacheMedia(spec);
  }));
};


/**
 * Adds binary spec (json object with either a url or mime type and base64
 * encoded blob) to the cache and adds the database key to the object.
 * @param {Object|string} spec
 * @return {Object}
 */
cwc.ui.TutorialUtils.prototype.cacheMedia = async function(spec) {
  if (typeof spec == 'string') {
    let specObj = {
      'url': spec,
    };
    specObj[cwc.ui.TutorialUtils.databaseReferenceKey] = spec;
    return specObj;
  }
  let db_key = false;
  await this.initImagesDb();
  if ('youtube_id' in spec) {
    let youtubeId = await this.getYouTubeVideoId(spec['youtube_id']);
    if (!youtubeId) {
      return;
    }
    this.log_.warn('Cannot cache youtube thumbnails because CORS disallows it');
    /*
    db_key = await this.ensureUrlInDb_(
      `https://img.youtube.com/vi/${youtubeId}/0.jpg`);
    */
  } else {
    db_key = await this.ensureObjectInDb_(spec);
  }
  if (db_key) {
    spec[cwc.ui.TutorialUtils.databaseReferenceKey] = db_key;
  }
  return spec;
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
  // TODO: Use checksum to avoid multiple copies in db.
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
 * @param {Array<Object>} items
 * @param {boolean} cachedOnly
 * @return {Array<string>}
 * @export
 */
cwc.ui.TutorialUtils.prototype.getVideoKeys = function(items,
  cachedOnly = true) {
  return this.getKeys(items.filter(this.isVideo_), cachedOnly);
};


/**
 * Filters an array of filenames or URLs for those that are images
 * @param {Array<Object>} items
 * @param {boolean} cachedOnly
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
 * @param {Array<Object>} items
 * @param {boolean} cachedOnly
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
 * @return {boolean}
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


/**
 * Captures references to elements needed by the media overlay.
 * @private
 */
cwc.ui.TutorialUtils.prototype.initMediaOverlay_ = function() {
  this.nodeMediaOverlay_ = goog.dom.getElement(this.tutorialPrefix +
    'media-overlay');
  this.nodeMediaOverlayClose_ = goog.dom.getElement(
    this.tutorialPrefix + 'media-overlay-close');
  this.nodeMediaOverlayContent_ = goog.dom.getElement(
    this.tutorialPrefix + 'media-overlay-content');

  this.nodeMediaOverlayClose_.addEventListener('click', () => {
    this.hideMedia_();
  });
};


/**
 * Renders cached media from database to DOM.
 * @param {Element} parentElement
 */
cwc.ui.TutorialUtils.prototype.initMedia_ = function(parentElement) {
  let mediaButtons = parentElement.querySelectorAll(
    `.${this.tutorialPrefix}step-media-item`);
  this.initMediaOverlay_();
  if (!this.imagesDb) {
    this.log_.warn('No images DB, images will not be displayed');
    return;
  }
  mediaButtons.forEach((button) => {
    this.initMediaImage_(button);
    // TODO: display youtube and video thumbnails
  });
};


/**
 * @param {Element} button
 * @private
 */
cwc.ui.TutorialUtils.prototype.initMediaImage_ = function(button) {
  let image = button.querySelector('img');
  if (!image) {
    this.log_.info('No image for button', button);
    return;
  }
  let imageSrc = button.getAttribute('data-media-src');
  if (!imageSrc) {
    this.log_.error('Failed to get data-media-src for', button);
    return;
  }
  this.imagesDb.get(imageSrc).then((blob) => {
    if (blob) {
      let objectURL = URL.createObjectURL(blob);
      image.src = objectURL;
      this.objectURLs_.push(objectURL);
    } else {
      this.log_.warn('Removing image', image, 'for button', button,
        'because it is not in the database');
      image.remove();
    }
  });
};


/**
 * Shows media in a full screen overlay.
 * @param {Element} button
 * @private
 */
cwc.ui.TutorialUtils.prototype.onMediaClick_ = async function(button) {
  let mediaType = button.getAttribute('data-media-type');
  if (!mediaType) {
    this.log_.error('Media button', button, 'has no data-media-type attribute');
    return;
  }
  let mediaSrc = button.getAttribute('data-media-src');
  if (!mediaSrc) {
    this.log_.error('Media button', button, 'has no data-media-src attribute');
    return;
  }

  switch (mediaType) {
    case 'image': {
      let mediaImg = button.querySelector('img');
      if (!mediaImg) {
        this.log_.error('No image for button', button);
        return;
      }
      let clone = mediaImg.cloneNode(true);
      clone.removeAttribute('class');
      this.showMedia_(clone);
      break;
    }
    case 'youtube': {
      let content = document.createElement(this.webviewSupport_ ? 'webview' :
        'iframe');
      let videoId = await this.getYouTubeVideoId(mediaSrc);
      if (videoId) {
        content.src = `https://www.youtube-nocookie.com/embed/${videoId}/?rel=0&amp;autoplay=0&showinfo=0`;
        this.showMedia_(content);
      }
      break;
    }
    case 'video': {
      let video = document.createElement('video');
      this.imagesDb.get(mediaSrc).then((blob) => {
        if (blob) {
          let objectURL = URL.createObjectURL(blob);
          video.src = objectURL;
          this.objectURLs_.push(objectURL);
          video.controls = true;
          this.showMedia_(video);
        } else {
          video.remove();
        }
      });
      break;
    }
    default: {
      this.log_.error('Unknown media type', mediaType, 'for button', button);
    }
  }
};


/**
 * Strips potentially malicious URL bits
 * @param {string} youtubeUrl
 * @return {string}
 */
cwc.ui.TutorialUtils.prototype.getYouTubeVideoId = async function(youtubeUrl) {
  let videoId = youtubeUrl.replace(/^http(s):\/\/[^/]\/(embed\/?)?/, '');
  try {
    let url = new URL(`https://youtu.be/${encodeURI(videoId)}`);
    return url.pathname.toString().replace(/^\//, '');
  } catch (e) {
    this.log_.error(youtubeUrl,
      'does not appear to be a YouTube video ID or URL', e);
  }
  // TODO: Validate Video ID against gdata.youtube.com
  return '';
};


/**
 * Closes media overlay.
 * @private
 */
cwc.ui.TutorialUtils.prototype.hideMedia_ = function() {
  while (this.nodeMediaOverlayContent_.firstChild) {
    this.nodeMediaOverlayContent_.firstChild.remove();
  }
  this.nodeMediaOverlay_.classList.add('is-hidden');
};


/**
 * Shows media overlay with the provided element.
 * @param {!Element} media
 * @private
 */
cwc.ui.TutorialUtils.prototype.showMedia_ = function(media) {
  this.nodeMediaOverlayContent_.appendChild(media);
  this.nodeMediaOverlay_.classList.remove('is-hidden');
};


/**
 * Sets initial state for each step button.
 * @param {Element} parentElement
 * @private
 */
cwc.ui.TutorialUtils.prototype.initStepMediaButtons_ = function(parentElement) {
  let mediaButtons = parentElement.querySelectorAll(
    `.${this.tutorialPrefix}step-media-expand`);
  mediaButtons.forEach((toggle) => {
    goog.events.listen(toggle, goog.events.EventType.CLICK,
      this.onMediaClick_.bind(this, toggle));
  });
};


/**
 * Clears references to elements
 */
cwc.ui.TutorialUtils.prototype.clear = function() {
  this.imagesDb = null;
  this.nodeMediaOverlay_ = null;
  this.nodeMediaOverlayClose_ = null;
  this.nodeMediaOverlayContent_ = null;
  while (this.objectURLs_.length > 0) {
    URL.revokeObjectURL(this.objectURLs_.pop());
  }
};


/**
 * @param {!Object} textObject
 * @return {!string}
 */
cwc.ui.TutorialUtils.prototype.sanitizeTextObject = function(textObject) {
  if (!this.validateTextObject_(textObject)) {
    return '';
  }

  let html = '';
  switch (textObject['mime_type']) {
    case cwc.utils.mime.Type.HTML.type: {
      html = textObject['text'];
      break;
    }
    case cwc.utils.mime.Type.MARKDOWN.type: {
      if (this.helper.checkJavaScriptFeature('marked')) {
        html = marked(textObject['text']);
      } else {
        this.log_.warn('Markdown not supported, displaying textObject text',
          textObject);
        html = textObject['text'];
      }
      break;
    }
    case cwc.utils.mime.Type.TEXT.type: {
      let node = document.createElement('div');
      node.appendChild(document.createTextNode(textObject['text']));
      html = node.innerHTML;
      break;
    }
    default: {
      this.log_.error('Unknown or unsupported mime type',
        textObject['mime_type']);
    }
  }
  return this.sanitizeHtml(html);
};


/**
 * @param {!string} html
 * @return {!string}
 */
cwc.ui.TutorialUtils.prototype.sanitizeHtml = function(html) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(
    goog.html.SafeHtml.unwrap(this.sanitizer_.sanitize(html)));
};


/**
 * @param {!Object} textObject
 * @return {boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.validateTextObject_ = function(textObject) {
  if (typeof textObject !== 'object') {
    this.log_.error('Invalid textObject, not an object', textObject);
    return false;
  }
  if (typeof textObject['text'] !== 'string') {
    this.log_.error('Invalid textObject, text key missing or not a string',
      textObject);
    return false;
  }
  if (typeof textObject['mime_type'] !== 'string') {
    this.log_.error('Invalid textObject, mime_type key missing or not a string',
      textObject);
    return false;
  }
  return true;
};
