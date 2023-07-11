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
      isProcessing: false,
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
   * @param {HTMLImageElement} image
   * @return {Promise<String>}
   */
  convertImageToWebP(image) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      resolve(canvas.toDataURL('image/webp', 1));
    });
  }

  /**
   * @param {File} file
   */
  readFile(file) {
    if (
      !file ||
      !this.props.onDropFile ||
      typeof this.props.onDropFile != 'function'
    ) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Encoding = event.target.result;

      // Optimize Images except webp und svg.
      if (
        file.type.startsWith('image/') &&
        file.type != 'image/webp' &&
        file.type != 'image/gif' &&
        file.type != 'image/svg+xml' &&
        file.type != 'image/svg'
      ) {
        const image = new Image();
        image.src = base64Encoding;
        image.onload = () => {
          this.convertImageToWebP(image).then((webPBase64Encoding) => {
            if (webPBase64Encoding.length < base64Encoding.length) {
              console.log(
                'Return optimized file as webp',
                file.type,
                file.name,
                'with size',
                webPBase64Encoding.length,
                'instead of',
                base64Encoding.length,
                'bytes and compression rate of',
                Math.round(
                  100 -
                    (webPBase64Encoding.length / base64Encoding.length) * 100,
                ),
                '%',
              );
              this.props.onDropFile(file, webPBase64Encoding);
            } else {
              console.log('Return file as is', file.type, file.name);
              this.props.onDropFile(file, base64Encoding);
            }
            setTimeout(() => {
              this.setState({
                isProcessing: false,
              });
            }, 500);
          });
        };
        return;
      }

      // Return file as data url without optimization.
      console.log('Return file as data url', file.type, file.name);
      this.props.onDropFile(file, base64Encoding);
      setTimeout(() => {
        this.setState({
          isProcessing: false,
        });
      }, 500);
    };
    reader.readAsDataURL(file);
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
    this.setState({
      isDraggingOver: true,
    });
  }

  /**
   * @param {*} event
   */
  handleDrop(event) {
    event.preventDefault();
    this.setState({
      isDraggingOver: false,
      isProcessing: true,
    });
    const files = event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    this.readFile(files[0]);
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
      this.setState({
        isDraggingOver: false,
        isProcessing: true,
      });
      this.readFile(files[0]);
    };
    fileInput.click();
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
                <Box sx={{ minHeight: '36px' }}>
                  {this.state.isProcessing ? (
                    <Box>{i18next.t('ASSETS_PROCESSING')}</Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={this.handleUploadFile.bind(this)}
                    >
                      <UploadFileIcon
                        sx={{ paddingRight: '5px', verticalAlign: 'middle' }}
                      />
                      {i18next.t('ASSETS_UPLOAD_FILE')}
                    </Button>
                  )}
                </Box>
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
