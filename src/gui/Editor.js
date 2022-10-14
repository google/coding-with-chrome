/**
 * @license Copyright 2022 The Coding with Chrome Authors.
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Editor for the Coding with Chrome suite.
 */

import React from 'react';
import { render } from 'react-dom';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

import './Editor.css';

/**
 * Editor class
 */
export class EditorGui {
  /**
   * @constructor
   */
  constructor() {
    this.editor = null;
  }

  /**
   * Open Editor
   * @param {HTMLElement|null} targetElement
   */
  open(targetElement = document.getElementById('cwc-editor')) {
    if (!targetElement) {
      console.error('Unable to find target element:', targetElement);
      return;
    }
    render(
      <AceEditor
        mode="java"
        theme="github"
        onChange={this.onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />,
      targetElement
    );
  }

  /**
   * @param {any} newValue
   */
  onChange(newValue) {
    console.log('change', newValue);
  }
}
