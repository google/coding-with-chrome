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

import ExtensionIcon from '@mui/icons-material/Extension';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CreateIcon from '@mui/icons-material/Create';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
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
import i18next from '../App/i18next';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { BlocklyWorkspace, WorkspaceSvg } from 'react-blockly';

import { Toolbar, ToolbarIconButton } from '../Toolbar';
import LanguageSetting from '../Settings/LanguageSetting';
import SettingScreen from '../Settings/SettingScreen';

const ConfirmDialog = lazy(() => import('../Dialogs/ConfirmDialog'));

import {} from './style.module.css';

/**
 *
 */
export class CodeEditorToolbar extends React.PureComponent {
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
      openSettings: false,
      openLanguageSettings: false,
    };
  }

  /**
   *
   */
  componentDidMount() {
    i18next.on('languageChanged', () => {
      this.forceUpdate();
    });
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
    this.props.codeEditor.undo();
  }

  /**
   * Handle Blockly redo
   */
  handleRedo() {
    this.props.codeEditor.redo();
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
      console.error('.cwc files are no longer supported!');
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
   * Export project file.
   */
  handleExportFile() {
    console.log(`Export  ${this.props.project} ...`);
    const textAsBlob = new Blob([this.props.blockEditor.getXML()], {
      type: 'application/xml',
    });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${this.props.project.name}-${this.props.project.id}.xml`;
    downloadLink.innerText = 'Download File';
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
   * Handle new Project.
   */
  handleNewProject() {
    if (
      this.props.onNewProject &&
      typeof this.props.onNewProject === 'function'
    ) {
      this.props.onNewProject();
      this.setState({ showDrawer: false });
    }
  }

  /**
   * Handle new Project.
   */
  handleOpenProject() {
    if (
      this.props.onOpenProject &&
      typeof this.props.onOpenProject === 'function'
    ) {
      this.props.onOpenProject();
      this.setState({ showDrawer: false });
    }
  }

  /**
   * @param {string} name
   */
  navigateNewProject() {
    window.location.hash = '#/game_editor/';
    window.location.reload();
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
              title={i18next.t('SAVE_PROJECT')}
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
              title={i18next.t('SAVE_PROJECT')}
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
          <Typography color="inherit" noWrap sx={{ flexGrow: 1 }}></Typography>
          {this.props.blockEditor.codeEditor && (
            <ToolbarIconButton
              aria-label="code"
              onClick={() => {
                this.props.blockEditor.showBlockEditor();
              }}
            >
              <ExtensionIcon />
            </ToolbarIconButton>
          )}
          <LanguageSetting color="primary" />
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
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {this.props.project.name}
              </Typography>
              {this.props.project.screenshot && (
                <CardMedia
                  component="img"
                  height="152"
                  width="270"
                  image={this.props.project.screenshot}
                />
              )}
              <Typography variant="caption" color="text.secondary">
                {this.props.project.id}
              </Typography>
              <Typography
                variant="body2"
                style={{ wordWrap: 'break-word', maxWidth: 250 }}
              >
                {this.props.project.description}
              </Typography>
            </CardContent>
          </Card>
          <MenuList sx={{ minWidth: '250px' }}>
            {this.props.onNewProject && (
              <MenuItem onClick={this.handleNewProject.bind(this)}>
                <ListItemIcon>
                  <CreateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18next.t('CREATE_NEW_PROJECT')}</ListItemText>
              </MenuItem>
            )}
            {this.props.onOpenProject && (
              <MenuItem onClick={this.handleOpenProject.bind(this)}>
                <ListItemIcon>
                  <FolderOpenIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18next.t('OPEN_PROJECT')}</ListItemText>
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={this.handleRequestImportFile.bind(this)}>
              <ListItemIcon>
                <FileUploadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{i18next.t('IMPORT_PROJECT')}</ListItemText>
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
              <ListItemText>{i18next.t('EXPORT_PROJECT')}</ListItemText>
            </MenuItem>
          </MenuList>
          <BottomNavigation showLabels color="primary" sx={{ boxShadow: 3 }}>
            <BottomNavigationAction label="About" icon={<InfoIcon />} />
            <BottomNavigationAction
              label="Settings"
              icon={<SettingsIcon />}
              onClick={() => {
                this.setState({
                  openSettings: true,
                });
              }}
            />
            <BottomNavigationAction
              label="Language"
              icon={<LanguageIcon />}
              onClick={() => {
                this.setState({
                  openLanguageSettings: true,
                });
              }}
            />
          </BottomNavigation>
        </Drawer>
        {this.state.showNewFileDialog && (
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
        )}
        <SettingScreen
          color="inherit"
          open={this.state.openSettings}
          onClose={() => {
            this.setState({
              openSettings: false,
            });
          }}
        />
        <LanguageSetting
          color="inherit"
          open={this.state.openLanguageSettings}
          onClose={() => {
            this.setState({
              openLanguageSettings: false,
            });
          }}
        />
      </React.StrictMode>
    );
  }
}

CodeEditorToolbar.propTypes = {
  /** @type {BlockEditor} */
  blockEditor: PropTypes.object,

  /** @type {CodeEditor} */
  codeEditor: PropTypes.object,

  /** @type {boolean} */
  hasChanged: PropTypes.bool,

  /** @type {boolean} */
  hasSaved: PropTypes.bool,

  /** @type {boolean} */
  hasUndo: PropTypes.bool,

  /** @type {boolean} */
  hasRedo: PropTypes.bool,

  /** @type {Project} */
  project: PropTypes.object.isRequired,

  /** @type {function} */
  onFullscreen: PropTypes.func,

  /** @type {function} */
  onNewProject: PropTypes.func,

  /** @type {function} */
  onOpenProject: PropTypes.func,
};

export default CodeEditorToolbar;
