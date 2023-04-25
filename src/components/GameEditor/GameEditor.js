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

// Lazy load components.
const GameSetupScreen = lazy(() => import('./GameSetupScreen'));
const BlockEditor = lazy(() => import('../BlockEditor'));
const Preview = lazy(() => import('../Preview'));

import { DynamicFileParser } from './parser/DynamicFileParser';

import 'react-mosaic-component/react-mosaic-component.css';
import styles from './style.module.css';
import { PreviewService } from '../../service-worker/preview-service-worker';
import BlocklyTemplate from './template/BlocklyTemplate';
import { Project } from '../Project/Project';
import { ProjectType } from '../Project/ProjectType';

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

    // Set project.
    const project =
      props.project ||
      new Project(
        projectId || uuidv4(),
        ProjectType.GAME_EDITOR,
        projectName || ProjectNameGenerator.generate(i18next.resolvedLanguage)
      );

    // Set initial state.
    this.state = {
      project: project,
      showGameSetupScreen: !hasProjectData,
      toolbox: Toolbox.getToolbox(),
      blockEditorFullscreen: false,
      xml: hasProjectData
        ? BlocklyTemplate.render(project)
        : '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    };
  }

  /**
   * Hide specific content on drag event.
   */
  handleMosaicOnChange() {
    if (this.previewRef.current) {
      this.previewRef.current.hideContent();
    }
    if (this.state.blockEditorFullscreen) {
      this.setState({ blockEditorFullscreen: false });
    }
    if (this.state.previewFullscreen) {
      this.setState({ previewFullscreen: false });
    }
  }

  /**
   * Restore specific content on drop event.
   */
  handleMosaicOnRelease() {
    if (this.previewRef.current) {
      this.previewRef.current.showContent();
      this.previewRef.current.reload();
    }
    if (this.blockEditorRef.current) {
      this.blockEditorRef.current.resize();
    }
  }

  /**
   * @param {boolean} fullscreen
   */
  handleBlockEditorFullscreen(fullscreen) {
    console.log('handleBlockEditorFullscreen', fullscreen);
    this.setState({ blockEditorFullscreen: fullscreen }, () => {
      if (this.blockEditorRef) {
        this.blockEditorRef.current.resize();
      }
      if (!fullscreen && this.previewRef) {
        this.previewRef.current.updatePreviewLocation();
      }
    });
  }

  /**
   * @param {boolean} fullscreen
   */
  handlePreviewFullscreen(fullscreen) {
    console.log('handlePreviewFullscreen', fullscreen);
    this.setState({ previewFullscreen: fullscreen }, () => {
      if (this.blockEditorRef) {
        this.blockEditorRef.current.resize();
      }
      if (this.previewRef) {
        this.previewRef.current.updatePreviewLocation();
      }
    });
  }

  /**
   * @return {Object}
   */
  getLayout() {
    return {
      blockEditor: (
        <BlockEditor
          ref={this.blockEditorRef}
          type={'GameEditor'}
          content={this.state.xml}
          toolbox={this.state.toolbox}
          template={PhaserTemplate.render}
          parseXML={this.handleParseXML.bind(this)}
          onChange={this.handleBlockEditorContentChange.bind(this)}
          onLoadWorkspace={this.handleOnLoadWorkspace.bind(this)}
          onFullscreen={this.handleBlockEditorFullscreen.bind(this)}
          project={this.state.project}
          windowId={this.props.windowId}
        />
      ),
      preview: (
        <Preview
          ref={this.previewRef}
          base={`preview/${this.state.project.id}/`}
          readOnly={true}
          hideURL={true}
          onFullscreen={this.handlePreviewFullscreen.bind(this)}
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
    PreviewService.saveHTMLFile(`${this.state.project.id}/`, code).then(() => {
      if (this.previewRef.current) {
        this.previewRef.current.goToHomePage();
      }
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
  handleOnLoadWorkspace(workspace) {
    this.updateToolbox(workspace);
  }

  /**
   * @param {WorkspaceSvg} workspace
   */
  updateToolbox(workspace) {
    const phaserAudioFiles = DynamicFileParser.getPhaserAudioFiles(workspace);
    const phaserImageFiles = DynamicFileParser.getPhaserImageFiles(workspace);
    if (phaserAudioFiles.size > 0 || phaserImageFiles.size > 0) {
      const toolbox = Toolbox.getToolbox(phaserAudioFiles, phaserImageFiles);
      this.setState({ toolbox });
      workspace.updateToolbox(toolbox);
    }
  }

  /**
   * @return {Object}
   */
  render() {
    // Set layout with mosaic and split percentage for left and right view.
    let leftViewSplitPercentage = this.state.blockEditorFullscreen ? 100 : 75;
    if (this.state.previewFullscreen) {
      leftViewSplitPercentage = 0;
    }
    const rightView = this.state.blockEditorFullscreen
      ? {}
      : {
          direction: 'column',
          first: 'preview',
          second: this.state.previewFullscreen ? '' : 'assets',
          splitPercentage: this.state.previewFullscreen ? 100 : 70,
        };

    return (
      <React.StrictMode>
        {this.state.showGameSetupScreen && (
          <GameSetupScreen
            projectId={this.state.project.id}
            projectName={this.state.project.name}
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
                second: rightView,
                splitPercentage: leftViewSplitPercentage,
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
  project: PropTypes.object,
};
