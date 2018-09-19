/**
 * @fileoverview Google Classroom integration for the Coding with Chrome editor.
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
 * @author efuquen@google.com (Edwin Fuquen)
 */

goog.provide('cwc.ui.GClassroom');

goog.require('cwc.config.GDrive');
goog.require('cwc.soy.GClassroom');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');

goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.GClassroom = function(helper) {
  /** @type {string} */
  this.name = 'GClassroom';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('gclassroom');

  /** @type {Object} */
  this.data = null;

  /** @type {string} */
  this.dialogType = '';

  /** @type {!string} */
  this.mimeType = 'application/cwc';

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  this.idByCourseWorkExpanded_ = {};
};

cwc.ui.GClassroom.prototype.openDialog = function() {
    this.dialogType = 'open';
    this.getMyCourses_(this.handleCourses.bind(this));
};

/**
 * @param {Object} data List of courses.
 */
cwc.ui.GClassroom.prototype.handleCourses = function(data) {
    let courses = data['courses'];
    let courseList = goog.dom.getElement(this.prefix + 'course_list');
    if (!courseList) {
        this.prepareDialog();
    }
    this.updateCourseList(courses);
};

cwc.ui.GClassroom.prototype.openGDriveFile = function(fileId) {
  let gdriveInstance = this.helper.getInstance('gdrive');
  if (gdriveInstance) {
    let getFileCallback = (function(file) {
      gdriveInstance.downloadFile(file);
    }).bind(this);
    gdriveInstance.getFile(fileId, getFileCallback);
  } else {
    console.error('GClassroom.openGDriveFile has no gdrive instance.');
  }
};

cwc.ui.GClassroom.prototype.handleCourseWorks = function(data) {
  let courseWorks = data['courseWork'];
  let idToCourseWork = {};
  for (let i = 0; i < courseWorks.length; i++) {
    idToCourseWork[courseWorks[i]['id']] = courseWorks[i];
  }

  let courseWorkList = goog.dom.getElement(this.prefix + 'course_work_list');
  goog.style.showElement(goog.dom.getElement(
    this.prefix + 'course_list'), false);
  goog.soy.renderElement(
    courseWorkList,
    cwc.soy.GClassroom.gClassroomCourseWorkListTemplate,
    {prefix: this.prefix, courseWorks: courseWorks}
  );

  let elements = goog.dom.getElementsByClass(this.prefix + 'course_work');
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    let courseWorkId = goog.dom.dataset.get(element, 'id');
    this.idByCourseWorkExpanded_[courseWorkId] = false;
    let loaderEvent = () => {
      let iconElement = element.firstElementChild.firstElementChild;
      if (this.idByCourseWorkExpanded_[courseWorkId]) {
        let submissionContainer = goog.dom.getElement(
          this.prefix + 'student_submission_' + courseWorkId);
        goog.dom.removeChildren(submissionContainer);
        goog.dom.setTextContent(iconElement, 'expand_more');
        this.idByCourseWorkExpanded_[courseWorkId] = false;
      } else {
        let courseWork = idToCourseWork[courseWorkId];
        this.getMyCourseWorkStudentSubmissions(
          courseWork['courseId'], courseWorkId, iconElement,
          this.handleStudentSubmissions.bind(this));
     }
    };
    this.events_.listen(element.firstElementChild, goog.events.EventType.CLICK,
      loaderEvent, false, this);
  }
};

cwc.ui.GClassroom.prototype.filterSupportedFiles = function(files) {
  let supportedFiles = [];
  files.forEach((file) => {
    let ext_match = file.name.match('\\.[a-zA-Z]{1,4}$');
    if (files.mimeType in cwc.config.GDrive.MIME_TYPES ||
      (ext_match != null &&
        ext_match[0] in cwc.config.GDrive.EXT_TO_MIME_TYPE)) {
      supportedFiles.push(file);
    }
  });
  return supportedFiles;
}

cwc.ui.GClassroom.prototype.handleStudentSubmissions = function(
  data, iconElement) {
  let gdriveInstance = this.helper.getInstance('gdrive');
  if (gdriveInstance) {
    let attachments = (
        data['studentSubmissions'][0]['assignmentSubmission']['attachments']);
    let courseWorkId = data['studentSubmissions'][0]['courseWorkId'];
    let getFilePromises = [];
    for (let i = 0; i < attachments.length; i++) {
      let attachment = attachments[i];
      if ('driveFile' in attachment) {
        let fileId = attachment['driveFile']['id'];
        getFilePromises.push(gdriveInstance.getFile(fileId));
      }
    }

    Promise.all(getFilePromises).then((files) => {
      files = this.filterSupportedFiles(files);
      let idToDriveFile = {};
      for (let i = 0; i < files.length; i++) {
        idToDriveFile[files[i]['id']] = files[i];
      }
      let submissionContainer = goog.dom.getElement(
          this.prefix + 'student_submission_' + courseWorkId);
      goog.soy.renderElement(
          submissionContainer,
          cwc.soy.GClassroom.gClassroomStudentSubmissionListTemplate,
          {prefix: this.prefix, submissions: files}
      );
      goog.dom.setTextContent(iconElement, 'expand_less');
      this.idByCourseWorkExpanded_[courseWorkId] = true;

      let elements = goog.dom.getElementsByClass(
        this.prefix + 'student_submission');
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let loaderEvent = () => {
          let driveFileId = goog.dom.dataset.get(element, 'id');
          let driveFile = idToDriveFile[driveFileId];
          gdriveInstance.downloadFile(driveFile);
        };
        this.events_.listen(element, goog.events.EventType.CLICK,
          loaderEvent, false, this);
      }
    });
  } else {
      console.error(
          'GClassroom.handleStudentSubmissions has no gdrive instance.');
  }
};

/**
 * Decorates the classroom library.
 */
cwc.ui.GClassroom.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventTarget = layoutInstance.getEventTarget();
    this.events_.listen(eventTarget, goog.events.EventType.UNLOAD,
        this.cleanUp_, false, this);
  }

  cwc.ui.Helper.mdlRefresh();
};


cwc.ui.GClassroom.prototype.prepareDialog = function() {
  let dialogInstance = this.helper.getInstance('dialog', true);
  let title = {
    title: 'Google Classroom',
  };
  dialogInstance.showTemplate(title, cwc.soy.GClassroom.gClassroomTemplate, {
    prefix: this.prefix
  });
  this.decorate();
}
/**
 * Updates the GClassroom course list with the new courses.
 * @param {Object} files Course list with the result of the search.
 */
cwc.ui.GClassroom.prototype.updateCourseList = function(courses) {
  let courseList = goog.dom.getElement(this.prefix + 'course_list');
  goog.soy.renderElement(
    courseList,
    cwc.soy.GClassroom.gClassroomCourseListTemplate,
    {prefix: this.prefix, courses: courses}
  );

  let elements = goog.dom.getElementsByClass(this.prefix + 'course');
  for (let i = 0; i < elements.length; ++i) {
    let element = elements[i];
    let loaderEvent = () => {
      let courseId = goog.dom.dataset.get(element, 'id');
      this.getMyCourseWork(courseId, this.handleCourseWorks.bind(this));
    };
    this.events_.listen(element, goog.events.EventType.CLICK,
      loaderEvent, false, this);
  }
}

/**
 * @param {function(?)} callback
 * @private
 */
cwc.ui.GClassroom.prototype.getMyCourses_ = function(callback) {
  let accountInstance = this.helper.getInstance('account');
  if (accountInstance) {
    let opts = {
      subdomain: 'classroom',
      path: '/v1/courses',
      params: {
          'studentId': 'me',
      },
    };
    accountInstance.request(opts, callback);
  } else {
    console.error('GClassroom.getMyCourses missing account');
  }
};

/**
 * @param {int} courseId
 * @param {function(?)} callback
 * @private
 */
cwc.ui.GClassroom.prototype.getMyCourseWork = function(courseId, callback) {
  let accountInstance = this.helper.getInstance('account');
  if (accountInstance) {
    let opts = {
      subdomain: 'classroom',
      path: '/v1/courses/' + courseId + '/courseWork',
    };
    accountInstance.request(opts, callback);
  } else {
    console.error('GClassroom.getMyCourseWork missing account');
  }
};

cwc.ui.GClassroom.prototype.getMyCourseWorkStudentSubmissions = function(
    courseId, courseWorkId, iconElement, callback) {
  let accountInstance = this.helper.getInstance('account');
  if (accountInstance) {
    let opts = {
      subdomain: 'classroom',
      path: '/v1/courses/' + courseId + '/courseWork/' + courseWorkId + (
          '/studentSubmissions'),
    };
    accountInstance.request(opts, (data) => {
      callback(data, iconElement);
    });
  } else {
    console.error(
        'GClassroom.getMyCourseWorkStudentSubmissions missing account');
  }
};

/**
 * @private
 */
cwc.ui.GClassroom.prototype.cleanUp_ = function() {
  this.events_.clear();
};
