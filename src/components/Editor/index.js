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
 * @fileoverview Editor for the desktop screen.
 */

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import { WindowManager } from '../Desktop/WindowManager';

/**
 *
 */
export class Editor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.windowId = props.windowId;
    this.editorInstance = null;

    // Adding additional event listener for close and refresh.
    if (this.windowId) {
      WindowManager.addResizeEventListener(this.windowId, () => {
        this.resize();
      });
    }
  }

  /**
   * @param {any} newValue
   */
  onChange(newValue) {
    console.log('change', newValue, this.editorInstance);
  }

  /**
   * @param {any} editorInstance
   */
  onLoad(editorInstance) {
    this.editorInstance = editorInstance;
    this.editorInstance.container.style.resize = 'both';
    console.debug('Editor Instance: ', this.editorInstance);
    this.resize();
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.editorInstance) {
      if (this.editorInstance.container) {
        const parentNode = this.editorInstance.container.parentNode;
        if (parentNode.clientHeight > 100 && parentNode.clientWidth > 100) {
          this.editorInstance.container.style.height =
            parentNode.clientHeight + 'px';
          this.editorInstance.container.style.width =
            parentNode.clientWidth + 'px';
          this.editorInstance.resize();
        }
      }
    }
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <AceEditor
          mode="java"
          theme="github"
          onLoad={this.onLoad.bind(this)}
          onChange={this.onChange.bind(this)}
          name={this.windowId + '_editor'}
          editorProps={{ $blockScrolling: true }}
        />
      </React.StrictMode>
    );
  }
}

Editor.propTypes = {
  windowId: PropTypes.string.isRequired,
};
