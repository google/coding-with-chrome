Coding with Chrome - Modes
==========================

This document covers the modes of Coding with Chrome and how they are used.

Workflow
---------

1. The file / content is analyzed from the file detector (cwc.file.detector)
   and will be tagged with a file type (cwc.file.Type).

2. The file loader (cwc.fileHandler.FileLoader) uses the file handler config
   (cwc.fileHandler.Config), to load the correct mode config (cwc.mode.ConfigData)
   for the file type (cwc.file.Type).

3. The modder (cwc.mode.Modder) build the UI, loads the content and
   defines the used renderer according to the mode config (cwc.mode.ConfigData).

Add a new file_type
--------------------

### Add file extension

Add the official file extension if you don't want to use the .cwc file format.

utils/mine/mime_type.js

Add a new mode
---------------

### Define your mode under src/mode/{Mode Name}

### Add your mode to the mode_type.js

### Add your mode to the mode_config_data.js

### Add blank template file

static_files/resources/templates/...

### Add mode to select screen

ui/select_screen/...
