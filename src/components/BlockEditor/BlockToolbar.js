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
 * @fileoverview Block Editor Toolbar.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { createRef, lazy } from 'react';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CodeIcon from '@mui/icons-material/Code';
import CreateIcon from '@mui/icons-material/Create';
import Drawer from '@mui/material/Drawer';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import PropTypes from 'prop-types';
import RedoIcon from '@mui/icons-material/Redo';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import UndoIcon from '@mui/icons-material/Undo';
import i18next from 'i18next';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { BlocklyWorkspace, WorkspaceSvg } from 'react-blockly';
import FileFormat, { ContentType } from '../FileFormat/FileFormat';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars

import { Toolbar, ToolbarIconButton, ToolbarButton } from '../Toolbar';

const ConfirmDialog = lazy(() => import('../Dialogs/ConfirmDialog'));

import styles from './style.module.css';

/**
 *
 */
export class BlockToolbar extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.fileUploadButton = createRef();
    this.state = {
      file: null,
      isFullscreen: false,
      showDrawer: false,
      showEditor: false,
      showNewFileDialog: false,
      snackbarSaved: false,
    };
  }

  /**
   *
   */
  toggleFullscreen() {
    console.log('Toggle fullscreen ...');
    this.setState({ isFullscreen: !this.state.isFullscreen }, () => {
      if (
        this.props.onFullscreen !== undefined &&
        typeof this.props.onFullscreen === 'function'
      ) {
        this.props.onFullscreen(this.state.isFullscreen);
      }
    });
  }

  /**
   * Handle Blocks undo
   */
  handleUndo() {
    this.props.blocklyWorkspace.undo(false);
  }

  /**
   * Handle Blockly redo
   */
  handleRedo() {
    this.props.blocklyWorkspace.undo(true);
  }

  /**
   * Open Drawer Menu.
   */
  handleOpenDrawer() {
    this.setState({ showDrawer: true });
  }

  /**
   * Close Drawer Menu.
   */
  handleCloseDrawer() {
    this.setState({ showDrawer: false });
  }

  /**
   * Requests user to open a file.
   */
  handleRequestImportFile() {
    this.fileUploadButton.current.click();
  }

  /**
   * Imports project file.
   * @param {*} event
   */
  handleImportFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file) {
        console.log('Open a file ...', file);
        const reader = new FileReader();
        reader.onload = (fileEvent) => {
          const data = fileEvent?.target?.result;
          this.handleImportFileContent(file, data);
        };
        reader.readAsText(file);
      }
    }
    this.handleCloseDrawer();
  }

  /**
   * @param {File} file
   * @param {string|ArrayBuffer|null|undefined} content
   */
  handleImportFileContent(file, content = '') {
    if (file.name.endsWith('.cwc')) {
      this.handleCodingWithChromeFileFormat(file, content);
    } else if (file.name.endsWith('.xml')) {
      this.handleBlocklyFileFormat(file, content);
    } else {
      console.log('Unknown file format ...', file.name);
      return;
    }
  }

  /**
   * @param {File} file
   * @param {string|ArrayBuffer|null|undefined} content
   */
  handleBlocklyFileFormat(file, content) {
    console.log('Handle Blockly file ...', file.name, content);

    // Load XML content.
    this.props.blockEditor.loadWorkspace(content, new Map(), true);
  }

  /**
   * @param {File} file
   * @param {string|ArrayBuffer|null|undefined} content
   */
  handleCodingWithChromeFileFormat(file, content) {
    console.log('Handle Coding with Chrome file ...', file.name, content);
    const parsedFile = new FileFormat(content || '');
    console.log('Parsed file', parsedFile);
    const projectFiles = new Map();
    if (!this.props.blocklyWorkspace) {
      return;
    }

    // Handle additional files, if any.
    if (parsedFile.hasFiles()) {
      console.log('Handle additional files ...');
      const files = parsedFile.getFiles();
      files.forEach((file) => {
        projectFiles.set(file.name, file.content);
      });
    }

    // Load XML content.
    if (parsedFile.hasContent(ContentType.BLOCKLY)) {
      this.props.blockEditor.loadWorkspace(
        parsedFile.getContent(ContentType.BLOCKLY),
        projectFiles,
        true
      );
    }
  }

  /**
   * Export project file.
   */
  handleExportFile() {
    console.log(`Export  ${this.props.project} ...`);
    const textAsBlob = new Blob([this.props.blockEditor.getXML()], {
      type: 'application/xml',
    });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${this.props.project.name}-${this.props.project.id}.xml`;
    downloadLink.innerHTML = 'Download File';
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textAsBlob);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  /**
   * New project file.
   */
  handleNewFile() {
    if (this.props.hasChanged) {
      this.setState({ showNewFileDialog: true });
    } else {
      this.navigateNewProject();
    }
  }

  /**
   * @param {string} name
   */
  navigateNewProject() {
    window.location.hash = '#/game_editor/';
    window.location.reload(true);
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Toolbar>
          <ToolbarIconButton
            aria-label="menu"
            onClick={this.handleOpenDrawer.bind(this)}
          >
            <MenuIcon />
          </ToolbarIconButton>
          {this.props.hasSaved && this.props.blockEditor && (
            <ToolbarIconButton
              aria-label="save"
              disabled={!this.props.hasChanged}
              onClick={() => {
                this.props.blockEditor.saveWorkspace();
              }}
            >
              <SaveIcon />
            </ToolbarIconButton>
          )}
          {!this.props.hasSaved && this.props.blockEditor && (
            <ToolbarIconButton
              aria-label="save_as"
              onClick={() => {
                this.props.blockEditor.saveWorkspace();
              }}
              color="error"
            >
              <SaveAsIcon />
            </ToolbarIconButton>
          )}
          <ToolbarIconButton
            title={i18next.t('UNDO')}
            aria-label="undo"
            disabled={!this.props.hasUndo}
            onClick={this.handleUndo.bind(this)}
          >
            <UndoIcon />
          </ToolbarIconButton>
          <ToolbarIconButton
            title={i18next.t('REDO')}
            aria-label="redo"
            disabled={!this.props.hasRedo}
            onClick={this.handleRedo.bind(this)}
          >
            <RedoIcon />
          </ToolbarIconButton>
          <ToolbarButton variant="contained">Create new Variable</ToolbarButton>
          {this.props.blockEditor.codeEditor && (
            <ToolbarIconButton
              aria-label="code"
              onClick={() => {
                this.props.blockEditor.showCodeEditor();
              }}
            >
              <CodeIcon />
            </ToolbarIconButton>
          )}
          {this.props.onFullscreen && (
            <ToolbarIconButton
              title={
                this.state.isFullscreen
                  ? i18next.t('EXIT_FULLSCREEN')
                  : i18next.t('ENTER_FULLSCREEN')
              }
              aria-label="fullscreen"
              onClick={this.toggleFullscreen.bind(this)}
            >
              {this.state.isFullscreen ? (
                <FullscreenExitIcon />
              ) : (
                <FullscreenIcon />
              )}
            </ToolbarIconButton>
          )}
        </Toolbar>
        <Drawer
          anchor="left"
          open={this.state.showDrawer}
          onClose={this.handleCloseDrawer.bind(this)}
        >
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {this.props.project.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {this.props.project.id}
              </Typography>
              <Typography variant="body2">
                {this.props.project.description}
              </Typography>
            </CardContent>
          </Card>
          <MenuList sx={{ minWidth: '250px' }} className={styles.drawerMiddle}>
            <MenuItem onClick={this.handleNewFile.bind(this)}>
              <ListItemIcon>
                <CreateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Project</ListItemText>
            </MenuItem>
            <MenuItem onClick={this.handleRequestImportFile.bind(this)}>
              <ListItemIcon>
                <FileUploadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Import Project</ListItemText>
              <input
                ref={this.fileUploadButton}
                type="file"
                onChange={this.handleImportFile.bind(this)}
                hidden
              />
            </MenuItem>
            <MenuItem onClick={this.handleExportFile.bind(this)}>
              <ListItemIcon>
                <FileDownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export Project</ListItemText>
            </MenuItem>
          </MenuList>
          <BottomNavigation
            showLabels
            color="primary"
            className={styles.drawerBottom}
          >
            <BottomNavigationAction label="About" icon={<InfoIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
            <BottomNavigationAction label="Language" icon={<LanguageIcon />} />
          </BottomNavigation>
        </Drawer>
        <ConfirmDialog
          open={this.state.showNewFileDialog}
          title={i18next.t('BLOCK_EDITOR_UNSAVED_CHANGED')}
          text={i18next.t('BLOCK_EDITOR_DIALOG_NEW_PROJECT_TEXT')}
          confirmText={i18next.t('BLOCK_EDITOR_DIALOG_NEW_PROJECT_CONFIRM')}
          cancelText={i18next.t('BLOCK_EDITOR_DIALOG_NEW_PROJECT_CANCEL')}
          onConfirm={this.navigateNewProject.bind(this)}
          onCancel={() => {
            this.setState({ showNewFileDialog: false });
          }}
        ></ConfirmDialog>
      </React.StrictMode>
    );
  }
}

BlockToolbar.propTypes = {
  /** @type {BlockEditor} */
  blockEditor: PropTypes.object,

  /** @type {WorkspaceSvg} */
  blocklyWorkspace: PropTypes.object,

  /** @type {boolean} */
  hasChanged: PropTypes.bool,

  /** @type {boolean} */
  hasSaved: PropTypes.bool,

  /** @type {boolean} */
  hasUndo: PropTypes.bool,

  /** @type {boolean} */
  hasRedo: PropTypes.bool,

  /** @type {Project} */
  project: PropTypes.object,

  /** @type {function} */
  onFullscreen: PropTypes.func,
};

export default BlockToolbar;
