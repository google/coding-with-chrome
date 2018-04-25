function(code, res) {
  var msg = '<h2 style="font-style: italic; color: red;">No right triangles yet. Keep trying.</h2>';
  if (res) {
    msg = '<h2 style="color: green">That\'s a right triangle. Great Job!</h2>';
  }
  document.getElementById('status').innerHTML = msg;
}
