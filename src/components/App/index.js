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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Main app for the Coding with Chrome suite.
 */

import * as ReactDOM from 'react-dom/client';
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './i18next.js';

import { DesktopApp } from './../Desktop';
import { GameEditor } from '../GameEditor/index.js';
import { SelectScreen } from '../SelectScreen/index.js';

/**
 * @param {HTMLElement} node
 */
export function render(node) {
  const root = ReactDOM.createRoot(node);
  root.render(
    <Suspense fallback="...is loading">
      <Router>
        <Routes>
          <Route path="/desktop" element={<DesktopApp />} />
          <Route path="/game_editor" element={<GameEditor />} />
          <Route path="/" element={<SelectScreen />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
