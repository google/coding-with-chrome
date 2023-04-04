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

import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Mosaic } from 'react-mosaic-component';
import { v4 as uuidv4 } from 'uuid';

import GameSetupScreen from './GameSetupScreen';
import PhaserTemplate from './template/PhaserTemplate';
import ProjectNameGenerator from './generator/ProjectNameGenerator';
import { BlockEditor } from '../BlockEditor/BlockEditor';
import { Preview } from '../Preview';
import { Toolbox } from './toolbox/Toolbox';

import 'react-mosaic-component/react-mosaic-component.css';
import styles from './style.module.css';
import { PreviewService } from '../../service-worker/preview-service-worker';

/**
 *
 */
export class GameEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      projectName: ProjectNameGenerator.generate(i18next.resolvedLanguage),
      projectId: uuidv4(),
      projectDescription: '',
      showGameSetupScreen: true,
      xml: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    };
    this.previewRef = React.createRef();
    this.blockEditorRef = React.createRef();
  }

  /**
   * @param {Object} opt_event
   */
  handleMosaicOnChange(opt_event) {
    if (this.previewRef) {
      this.previewRef.current.hideContent();
    }
  }

  /**
   * @param {Object} opt_event
   */
  handleMosaicOnRelease(opt_event) {
    if (this.previewRef) {
      this.previewRef.current.showContent();
      this.previewRef.current.reload();
    }
  }

  /**
   * @param {Object} event
   */
  handleDragOver(event) {
    console.log('Drag Over', event);
  }

  /**
   * @return {Object}
   */
  getLayout() {
    return {
      blockEditor: (
        <BlockEditor
          ref={this.blockEditorRef}
          content={this.state.xml}
          toolbox={Toolbox.getToolbox()}
          template={PhaserTemplate.render}
          onChange={this.handleBlockEditorContentChange.bind(this)}
          projectId={this.state.projectId}
          windowId={this.props.windowId}
        />
      ),
      preview: (
        <Preview
          ref={this.previewRef}
          base={`preview/${this.state.projectId}/`}
        />
      ),
      assets: <div>Assets Window</div>,
    };
  }

  /**
   * @param {uuidv4} projectId
   * @param {string} projectName
   * @param {string} projectDescription
   * @param {string} xml
   */
  handleGameSetupScreenClose(
    projectId,
    projectName = '',
    projectDescription = '',
    xml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'
  ) {
    // Separate steps to make sure xml is updated before showing the editor.
    this.setState(
      {
        projectId,
        projectName,
        projectDescription,
        xml,
      },
      () => {
        this.setState({ showGameSetupScreen: false });
      }
    );
  }

  /**
   * @param {string} code
   */
  handleBlockEditorContentChange(code) {
    PreviewService.saveHTMLFile(`${this.state.projectId}/`, code).then(() => {
      this.previewRef.current.goToHomePage();
    });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <GameSetupScreen
          projectId={this.state.projectId}
          open={this.state.showGameSetupScreen}
          onClose={this.handleGameSetupScreenClose.bind(this)}
        ></GameSetupScreen>
        {!this.state.showGameSetupScreen && (
          <Box className={styles.layout}>
            <Mosaic
              renderTile={(id) => this.getLayout()[id]}
              onChange={this.handleMosaicOnChange.bind(this)}
              onRelease={this.handleMosaicOnRelease.bind(this)}
              initialValue={{
                direction: 'row',
                first: 'blockEditor',
                second: {
                  direction: 'column',
                  first: 'preview',
                  second: 'assets',
                },
                splitPercentage: 75,
              }}
            />
          </Box>
        )}
      </React.StrictMode>
    );
  }
}

GameEditor.propTypes = {
  windowId: PropTypes.string,
};

export default GameEditor;
