# Build Coding with Chrome Suite (Experimental)

<img src="static_files/images/cwc_logo.png" align="right">

## What you need to build the Coding with Chrome Suite

In order to build the Coding with Chrome Suite, you only need to have Node.js/npm
and GIT installed on your system.

Each build is cross-platform compatible. Which mean if you build the
Coding with Chrome Suite on Windows you could use the generated code in other
platforms like Mac OS X as well.

### Preparations

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

#### Module not found error

If you get an error like:

```bash
Module not found: Error: Can't resolve '...'
```

Please make sure that you have cloned the repository with the `--recursive` flag.

Otherwise you need to run the following command to get the missing files:

```bash
git submodule update --init --recursive
```

### Start the actual app

To start the app, run the following command:

```bash
npm run start
```
