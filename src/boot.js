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
 * @fileoverview Bootscript for the Coding with Chrome suite.
 */

import { screen } from './gui/Screen';
import { Splash } from './gui/Splash';
import { Version } from './config/Config';

/**
 * Boot sequence.
 */
console.log('Booting Coding with Chrome suite', Version);
console.log('Init Screen and showing splash screen');
screen.init();
const SplashScreen = new Splash(screen.add('splash-screen', 'Splash Screen'));
screen.pin('splash-screen');
console.log('Initialize platform ...');
SplashScreen.addStep('Loading Service Worker ...', () => {
  return new Promise((resolve) => {
    import('./service-worker/InstallWorker').then((module) => {
      new module.InstallWorker().register();
      resolve();
    });
  });
});
SplashScreen.addStep('Loading kernel ...', () => {
  return new Promise((resolve) => {
    import('./kernel/Kernel').then((module) => {
      module.kernel.boot();
      resolve();
    });
  });
});
SplashScreen.addStep('Loading User Config ...', () => {
  return new Promise((resolve) => {
    import('./config/UserConfig').then((module) => {
      new module.UserConfig();
      resolve();
    });
  });
});
SplashScreen.addStep('Switch run level ...');
SplashScreen.addStep('Initialize built-in drivers ...');
SplashScreen.addStep('Mount file-system ...');
SplashScreen.addStep('Starting built-in services ...');
SplashScreen.addStep('Start Run-level ...');
SplashScreen.addStep('Loading App ...', () => {
  return new Promise((resolve) => {
    import('./components/App/index.js').then((module) => {
      module.render(screen.add('app', 'Main app'));
      screen.hide('app');
      resolve();
    });
  });
});
SplashScreen.addStep('Cleanup ...', () => {
  return new Promise((resolve) => {
    screen.remove('splash-screen');
    screen.show('app');
    resolve();
  });
});
SplashScreen.execute();
