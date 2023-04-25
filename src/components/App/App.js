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
 * @fileoverview Main app for the Coding with Chrome suite.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

const DesktopApp = lazy(() => import('../Desktop'));
const GameEditor = lazy(() => import('../GameEditor'));
const GameEditorSelectScreen = lazy(() =>
  import('../GameEditor/GameEditorSelectScreen')
);
const SelectScreen = lazy(() => import('../SelectScreen'));

/**
 * @class
 */
class App extends React.Component {
  /**
   * @return {Object}
   */
  render() {
    return (
      <Suspense>
        <HashRouter>
          <Routes>
            <Route path="/" exact element={<SelectScreen {...this.props} />} />
            <Route path="/desktop" element={<DesktopApp {...this.props} />} />
            <Route
              path="/game_editor"
              exact
              element={<GameEditorSelectScreen {...this.props} />}
            />
            <Route
              path="/game_editor/:projectId"
              element={<GameEditor {...this.props} />}
            />
          </Routes>
        </HashRouter>
      </Suspense>
    );
  }
}
export default App;
