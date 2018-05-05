Build Coding with Chrome
=========================

<img src="static_files/images/cwc_logo.png" align="left">

What you need to build the Coding with Chrome App
--------------------------------------------------

In order to build the Coding with Chrome App, you only need to have Node.js/npm,
git and Open JDK / Java JRE installed on your system.

Each build is cross platform compatible. Which mean if you build the
Coding with Chrome App on Windows you could use the generated code
`genfiles/chrome_app` folder in other platforms like Mac OS X as well.

### Windows

Install Node.js from the official web page at <https://nodejs.org>

* Optional, if not already installed
  * Install git from the official web page at <https://git-scm.com/>
  * Install Java JRE
  * Install Google Chrome browser at <https://google.com/chrome>

### Mac OS X

Install Node.js from the official web page at <https://nodejs.org>

* Optional, if not already installed
  * Install git from the official web page at <https://git-scm.com/>
  * Install Java JRE
  * Install Google Chrome browser at <https://google.com/chrome>

### Linux/BSD

Use your package manager to install Node.js, or build from source.

* Optional, if not already installed
  * Use your package manager to install git, or build from source.
  * Install Open JDK or Java JRE
  * Install Google Chrome browser at <https://google.com/chrome>

How to build your own Coding with Chrome App
---------------------------------------------

### Get the sources

Download the source files manual from GitHub or with git by running:

```bash
git clone --recursive git://github.com/google/coding-with-chrome.git
```

### Switch into the downloaded folder

To be able to execute the following commands, you need to switch to the
downloaded folder by running:

```bash
cd coding-with-chrome
```

### Init / update submodules

In some cases you need to init and update the submodules manually by:

```bash
git submodule init
git submodule update
```

### Get required packages

Enter the "coding-with-chrome" directory and get the required packages by:

```bash
npm install
```

### Sync the project folder

In order to update all dependencies automatically, just run the following
command:

```bash
npm run sync
```

### Build the actual app

There are several ways to use Coding with Chrome, each of them have their
advantage or disadvantage.

In general we are offering the following versions:

* [Chrome Application (Chrome OS)](doc/BUILD_CHROME_OS.md)
* Binary ([Mac](doc/BUILD_MAC_APP.md),
  [Windows](doc/BUILD_WIN_APP.md) and [Linux](doc/BUILD_LINUX_APP.md))
* [Web (any modern Browser / experimental)](doc/BUILD_WEB.md)
