Coding with Chrome Debugging
============================

This document covers debugging informations and technique's for the
Coding with Chrome editor.

## General options
This list gives an general overview of options which could be useful
for debugging.

### Log level
You could adjust the visible log level in the src/config/config.js file:
```js
/**
 * Default log level.
 * @type {cwc.utils.LogLevel}
 */
cwc.config.LogLevel = cwc.utils.LogLevel.INFO;
```

### Update dependencies
In some cases you need to update the dependencies to the latest version to
get everything working. This can be done with the following command:
```bash
npm run update
```

### Clean up generated files and remove "extraneous" packages
To clean up the generated files in the genfiles folder and additional to
remove "extraneous" packages, run:
```bash
npm run clean
```

### Clean build
If you want to build an clean build, run:
```bash
npm run clean-build
```

### Fast rebuild
In the case you don't need to rebuild the hole package (remote and static files)
you could simple use:
```bash
npm run rebuild
```

### Fast build
The following command will build all files and automatically launching or reload
 "Coding with Chrome" in the Chrome browser on Mac OS, Linux and Windows.
```bash
npm run fastbuild
```

## Live debugging
The following methods will help you to debug certain functions or parts without
the need to recompile the hole source code.

### Using genfiles/js/debug.js
The `genfiles/js/debug.js` file allows you to overwrite definitions or to change
function without the need of recompile everything.

Just overwrite your function in the `genfiles/js/debug.js` file and reload the
application to see your change in action.

In some cases it could be that you need to insert the hole object definition
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

**NOTE: Please keep in mind that your changes in the `genfiles/js/debug.js` file
will be overwritten if you compile or recompile the code.**

### Using genfiles/js/cwc_ui.js
Instead of overwriting definitions in the `genfiles/js/debug.js` file you could
directly replace them in the `genfiles/js/cwc_ui.js` file.

Please keep in mind that this file contains optimized code, so its not really
readable but this will also avoid to re-compile the code to test something.

Original genfiles/js/cwc_ui.js:
```javascript
cwc.mode.tts.Mod = ...
```

Modified genfiles/js/cwc_ui.js:
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

**NOTE: Please keep in mind that your changes in the `genfiles/js/cwc_ui.js`
file will be overwritten if you compile or recompile the code.**

### Chrome Developer Tools
Even this is an Chrome application, you could still use the Chrome Developer
Tools to debug certain parts.

Just open the Chrome extension page (e.g. `chrome://extensions/`) in your Chrome
browser and search for "Coding with Chrome".
Click the entries in the "inspect views" to get access to the DOM and the
JavaScript console.

### Adding additional log messages
If needed add additional log messages with console.info, console.debug,
console.trace...

Alternative you could use the helper function to get an log handler which is
controlled by the application with an the general log level.

Example:
```javascript
... = function(helper) {
  /** @type {!cwc.utils.Logger} */
  this.log_ = helper.getLogger();
  ...
};

this.log_.debug('...');
```

### Accessing the core
If you need access to the core of Coding with Chrome, open the JavaScript
console for the the "html/editor.html" view and run the following command:

```javascript
var testInstance_ = cwcBuildUi();
console.log(testInstance_);
```

This will reload and rebuild the hole UI and you could access the core over
the `testInstance_` variable.

If you loaded an custom mode, you could access the mode over
`testInstance_.helper.instances_.mode`.

**Note: It could be that some functions are not working as expected after an
reload (reload protection), so please only use this for debugging reasons.**
