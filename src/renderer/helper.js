/**
 * @fileoverview Renderer for the Coding with Chrome editor.
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
goog.provide('cwc.renderer.Helper');

goog.require('cwc.soy.Renderer');

goog.require('soydata');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.renderer.Helper = function() {};


/**
 * @param {!string} content Content to modify.
 * @param {!cwc.file.Files} files
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.injectFiles = function(content, files) {
  let fileReplace = function(unused_result, file_id) {
    let fileContent = files.getFileContent(file_id);
    return fileContent;
  };
  return content.replace(/{{ file:(.+) }}/gi, fileReplace);
};


/**
 * @param {string} content Content to modify.
 * @param {string} text Text to prepend if not already in content.
 * @return {string}
 * @export
 */
cwc.renderer.Helper.prototype.prependText = function(content, text) {
  if (content && text) {
    if (!content.includes(text)) {
      return text + '\n' + content;
    }
  }
  return content;
};


/**
 * @param {string=} body
 * @param {string=} header
 * @param {string=} css
 * @param {string=} javascript
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTML = function(body, header, css,
    javascript) {
  return cwc.soy.Renderer.html({
    body: body ? this.sanitizedHtml_(body) : '',
    head: header ? this.sanitizedHtml_(header) : '',
    css: css ? this.sanitizedCss_(css) : '',
    js: javascript ? this.sanitizedJs_(javascript) : '',
  }).getContent();
};


/**
 * @param {!string} body
 * @param {string=} header
 * @param {string=} css
 * @param {string=} javascript
 * @param {string=} canvas
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLCanvas = function(body, header, css,
    javascript, canvas = 'canvas-chrome') {
  return cwc.soy.Renderer.html({
    body: body ? this.sanitizedHtml_(body) : '',
    head: header ? this.sanitizedHtml_(header) : '',
    css: css ? this.sanitizedCss_(css) : '',
    js: javascript ? this.sanitizedJs_(javascript) : '',
    canvas: canvas,
  }).getContent();
};


/**
 * @param {string=} body
 * @param {string=} header
 * @param {string=} css
 * @param {string=} javascript
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLGrid = function(body, header, css,
    javascript) {
  return cwc.soy.Renderer.htmlGrid({
    body: body ? this.sanitizedHtml_(body) : '',
    head: header ? this.sanitizedHtml_(header) : '',
    css: css ? this.sanitizedCss_(css) : '',
    js: javascript ? this.sanitizedJs_(javascript) : '',
  }).getContent();
};


/**
 * @param {string=} body
 * @param {string=} header
 * @param {object=} environ
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLRunner = function(body, header,
    environ = {}) {
  header += this.getStyleSheetURL(
    /** @type {string} */ (cwc.framework.StyleSheet.RUNNER), 'Runner CSS',
    environ['baseURL']);
  return cwc.soy.Renderer.htmlRunner({
    body: body ? this.sanitizedHtml_(body) : '',
    head: header ? this.sanitizedHtml_(header) : '',
  }).getContent();
};


/**
 * @param {!string} html
 * @param {string=} header
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getRawHTML = function(html, header) {
  if (!html) {
    return '';
  }
  if (header) {
    if (html.includes('</head>')) {
      return html.replace('</head>', header + '\n</head>');
    } else if (html.includes('<body')) {
      return html.replace('<body',
        '<head>\n' + header + '\n</head>\n<body');
    } else if (html.includes('<html>')) {
      return html.replace('<html>',
        '<html>\n<head>\n' + header + '\n</head>\n');
    } else if (!html.includes('<html')) {
      return '<head>\n' + header + '\n</head>\n' + html;
    }
  }
  return html;
};


/**
 * @param {!string} data_url
 * @param {number=} width
 * @param {number=} height
 * @return {string} Rendered content as object.
 * @export
 */
cwc.renderer.Helper.prototype.getObjectTag = function(data_url, width = 400,
    height = 400) {
  return cwc.soy.Renderer.objectTemplate({
    data_url: this.sanitizedUri_(data_url),
    type: 'text/html',
    width: width,
    height: height,
  }).getContent();
};


/**
 * Returns data encoded content.
 * @param {!string} content
 * @param {string=} type
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.getDataURL = function(content,
    type = 'text/html') {
  if (goog.isString(content) && goog.string.startsWith(content, 'data:')) {
    return content;
  }
  if (type == 'application/javascript') {
    type = 'text/javascript';
  }
  let dataUrl = '';
  try {
    dataUrl = 'data:' + type + ';base64,' + btoa(content);
  } catch (err) {
    dataUrl = 'data:' + type + ';charset=utf-8,' +
      encodeURIComponent(content);
  }

  return dataUrl;
};


/**
 * @param {!string} content
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptContent = function(content) {
  return cwc.soy.Renderer.javaScriptContent({
    content: this.sanitizedJs_(content),
  }).getContent();
};


/**
 * @param {!string} url
 * @param {string=} filename
 * @param {string=} baseUrl
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptURL = function(url, filename,
    baseUrl) {
  return cwc.soy.Renderer.javaScriptUrl({
    url: (baseUrl || '') + url,
    filename: filename || url,
  }).getContent();
};


/**
 * @param {!Array.<string>} filenames
 * @param {string=} baseUrl
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getJavaScriptURLs = function(filenames, baseUrl) {
  let headers = '';
  for (let filename of filenames) {
    headers += this.getJavaScriptURL(filename, filename, baseUrl);
  }
  return headers;
};


/**
 * @param {!string} data
 * @param {string=} encoding default: base64
 * @param {string=} filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptDataURL = function(data,
    encoding = 'base64', filename = '') {
  if (goog.string.startsWith(data, 'data:text/javascript;')) {
    data = data.split(';')[1];
    if (data.includes(',')) {
      let dataFragments = data.split(',');
      encoding = dataFragments[0];
      data = dataFragments[1];
    }
  }

  return cwc.soy.Renderer.javaScriptDataUrl({
    data: data,
    encoding: encoding,
    filename: filename,
  }).getContent();
};


/**
 * @param {!string} url
 * @param {string=} filename
 * @param {string=} baseUrl
 * @return {string}
 */
cwc.renderer.Helper.prototype.getStyleSheetURL = function(url, filename,
    baseUrl) {
  return cwc.soy.Renderer.styleSheetUrl({
    url: (baseUrl || '') + url,
    filename: filename || url,
  }).getContent();
};


/**
 * @param {!string} data
 * @param {string=} encoding default: base64
 * @param {string=} filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getStyleSheetDataURL = function(data,
    encoding = 'base64', filename = '') {
  if (goog.string.startsWith(data, 'data:text/css;')) {
    data = data.split(';')[1];
    if (data.includes(',')) {
      let dataFragments = data.split(',');
      encoding = dataFragments[0];
      data = dataFragments[1];
    }
  }

  return cwc.soy.Renderer.styleSheetDataUrl({
    data: data,
    encoding: encoding,
    filename: filename,
  }).getContent();
};


/**
 * @param {!string} filename
 * @param {!cwc.file.Files} files
 * @return {string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeader = function(filename, files) {
  let file = files.getFile(filename);
  if (!file) {
    return '';
  }
  return this.getJavaScriptDataURL(file.getContent(), undefined, filename);
};


/**
 * @param {!Array.<string>} filenames
 * @param {!cwc.file.Files} files
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeaders = function(filenames, files) {
  let headers = '';
  for (let filename of filenames) {
    headers += this.getFrameworkHeader(filename, files);
  }
  return headers;
};


/**
 * @param {!string} filename
 * @param {!cwc.file.Files} files
 * @return {string}
 */
cwc.renderer.Helper.prototype.getStyleSheetHeader = function(filename, files) {
  let file = files.getFile(filename);
  if (!file) {
    return '';
  }
  return this.getStyleSheetDataURL(file.getContent(), filename);
};


/**
 * @param {!string} css
 * @return {!string}
 * @suppress {invalidCasts}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedCss_ = function(css = '') {
  return /** @type {string} */ (soydata.VERY_UNSAFE.ordainSanitizedCss(css));
};


/**
 * @param {!string} javascript
 * @return {!string}
 * @suppress {invalidCasts}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedJs_ = function(javascript = '') {
  return /** @type {string} */ (
    soydata.VERY_UNSAFE.ordainSanitizedJs(javascript));
};


/**
 * @param {!string} html
 * @return {!string}
 * @suppress {invalidCasts}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedHtml_ = function(html = '') {
  return /** @type {string} */ (soydata.VERY_UNSAFE.ordainSanitizedHtml(html));
};


/**
 * @param {!string} uri
 * @return {!string}
 * @suppress {invalidCasts}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedUri_ = function(uri = '') {
  return /** @type {string} */ (soydata.VERY_UNSAFE.ordainSanitizedUri(uri));
};
