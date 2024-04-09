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

import React, { createRef, lazy } from 'react';

import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Mosaic } from 'react-mosaic-component';

import { PhaserTemplate } from './template/PhaserTemplate';
import { Toolbox } from './toolbox/Toolbox';

import i18next from '../App/i18next';

import { DynamicFileParser } from './parser/DynamicFileParser';

import { PreviewService } from '../../service-worker/preview-service-worker';
import BlocklyTemplate from './template/BlocklyTemplate';
import { Project } from '../Project/Project';
import { ProjectType } from '../Project/ProjectType';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { WorkspaceSvg } from 'react-blockly';

// Lazy load components, specific components.
const Assets = lazy(() => import('../Assets'));
const BlockEditor = lazy(() => import('../BlockEditor'));
const DeleteGameProject = lazy(() => import('./dialog/DeleteGameProject'));
const NewGameProject = lazy(() => import('./dialog/NewGameProject'));
const OpenGameProject = lazy(() => import('./dialog/OpenGameProject'));
const Preview = lazy(() => import('../Preview'));
const Screenshot = lazy(() => import('../Screenshot'));

import 'react-mosaic-component/react-mosaic-component.css';
import { layout } from './style.module.css';
import './style.global.css';
import { BlocksBuilder } from '../BlockEditor/blocks/BlocksBuilder';
import GameEditorSettings from '../Settings/GameEditorSettings';
import { DataURL } from '../../utils/file/DataURL';
import { BlocksHelper } from './blocks/BlocksHelper';

/**
 *
 */
export class GameEditor extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    // Extract projectId and projectName from URL.
    let projectId;
    const urlData = window.location.hash
      .replace('#/game_editor/', '')
      .replace('#/game_editor', '')
      .split('/');
    if (urlData.length === 1) {
      projectId = urlData[0];
      console.debug(`[GameEditor] Found project ID ${projectId} in URL.`);
    } else {
      console.debug(
        `[GameEditor] No project ID and name found in URL. Showing Game Setup screen.`,
      );
      window.location.hash = `#/game_editor/`;
      window.location.reload();
    }

    // Timer for handling changes
    this.timer = {
      handleXMLChange: null,
    };

    // Set trusted origin for postMessage and other communication.
    this.trustedOrigin = `${window.location.origin}`;

    // Set initial state.
    this.state = {
      /** @type {number} */
      autoRefresh: GameEditorSettings.getAutoRefreshDefault(),

      /** @type {ReactRef} */
      previewRef: createRef(),

      /** @type {ReactRef} */
      blockEditorRef: createRef(),

      /** @type {Project} */
      project: props.project,

      /** @type {Map} */
      audioFiles: new Map(),

      /** @type {Map} */
      imageFiles: new Map(),

      /** @type {boolean} */
      isLoaded: props.project || false,

      /** @type {boolean} */
      isFirstRunPreview: true,

      leftViewSplitPercentage: 75,
      rightViewSplitPercentage: 70,

      toolbox: Toolbox.getToolbox(),
      blockEditorFullscreen: false,
      openNewProject: false,
      openExistingProject: false,
      openDeleteProject: false,
      screenshotUrl: '',
      xml: '',
    };

    // Set project details from data base.
    if (!props.project) {
      Project.getProject(projectId, ProjectType.GAME_EDITOR)
        .then((project) => {
          if (project) {
            console.debug(
              '[GameEditor] Found project',
              project,
              'with project id',
              projectId,
            );
            this.setState(
              {
                project: project,
                xml: project.getIsEmpty()
                  ? BlocklyTemplate.render(project)
                  : '',
              },
              () => {
                this.setState({ isLoaded: true });
              },
            );
          }
        })
        .catch((error) => {
          console.error(`[GameEditor] ${error}`);
        });
    }

    // Loading user editor config.
    GameEditorSettings.getAutoRefresh().then((value) => {
      if (typeof value != 'undefined') {
        this.state.autoRefresh = value;
      }
    });

    // Listen for additional messages like screenshots or errors.
    window.addEventListener('message', this.handleMessages.bind(this), false);
  }

  /**
   *
   */
  componentDidMount() {
    // Adding event listener for language change.
    i18next.on('languageChanged', () => {
      this.updateToolbox(
        this.state.blockEditorRef?.current?.getBlocklyWorkspace(),
      );
    });
  }

  /**
   * @return {Object}
   */
  getLayout() {
    return {
      blockEditor: (
        <BlockEditor
          ref={this.state.blockEditorRef}
          type={'GameEditor'}
          content={this.state.xml}
          toolbox={this.state.toolbox}
          template={PhaserTemplate.render}
          parseAssets={this.handleParseAssets.bind(this)}
          parseXML={this.handleParseXML.bind(this)}
          onChange={this.handleBlockEditorContentChange.bind(this)}
          onLoadWorkspace={this.handleOnLoadWorkspace.bind(this)}
          onSaveWorkspace={this.handleOnSaveWorkspace.bind(this)}
          onFullscreen={this.handleBlockEditorFullscreen.bind(this)}
          onNewProject={this.handleNewProject.bind(this)}
          onOpenProject={this.handleOpenProject.bind(this)}
          onDeleteProject={this.handleDeleteProject.bind(this)}
          autoCollapse={true}
          project={this.state.project}
          windowId={this.props.windowId}
        />
      ),
      preview: (
        <Preview
          ref={this.state.previewRef}
          base={`preview/${this.state.project.id}/`}
          readOnly={true}
          hideURL={true}
          onFullscreen={this.handlePreviewFullscreen.bind(this)}
        />
      ),
      assets: <Assets onDropFile={this.handleOnDropFile.bind(this)} />,
    };
  }

  /**
   * Hide specific content on drag event.
   */
  handleMosaicOnChange() {
    if (this.state.previewRef.current) {
      this.state.previewRef.current.hideContent();
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
   * @param {MosaicNode<T>} node
   */
  handleMosaicOnRelease(node) {
    if (this.state.previewRef.current) {
      this.state.previewRef.current.showContent();
      this.state.previewRef.current.reload();
    }
    if (this.state.blockEditorRef.current) {
      this.state.blockEditorRef.current.resize();
    }
    if (node.splitPercentage) {
      this.setState({ leftViewSplitPercentage: node.splitPercentage });
    }
    if (node.second && node.second.splitPercentage) {
      this.setState({ rightViewSplitPercentage: node.second.splitPercentage });
    }
  }

  /**
   * @param {*} event
   */
  handleMessages(event) {
    if (
      event.origin != this.trustedOrigin ||
      !event.data ||
      !event.data.type ||
      !event.data.value
    ) {
      return;
    }
    switch (event.data.type) {
      case 'screenshot':
        console.log('[GameEditor] Received screenshot...');
        this.state.project.setScreenshot(event.data.value);
        this.state.project.save().then(() => {
          this.setState((prevState) => ({
            screenshotUrl: '',
            project: prevState.project,
          }));
        });
        break;
      case 'runtime_error':
        console.log('[GameEditor] Received runtime error...');
        console.error(event.data.value);
        break;
      case 'error':
        console.log('[GameEditor] Received error...');
        console.error(event.data.value);
        break;
    }
  }

  /**
   * @param {boolean} fullscreen
   */
  handleBlockEditorFullscreen(fullscreen) {
    console.log('handleBlockEditorFullscreen', fullscreen);
    this.setState({ blockEditorFullscreen: fullscreen }, () => {
      if (this.state.blockEditorRef) {
        this.state.blockEditorRef.current.resize();
      }
      if (!fullscreen && this.state.previewRef) {
        this.state.previewRef.current.updatePreviewLocation();
      }
    });
  }

  /**
   * @param {boolean} fullscreen
   */
  handlePreviewFullscreen(fullscreen) {
    console.log('handlePreviewFullscreen', fullscreen);
    this.setState({ previewFullscreen: fullscreen }, () => {
      if (this.state.blockEditorRef) {
        this.state.blockEditorRef.current.resize();
      }
      if (this.state.previewRef) {
        this.state.previewRef.current.updatePreviewLocation();
      }
    });
  }

  /**
   * Handle the creation of an new Project.
   */
  handleNewProject() {
    this.setState({ openNewProject: true });
  }

  /**
   * Handle the opening of an existing Project.
   */
  handleOpenProject() {
    this.setState({ openExistingProject: true });
  }

  /**
   * Handle deletion of an existing Project.
   */
  handleDeleteProject() {
    this.setState({ openDeleteProject: true });
  }

  /**
   * @param {File} file
   * @param {string} content
   */
  handleOnDropFile(file, content) {
    const filename = file.name;
    const name = filename.substring(0, filename.lastIndexOf('.'));
    const urlData = content;
    const url = '';
    const fileEntry = {
      name,
      filename,
      url,
      urlData,
    };
    if (file.type.startsWith('image/')) {
      this.state.imageFiles.set(name, fileEntry);
    } else if (file.type.startsWith('audio/')) {
      this.state.audioFiles.set(name, fileEntry);
    } else {
      console.error('Unsupported file type', file.type);
      return;
    }

    // Updating preview cache
    DataURL.generateIdFromDataURL(urlData).then((assetId) => {
      PreviewService.addAssetFile(
        this.props.project?.id || this.state.project?.id,
        assetId,
        urlData,
      );

      // Updating block editor
      if (this.state.blockEditorRef.current) {
        const blocklyWorkspace =
          this.state.blockEditorRef.current.getBlocklyWorkspace();

        // Updating toolbox.
        this.updateToolbox(blocklyWorkspace);

        // Automatically add supported blocks to workspace.
        if (file.type.startsWith('image/')) {
          BlocksBuilder.addDynamicImageFileToWorkspace(
            blocklyWorkspace,
            name,
            filename,
            urlData,
            assetId,
          );
        } else if (file.type.startsWith('audio/')) {
          BlocksBuilder.addDynamicAudioFileToWorkspace(
            blocklyWorkspace,
            name,
            filename,
            urlData,
            assetId,
          );
        } else {
          console.warn('Unsupported block file type:', file.type);
        }
      }
    });
  }

  /**
   * @param {string} code
   */
  handleBlockEditorContentChange(code) {
    // Update Preview with new code, if auto-refresh is enabled.
    if (this.timer.handleXMLChange) {
      clearTimeout(this.timer.handleXMLChange);
      this.timer.handleXMLChange = null;
    }

    // Allow updates for the preview directly on the first run / load and use
    // auto-fresh for further refresh / updates.
    if (this.state.isFirstRunPreview) {
      this.updatePreview(code);
      this.setState({
        isFirstRunPreview: false,
      });
    } else if (this.state.autoRefresh > 0) {
      this.timer.handleXMLChange = setTimeout(() => {
        this.updatePreview(code);
      }, this.state.autoRefresh);
    }
  }

  /**
   * Updates preview with current code.
   * @param {string} code
   */
  updatePreview(code) {
    PreviewService.saveHTMLFile(`${this.state.project.id}/`, code).then(() => {
      if (this.state.previewRef.current) {
        this.state.previewRef.current.goToHomePage();
      }
    });
  }

  /**
   * @param {string} xml
   * @return {string}
   */
  handleParseXML(xml) {
    BlocksHelper.setWorkspaceXML(xml);
    return xml;
  }

  /**
   * @param {WorkspaceSvg} workspace
   */
  handleOnLoadWorkspace(workspace) {
    this.updateToolbox(workspace);
  }

  /**
   * @param {Project} project
   * @param {Database} database
   * @param {string} code
   */
  handleOnSaveWorkspace(project, database, code) {
    console.log('handleOnSaveWorkspace ...', project, database);

    // Prepare Screenshot instance, to take screenshot.
    const screenshotUrl = `${this.state.project.id}/screenshot`;
    PreviewService.saveHTMLFile(
      screenshotUrl,
      code
        .replace(', Phaser.AUTO,', ', Phaser.CANVAS,')
        .replace('autoFocus: true,', 'autoFocus: false,')
        .replace(
          'preserveDrawingBuffer: false,',
          'preserveDrawingBuffer: true,',
        )
        .replace("powerPreference: 'default',", "powerPreference: 'low-power',")
        .replace('width: window.innerWidth,', 'width: 1080,')
        .replace('height: window.innerHeight,', 'height: 608,'),
    ).then(() => {
      console.log('Screenshot will be taken from', screenshotUrl);
      this.setState({ screenshotUrl: 'preview/' + screenshotUrl });
    });
  }

  /**
   * @param {WorkspaceSvg} workspace
   * @return {Map<string, FileEntry>}
   */
  handleParseAssets(workspace) {
    const phaserAudioFiles = DynamicFileParser.getPhaserAudioFiles(workspace);
    const phaserImageFiles = DynamicFileParser.getPhaserImageFiles(workspace);
    return new Map([...phaserAudioFiles, ...phaserImageFiles]);
  }

  /**
   * @param {WorkspaceSvg} workspace
   */
  updateToolbox(workspace) {
    if (!workspace) {
      console.warn('Unable to update toolbox for workspace', workspace);
      return;
    }
    const phaserAudioFiles = new Map([
      ...this.state.audioFiles,
      ...DynamicFileParser.getPhaserAudioFiles(workspace),
    ]);
    const phaserImageFiles = new Map([
      ...this.state.imageFiles,
      ...DynamicFileParser.getPhaserImageFiles(workspace),
    ]);

    const toolbox = Toolbox.getToolbox(phaserAudioFiles, phaserImageFiles);
    if (toolbox) {
      this.setState({ toolbox });
    }
  }

  /**
   * @return {Object}
   */
  render() {
    // Set layout with mosaic and split percentage for left and right view.
    let leftViewSplitPercentage = this.state.blockEditorFullscreen
      ? 100
      : this.state.leftViewSplitPercentage;
    if (this.state.previewFullscreen) {
      leftViewSplitPercentage = 0;
    }
    const rightView = this.state.blockEditorFullscreen
      ? {}
      : {
          direction: 'column',
          first: 'preview',
          second: this.state.previewFullscreen ? '' : 'assets',
          splitPercentage: this.state.previewFullscreen
            ? 100
            : this.state.rightViewSplitPercentage,
        };

    // Render layout with mosaic and split percentage for left and right view.
    return (
      <React.StrictMode>
        {this.state.isLoaded && (
          <Box className={layout}>
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

        {this.state.openExistingProject && (
          <OpenGameProject
            open={this.state.openExistingProject}
            onClose={() => {
              this.setState({ openExistingProject: false });
            }}
          />
        )}

        {this.state.openNewProject && (
          <NewGameProject
            open={this.state.openNewProject}
            onClose={() => {
              this.setState({ openNewProject: false });
            }}
          />
        )}

        {this.state.openDeleteProject && (
          <DeleteGameProject
            open={this.state.openDeleteProject}
            project={this.state.project}
            onClose={() => {
              this.setState({ openDeleteProject: false });
            }}
          />
        )}

        {this.state.project && this.state.project.id && (
          <Screenshot url={this.state.screenshotUrl} />
        )}
      </React.StrictMode>
    );
  }
}

GameEditor.propTypes = {
  windowId: PropTypes.string,
  project: PropTypes.object,
};
