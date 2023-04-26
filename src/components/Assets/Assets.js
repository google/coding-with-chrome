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
 * @fileoverview Assets Manager.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import Box from '@mui/material/Box';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MenuIcon from '@mui/icons-material/Menu';
import Paper from '@mui/material/Paper';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { Toolbar, ToolbarIconButton } from '../Toolbar';

import styles from './style.module.css';

/**
 *
 */
export class Assets extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isDraggingOver: false,
    };
  }

  /**
   * @param {*} event
   */
  handleDragEnter(event) {
    event.preventDefault();

    this.setState({
      isDraggingOver: true,
    });
  }

  /**
   * @param {*} event
   */
  handleDragLeave(event) {
    event.preventDefault();

    this.setState({
      isDraggingOver: false,
    });
  }

  /**
   * @param {*} event
   */
  handleDragOver(event) {
    event.preventDefault();
  }

  /**
   * @param {*} event
   */
  handleDrop(event) {
    event.preventDefault();
    this.setState({
      isDraggingOver: false,
    });
    const files = event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (
        this.props.onDropFile &&
        typeof this.props.onDropFile === 'function'
      ) {
        this.props.onDropFile(file, event.target.result);
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <Paper elevation={3}>
          <Toolbar>
            <ToolbarIconButton aria-label="menu">
              <MenuIcon />
            </ToolbarIconButton>
            <Typography color="primary" sx={{ flex: 'auto' }}>
              Assets
            </Typography>
          </Toolbar>
          <Box className={styles.contentWrapper}>
            <Box
              className={
                this.state.isDraggingOver
                  ? styles.drag_zone_active
                  : styles.drag_zone
              }
              onDragEnter={this.handleDragEnter.bind(this)}
              onDragLeave={this.handleDragLeave.bind(this)}
              onDragOver={this.handleDragOver.bind(this)}
              onDrop={this.handleDrop.bind(this)}
            >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={4}
              >
                <Box>
                  <PermMediaIcon sx={{ fontSize: 64 }} />
                </Box>
                <Box>
                  <FileUploadIcon
                    sx={{ paddingRight: '5px', verticalAlign: 'middle' }}
                  />
                  Drop files here
                </Box>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </React.StrictMode>
    );
  }
}

Assets.propTypes = {
  windowId: PropTypes.string,
  onDropFile: PropTypes.func,
};
