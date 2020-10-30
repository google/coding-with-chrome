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
 * @fileoverview Splashscreen for the Coding with Chrome suite.
 */

import { DevMode, Version } from '../config/Config';
import { StackQueue } from '../utils/stack/StackQueue';

import './Splash.css';

/**
 * Splash Screen class
 */
export class Splash {
  /**
   * @param {HTMLElement} node
   * @constructor
   */
  constructor(node) {
    /** @type {number} */
    this.currentProgress = 0;

    /** @type {string} */
    this.currentProgressText = '';

    this.progressSize = 0;
    this.progressStep = 1;

    /** @type {StackQueue} */
    this.stackQueue = new StackQueue(false);

    /** @type {number} */
    this.startTime = globalThis.BOOT_TIME || Date.now();

    /** @type {HTMLElement} */
    this.node = node;

    /** @type {HTMLElement|null} */
    this.nodeVersion = this.node.querySelector('div.version');

    /** @type {HTMLElement|null} */
    this.nodeProgressBar = this.node.querySelector(
      'div.content > div.progress > div.progress-bar > div'
    );

    /** @type {HTMLElement|null} */
    this.nodeProgressText = this.node.querySelector(
      'div.content > div.progress > div.progress-text'
    );

    /** @type {HTMLElement|null} */
    this.nodeProgressTextLog = this.node.querySelector(
      'div.content > div.progress > div.progress-text-log > ul'
    );

    if (node) {
      this.render();
    }
  }

  /**
   * Shows the splash screen.
   */
  show() {
    if (this.node) {
      console.debug('Showing Splashscreen ...');
      this.node.style.display = 'block';
      this.render();
    }
  }

  /**
   * Hides the splash screen.
   */
  hide() {
    if (this.node) {
      console.debug('Hiding Splashscreen ...');
      this.node.style.display = 'none';
    }
  }

  /**
   * Render splash screen.
   */
  render() {
    if (this.nodeVersion) {
      this.nodeVersion.textContent = `${DevMode ? 'Dev' : 'Prod'} v${Version}`;
    }
    this.progress = 0;
    this.progressText = 'Starting ...';
  }

  /**
   * @param {String} name
   * @param {Function=} func
   * @param {Function=} scope
   */
  addStep(name, func, scope) {
    if (func) {
      this.stackQueue.addPromiseRaiseError(() => {
        this.progress = (100 / this.progressSize) * this.progressStep++;
        this.progressText = name;
        if (scope) {
          return func.call(scope);
        }
        return func.call(func);
      });
    } else {
      this.stackQueue.addCommand(() => {
        this.progress = (100 / this.progressSize) * this.progressStep++;
        this.progressText = name;
      });
    }
  }

  /**
   * @param {number} progress 0 - 100
   */
  set progress(progress) {
    this.currentProgress = Number(parseFloat(String(progress)).toFixed(0));
    console.debug('Set Progress to', this.currentProgress);
    if (this.nodeProgressBar) {
      this.nodeProgressBar.style.transform = `translateX(-${
        100 - this.currentProgress
      }%)`;
    }
  }

  /**
   * @return {number} 0 - 100
   */
  get progress() {
    return this.currentProgress;
  }

  /**
   * @param {String} text
   */
  set progressText(text) {
    console.debug('Set Progress text to', text);
    if (this.nodeProgressText) {
      this.nodeProgressText.textContent = `${text}`;
    }
    if (this.nodeProgressTextLog) {
      const elapsedTime = Date.now() - this.startTime;
      const logEntry = document.createElement('li');
      logEntry.textContent = `[${this.progress}%] ${text} (${elapsedTime} msec)`;
      this.nodeProgressTextLog.appendChild(logEntry);
    }
  }

  /**
   * @return {string}
   */
  get progressText() {
    return this.currentProgressText;
  }

  /**
   *
   */
  execute() {
    this.addStep('Done.', () => {
      return new Promise((resolve) => {
        resolve();
      });
    });
    this.progressSize = this.stackQueue.getSize();
    this.stackQueue.start();
  }
}
