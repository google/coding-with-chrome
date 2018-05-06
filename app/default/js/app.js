/*
 * Decorates Coding with Chrome GUI after content is loaded and no other
 * instance is already defined.
 */
window.addEventListener('load', function() {
  if (!window['CWC_BUILDER']) {
    new cwc.ui.Builder().decorate();
  }
}, false);
