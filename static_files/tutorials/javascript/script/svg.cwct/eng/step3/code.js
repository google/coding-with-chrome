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
