# Coding with Chrome (beta)

Coding with Chrome is an Educational Development Environment built around two
core philosophies:
  Offer a stand-alone, offline app experience which allows people anywhere to
  learn how to build useful computer programs:
    * A basic IDE able to support real programming work
    * A tutorial system that poses a challenge, checks the solution and
      provides feedback.

  Allow educators to put together a custom curriculum made up of various
  components like:
    * input languages (blockly, javascript, coffeescript)
    * output modules (turtle graphics, javascript output, connected robots)
    * Flexible UI where elements can be easily added, modified or removed
    * Tutorial engine for self learning

## Licensing
Apache License, Version 2.0 see LICENSE.md


## What you need to build your own Coding with Chrome App
In order to build the Coding with Chrome App, you only need to have Node.js/npm.
If you want to clone/copy the Coding with Chrome App repo, you need git as well.
Note: To avoid compatibility issues, please use NPM 2.x.

### Windows
Install Node.js (4.2) from the offical webpage at https://nodejs.org
Optional: Install git from the offical webpage at https://git-scm.com/

### Mac OS X
Install Node.js (4.2) from the offical webpage at https://nodejs.org
Optional: Install git from the offical webpage at https://git-scm.com/

### Linux/BSD
Use your package manager to install Node.js (4.2), or build from source.
Optional: Use your package manager to install git, or build from source.


## How to build your own Coding with Chrome App

### Get the sources
Download the source files manual from GitHub or with git by running:
```bash
git clone git://github.com/google/coding-with-chrome.git
```

### Get required packages
Enter the "coding-with-chrome" directory and get the required packages by:
```bash
npm install
```

### Build the actual app
To compile the Chrome app run the build script:
```bash
npm run build
```
The build version will be put in the `genfiles/` directory, together with all
required packages and files.


## How to load Coding with Chrome App in the Chrome Browser

### Enable developer mode
Visit `chrome://extensions` in your browser (or open up the Chrome menu by
clicking the icon to the far right of the Omnibox (three horizontal bars) and
select Extensions under the Tools menu to get to the same place).

Ensure that the Developer mode checkbox in the top right-hand corner is checked.

### Add the app
On the same page click `Load unpacked extension…` to pop up a file-selection
dialog.

Navigate to the directory in which your `genfiles/` files live, and select it.

Alternatively, you can drag and drop the directory where your `genfiles/` files
live onto chrome://extensions in your browser to load it.

### Launch the app
On the same page click `Launch` next to `Coding with Chrome` or visit
`chrome://apps` in your browser and click on the `Coding with Chrome` icon.


## Supported hardware and system

### Supported hardware
Computers and Laptops with Chrome OS or any OS which is able to run the
Desktop Chrome Browser are supported.
For additional features bluetooth and/or USB are required.

### Supported systems
The following operating systems are supported by Coding with Chrome:
* Chrome OS
* Mac OS
* Windows OS
* Linux (without Bluetooth support / USB supported)

## Report Issues
For any issues or feature requests, we would really appreciate it if you report
them using our [issue tracker](https://github.com/google/coding-with-chrome/issues).


## Contributing

### Rebuild the app
If you change something in the source code, you will need to re-compile it by:
```bash
npm run rebuild
```
After this you only need to reload the Chrome App to see your change in action.

### Update dependencies
Run the following command to update the dependencies to the latest version:
```bash
npm run update
```
After this you only need to reload the Chrome App to see your change in action.

### Translation
If you want to help with the translation perform the following steps:
* Navigate around in the UI part you want to translate
* Open the Chrome Developer Tools inside the Coding with Chrome App
* Type the following command into the console:
```
i18n.getToDo()
```
This will return a list of all untranslated text for your language.
Add your translations to the output and place them into the file
 `app/_locales/[language]/message.json`.

### Google Drive support (experimental)
To enable the experimental Google Drive support add your application key and
your api key to the `app/manifest.json` file:
```
…
  "description": "Coding with Chrome.",
  "key": "MIIBIjANBgkqhki…",
…
  "oauth2": {
    "client_id": "958…",
    "scopes": [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  },
…
```
Since this feature is experimental, although problems are unlikely we can not
guarantee this code is error free. Please make sure that you back up your
Google Drive data, or only use test accounts without critical files or data.

See: https://developer.chrome.com/apps/app_identity
