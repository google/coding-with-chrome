function(code, res) {
  console.log({code: code, res: res});
  var matches = code.match(/draw.circle\(([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+), *([^,]+)\)/);
  var msg = 'No circles yet, keep trying';
  var color = 'red';
  if (matches) {
    msg = 'Great circle. Now can you make it <span style="color: #3333ff">blue</span>?';
    color = 'orange';
    if (matches[4].includes('#3333ff')) {
      msg = 'Good job. Now make the border <span style="color: #009900">green</span>.';
    }
    if (matches[5].includes('#009900')) {
      msg = 'Perfect! Now you\'re ready to program in blockly.';
      color = 'green';
    }
  }
  document.getElementById('msg').innerHTML = '<h2 style="color: '+color+'">'+msg+'</h2>';
}
