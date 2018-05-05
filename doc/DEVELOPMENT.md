Coding with Chrome - Development
=================================

Starting development
---------------------

### Before starting development

Before you start working on a larger contribution, you should get in touch
with us first through the issue tracker with your idea so that we can help out
and possibly guide you.
Coordinating up front makes it much easier to avoid frustration later on.

### Check or enable Source Maps in Chrome

Source Maps are enabled by default (as of Chrome 39), but if you’d like to
double-check or enable them, first open DevTools and click the settings cog
gear.
Under Sources, check Enable JavaScript Source Maps.
You might also check Enable CSS Source Maps.

### Running the debug mode

During development you should only use the debug mode, which provides additional
informations and pre-checks over:

```bash
npm run debug
```

Other options
--------------

### Rebuild the app

If you change something in the source code, you need to re-compile it.
After this you only need to reload the Chrome App to see your change in action.

### Update dependencies

Run the following command to update the dependencies to the latest version:

```bash
npm run sync
```

After this you only need to reload the Chrome App to see your change in action.

### Google Drive support (experimental)

Since this feature is experimental, although problems are unlikely we can not
guarantee this code is error free. Please make sure that you back up your
Google Drive data, or only use test accounts without critical files or data.

See: <https://developer.chrome.com/apps/app_identity>

### Debugging

For debug instruction, please check [DEBUG.md](DEBUG.md).
