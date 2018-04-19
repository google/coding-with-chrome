Build Coding with Chrome - Chrome Application
==============================================
<p align="center"><img src="../static_files/images/cwc_logo.png"></p>

## Prerequisites
Please make sure you followed the [Build pre-requisites](BUILD.md) before using this document.

## Build the core files
In order to build the actual app you need first to build all core files.
This step is normally needed only once and after an update of the core files.
This could be done with the following command:
```bash
npm run build
```

## Build the actual app
To only compile the Chrome app run the build script with the following command:
```bash
npm run build-chrome_app
```
The build version will be compiled in the `dist/chrome_os` directory, together with all required packages and files.

## Build and run the actual app (testing)
For testing you can compile and run the Chrome app use the following command:
```bash
npm run chrome-app
```
This will automatically build and start the application on Mac OS, Linux or
Windows, if supported.

## How to load Coding with Chrome App manual in the Chrome Browser

### Enable developer mode
Visit `chrome://extensions` in your browser (or open up the Chrome menu by
clicking the icon to the far right of the Omnibox (three horizontal bars) and
select Extensions under the Tools menu to get to the same place).

Ensure that the Developer mode checkbox in the top right-hand corner is checked.

### Add the app
On the same page click `Load unpacked extension…` to pop up a file-selection
dialog.

Navigate to the directory in which your `dist/chrome_os` files live, and select it.

Alternatively, you can drag and drop the directory where your `dist/chrome_os` files
live onto chrome://extensions in your browser to load it.

### Launch the app
On the same page click `Launch` next to `Coding with Chrome` or visit
`chrome://apps` in your browser and click on the `Coding with Chrome` icon.
