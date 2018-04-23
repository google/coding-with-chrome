/**
 * @fileoverview File library tour for the Coding with Chrome editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.LibraryTour');


/**
 * @param {string} prefix
 * @return {!Shepherd}
 */
cwc.ui.LibraryTour.get = function(prefix = '') {
  let tour = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  tour.addStep('intro', {
    'title': i18t('File library'),
    'text': i18t('Library__intro'),
    'attachTo': '#' + prefix + 'chrome center',
    'buttons': [{
      'text': i18t('EXIT'),
      'action': tour.cancel,
      'classes': 'shepherd-button-secondary',
    }, {
      'text': i18t('NEXT'),
      'action': tour.next,
      'classes': 'shepherd-button-example-primary',
    }],
  });
  tour.addStep('upload', {
    'title': i18t('File library'),
    'text': i18t('Library__upload_button'),
    'attachTo': '#' + prefix + 'upload-button left',
    'advanceOn': '#' + prefix + 'upload-button click',
  });
  tour.addStep('images', {
    'text': i18t('Library__image_tab'),
    'attachTo': '#' + prefix + 'images_tab bottom',
    'advanceOn': '#' + prefix + 'images_tab click',
  });
  tour.addStep('audio', {
    'text': i18t('Library__audio_tab'),
    'attachTo': '#' + prefix + 'audio_tab bottom',
    'advanceOn': '#' + prefix + 'audio_tab click',
  });
  tour.addStep('all', {
    'text': i18t('Library__all_tab'),
    'attachTo': '#' + prefix + 'all_tab bottom',
    'advanceOn': '#' + prefix + 'all_tab click',
  });
  tour.addStep('search', {
    'text': i18t('Library__search_tab'),
    'attachTo': '#' + prefix + 'search_tab bottom',
    'advanceOn': '#' + prefix + 'search_tab click',
  });
  tour.addStep('close', {
    'text': i18t('Library__close_dialog'),
    'attachTo': '#cwc-dialog-close left',
    'buttons': [{
      'text': i18t('EXIT'),
      'action': tour.cancel,
      'classes': 'shepherd-button-example-primary',
    }],
  });
  return tour;
};
