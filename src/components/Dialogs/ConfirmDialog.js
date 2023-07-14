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
 * @fileoverview Confirm dialog.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

/**
 * @return {Object}
 */
export class ConfirmDialog extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open || false,
      title: this.props.title || 'Confirm Dialog',
      text: this.props.text || 'Are you sure?',
      confirmText: this.props.confirmText || 'Confirm',
      cancelText: this.props.cancelText || 'Cancel',
      onClose: this.props.onClose || null,
      onConfirm: this.props.onConfirm || null,
      onCancel: this.props.onCancel || null,
    };
  }

  /**
   * @param {*} props
   * @param {*} current_state
   * @return {Object}
   */
  static getDerivedStateFromProps(props, current_state) {
    if (current_state.open !== props.open) {
      return {
        open: props.open,
      };
    }
    return null;
  }

  /**
   *
   */
  handleClickOpen() {
    this.setState({ open: true });
  }

  /**
   *
   */
  handleClose() {
    if (this.state.onClose && typeof this.state.onClose === 'function') {
      this.state.onClose();
    } else if (
      this.state.onCancel &&
      typeof this.state.onCancel === 'function'
    ) {
      this.state.onCancel();
    }
    this.setState({ open: false });
  }

  /**
   *
   */
  handleCancel() {
    if (this.state.onCancel && typeof this.state.onCancel === 'function') {
      this.state.onCancel();
    } else if (this.state.onClose && typeof this.state.onClose === 'function') {
      this.state.onClose();
    }
    this.setState({ open: false });
  }

  /**
   *
   */
  handleConfirm() {
    if (this.state.onConfirm && typeof this.state.onConfirm === 'function') {
      this.state.onConfirm();
    }
    this.setState({ open: false });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <div>
        <Dialog
          fullWidth={this.props.fullWidth}
          maxWidth={this.props.maxWidth}
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCancel.bind(this)}
              variant="outlined"
              color={this.props.cancelColor}
            >
              {this.props.cancelIcon} {this.state.cancelText}
            </Button>
            <Button
              onClick={this.handleConfirm.bind(this)}
              variant="contained"
              color={this.props.confirmColor}
            >
              {this.props.confirmIcon} {this.state.confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  confirmText: PropTypes.string,
  confirmIcon: PropTypes.object,
  confirmColor: PropTypes.string,
  cancelText: PropTypes.string,
  cancelIcon: PropTypes.object,
  cancelColor: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.string,
};

export default ConfirmDialog;
