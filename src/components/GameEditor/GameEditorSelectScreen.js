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

import React, { lazy } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CreateIcon from '@mui/icons-material/Create';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import i18next from 'i18next';

const NewGameProject = lazy(() => import('./dialog/NewGameProject'));
const OpenGameProject = lazy(() => import('./dialog/OpenGameProject'));

/**
 *
 */
export class GameEditorSelectScreen extends React.PureComponent {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.cards = [1, 2, 3];
    this.state = {
      openNewProject: false,
      openExistingProject: false,
    };
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <AppBar position="relative">
          <Toolbar>
            <VideogameAssetIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Game Editor
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Game Editor
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="text.secondary"
                paragraph
              >
                {i18next.t('CREATE_NEW_GAME_PROJECT')}
              </Typography>
              <Stack
                sx={{ pt: 6 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    this.setState({ openNewProject: true });
                  }}
                >
                  <CreateIcon />
                  {i18next.t('CREATE_NEW_PROJECT')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.setState({ openExistingProject: true });
                  }}
                >
                  <FolderOpenIcon />
                  {i18next.t('OPEN_PROJECT')}
                </Button>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {this.cards.map((card) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent
                      sx={{
                        pt: '56.25%',
                      }}
                    >
                      Hello World
                    </CardContent>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Heading
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Load</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>

        {this.state.openExistingProject && (
          <OpenGameProject
            open={this.state.openExistingProject}
            onClose={() => {
              this.setState({ openExistingProject: false });
            }}
          />
        )}

        {this.state.openNewProject && (
          <NewGameProject
            open={this.state.openNewProject}
            onClose={() => {
              this.setState({ openNewProject: false });
            }}
          />
        )}
      </React.StrictMode>
    );
  }
}

GameEditorSelectScreen.propTypes = {};

export default GameEditorSelectScreen;
