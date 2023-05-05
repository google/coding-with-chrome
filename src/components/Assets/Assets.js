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
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MenuIcon from '@mui/icons-material/Menu';
import Paper from '@mui/material/Paper';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import i18next from '../App/i18next';

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
   *
   */
  componentDidMount() {
    i18next.on('languageChanged', () => {
      this.forceUpdate();
    });
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
   *
   */
  handleUploadFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*, image/*';
    fileInput.onchange = (event) => {
      const files = event.target.files;
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
    };
    fileInput.click();
    this.setState({
      isDraggingOver: false,
    });
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
            <Typography color="primary.dark" sx={{ flex: 'auto' }}>
              {i18next.t('ASSETS')}
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
              component={Stack}
              direction="column"
              justifyContent="center"
            >
              <Stack justifyContent="center" alignItems="center" spacing={2}>
                <Box>
                  <PermMediaIcon sx={{ fontSize: 48 }} />
                </Box>
                <Button
                  variant="contained"
                  onClick={this.handleUploadFile.bind(this)}
                >
                  <UploadFileIcon
                    sx={{ paddingRight: '5px', verticalAlign: 'middle' }}
                  />
                  {i18next.t('ASSETS_UPLOAD_FILE')}
                </Button>
                <Box>
                  <FileUploadIcon
                    sx={{ paddingRight: '5px', verticalAlign: 'middle' }}
                  />
                  {i18next.t('ASSETS_DROP_FILES_HERE')}
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
