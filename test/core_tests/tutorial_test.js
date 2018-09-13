/**
 * @fileoverview Tutorial tests
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
 * @author carheden@google.com (Adam Carheden)
 */

describe('Tutorial', function() {
  let sidebarId = 'cwc-sidebar';
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="cwc-editor" style="z-index: 1000;"></div>
    <div id="${sidebarId}" style="z-index: 2000"></div>
  `);
  document.head.insertAdjacentHTML('afterbegin',
    '<link rel="stylesheet" href="css/editor.css">');

  let randomString = function(maxLength = 20, minLength = 1,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ' +
      '!@#$%^&*()-_=+~[]{}\\|<>,./?;:\'"') {
    let length = Math.floor(Math.random() * (maxLength + minLength)) +
      minLength;
    let string = '';
    while (string.length < length) {
      string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return string;
  };

  let testTutorial = async function(tutorialTemplate) {
    let builder = new cwc.ui.Builder();
    await builder.decorate();
    let sidebar = builder.getHelper().getInstance('sidebar');
    expect(sidebar).not.toBeNull();
    let sidebarNode = document.getElementById(sidebarId);
    expect(sidebarNode).not.toBeNull();
    sidebar.decorate(sidebarNode);
    let tutorial = builder.getHelper().getInstance('tutorial');
    await tutorial.setTutorial(tutorialTemplate);
    return builder;
  };

  let tutorialContainerId = 'cwc-tutorial-container';
  let tutorialStepContainerId = 'cwc-tutorial-step-container';

  let hasTutorial = function(builder) {
    let sidebarInstance = builder.getHelper().getInstance('sidebar');
    expect(sidebarInstance.isContentActive('tutorial')).toBe(true);
    let tutorialContentDiv = document.getElementById(tutorialContainerId);
    expect(tutorialContentDiv).not.toBeNull();
  };

  let getTutorialTemplate = (steps) => {
    let tutorialTemplate = {
        'description': {
          'text': randomString(),
          'mime_type': 'text/plain',
        },
      };
    if (steps === false) return tutorialTemplate;

    tutorialTemplate['steps'] = [];
    for (let i=0; i<steps; i++) {
      tutorialTemplate['steps'].push({
        'title': randomString(),
          'description': {
            'text': randomString(),
            'mime_type': 'text/plain',
          },
      });
    }

    return tutorialTemplate;
  };

  let clickContinue = function(stepNumber) {
    let steps = document.getElementsByClassName(tutorialStepContainerId);
    expect(steps.length).toBeGreaterThan(stepNumber);
    let content = steps[stepNumber].querySelector('.cwc-tutorial-step-content');
    let button = content.querySelector('.cwc-tutorial-step-actions button');
    expect(button).not.toBeNull();
    button.click();
  };

  let walkTutorial = async function(stepCount) {
      let tutorialTemplate = getTutorialTemplate(stepCount);
      let builder = await testTutorial(tutorialTemplate);
      hasTutorial(builder);

      // Correct content
      let steps = document.getElementsByClassName(tutorialStepContainerId);
      expect(steps.length).toEqual(stepCount);
      let description = document.getElementById('cwc-tutorial-description');
      expect(description).not.toBeNull();
      expect(description.textContent).toEqual(
        tutorialTemplate['description']['text']);

      // Validate step order and text
      [].slice.call(steps).forEach((step, index) => {
        if (index == 0) {
          expect(step.className)
            .toMatch(/\bcwc-tutorial-step-container--active\b/);
        } else {
          expect(step.className)
            .not.toMatch(/\bcwc-tutorial-step-container--active\b/);
        }

        let number = step.querySelector('.cwc-tutorial-step-number-text');
        expect(number).not.toBeNull();
        expect(parseInt(number.textContent)).toBe(index + 1);

        let title = step.querySelector('.cwc-tutorial-step-title');
        expect(title).not.toBeNull();
        expect(title.textContent).toEqual(
          tutorialTemplate['steps'][index]['title']);

        let stepDescription = step.querySelector(
          '.cwc-tutorial-step-description');
        expect(stepDescription).not.toBeNull();
        expect(stepDescription.textContent).toEqual(
          tutorialTemplate['steps'][index]['description']['text']);
      });

      // Click through each step
      for (let i=0; i < stepCount - 1; i++) {
        // Current step is visible
        let content = steps[i].querySelector('.cwc-tutorial-step-content');
        expect(content).not.toBeNull();
        expect(content.offsetParent).not.toBeNull();

        // Next step is not visible
        let nextContent = steps[i+1]
          .querySelector('.cwc-tutorial-step-content');
        expect(nextContent).not.toBeNull();
        expect(nextContent.offsetParent).toBeNull();

        // Advance to the next step
        clickContinue(i);

        // Old current step is no longer visible
        expect(content.offsetParent).toBeNull();
        expect(steps[i].className)
          .toMatch(/\bcwc-tutorial-step-container--complete\b/);

        // New current step is now visible
        expect(steps[i + 1].className)
          .toMatch(/\bcwc-tutorial-step-container--active\b/);
        expect(nextContent.offsetParent).not.toBeNull();
      }
    };

  it('displays 0 steps correctly', async function() {
    await walkTutorial(0);
  });
  it('displays 1 step correctly', async function() {
    await walkTutorial(1);
  });
  it('displays 2 steps correctly', async function() {
    await walkTutorial(2);
  });
  it('displays 6 steps correctly', async function() {
    await walkTutorial(6);
  });
  it('displays 9 steps correctly', async function() {
    await walkTutorial(9);
  });

  it('displays HTML content', async function() {
    let tutorialTemplate = {
        'description': {
          'text': '<h1><font color="red">Test tutorial</font></h1>',
          'mime_type': 'text/html',
        },
        'steps': [
          {
            'title': randomString(),
            'description': {
              'text': '<div><span>Step 1</span></div>',
              'mime_type': 'text/html',
            },
          },
        ],
      };

    let builder = await testTutorial(tutorialTemplate);
    hasTutorial(builder);
    let description = document.getElementById('cwc-tutorial-description');
    expect(description).not.toBeNull();
    expect(description.innerHTML.includes(
      tutorialTemplate['description']['text'])).toBe(true);

    let step = document.querySelector(
      '#cwc-tutorial-step-0 .cwc-tutorial-step-description');
    expect(step).not.toBeNull();
    expect(step.innerHTML.includes(
      tutorialTemplate['steps'][0]['description']['text'])).toBe(true);
  });

  it('displays markdown content', async function() {
    let textDescription = 'Test tutorial';
    let textStepDescription = 'This step is important';
    let tutorialTemplate = {
        'description': {
          'text': `# ${textDescription}`,
          'mime_type': 'text/markdown',
        },
        'steps': [
          {
            'title': randomString(),
            'description': {
              'text': `**${textStepDescription}**`,
              'mime_type': 'text/markdown',
            },
          },
        ],
      };

    let builder = await testTutorial(tutorialTemplate);
    hasTutorial(builder);
    let description = document.getElementById('cwc-tutorial-description');
    expect(description).not.toBeNull();
    expect(description.textContent.trim()).toEqual(textDescription);

    let step = document.querySelector(
      '#cwc-tutorial-step-0 .cwc-tutorial-step-description');
    expect(step).not.toBeNull();
    expect(step.textContent.trim()).toEqual(textStepDescription);
  });

  it('getValidateFunction', async function() {
    let validate1 = function() {
      return {
        'solved': true,
        'message': 'validate_message_1',
      };
    }.toString();
    let validate2 = function() {
      return {
        'solved': true,
        'message': 'validate_message_2',
      };
    }.toString();
    let tutorialTemplate = getTutorialTemplate(3);
    tutorialTemplate['steps'][0]['validate'] = validate1;
    tutorialTemplate['steps'][1]['validate'] = validate2;
    let builder = await testTutorial(tutorialTemplate);
    let tutorial = builder.getHelper().getInstance('tutorial');

    // Check the first step
    expect(tutorial.getValidateFunction()).toEqual(validate1);

    // Advance to the next step and check that
    clickContinue(0);
    expect(tutorial.getValidateFunction()).toEqual(validate2);

    // Advance to the 3rd step and check that
    clickContinue(1);
    expect(tutorial.getValidateFunction()).toBeNull();
  });

  it('setMessage', async function() {
    let message1 = 'The swallow flies at midnight';
    let message2 = 'African or European?';
    let tutorialTemplate = getTutorialTemplate(2);
    let builder = await testTutorial(tutorialTemplate);
    let tutorial = builder.getHelper().getInstance('tutorial');

    // The message should start out empty
    let stepMessage = document.querySelector(
        '#cwc-tutorial-step-0 .cwc-tutorial-step-message');
    expect(stepMessage).not.toBeNull();
    expect(stepMessage.innerHTML).toBe('');

    // Validate that we can change it
    tutorial.setMessage(message1);
    expect(stepMessage.innerHTML).toBe(message1);

    tutorial.setMessage(message2);
    expect(stepMessage.innerHTML).toBe(message2);

    // Advance to the next step and check that
    clickContinue(0);
    stepMessage = document.querySelector(
        '#cwc-tutorial-step-1 .cwc-tutorial-step-message');
    expect(stepMessage.innerHTML).toBe('');
    tutorial.setMessage(message1);
    expect(stepMessage.innerHTML).toBe(message1);
    tutorial.setMessage(message2);
    expect(stepMessage.innerHTML).toBe(message2);
  });

  it('solved', async function() {
    let tutorialTemplate = getTutorialTemplate(2);
    let builder = await testTutorial(tutorialTemplate);
    let tutorial = builder.getHelper().getInstance('tutorial');

    // The step should start out unsolved
    let step = document.querySelector(
        '#cwc-tutorial-step-0');
    expect(step.className).not.toMatch(/\bsolved\b/);

    // Validate that we can change it both ways
    tutorial.solved(true);
    expect(step.className).toMatch(/\bsolved\b/);
    tutorial.solved(false);
    expect(step.className).not.toMatch(/\bsolved\b/);

    // Advance to the next step and check that
    clickContinue(0);
    step = document.querySelector(
        '#cwc-tutorial-step-1');
    expect(step.className).not.toMatch(/\bsolved\b/);
    tutorial.solved(true);
    expect(step.className).toMatch(/\bsolved\b/);
    tutorial.solved(false);
    expect(step.className).not.toMatch(/\bsolved\b/);
  });
});
