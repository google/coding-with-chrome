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
 * @fileoverview Delete Project Dialog.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import i18next from '../../App/i18next';
import ConfirmDialog from '../../Dialogs/ConfirmDialog';

/**
 *
 */
export class DeleteGameProject extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  /**
   * Handle game setup close.
   */
  handleDeleteProject() {
    // Create new project based on user input.
    console.log(
      `Delete project with id ${this.props.project.id} and name ${this.props.project.name} ...`,
    );

    // Delete project and update url to go back to game editor.
    this.props.project.archive().then(() => {
      window.location.hash = `#/game_editor/`;
      window.location.reload();
    });
    this.handleOnClose();
  }

  /**
   * Handle game setup close.
   */
  handleOnClose() {
    this.setState({ open: false, openEmojiPicker: false });
    if (this.props.onClose && typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  /**
   * @return {Object}
   */
  render() {
    const open =
      typeof this.props.open != 'undefined' ? this.props.open : this.state.open;
    return (
      <React.StrictMode>
        <ConfirmDialog
          fullWidth={true}
          maxWidth={'md'}
          open={open}
          title={i18next.t('DELETE_PROJECT_TITLE', {
            project: this.props.project,
          })}
          text={i18next.t('DELETE_PROJECT_TEXT', {
            project: this.props.project,
          })}
          confirmText={i18next.t('DELETE_PROJECT_CONFIRM')}
          confirmIcon={<DeleteForeverIcon />}
          confirmColor={'error'}
          cancelText={i18next.t('DELETE_PROJECT_CANCEL')}
          onConfirm={this.handleDeleteProject.bind(this)}
          onCancel={() => {
            this.setState({ open: false });
            this.handleOnClose();
          }}
        ></ConfirmDialog>
      </React.StrictMode>
    );
  }
}

DeleteGameProject.propTypes = {
  /** @type {boolean} */
  open: PropTypes.bool,

  /** @type {function} */
  onClose: PropTypes.func,

  /** @type {Project} */
  project: PropTypes.object.isRequired,
};

export default DeleteGameProject;
