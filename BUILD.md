# Build Coding with Chrome Suite

<img src="static_files/images/cwc_logo.png" align="right">

## What you need to build the Coding with Chrome Suite

In order to build the Coding with Chrome App, you only need to have Node.js/npm
and GIT installed on your system.

Each build is cross-platform compatible. Which mean if you build the
Coding with Chrome Suite on Windows you could use the generated code in other
platforms like Mac OS X as well.

### Preperations

Install Node.js from the official web page at <https://nodejs.org>

- Optional, if not already installed
  - Install git from the official web page at <https://git-scm.com/>
  - Install Google Chrome browser at <https://google.com/chrome>

## How to build your own Coding with Chrome Suite

### Get the sources

Download the source files manual from GitHub or with git by running:

```bash
git clone --recursive https://github.com/google/coding-with-chrome.git
```

### Switch into the downloaded folder

To be able to execute the following commands, you need to switch to the
downloaded folder by running:

```bash
cd coding-with-chrome
```

### Get required npm packages

Enter the "coding-with-chrome" directory and get the required packages by:

```bash
npm install
```

### Start the actual app

```bash
npm run start
```
