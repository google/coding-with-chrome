<!-- markdownlint-disable -->
2019-1-21 16:44:06 -v5.10.16

Welcome to Coding with Chrome 5.16.10
=====================================

In this version we have a lot for you to try.

* [AIY](https://aiyprojects.withgoogle.com/) Support

   AIY is a cardboard machine learning kit that Coding with Chrome can now
   control for you. Want to try some object recognition (have the computer
   look at a picture and tell you what's in it)? Or just make it go 'beep'?
   Try the AIY mode now!

* Tutorial Engine

  Coding with Chrome now has built-in interactive tutorials. We'll walk you
  through getting started with the user interface, Blockly, JavaScript and
  [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics). Look for the
  *Tutorials* header in the Blockly, AIY and Programming/JavaScript sections.

* [Google Classroom](https://edu.google.com/intl/en/products/classroom/?modal_active=none)
  Improvements

  Does tour teacher have new assignments for you in
  [Google Classroom](https://edu.google.com/intl/en/products/classroom/?modal_active=none)?
  You can now open them directly from the Coding with Chrome menu. Make sure
  you log in using the person icon in the upper right of Coding with Chrome to
  see the *Open Google Classroom* menu option.

* [Bluetooth BLE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) support

  We now support Bluetooth 4 (BLE) robots too, including the SPRK+. Try it out!

You can learn about lots of other minor changes in the change log below, pulled
directly from our [Open Source code repository on
Github](https://github.com/google/coding-with-chrome). Check there to see how
Coding with Chrome is built.

Please send comments and suggestions to
[codingwithchrome@google.com](mailto:codingwithchrome@google.com).

Thanks!

Recent Changelog
----------------

commit 42de1848bc5af4a43518f78e9e8216560e18895e (HEAD, whats-new)
Author: Adam Carheden <adam.carheden@gmail.com>
Date:   Mon Jan 21 12:18:07 2019 -0700

    Added What's New! banner

commit 8d9afb801fafb41280986bec86a39b10748af794 (upstream/master, origin/master, origin/HEAD, master)
Author: Markus Bordihn <mbordihn@google.com>
Date:   Mon Jan 21 18:41:27 2019 +0100

    Fixed Google Drive integration issues.
    There are still some remaining issues.

commit 833b2a93ae748fa6d83243c9cccf912104e31a65
Author: Markus Bordihn <mbordihn@google.com>
Date:   Fri Jan 18 17:19:15 2019 +0100

    Fixed Google Classroom and Google Cloud integration.
    Note: Seems Google Drive integration get's broken and needs to be fixed.

commit 35e468f4d62d3395179345076c385e90d7956d93
Author: Markus Bordihn <mbordihn@google.com>
Date:   Thu Jan 17 17:34:34 2019 +0100

    Update main-debug.js

commit 32d76c07042302167a49b6c29eec57712a900f1e
Author: Markus Bordihn <mbordihn@google.com>
Date:   Thu Jan 17 17:31:01 2019 +0100

    Fixed smaller issues and compiler warnings.

commit 3de1ee8feeced5f047dfce02994d774eaa0d63d5
Author: Adam Carheden <adam.carheden@gmail.com>
Date:   Thu Jan 17 09:13:29 2019 -0700

    Moved AIY and Tutorial cards out of experimental (#209)

    - Fixed bug displaying feedback for SVG tutorial

commit b5d7f3683ae386a3284b652d1616a63b9e0c59e2
Author: Ashley Gau <agau4779@gmail.com>
Date:   Thu Jan 10 15:27:51 2019 -0800

    Add changelog as built file (#203)

commit 8d0697d7462d2599bc82b61ed0f16eb0b4ebb476
Author: Markus Bordihn <mbordihn@google.com>
Date:   Fri Jan 4 01:20:12 2019 +0100

    Fxied compiler warnings.

commit 6b60e047823f6707a319167a5aec63f12213a904
Author: Adam Carheden <adam.carheden@gmail.com>
Date:   Fri Dec 21 10:31:08 2018 -0700

    Aiy tutorial (#206)

    * Added AIY Examples
    - Added examples from https://github.com/google/aiyprojects-raspbian
      as cards on the AIY select screen.
    - Removed unused 'mkdir' function from tutorial build script.
    * Added AIY Voice Kit tutorial

commit e5b1e35fdb2aae7137a03ce9f5233c4747ba9f6b
Author: Filip Stanis <filip@stanis.me>
Date:   Wed Dec 12 16:14:59 2018 +0000

    Disable Joy Demo when connecting to AIY (#207)

    * Add warning about Joy Demo
    * Disable Joy Demo when connecting
    * add default timeout
[Show all](https://github.com/google/coding-with-chrome/commits/master)
