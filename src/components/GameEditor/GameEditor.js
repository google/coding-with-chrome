/**
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 * @fileoverview Game Editor.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { lazy } from 'react';

import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Mosaic } from 'react-mosaic-component';
import { v4 as uuidv4 } from 'uuid';

import PhaserTemplate from './template/PhaserTemplate';
import ProjectNameGenerator from './generator/ProjectNameGenerator';
import { Toolbox } from './toolbox/Toolbox';

const GameSetupScreen = lazy(() => import('./GameSetupScreen'));
const BlockEditor = lazy(() => import('../BlockEditor'));
const Preview = lazy(() => import('../Preview'));

import 'react-mosaic-component/react-mosaic-component.css';
import styles from './style.module.css';
import { PreviewService } from '../../service-worker/preview-service-worker';
import BlocklyTemplate from './template/BlocklyTemplate';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { WorkspaceSvg } from 'react-blockly';

/**
 *
 */
export class GameEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    // Extract projectId and projectName from URL, if available.
    let projectId;
    let projectName;
    const urlData = window.location.hash
      .replace('#/game_editor/', '')
      .replace('#/game_editor', '')
      .split('/');
    if (urlData.length === 2) {
      projectId = urlData[0];
      projectName = decodeURIComponent(urlData[1]);
      console.debug(
        `[GameEditor] Found project ID ${projectId} and name ${projectName} in URL.`
      );
    } else {
      console.debug(
        `[GameEditor] No project ID and name found in URL. Showing Game Setup screen.`
      );
    }
    const hasProjectData = projectId && projectName;

    // Create references.
    this.previewRef = React.createRef();
    this.blockEditorRef = React.createRef();

    // Set initial state.
    this.state = {
      projectName:
        projectName || ProjectNameGenerator.generate(i18next.resolvedLanguage),
      projectId: projectId || uuidv4(),
      projectDescription: '',
      showGameSetupScreen: !hasProjectData,
      toolbox: Toolbox.getToolbox(),
      xml: hasProjectData
        ? BlocklyTemplate.render(projectName)
        : '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    };
  }

  /**
   * Hide specific content on drag event.
   */
  handleMosaicOnChange() {
    if (this.previewRef) {
      this.previewRef.current.hideContent();
    }
  }

  /**
   * Restore specific content on drop event.
   */
  handleMosaicOnRelease() {
    if (this.previewRef) {
      this.previewRef.current.showContent();
      this.previewRef.current.reload();
    }
    if (this.blockEditorRef) {
      this.blockEditorRef.current.resize();
    }
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
          toolbox={this.state.toolbox}
          template={PhaserTemplate.render}
          parseXML={this.handleParseXML.bind(this)}
          onChange={this.handleBlockEditorContentChange.bind(this)}
          onLoadFile={this.handleOnLoadFile.bind(this)}
          onSaveFile={this.handleOnSaveFile.bind(this)}
          projectId={this.state.projectId}
          projectName={this.state.projectName}
          windowId={this.props.windowId}
        />
      ),
      preview: (
        <Preview
          ref={this.previewRef}
          base={`preview/${this.state.projectId}/`}
          readOnly={true}
          hideURL={true}
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
    // Update url with new project id and project name.
    window.location.hash = `#/game_editor/${projectId}/${encodeURIComponent(
      projectName
    )}`;

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
   * @param {string} xml
   * @return {string}
   */
  handleParseXML(xml) {
    return xml;
  }

  /**
   * @param {WorkspaceSvg} workspace
   */
  handleOnLoadFile(workspace) {
    // Add dynamic image blocks to toolbox.
    const phaserLoadImageBlocks = workspace.getBlocksByType(
      'phaser_load_image',
      true
    );
    if (phaserLoadImageBlocks.length > 0) {
      const dynamicImages = new Map();
      for (const phaserLoadImageBlock of phaserLoadImageBlocks) {
        if (
          phaserLoadImageBlock &&
          phaserLoadImageBlock['childBlocks_'].length === 1 &&
          phaserLoadImageBlock['childBlocks_'][0]['type'] ==
            'dynamic_image_file'
        ) {
          // Read data from phaser load image block.
          const name =
            phaserLoadImageBlock['inputList'][0]['fieldRow'][2]['value_'] ||
            'unknown';

          // Read data from dynamic image file block.
          const dynamicImageFileBlock = phaserLoadImageBlock['childBlocks_'][0];
          const urlData =
            dynamicImageFileBlock['inputList'][0]['fieldRow'][0]['value_'];
          const filename =
            dynamicImageFileBlock['inputList'][1]['fieldRow'][0]['value_'];
          const url =
            dynamicImageFileBlock['inputList'][1]['fieldRow'][1]['value_'];

          dynamicImages.set(name, {
            name,
            filename,
            url,
            urlData,
          });
        }
      }
      if (dynamicImages.size > 0) {
        console.log('Dynamic images', dynamicImages);
        const toolbox = Toolbox.getToolbox(dynamicImages);
        this.setState({ toolbox });
      }
    }
  }

  /**
   * @param {string} xml
   * @return {string}
   */
  handleOnSaveFile(xml) {
    return xml;
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        {this.state.showGameSetupScreen && (
          <GameSetupScreen
            projectId={this.state.projectId}
            projectName={this.state.projectName}
            open={this.state.showGameSetupScreen}
            onClose={this.handleGameSetupScreenClose.bind(this)}
          ></GameSetupScreen>
        )}
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
                  splitPercentage: 70,
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
  projectId: PropTypes.string,
  projectName: PropTypes.string,
};
