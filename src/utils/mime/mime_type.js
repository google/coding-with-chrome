/**
 * @fileoverview Support file extensions for Coding with Chrome.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.mime.Type');
goog.provide('cwc.utils.mime.getByType');


/**
 * @enum {!Object.<string>}
 */
cwc.utils.mime.Type = {
  CWC: {
    descr: 'Coding with Chrome file format',
    ext: ['.cwc', '.cwct'],
    type: 'application/cwc+json',
  },
  JAVASCRIPT: {
    descr: 'JavaScript (ECMAScript)',
    ext: ['.js'],
    type: 'application/javascript',
  },
  JSON: {
    descr: 'JSON format',
    ext: ['.json'],
    type: 'application/json',
  },
  OCTET_STREAM: {
    descr: 'Any kind of binary data',
    ext: ['.bin', '.arc'],
    type: 'application/octet-stream',
  },
  OGG: {
    descr: 'OGG',
    ext: ['.ogx'],
    type: 'application/ogg',
  },
  PDF: {
    descr: 'Adobe Portable Document Format (PDF)',
    ext: ['.pdf'],
    type: 'application/pdf',
  },
  RTF: {
    descr: 'Rich Text Format (RTF)',
    ext: ['.rtf'],
    type: 'application/rtf',
  },
  XUL: {
    descr: 'XUL',
    ext: ['.xul'],
    type: 'application/vnd.mozilla.xul+xml',
  },
  SH: {
    descr: 'Bourne shell script',
    ext: ['.sh'],
    type: 'application/x-sh',
  },
  TAR: {
    descr: 'Tape Archive (TAR)',
    ext: ['.tar'],
    type: 'application/x-tar',
  },
  XHTML: {
    descr: 'XHTML',
    ext: ['.xhtml'],
    type: 'application/xhtml+xml',
  },
  BLOCKLY: {
    descr: 'Blockly XML',
    ext: ['.blockly'],
    type: 'application/blockly+xml',
  },
  XML: {
    descr: 'XML',
    ext: ['.xml'],
    type: 'application/xml',
  },
  ZIP: {
    descr: 'ZIP archive',
    ext: ['.zip'],
    type: 'application/zip',
  },
  AAC: {
    descr: 'AAC audio file',
    ext: ['.aac'],
    type: 'audio/aac',
  },
  MIDI: {
    descr: 'Musical Instrument Digital Interface (MIDI)',
    ext: ['.mid', '.midi'],
    type: 'audio/midi',
  },
  OGG_AUDIO: {
    descr: 'OGG audio',
    ext: ['.oga'],
    type: 'audio/ogg',
  },
  WEBM_AUDIO: {
    descr: 'WEBM audio',
    ext: ['.weba'],
    type: 'audio/webm',
  },
  WAV: {
    descr: 'Waveform Audio Format',
    ext: ['.wav'],
    type: 'audio/x-wav',
  },
  TTF: {
    descr: 'TrueType Font',
    ext: ['.ttf'],
    type: 'font/ttf',
  },
  WOFF: {
    descr: 'Web Open Font Format (WOFF)',
    ext: ['.woff'],
    type: 'font/woff',
  },
  WOFF2: {
    descr: 'Web Open Font Format (WOFF)',
    ext: ['.woff2'],
    type: 'font/woff2',
  },
  GIF: {
    descr: 'Graphics Interchange Format (GIF)',
    ext: ['.gif'],
    type: 'image/gif',
  },
  JPEG: {
    descr: 'JPEG images',
    ext: ['.jpeg', '.jpg'],
    type: 'image/jpeg',
  },
  SVG: {
    descr: 'Scalable Vector Graphics (SVG)',
    ext: ['.svg'],
    type: 'image/svg+xml',
  },
  TIFF: {
    descr: 'Tagged Image File Format (TIFF)',
    ext: ['.tif .tiff'],
    type: 'image/tiff',
  },
  PNG: {
    descr: 'Portable Network Graphics (PNG)',
    ext: ['.png'],
    type: 'image/png',
  },
  WEBP: {
    descr: 'WEBP image',
    ext: ['.webp'],
    type: 'image/webp',
  },
  ICON: {
    descr: 'Icon format',
    ext: ['.ico'],
    type: 'image/x-icon',
  },
  COFFEESCRIPT: {
    descr: 'CoffeeScript',
    ext: ['.coffee', '.litcoffee'],
    type: 'application/coffeescript',
  },
  CSS: {
    descr: 'Cascading Style Sheets (CSS)',
    ext: ['.css'],
    type: 'text/css',
  },
  CSV: {
    descr: 'Comma-separated values (CSV)',
    ext: ['.csv'],
    type: 'text/csv',
  },
  HTML: {
    descr: 'HyperText Markup Language (HTML)',
    ext: ['.htm', '.html'],
    type: 'text/html',
  },
  TEXT: {
    descr: '',
    ext: ['.txt'],
    type: 'text/plain',
  },
  PYTHON: {
    descr: 'Python application',
    ext: ['.py'],
    type: 'text/x-python',
  },
  MPEG: {
    descr: 'MPEG Video',
    ext: ['.mpeg'],
    type: 'video/mpeg',
  },
  OGG_VIDEO: {
    descr: 'OGG video',
    ext: ['.ogv'],
    type: 'video/ogg',
  },
  WEBM_VIDEO: {
    descr: 'WEBM video',
    ext: ['.webm'],
    type: 'video/webm',
  },
  MSVIDEO: {
    descr: 'AVI: Audio Video Interleave',
    ext: ['.avi'],
    type: 'video/x-msvideo',
  },
  MARKDOWN: {
    descr: 'Markdown',
    ext: ['.md'],
    type: 'text/markdown',
  },
};


/**
 * @param {!string} type
 * @return {!string}
 */
cwc.utils.mime.getByType = function(type) {
  for (let entry in cwc.utils.mime.Type) {
    if (Object.prototype.hasOwnProperty.call(cwc.utils.mime.Type, entry)) {
      if (cwc.utils.mime.Type[entry].type === type) {
        return cwc.utils.mime.Type[entry];
      }
    }
  }
  return '';
};
