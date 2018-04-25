// Create a scalable vector graphic (SVG)
// Note: There are other ways to draw in HTML5,
//       such as the 'canvas' element
let svg = document.createElementNS('http://www.w3.org/2000/svg',
    'svg');
svg.setAttribute('height', 200);
svg.setAttribute('width', 200);
// We use the array notation ([]) to access these properties
// because their names include a dash (-), which has special
// meaning in javascript
svg.style['background-color'] = '#f3f3f3';
svg.style['margin-left'] = 'auto';
svg.style['margin-right'] = 'auto';

// Find the center of our drawing
let center = {x: svg.getAttribute('height') /
  2, y: svg.getAttribute('width') / 2};

// We'll make a triangle that's 2/3 the size our our drawing
let altitude = svg.getAttribute('height') * (2/3);

// Let's calculate the three points of our triangle
let points = [
  // point 0
  {x: center.x - altitude / 2,
   y: center.y + altitude / 2,
   color: 'red'},
  // point 1
  {x: center.x,
   y: center.y - altitude / 2,
   color: 'green'},
  // point 2
  {x: center.x + altitude / 2,
   y: center.y + altitude / 2,
   color: 'blue'},
];

// Finally we draw lines between each set of points
for (let p=0; p<points.length; p++) {
  // Each leg of our triangle is an SVG line element
  let line =
    document.createElementNS('http://www.w3.org/2000/svg',
    'line');

  // Set the color of each line.
  // This helps us figure out which line is which if we have
  // to debug the coordinates we calculated
  if (points[p]['color']) {
    line.style.stroke = points[p].color;
  }

  // Start out line at the current point
  line.setAttribute('x1', points[p].x);
  line.setAttribute('y1', points[p].y);
  // Figure out the index of the next point
  // What if we just used 'p + 1'?
  let pNext =
    p == points.length - 1 ? 0 : p + 1;

  // Draw a line to the next point
  line.setAttribute('x2', points[pNext].x);
  line.setAttribute('y2', points[pNext].y);

  // Put our line on our drawing
  svg.appendChild(line);
}

// Put the drawing on the page
let body = document.getElementsByTagName('body')[0];
body.style['padding'] = '2em';
body.appendChild(svg);
