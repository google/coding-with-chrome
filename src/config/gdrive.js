/**
 *
 * @fileoverview GDrive config for Coding in Chrome.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
 * @author efuquen@google.com (Edwin Fuquen)
 */

goog.provide('cwc.config.GDrive');


/**
 * Google Drive config
 * @enum {!Object.<string>|number|string}
 */
cwc.config.GDrive = {
  PAGE_SIZE: 250,
  ORDER_BY: 'folder,modifiedTime desc,name',
  FILE_FIELDS: 'files(id,mimeType,parents,iconLink,modifiedTime,name,owners)',
  FOLDER_MIME_TYPE: 'application/vnd.google-apps.folder',
  EXT_TO_MIME_TYPE: {
    'py': 'text/python',
    'html': 'text/html',
    'cwc': 'application/cwc',
  },
  MIME_TYPES: [
    'text/python',
    'text/html',
    'application/cwc',
  ],
  ACCEPTED_MIME_TYPE_QUERY: '(' +
    'mimeType = \'text/python\' or ' +
    'mimeType = \'text/html\' or ' +
    'mimeType = \'application/cwc\' or ' +
    'mimeType = \'application/vnd.google-apps.folder\')',
};
