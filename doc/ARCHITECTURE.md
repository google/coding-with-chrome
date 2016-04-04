Coding with Chrome - Architecture
=================================

This document covers the technical architecture for the different parts of
Coding with Chrome.

## Folder structure

* **app** - Chrome app folder
  * **_locales** - Language specific translations
    * **de** - German translation
    * **en** - English translation
  * **css** - Static css files
    * **blockly** Custom blockly css files
    * **closure** Custom closure css files
    * **codemirror** Custom codemirror css files
  * **examples** - Example files
  * **fonts** - Fonts folder including Icon fonts
  * **html** - Start html files for the ui
  * **icons** - Chrome app icons
  * **images** - Static image files
  * **js** - Start javascript files to load the ui
* **doc** - Technical documentation
* **genfiles** - Output folder for the compiled Chrome application
* **src** - Source folder for actual code
  * **config** - Main configurations for Coding with Chrome
  * **file** - File and files classes
  * **file_format** - CWC fileformat definition, reader and writer
  * **file_handler** - File handler to create, load, save and exports files
  * **frameworks** - Collection of support frameworks for the Runner
    * **arduino** - Arduino framework
    * **ev3** - EV3 framework
    * **runner** - Runner framework to execute code
    * **simple** - Simple framework
  * **mode** - Supported Editor modes
    * **arduino** - Arduino mode
    * **basic** - Basic mode
    * **ev3** - EV3 mode
    * **html5** - HTML5 mode
    * **json** - JSON mode
    * **text** - Text mode
    * **tts** - TTS mode
  * **protocol** Supported protocols for communication
    * **arduino** - Arduino protocol
    * **bluetooth** - Bluetooth protocol
    * **ev3** - EV3 protocol
    * **serial** - Serial protocol
    * **usb** - USB protocol
  * **renderer** - Collection of different outputs / renderer
    * **external** - Customized and specific renderer like for the ev3
    * **internal** - General renderer like for html
  * **ui** - Collection of all ui parts
    * **blockly** - Blockly implementation
      * **blocks** - Customized block definitions
    * **config** - Handling users configurations
    * **connection_manager** - Managed different types of connections
    * **debug** - Used for easily testing the different modes and files
    * **documentation** - In-app documentation and tutorials
    * **editor** - Code Mirror implementation
    * **gdrive** - Google Drive support to load and save files
    * **gui** - Basic GUI structure
    * **help** - In-app help articles
    * **layout** - Definition of the different UI layouts
    * **library** - Handling of additional library files
    * **menubar** - Definition of the menubar
    * **message** - Message handler for info, error, warn …
    * **preview** - Definition of the preview
    * **runner** - Definition of the runner
    * **select_screen** - Main screen to select the different mods or examples
    * **setttings** - UI element for handling user settings
    * **statusbar** - Definition of the statusbar
  * **utils** - Collection of additional helper
* **third_party** - Third party files like images, logos, …


##Basic Workflow

### Renderer
The renderer prepares the sandbox environment with the needed frameworks or
preparations to execute the user generated code.
```
+----------------------+                             +----------------------+
|                      |                             |                      |
|       Editor         |                             |      Preview         |
|                      |      +----------------+     |  +----------------+  |
| +----------------+   |      |                |     |  |                |  |
| |                |   +----> |     Render     | +-------->              |  |
| |  User Input    |   |      |                |     |  |     Sandbox    |  |
| |                +---+      +----------------+     |  |                |  |
| +----------------+   |                             |  +----------------+  |
+----------------------+                             +----------------------+
```

### Runner
The runner is used if a hardware communication between the user generated code
and the serial, Bluetooth or USB interface is needed.
The code will be executed in the sandbox as well, but will have limited access
to the internal apis over the runner framekwork / runner api.
```
+----------------------+                             +----------------------+
|                      |      +----------------+     |                      |
|       Editor         |      |                |     |      Preview         |
|                      +----> +     Runner     +--+  |  +----------------+  |
| +----------------+   |      |                |  |  |  |                |  |
| |                |   |      +----------------+  +------->  Sandbox     |  |
| |  User Input    |   |                             |  +----------------+  |
| |                +---+      +----------------+  +-----+Runnerframework |  |
| +----------------+   |      |                |  |  |  +----------------+  |
+----------------------+  +---+   Runner API   | <+  +----------------------+
|                      |  |   |                |
|   Internal APIs   <-----+   +----------------+
|                      |
+----------------------+
```
