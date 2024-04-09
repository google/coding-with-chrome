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
 * @fileoverview Editor for the desktop screen.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import CachedIcon from '@mui/icons-material/Cached';
import Divider from '@mui/material/Divider';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PropTypes from 'prop-types';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import i18next from 'i18next';

import { Toolbar, ToolbarIconButton } from '../Toolbar';

import { locationBar, locationBarPrefix } from './style.module.css';

/**
 *
 */
export class PreviewToolbar extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      isFullscreen: false,
      loaded: false,
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
   * @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event
   */
  handleChangeInput(event) {
    if (event?.target?.value) {
      this.setState({ location: event.target.value });
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyPress(event) {
    if (event.code == 'Enter' || event.code == 'NumpadEnter') {
      this.props.preview.setPreviewLocation(this.state.location);
    }
  }

  /**
   * @param {boolean} loaded
   */
  isLoaded(loaded) {
    this.setState({ loaded });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Toolbar>
          <ToolbarIconButton aria-label="menu">
            <MenuIcon />
          </ToolbarIconButton>
          {!this.props.hideURL && (
            <span className={locationBarPrefix}>{this.state.base}</span>
          )}
          {!this.props.hideURL && !this.props.readOnly && (
            <InputBase
              sx={{ paddingTop: '3px', marginLeft: '1px', ml: 1, flex: 1 }}
              size="small"
              placeholder="test123"
              className={locationBar}
              onChange={this.handleChangeInput.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
          )}
          <ToolbarIconButton
            aria-label="reload"
            onClick={() => {
              this.props.preview.reload();
            }}
          >
            <CachedIcon />
          </ToolbarIconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          {!this.state.loaded && (
            <ToolbarIconButton
              aria-label="run"
              color="success"
              onClick={() => {
                this.props.preview.updatePreviewLocation();
              }}
            >
              <PlayCircleIcon />
            </ToolbarIconButton>
          )}
          {this.state.loaded && (
            <ToolbarIconButton
              aria-label="stop"
              color="error"
              onClick={() => {
                this.props.preview.stop();
              }}
            >
              <StopCircleIcon />
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
      </React.StrictMode>
    );
  }
}

PreviewToolbar.propTypes = {
  /** @type {Preview} */
  preview: PropTypes.object,

  /** @type {boolean} */
  hideURL: PropTypes.bool,

  /** @type {boolean} */
  readOnly: PropTypes.bool,

  /** @type {function} */
  onFullscreen: PropTypes.func,
};

export default PreviewToolbar;
