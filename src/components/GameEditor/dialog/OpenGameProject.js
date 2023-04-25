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
 * @fileoverview Game Editor Setup Screen.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import Dialog from '@mui/material/Dialog';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

import { Project } from '../../Project/Project';
import { ProjectType } from '../../Project/ProjectType';

/**
 *
 */
export class OpenGameProject extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      projects: [],
    };
  }

  /**
   * Component did mount.
   */
  componentDidMount() {
    Project.getProjects(ProjectType.GAME_EDITOR).then((projects) => {
      this.setState({ projects });
    });
  }

  /**
   * @param {*} event
   */
  handleOpenProject(event) {
    if (event.currentTarget && event.currentTarget.getAttribute('value')) {
      console.log(event.currentTarget.getAttribute('value'));
      // Update url with new project id and project name.
      window.location.hash = `#/game_editor/${event.currentTarget.getAttribute(
        'value'
      )}`;
      window.location.reload(true);
    }
  }

  /**
   * Handle game setup close.
   */
  handleOnClose() {
    this.setState({ open: false });
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
        <Dialog
          open={open}
          onClose={this.handleOnClose.bind(this)}
          disablePortal
        >
          {this.state.projects.map((project) => (
            <MenuItem
              key={project.id}
              value={project.id}
              onClick={this.handleOpenProject.bind(this)}
            >
              <ListItemIcon>{project.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography color="primary">{project.name}</Typography>
                    <Typography variant="caption" display="block">
                      {project.id}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    {project.description}
                    <Typography variant="caption" display="block">
                      {'Last modified:' + project.lastModified}
                    </Typography>
                  </React.Fragment>
                }
              />
            </MenuItem>
          ))}
        </Dialog>
      </React.StrictMode>
    );
  }
}

OpenGameProject.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default OpenGameProject;
