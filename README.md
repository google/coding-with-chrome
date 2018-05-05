Coding with Chrome [<img
src="static_files/resources/external/chrome_webstore.png" align="right"
alt="Available in the Chrome Web Store">](https://chrome.google.com/webstore/detail/coding-with-chrome/becloognjehhioodmnimnehjcibkloed)
==================

[![Code Climate](https://codeclimate.com/github/google/coding-with-chrome/badges/gpa.svg)](https://codeclimate.com/github/google/coding-with-chrome)
[![Build Status](https://travis-ci.org/google/coding-with-chrome.svg?branch=master)](https://travis-ci.org/google/coding-with-chrome)
[<img src="static_files/resources/external/chrome_webstore.png" align="right"
alt="Available in the Chrome Web Store">](https://chrome.google.com/webstore/detail/coding-with-chrome/becloognjehhioodmnimnehjcibkloed)
<img src="/static_files/images/cwc_logo.png" align="right" alt="Coding with Chrome">

* [Licensing](#licensing)
* [Install Coding with Chrome](#install-coding-with-chrome)
* [Build Coding with Chrome](#build-the-coding-with-chrome-app)
* [Supported hardware and system](#supported-hardware-and-system)
* [Report Issues](#report-issues)
* [Contributing](#contributing)
* [Credits](#credits)

Coding with Chrome is an Educational Development Environment built around two
core philosophies:

1. Offer a stand-alone, offline app experience which allows people anywhere to
   learn how to build useful computer programs:
   * A basic IDE able to support real programming work
   * A tutorial system that poses a challenge, checks the solution and
     provides feedback.
2. Allow educators to put together a custom curriculum made up of various
   components like:
   * input languages (blockly, javascript, coffeescript)
   * output modules (turtle graphics, javascript output, connected robots)
   * Flexible UI where elements can be easily added, modified or removed
   * Tutorial engine for self learning

Licensing
----------

Apache License, Version 2.0 see [LICENSE.md](LICENSE.md)

Install Coding with Chrome
---------------------------

If you only want to install __Coding with Chrome__, you could use the
pre-compiled versions.

### Chrome App version

To install the Chrome App version:

1. Visit the [Chrome Web Store][1]
2. Click __Add to Chrome__
3. Go to [chrome://apps](chrome://apps) or use the "Overview" ○ Launcher
4. Launch __Coding with Chrome__

### Mac OS and Windows version (alpha)

To install the Mac OS and/or Windows binary version:

1. Visit the [Release Page][2] and look for the latest entry
2. Download and extract the corresponding **.zip file** for your platform
3. Go into the extracted folder and launch __Coding with Chrome__(.app/.exe)

Build the Coding with Chrome App
---------------------------------

If you want to build the latest Coding with Chrome App from the source code,
please check the [build instructions](BUILD.md).

Supported hardware and system
------------------------------

### Supported hardware

Computers and Laptops with Chrome OS or any OS which is able to run the
Desktop Chrome Browser are supported.
For additional features Bluetooth and/or USB are required.

### Supported systems

The following operating systems are supported by Coding with Chrome:

* Chrome OS
* Mac OS
* Windows OS
* Linux (without Bluetooth support / USB supported)

### Supported robots

The following robots are supported, out of the box by Coding with Chrome:

* EV3
* Sphero 2.0
* mBot (firmware >= 06.01.104)
* mBot Ranger (firmware >= 09.01.001)

Report Issues
--------------

For any issues or feature requests, we would really appreciate it if you report
them using our [issue tracker](https://github.com/google/coding-with-chrome/issues).

Contributing
-------------

Contributing to Coding with Chrome is subject to the guidelines in the
[CONTRIBUTING.md](CONTRIBUTING.md) file, which, in brief, requires that
contributors sign the [Individual Contributor License Agreement (CLA)][3].

For more information about develop for Coding with Chrome, please check
[doc/DEVELOPMENT.md](doc/DEVELOPMENT.md)

### Translation

For translation instruction, please check [doc/I18N.md](doc/I18N.md).

Credits
--------

Coding with Chrome is made possible by other [open source software](NOTICE.md).

[1]: https://chrome.google.com/webstore/detail/coding-with-chrome/becloognjehhioodmnimnehjcibkloed
[2]: https://github.com/google/coding-with-chrome/releases
[3]: https://cla.developers.google.com/
