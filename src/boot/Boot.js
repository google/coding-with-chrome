/**
 * @fileoverview Bootscript for the Coding with Chrome suite.
 *
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
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { Splash } from '../gui/Splash';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { Version } from '../config/Config';

/**
 * Boot sequence.
 */
export function boot() {
  const SplashScreen = new Splash();
  console.log('Booting Coding with Chrome suite', Version);
  console.log('Initialize platform ...');
  if ('serviceWorker' in navigator) {
    runtime.register().then(
      function(registration) {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );
      },
      function(err) {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  }
  console.log('Showing splash screen');
  SplashScreen.show();
  SplashScreen.addStep('Loading Coding with Chrome Suite ...');
  SplashScreen.addStep('Step 1', () => {
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  });
  SplashScreen.addStep('Step 2', () => {
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  });
  SplashScreen.addStep('Step 3', () => {
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  });
  console.log('Switch run level ...');
  console.log('Initialize built-in drivers ...');
  console.log('Mount file-system ...');
  console.log('Starting built-in services ...');
  console.log('Loading shell ...');
  console.log('Start Run-level ...');
  SplashScreen.execute();
}
