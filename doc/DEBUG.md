Coding with Chrome - Debugging
===============================

This document covers debugging information and technique's for the
Coding with Chrome editor.

General options
----------------

This list gives an general overview of options which could be useful
for debugging.

### Log level

You could adjust the visible log level in the `src/config/config.js` file:

```javascript
/**
 * Default log level.
 * @type {cwc.utils.LogLevel}
 */
cwc.config.LogLevel = cwc.utils.LogLevel.INFO;
```

### Source map

If you need to take a look at the original source code instead of the
compiled source code, please run:

```bash
npm run debug
```

### Sync latest files and dependencies

In some cases, you need to update the dependencies to the latest version to
get everything working. This can be done with the following command:

```bash
npm run sync
```

### Clean up generated files and remove "extraneous" packages

To clean up the generated files in the `genfiles` folder and additional to
remove "extraneous" packages, run:

```bash
npm run clean
```

Live debugging
---------------

The following methods will help you to debug certain functions or parts without
the need to recompile the whole source code.

### Using dist/chrome_os/js/debug.js

The `dist/chrome_os/js/debug.js` file allows you to overwrite definitions or to
change function without the need of recompile everything.

Just overwrite your function in the `dist/chrome_os/js/debug.js` file and reload
the application to see your change in action.

In some cases, it could be that you need to insert the whole object definition
here and not only parts of it.

Original definition:

```javascript
cwc.protocol.bluetooth.Device.prototype.getAddress=function(){...};
```

genfiles/js/debug.js:

```javascript
cwc.protocol.bluetooth.Device.prototype.getAddress=function(){
  if (!this.address) {
    console.error('Unknown device address!');
  }
  return this.address||"";
};
```

**NOTE: Please keep in mind that your changes in the
`dist/chrome_os/js/debug.js` file will be overwritten if you compile or
recompile the code.**

### Using dist/chrome_os/js/cwc_ui.js

Instead of overwriting definitions in the `dist/chrome_os/js/debug.js` file you
could directly replace them in the `dist/chrome_os/js/cwc_ui.js` file.

Please keep in mind that this file contains optimized code, so it's not really
readable but this will also avoid to re-compile the code to test something.

Original `dist/chrome_os/js/cwc_ui.js`:

```javascript
cwc.mode.tts.Mod = ...
```

Modified `dist/chrome_os/js/cwc_ui.js`:

```javascript
/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.tts.Mod = function(helper) {

  /** @type {cwc.mode.tts.Layout} */
  this.layout = new cwc.mode.tts.Layout(helper);

  /** @type {cwc.mode.tts.Editor} */
  this.editor = new cwc.mode.tts.Editor(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.tts.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
};
```

**NOTE: Please keep in mind that your changes in the
`dist/chrome_os/js/cwc_ui.js` file will be overwritten if you compile or
recompile the code.**

### Chrome Developer Tools

Even this is an Chrome application, you could still use the Chrome Developer
Tools to debug certain parts.

Just open the Chrome extension page (e.g. `chrome://extensions/`) in your
Chrome browser and search for "Coding with Chrome".
Click the entries in the "inspect views" to get access to the DOM and the
JavaScript console.

### Accessing the core

If you need access to the core of Coding with Chrome, open the JavaScript
console for the "index.html" view and run the following command:

```javascript
console.log(window['CWC_BUILDER']);
```

You could access the core over the `window['CWC_BUILDER']` variable.

**Note: It could be that some functions are not working as expected after an
reload (reload protection), so please only use this for debugging reasons.**
