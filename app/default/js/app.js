/*
 * Decorates Coding with Chrome GUI after content is loaded and no other
 * instance is already defined.
 */
window['CWC_BUILDER'] = new cwc.ui.Builder();
window.addEventListener('load', function() {
  window['CWC_BUILDER'].decorate();
}, false);
