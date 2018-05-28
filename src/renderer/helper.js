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
 * @param {!string} content Content to modify.
 * @param {string=} baseURL
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.injectURLs = function(content, baseURL) {
  let urlReplace = function(unused_result, url) {
    return (baseURL || '') + url;
  };
  return content.replace(/{{ url:(.+) }}/gi, urlReplace);
};


/**
 * @param {!string} content
 * @param {string=} baseURL
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.cacheURLs = function(content, baseURL) {
  let urlPattern = /{{ url:(.+) }}/gi;
  let urls = [];
  let results;
  while ((results = urlPattern.exec(content)) !== null) {
    urls.push(results[1]);
  }
  return this.getCachedURLs(urls, baseURL);
};


/**
 * @param {!Array} urls
 * @param {string=} baseURL
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.getCachedURLs = function(urls, baseURL) {
  if (!urls || urls.length === 0) {
    return '';
  }
  let result = '';
  for (let url of urls) {
    let finalURL= (baseURL || '') + url;
    if (url.endsWith('.mp3') || url.endsWith('.ogg')) {
      result += '<audio src="' + finalURL + '"></audio>';
    }
  }
  return result;
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
 * @param {string=} content
 * @param {string=} headers
 * @param {Object=} environ
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getRunner = function(content, headers = [],
    environ = {}) {
  let body = '';
  let header = '';
  if (environ['currentView'] === '__python__') {
    headers.push(cwc.framework.External.BRYTHON.CORE);
    headers.push(cwc.framework.External.BRYTHON.STDLIB);
    body = '<script type="text/python">\n' +
      'from browser import window\n' +
        content + '\n' +
      '</script>' +
      '<script>' +
      '  brython();' +
      '</script>';
  } else {
    body = '\n<script>' + content + '</script>\n';
  }
  if (environ['devices']) {
    header += '<script>window[\'__DEVICES__\'] = ' +
      JSON.stringify(environ['devices']) + ';</script>\n';
  }
  header += this.getJavaScriptURLs(headers, environ['baseURL']);
  return this.getHTMLRunner(body, header, environ);
};


/**
 * @param {string=} body
 * @param {string=} header
 * @param {Object=} environ
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
 * @param {string=} javascript
 * @param {string=} header
 * @param {string=} body
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getJavaScript = function(javascript, header,
    body) {
  return cwc.soy.Renderer.html({
    body: body ? this.sanitizedHtml_(body) : '',
    head: header ? this.sanitizedHtml_(header) : '',
    js: javascript ? this.sanitizedJs_(javascript) : '',
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
 * @param {string=} baseURL
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptURL = function(url, filename,
    baseURL) {
  return cwc.soy.Renderer.javaScriptUrl({
    url: (baseURL || '') + url,
    filename: filename || url,
  }).getContent();
};


/**
 * @param {!Array.<string>} filenames
 * @param {string=} baseURL
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getJavaScriptURLs = function(filenames, baseURL) {
  let headers = '';
  for (let filename of filenames) {
    headers += this.getJavaScriptURL(filename, filename, baseURL);
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
 * @param {string=} baseURL
 * @return {string}
 */
cwc.renderer.Helper.prototype.getStyleSheetURL = function(url, filename,
    baseURL) {
  return cwc.soy.Renderer.styleSheetUrl({
    url: (baseURL || '') + url,
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
 * @param {!string} name
 * @param {!cwc.Cache} cache
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getCacheFileHeader = function(name, cache) {
  let fileContent = cache.getPreloadedFile(name);
  if (!fileContent) {
    return '';
  }
  return this.getJavaScriptDataURL(fileContent, undefined, name);
};


/**
 * @param {!Array} names
 * @param {!cwc.Cache} cache
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getCacheFilesHeader = function(names, cache) {
  let headers = '';
  for (let name of names) {
    headers += this.getCacheFileHeader(name, cache);
  }
  return headers;
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
