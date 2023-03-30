/**
 * @license Copyright 2023 The Coding with Chrome Authors.
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
 * @fileoverview Preview for the desktop screen.
 */

import Box from '@mui/material/Box';
import CachedIcon from '@mui/icons-material/Cached';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PropTypes from 'prop-types';
import React from 'react';
import StopCircleIcon from '@mui/icons-material/StopCircle';

import styles from './style.module.css';

/**
 *
 */
export class Preview extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = { location: '', loaded: false };
    this.windowId = props.windowId;
    this.toolbar = React.createRef();
    this.contentWrapper = React.createRef();
    this.contentIframe = React.createRef();
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    //
  }

  /**
   * @param {string} location
   */
  setPreviewLocation(location = '') {
    if (location.startsWith('/')) {
      location = location.substring(1);
    }
    if (location.length <= 3) {
      location = '';
    }
    console.log('Change preview location', location);
    this.setState({ location: location });
    this.setState({ loaded: false });
    this.contentIframe.current.src = location;
  }

  /**
   * Update Preview Location.
   */
  updatePreviewLocation() {
    this.setPreviewLocation(this.state.location);
  }

  /**
   * @param {event} opt_event
   */
  handleContentIframeLoad(opt_event) {
    this.setState({ loaded: true });
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
      this.setPreviewLocation(this.state.location);
    }
  }

  /**
   * Reloads the iframe content.
   */
  reload() {
    this.contentIframe.current.contentWindow.location.reload();
  }

  /**
   * Stops the iframe content.
   */
  stop() {
    this.contentIframe.current.contentWindow.stop();
    this.setState({ loaded: false });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Box
          className={styles.toolbar}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <span>/</span>
          <InputBase
            color="primary"
            sx={{ paddingTop: '3px', marginLeft: '1px', ml: 1, flex: 1 }}
            size="small"
            placeholder="preview/test123"
            onChange={this.handleChangeInput.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
          <IconButton
            edge="start"
            color="primary"
            aria-label="reload"
            onClick={this.reload.bind(this)}
            sx={{ p: '10px' }}
          >
            <CachedIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          {!this.state.loaded && (
            <IconButton
              edge="start"
              color="primary"
              aria-label="run"
              onClick={this.updatePreviewLocation.bind(this)}
              sx={{ p: '10px' }}
            >
              <PlayCircleIcon />
            </IconButton>
          )}
          {this.state.loaded && (
            <IconButton
              edge="start"
              color="primary"
              aria-label="stop"
              onClick={this.stop.bind(this)}
              sx={{ p: '10px' }}
            >
              <StopCircleIcon />
            </IconButton>
          )}
        </Box>
        <Box className={styles.contentWrapper} ref={this.contentWrapper}>
          <iframe
            ref={this.contentIframe}
            src="preview/"
            allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen"
            allowFullScreen
            onLoad={this.handleContentIframeLoad.bind(this)}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-top-navigation-by-user-activation allow-downloads"
          ></iframe>
        </Box>
      </React.StrictMode>
    );
  }
}

Preview.propTypes = {
  windowId: PropTypes.string.isRequired,
};
