Build Coding with Chrome - Binary Mac Application
==================================================

<img src="../static_files/images/cwc_logo.png" align="right">

Prerequisites
--------------

Please make sure you followed the [Build pre-requisites](../BUILD.md) before
using this document.

Build the core files
---------------------

In order to build the actual app you need first to build all core files.
This step is normally needed only once and after an update of the core files.
This could be done with the following command:

```bash
npm run build
```

Build the launcher
-------------------

To compile the binary launcher run the build script with the following command:

```bash
npm run build-nw_app
```

Build the actual app
---------------------

To compile the packed binary version run the build script with the following
command:

```bash
npm run publish-nw_app-mac
```

The build version will be compiled in the `/dist/binary/osx64` directory,
together with all required packages and files.

### Launch the app

Go into the `/dist/binary/osx64` directory and double click on the `binary`
file.

Troubleshooting
----------------

### EMFILE error or "too many open files" error on MAC OSX

Run `ulimit -n 1024` and add it into `~/.bash_profile`.
