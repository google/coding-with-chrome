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

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DownloadingIcon from '@mui/icons-material/Downloading';
import Grid from '@mui/material/Grid';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import SortIcon from '@mui/icons-material/Sort';
import Typography from '@mui/material/Typography';
import i18next from '../../App/i18next';

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
      projectsByDate: [],
      projectsByName: [],
      listView: false,
      sortMode: 'default',
    };
  }

  /**
   * Component did mount.
   */
  componentDidMount() {
    Project.getProjects(ProjectType.GAME_EDITOR).then((projects) => {
      // Sort projects by date and name and update state.
      this.setState({
        projects,
        projectsByDate: [...projects].sort((a, b) =>
          a.lastModified > b.lastModified ? -1 : 1
        ),
        projectsByName: [...projects].sort((a, b) =>
          a.name > b.name ? 1 : -1
        ),
      });
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
      window.location.reload();
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
    let projects = this.state.projects;
    if (this.state.sortMode === 'name') {
      projects = this.state.projectsByName;
    } else if (this.state.sortMode === 'date') {
      projects = this.state.projectsByDate;
    }
    return (
      <React.StrictMode>
        <Dialog
          open={open}
          onClose={this.handleOnClose.bind(this)}
          fullWidth={true}
          maxWidth="lg"
          disablePortal
        >
          <DialogTitle>
            {i18next.t('SELECT_PROJECT_TO_OPEN')}
            <Box
              sx={{
                float: 'right',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  this.setState({ sortMode: 'default' });
                }}
              >
                {i18next.t('UNSORTED')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  this.setState({ sortMode: 'name' });
                }}
              >
                <SortByAlphaIcon sx={{ marginRight: '5px' }} />{' '}
                {i18next.t('SORT_BY_NAME')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  this.setState({ sortMode: 'date' });
                }}
              >
                <SortIcon sx={{ marginRight: '5px' }} />
                {i18next.t('SORT_BY_DATE')}
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent>
            {!this.state.listView && (
              <Grid container spacing={2}>
                {projects.map((project) => (
                  <Grid
                    item
                    key={project.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 3,
                      }}
                    >
                      {project.screenshot && (
                        <CardMedia
                          sx={{ height: 152, backgroundColor: '#e0e0e0' }}
                          image={project.screenshot}
                          title="green iguana"
                        />
                      )}
                      {!project.screenshot && (
                        <Box
                          sx={{
                            height: 152,
                            backgroundColor: '#e0e0e0',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ImageNotSupportedIcon
                            fontSize="large"
                            sx={{ margin: 'auto', color: 'grey' }}
                            title={i18next.t('NO_SCREENSHOT_AVAILABLE')}
                          />
                        </Box>
                      )}
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexFlow: 'column',
                          flexGrow: 1,
                          padding: '8px 12px;',
                        }}
                      >
                        <Typography gutterBottom variant="h5" component="h2">
                          {project.name}
                        </Typography>
                        <Typography sx={{ flexGrow: 1 }}>
                          {project.description}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {i18next.t('LAST_MODIFIED') +
                            ':' +
                            project.lastModified}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {project.id}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          key={project.id}
                          value={project.id}
                          onClick={this.handleOpenProject.bind(this)}
                          sx={{ minWidth: '100%' }}
                        >
                          <DownloadingIcon sx={{ marginRight: '10px' }} />
                          {i18next.t('LOAD_PROJECT')}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {this.state.listView && (
              <Box>
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
                          <Typography color="primary">
                            {project.name}
                          </Typography>
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
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={this.handleOnClose.bind(this)}>
              {i18next.t('CANCEL')}
            </Button>
          </DialogActions>
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
