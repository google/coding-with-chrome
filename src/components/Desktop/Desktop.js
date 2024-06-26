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
 * @fileoverview Desktop screen for the Coding with Chrome suite.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { lazy } from 'react';

import { Panel } from './Panel';
import { Launcher } from './Launcher';

const WindowManager = lazy(() => import('./WindowManager'));

import { desktop } from './style.module.css';

// Load kernel
import('./../../kernel/Kernel').then((module) => {
  module.kernel.boot();
});

/**
 *
 */
export class DesktopApp extends React.PureComponent {
  /**
   * @return {Object}
   */
  render() {
    return (
      <React.StrictMode>
        <div className={desktop}>
          <Panel />
          <Launcher />
          <WindowManager />
        </div>
      </React.StrictMode>
    );
  }
}

export default DesktopApp;
