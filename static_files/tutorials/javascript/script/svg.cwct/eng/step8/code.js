// Step 1: Somewhere to draw
let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('height', 200);
svg.setAttribute('width', 200);
svg.style['background-color'] = '#f3f3f3';

// Step 2: Find the center
let center = {x: svg.getAttribute('height') /
  2, y: svg.getAttribute('width') / 2};

// Step 3: Size it down
let altitude = svg.getAttribute('height') * (2/3);

// Step 4: Three points
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

// Step 5: Points to lines
for (let p=0; p<points.length; p++) {
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

  // Start at the current point
  line.setAttribute('x1', points[p].x);
  line.setAttribute('y1', points[p].y);

  // Figure out the index of the next point
  let pNext = p == points.length - 1 ? 0 : p + 1;

  // End at the next point
  line.setAttribute('x2', points[pNext].x);
  line.setAttribute('y2', points[pNext].y);

  // Step 6: Add some color
  if (points[p]['color']) {
    line.style.stroke = points[p].color;
  }

  // Put our line on our drawing
  svg.appendChild(line);
}

// Step 7: Finally, a triangle
let body = document.getElementsByTagName('body')[0];
body.appendChild(svg);
