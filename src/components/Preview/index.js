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
 * @fileoverview Preview for the desktop screen.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CachedIcon from '@mui/icons-material/Cached';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PropTypes from 'prop-types';
import React from 'react';
import StopCircleIcon from '@mui/icons-material/StopCircle';

import { Toolbar, ToolbarIconButton } from '../Toolbar';

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
    this.state = {
      base: props.base || '/preview/',
      hideContent: false,
      loaded: false,
      loading: false,
      location: props.location || '',
      readOnly: typeof props.readOnly === 'boolean' ? props.readOnly : false,
      showURL: typeof props.showURL === 'boolean' ? props.showURL : true,
    };
    this.windowId = props.windowId;
    this.contentWrapper = React.createRef();
    this.contentIframe = React.createRef();
    this.contentLoadTimer = null;

    window.addEventListener('resize', this.resize.bind(this));
  }

  /**
   * Resize editor content to parent container.
   */
  resize() {
    this.reload();
  }

  /**
   * @param {string} location
   */
  setPreviewLocation(location = '') {
    console.log('Change preview location', location, this.state.base);

    // Check for content iframe.
    if (!this.contentIframe) {
      return;
    }

    // Check if we have a valid base path or location.
    if (
      !this.state.base &&
      (!location || (location && !/^\s*$/.test(location)))
    ) {
      return;
    }

    // If there is a base path, we need to add it to the target location.
    let targetLocation = location || this.state.base;
    if (this.state.base && location && !location.startsWith(this.state.base)) {
      targetLocation =
        this.state.base +
        (!this.state.base.endsWith('/') || !location.startsWith('/'))
          ? '/'
          : '' + location;
    }

    // Make sure we have a valid target location.
    if (
      !targetLocation.startsWith('preview/') &&
      !targetLocation.startsWith('/preview/')
    ) {
      targetLocation = '/preview/' + targetLocation;
    }
    if (targetLocation.startsWith('/')) {
      targetLocation = targetLocation.substring(1);
    }

    // Update state with new location and loading state.
    this.setState({ location: targetLocation, loaded: false, loading: true });

    // Set timeout for loading content.
    if (this.contentLoadTimer) {
      clearTimeout(this.contentLoadTimer);
    }
    this.contentLoadTimer = setTimeout(() => {
      console.warn('Timeout ...');
      this.stop();
    }, 10000);

    // Set new location.
    console.log('Set preview location', targetLocation);
    this.contentIframe.current.src = targetLocation;
  }

  /**
   * Update Preview Location.
   */
  updatePreviewLocation() {
    console.debug('Update preview location ...', this.state.location);
    this.setPreviewLocation(this.state.location);
  }

  /**
   * @param {event} event
   */
  handleContentIframeLoad(event) {
    if (this.contentLoadTimer) {
      clearTimeout(this.contentLoadTimer);
    }
    if (
      this.contentIframe.current.contentWindow.location.href != 'about:blank'
    ) {
      console.log('Iframe Content Loaded:', event);
      this.setState({ loaded: true, loading: false });
    }
  }

  /**
   * @param {event} event
   */
  handleContentIframeError(event) {
    console.error('Iframe Content Error:', event);
    this.setState({ loaded: false, loading: false });
    if (this.contentLoadTimer) {
      clearTimeout(this.contentLoadTimer);
    }
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
   *
   */
  goToHomePage() {
    this.setState({ location: '' });
    this.setPreviewLocation();
  }

  /**
   * Reloads the iframe content.
   */
  reload() {
    if (!this.contentIframe || !this.contentIframe.current?.contentWindow) {
      return;
    }
    console.log('Reloading Iframe ...');
    this.setState({ loaded: false, loading: true });
    this.contentIframe.current.contentWindow.location.reload();
  }

  /**
   * Stops the iframe content.
   */
  stop() {
    if (!this.contentIframe) {
      return;
    }
    console.log('Stopping Iframe ...');
    this.contentIframe.current.contentWindow.stop();
    this.contentIframe.current.contentWindow.location = 'about:blank';
    this.setState({ loaded: false, loading: false });
  }

  /**
   * @external
   */
  hideContent() {
    this.setState({ hideContent: true });
  }

  /**
   * @external
   */
  showContent() {
    this.setState({ hideContent: false });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Toolbar className={styles.toolbar}>
          <ToolbarIconButton aria-label="menu">
            <MenuIcon />
          </ToolbarIconButton>
          {this.props.showURL && (
            <span className={styles.locationBarPrefix}>{this.state.base}</span>
          )}
          {this.props.showURL && !this.props.readOnly && (
            <InputBase
              sx={{ paddingTop: '3px', marginLeft: '1px', ml: 1, flex: 1 }}
              size="small"
              placeholder="test123"
              className={styles.locationBar}
              onChange={this.handleChangeInput.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
          )}
          <ToolbarIconButton
            aria-label="reload"
            onClick={this.reload.bind(this)}
          >
            <CachedIcon />
          </ToolbarIconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          {!this.state.loaded && (
            <ToolbarIconButton
              aria-label="run"
              onClick={this.updatePreviewLocation.bind(this)}
            >
              <PlayCircleIcon />
            </ToolbarIconButton>
          )}
          {this.state.loaded && (
            <ToolbarIconButton aria-label="stop" onClick={this.stop.bind(this)}>
              <StopCircleIcon />
            </ToolbarIconButton>
          )}
        </Toolbar>
        <Box className={styles.contentWrapper} ref={this.contentWrapper}>
          {this.state.loading && (
            <Backdrop
              className={styles.contentLoadingScreen}
              sx={{
                color: '#fff',
                position: 'absolute',
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={this.state.loading}
            >
              <CircularProgress color="inherit" />
              <span className={styles.contentLoadingScreenTitle}>
                Loading ...
              </span>
            </Backdrop>
          )}
          {(this.state.hideContent ||
            (!this.state.location && !this.state.loading)) && (
            <Backdrop
              className={styles.contentResize}
              sx={{
                color: '#fff',
                position: 'absolute',
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={
                this.state.hideContent ||
                (!this.state.location && !this.state.loading)
              }
            >
              <AspectRatioIcon />
              <span className={styles.contentLoadingScreenTitle}>Preview</span>
            </Backdrop>
          )}
          <iframe
            className={`${
              this.windowId ? styles.contentIframeWindow : styles.contentIframe
            } ${this.state.hideContent ? styles.contentIframeHidden : ''}`}
            ref={this.contentIframe}
            src=""
            allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen"
            allowFullScreen
            onLoad={this.handleContentIframeLoad.bind(this)}
            onError={this.handleContentIframeError.bind(this)}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-top-navigation-by-user-activation allow-downloads"
            title="Preview Content Container"
          ></iframe>
        </Box>
      </React.StrictMode>
    );
  }
}

Preview.propTypes = {
  base: PropTypes.string,
  location: PropTypes.string,
  readOnly: PropTypes.bool,
  showURL: PropTypes.bool,
  windowId: PropTypes.string,
};

export default Preview;
