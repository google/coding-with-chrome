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

import { javascriptGenerator } from 'blockly/javascript';

import { BlockEditor } from '../BlockEditor';
import { Toolbox } from './toolbox';

/**
 *
 */
export class GameEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.windowId = props.windowId;
    this.blockyWorkspace = null;

    this.state = {
      xml: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>',
      javascriptCode: '',
    };
  }

  /**
   *
   */
  showCodeEditor() {
    console.log('Show Code Editor ...');
    const code = javascriptGenerator.workspaceToCode(this.blockyWorkspace);
    console.log(code);
  }

  /**
   * @param {any} newValue
   */
  onChange(newValue) {
    console.log('change', newValue, this.blockyWorkspace);
  }

  /**
   * @param {any} blockEditorInstance
   */
  onLoad(blockEditorInstance) {
    this.blockyWorkspace = blockEditorInstance;
    console.debug('Editor Instance: ', this.blockyWorkspace);
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    if (this.blockyWorkspace) {
      console.log(this.blockyWorkspace);
      window.dispatchEvent(new Event('resize'));
    }
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <BlockEditor
          content={this.state.xml}
          toolbox={Toolbox.getToolbox()}
          windowId={this.props.windowId}
        />
      </React.StrictMode>
    );
  }
}

GameEditor.propTypes = {
  windowId: PropTypes.string.isRequired,
};
