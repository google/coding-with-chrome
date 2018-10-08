Coding with Chrome - Release checklist
========================================

<img src="../static_files/images/cwc_logo.png" align="right">

These following actions needs to be performed before each release.
This makes sure that a release is not breaking any major function.

Automated Tests
----------------

Most of the general errors are caught by the automated tests.
But it's not possible to have an 100% test coverage, so these tests will not
catch all race conditions.

- [ ] Run "npm run test" and check if any test fails

- [ ] Check <https://travis-ci.org/google/coding-with-chrome>

- [ ] Check <https://codeclimate.com/github/google/coding-with-chrome>

- [ ] Check coverage report under /coverage. The overall status should be
  at least 55%, if less additional tests need to be added.

UI Tests
---------

The following UI needs to be performed to make sure the major UI works as
expected.

All of these tests should be performed without the "experimental" and without
the "debug mode".

- [ ] Load the UI and open the console and check any errors during the tests

- [ ] Change the language

- [ ] Change display of modules

- [ ] Local file save/load

- [ ] Google Drive save/load

- [ ] Check all examples from the Basic section

- [ ] Check all examples from the Advanced section

Robot Tests
------------

The robot tests could not be automated because of the unknown firmware updates
from the robot vendor side.

- [ ] Charge the robot

- [ ] Update the firmware to the latest version

- [ ] Test robot control over Gamepad

- [ ] Test robot control over Keyboard

- [ ] Test robot control over Control buttons

- [ ] Load the specific robot example and check if it works as expected

- [ ] If available check sensor monitor output

- [ ] If available check JavaScript / Python mode

- [ ] If available send the robot to sleep over the sleep button

Build Release version
----------------------

### Chrome App

```bash
npm run publish:chrome_app
```

Use the generated **dist/chrome_app.zip** file for the upload to the
Chrome Store or to share over other ways.

### Binary (experimental)

```bash
npm run build:nw_app
npm run publish:nw_app
```

Use the generated **dist/binary/*/*** folders to create an zip archive for
the upload to GitHub or to share over other ways.
