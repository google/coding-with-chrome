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
 * @param {!string} opt_body
 * @param {string=} opt_header
 * @param {string=} opt_css
 * @param {string=} opt_javascript
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTML = function(opt_body, opt_header,
    opt_css, opt_javascript) {
  return cwc.soy.Renderer.html({
    body: this.sanitizedHtml_(opt_body),
    head: this.sanitizedHtml_(opt_header),
    css: this.sanitizedCss_(opt_css),
    js: this.sanitizedJs_(opt_javascript),
  });
};


/**
 * @param {!string} opt_body
 * @param {string=} opt_header
 * @param {string=} opt_css
 * @param {string=} opt_javascript
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLGrid = function(opt_body, opt_header,
    opt_css, opt_javascript) {
  return cwc.soy.Renderer.htmlGrid({
    body: this.sanitizedHtml_(opt_body),
    head: this.sanitizedHtml_(opt_header),
    css: this.sanitizedCss_(opt_css),
    js: this.sanitizedJs_(opt_javascript),
  });
};


/**
 * @param {!string} opt_body
 * @param {string=} opt_header
 * @param {string=} opt_css
 * @param {string=} opt_javascript
 * @param {string=} canvas
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLCanvas = function(opt_body, opt_header,
    opt_css, opt_javascript, canvas = 'canvas-chrome') {
  return cwc.soy.Renderer.html({
    body: this.sanitizedHtml_(opt_body),
    head: this.sanitizedHtml_(opt_header),
    css: this.sanitizedCss_(opt_css),
    js: this.sanitizedJs_(opt_javascript),
    canvas: canvas,
  });
};


/**
 * @param {!string} html
 * @param {string=} opt_header
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getRawHTML = function(html, opt_header) {
  if (!html) {
    return '';
  }
  if (opt_header) {
    if (html.includes('</head>')) {
      return html.replace('</head>', opt_header + '\n</head>');
    } else if (html.includes('<body')) {
      return html.replace('<body',
        '<head>\n' + opt_header + '\n</head>\n<body');
    } else if (html.includes('<html>')) {
      return html.replace('<html>',
        '<html>\n<head>\n' + opt_header + '\n</head>\n');
    } else if (!html.includes('<html')) {
      return '<head>\n' + opt_header + '\n</head>\n' + html;
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
cwc.renderer.Helper.prototype.getObjectTag = function(data_url,
    width = 400, height = 400) {
  return cwc.soy.Renderer.objectTemplate({
    data_url: this.sanitizedUri_(data_url),
    type: 'text/html',
    width: width,
    height: height,
  });
};


/**
 * Returns data encoded content.
 * @param {!string} content
 * @param {string=} type
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.getDataUrl = function(content,
    type = 'text/html') {
  if (goog.isString(content) && goog.string.startsWith(content, 'data:')) {
    return content;
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
  });
};


/**
 * @param {!string} url
 * @param {string=} filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptUrl = function(url,
    filename = undefined) {
  return cwc.soy.Renderer.javaScriptUrl({
    url: url,
    filename: filename,
  });
};


/**
 * @param {!string} data
 * @param {string=} encoding default: base64
 * @param {string=} filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptDataUrl = function(data,
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
  });
};


/**
 * @param {!string} data
 * @param {string=} encoding default: base64
 * @param {string=} filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getStyleSheetDataUrl = function(data,
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
  });
};


/**
 * @param {!string} filename
 * @param {!cwc.file.Files} files
 * @return {string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeader = function(filename, files) {
  let file = files.getFile(filename);
  if (!file) {
    console.warn('Was unable to get file:', filename);
    return '';
  }
  return this.getJavaScriptDataUrl(file.getContent(), undefined, filename);
};


/**
 * @param {!Array} filenames
 * @param {!cwc.file.Files} renderer_frameworks
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeaders = function(filenames,
    renderer_frameworks) {
  let headers = '';
  for (let filename in filenames) {
    if (Object.prototype.hasOwnProperty.call(filenames, filename)) {
      headers += this.getFrameworkHeader(filenames[filename],
        renderer_frameworks);
    }
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
    console.warn('Was unable to get file:', filename);
    return '';
  }
  return this.getStyleSheetDataUrl(file.getContent(), filename);
};


/**
 * @param {!string} css
 * @return {!goog.soy.data.SanitizedCss}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedCss_ = function(css) {
  if (!css) {
    return '';
  }
  return soydata.VERY_UNSAFE.ordainSanitizedCss(css);
};


/**
 * @param {!string} javascript
 * @return {!goog.soy.data.SanitizedJs}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedJs_ = function(javascript) {
  if (!javascript) {
    return '';
  }
  return soydata.VERY_UNSAFE.ordainSanitizedJs(javascript);
};


/**
 * @param {!string} html
 * @return {!goog.soy.data.SanitizedHtml}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedHtml_ = function(html) {
  if (!html) {
    return '';
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(html);
};


/**
 * @param {!string} uri
 * @return {!goog.soy.data.SanitizedUri}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedUri_ = function(uri) {
  if (!uri) {
    return '';
  }
  return soydata.VERY_UNSAFE.ordainSanitizedUri(uri);
};
