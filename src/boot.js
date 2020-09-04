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

import { Splash } from './gui/Splash';
import { Version } from './config/Config';

import runtime from 'serviceworker-webpack-plugin/lib/runtime';

/**
 * Boot sequence.
 */
console.log('Booting Coding with Chrome suite', Version);
const SplashScreen = new Splash();
console.log('Showing splash screen');
SplashScreen.show();
console.log('Initialize platform ...');
SplashScreen.addStep('Preparing Service Worker', () => {
  return new Promise(resolve => {
    if ('serviceWorker' in navigator) {
      runtime.register({ scope: './' }).then(
        function(registration) {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          );
        },
        /**
         * @param {any} error
         */
        function(error) {
          console.log('ServiceWorker registration failed: ', error);
        }
      );
    }
    resolve();
  });
});
SplashScreen.addStep('Loading kernel ...', () => {
  return new Promise(resolve => {
    import(/* webpackChunkName: "kernel" */ './kernel/Kernel').then(module => {
      module.kernel.boot();
      resolve();
    });
  });
});
SplashScreen.addStep('Loading Coding with Chrome Suite ...');
SplashScreen.addStep('Loading User Config ...', () => {
  return new Promise(resolve => {
    import(/* webpackChunkName: "user_config" */ './config/UserConfig').then(
      module => {
        new module.UserConfig();
        resolve();
      }
    );
  });
});
SplashScreen.addStep('Switch run level ...');
SplashScreen.addStep('Initialize built-in drivers ...');
SplashScreen.addStep('Mount file-system ...');
SplashScreen.addStep('Starting built-in services ...');
SplashScreen.addStep('Loading shell ...');
SplashScreen.addStep('Start Run-level ...');
SplashScreen.addStep('Loading Terminal ...', () => {
  return new Promise(resolve => {
    import(/* webpackChunkName: "terminal" */ './gui/Terminal').then(module => {
      const terminalGui = new module.TerminalGui();
      terminalGui.show();
      resolve();
    });
  });
});
SplashScreen.addStep(
  'Done.',
  () => {
    return new Promise(resolve => {
      setTimeout(SplashScreen.hide.bind(SplashScreen), 1000);
      resolve();
    });
  },
  SplashScreen
);
SplashScreen.execute();
