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
 * @param {string=} prefix
 * @return {!Shepherd}
 */
cwc.ui.LibraryTour.get = function(prefix = '') {
  let tour = new Shepherd.Tour({
    'defaultStepOptions': {
      'showCancelLink': true,
      'tippyOptions': {
        'appendTo': document.getElementById('cwc-dialog-chrome'),
      },
    },
  });
  tour.addStep('intro', {
    'title': i18t('File library'),
    'text': i18t('@@LIBRARY__TOUR_INTRO'),
    'attachTo': '#' + prefix + 'chrome center',
    'buttons': [{
      'text': i18t('@@GENERAL__EXIT'),
      'action': tour.cancel,
      'classes': 'shepherd-button-secondary',
    }, {
      'text': i18t('@@GENERAL__NEXT'),
      'action': tour.next,
      'classes': 'shepherd-button-example-primary',
    }],
  });
  tour.addStep('upload', {
    'title': i18t('File library'),
    'text': i18t('@@LIBRARY__TOUR_UPLOAD_BUTTON'),
    'attachTo': '#' + prefix + 'upload-button left',
    'advanceOn': '#' + prefix + 'upload-button click',
    'buttons': [{
      'text': i18t('@@GENERAL__NEXT'),
      'action': tour.next,
    }],
  });
  tour.addStep('images', {
    'text': i18t('@@LIBRARY__TOUR_IMAGE_TAB'),
    'attachTo': '#' + prefix + 'images_tab bottom',
    'advanceOn': '#' + prefix + 'images_tab click',
    'buttons': [{
      'text': i18t('@@GENERAL__NEXT'),
      'action': tour.next,
    }],
  });
  tour.addStep('audio', {
    'text': i18t('@@LIBRARY__TOUR_AUDIO_TAB'),
    'attachTo': '#' + prefix + 'audio_tab bottom',
    'advanceOn': '#' + prefix + 'audio_tab click',
    'buttons': [{
      'text': i18t('@@GENERAL__NEXT'),
      'action': tour.next,
    }],
  });
  tour.addStep('all', {
    'text': i18t('@@LIBRARY__TOUR_ALL_TAB'),
    'attachTo': '#' + prefix + 'all_tab bottom',
    'advanceOn': '#' + prefix + 'all_tab click',
    'buttons': [{
      'text': i18t('@@GENERAL__NEXT'),
      'action': tour.next,
    }],
  });
  tour.addStep('search', {
    'text': i18t('@@LIBRARY__TOUR_SEARCH_TAB'),
    'attachTo': '#' + prefix + 'search_tab bottom',
    'advanceOn': '#' + prefix + 'search_tab click',
    'buttons': [{
      'text': i18t('@@GENERAL__NEXT'),
      'action': tour.next,
    }],
  });
  tour.addStep('close', {
    'text': i18t('@@LIBRARY__TOUR_CLOSE_DIALOG'),
    'attachTo': '#cwc-dialog-close left',
    'buttons': [{
      'text': i18t('@@GENERAL__EXIT'),
      'action': tour.cancel,
      'classes': 'shepherd-button-example-primary',
    }],
  });
  return tour;
};
