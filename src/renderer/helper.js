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
 * @param {string} content Content to mofify.
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
    js: this.sanitizedJs_(opt_javascript)
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
    js: this.sanitizedJs_(opt_javascript)
  });
};


/**
 * @param {!string} opt_body
 * @param {string=} opt_header
 * @param {string=} opt_css
 * @param {string=} opt_javascript
 * @param {string=} opt_canvas
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getHTMLCanvas = function(opt_body, opt_header,
    opt_css, opt_javascript, opt_canvas) {
  return cwc.soy.Renderer.html({
    body: this.sanitizedHtml_(opt_body),
    head: this.sanitizedHtml_(opt_header),
    css: this.sanitizedCss_(opt_css),
    js: this.sanitizedJs_(opt_javascript),
    canvas: opt_canvas || 'canvas-chrome'
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
 * @param {number=} opt_width
 * @param {number=} opt_height
 * @return {string} Rendered content as object.
 * @export
 */
cwc.renderer.Helper.prototype.getObjectTag = function(data_url,
    opt_width, opt_height) {
  return cwc.soy.Renderer.objectTemplate({
    data_url: this.sanitizedUri_(data_url),
    type: 'text/html',
    width: opt_width || 400,
    height: opt_height || 400
  });
};


/**
 * Returns data encoded content.
 * @param {!string} content
 * @param {string=} opt_type
 * @return {!string}
 * @export
 */
cwc.renderer.Helper.prototype.getDataUrl = function(content,
    opt_type) {
  if (goog.isString(content) && goog.string.startsWith(content, 'data:')) {
    return content;
  }

  var dataUrl = '';
  var dataType = opt_type || 'text/html';

  try {
    dataUrl = 'data:' + dataType + ';base64,' + btoa(content);
  } catch (err) {
    dataUrl = 'data:' + dataType + ';charset=utf-8,' +
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
    content: this.sanitizedJs_(content)
  });
};


/**
 * @param {!string} url
 * @param {string=} opt_filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptUrl = function(url, opt_filename) {
  return cwc.soy.Renderer.javaScriptUrl({
    url: url,
    filename: opt_filename
  });
};


/**
 * @param {!string} data
 * @param {string=} opt_encoding default: base64
 * @param {string=} opt_filename
 * @return {string}
 */
cwc.renderer.Helper.prototype.getJavaScriptDataUrl = function(data,
    opt_encoding, opt_filename) {
  var encoding = opt_encoding || 'base64';
  var filename = opt_filename;

  if (goog.string.startsWith(data, 'data:text/javascript;')) {
    data = data.split(';')[1];
    if (data.includes(',')) {
      var dataFragments = data.split(',');
      encoding = dataFragments[0];
      data = dataFragments[1];
    }
  }

  return cwc.soy.Renderer.javaScriptDataUrl({
    data: data,
    encoding: encoding,
    filename: filename
  });
};


/**
 * @param {!string} filename
 * @param {!cwc.file.Files} renderer_frameworks
 * @return {string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeader = function(filename,
    renderer_frameworks) {
  var framework = renderer_frameworks.getFile(filename);
  if (!framework) {
    console.warn('Was unable to get framework file:', filename);
    return '';
  }
  return this.getJavaScriptDataUrl(framework.getContent(), filename);
};


/**
 * @param {!array} filenames
 * @param {!cwc.file.Files} renderer_frameworks
 * @return {!string}
 */
cwc.renderer.Helper.prototype.getFrameworkHeaders = function(filenames,
    renderer_frameworks) {
  var headers = '';
  for (let filename in filenames) {
    headers += this.getFrameworkHeader(filenames[filename],
      renderer_frameworks);
  }
  return headers;
};


/**
 * @param {!string} css
 * @return {!string}
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
 * @return {!string}
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
 * @return {!string}
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
 * @return {!string}
 * @private
 */
cwc.renderer.Helper.prototype.sanitizedUri_ = function(uri) {
  if (!uri) {
    return '';
  }
  return soydata.VERY_UNSAFE.ordainSanitizedUri(uri);
};
