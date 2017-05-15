Build Coding with Chrome
=========================
<p align="center"><img src="static_files/images/cwc_logo.png"></p>

## What you need to build your own Coding with Chrome App
In order to build the Coding with Chrome App, you only need to have Node.js/npm, git and Open JDK / Java JRE installed on your system.

Each build is cross platform compatible. Which mean if you build the
Coding with Chrome App on Windows you could use the generated code
`genfiles/chrome_app` folder in other platforms like Mac OS X as well.

### Windows
Install Node.js from the official web page at https://nodejs.org
* Optional
  * Install git from the official web page at https://git-scm.com/
  * Install Java JRE

### Mac OS X
Install Node.js from the official web page at https://nodejs.org
* Optional
  * Install git from the official web page at https://git-scm.com/
  * Install Java JRE

### Linux/BSD
Use your package manager to install Node.js, or build from source.
* Optional
  * Use your package manager to install git, or build from source.
  * Install Open JDK or Java JRE


## How to build your own Coding with Chrome App

### Get the sources
Download the source files manual from GitHub or with git by running:
```bash
git clone --recursive git://github.com/google/coding-with-chrome.git
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
In order to update all dependencies automatically, just run the following command:
```bash
npm run sync
```

### Build and run the actual app
To compile and run the Chrome app use the following command:
```bash
npm run chrome-app
```
This will automatically build and start the application on Mac OS, Linux or
Windows.

### Build the actual app
To only compile the Chrome app run the build script with the following command:
```bash
npm run build-core
npm run build-chrome_app
```
The build version will be compiled in the `genfiles/chrome_app` directory, together with all required packages and files.


## How to load Coding with Chrome App manual in the Chrome Browser

### Enable developer mode
Visit `chrome://extensions` in your browser (or open up the Chrome menu by
clicking the icon to the far right of the Omnibox (three horizontal bars) and
select Extensions under the Tools menu to get to the same place).

Ensure that the Developer mode checkbox in the top right-hand corner is checked.

### Add the app
On the same page click `Load unpacked extension…` to pop up a file-selection
dialog.

Navigate to the directory in which your `genfiles/chrome_app` files live, and select it.

Alternatively, you can drag and drop the directory where your `genfiles/chrome_app` files
live onto chrome://extensions in your browser to load it.

### Launch the app
On the same page click `Launch` next to `Coding with Chrome` or visit
`chrome://apps` in your browser and click on the `Coding with Chrome` icon.
