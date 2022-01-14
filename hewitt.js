javascript:(function(){
  var lineColour = "rgba(0,0,255, 0.2)";
  
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  if(prefersDarkScheme.matches){
    lineColour = "rgba(255, 255, 255, 0.2)"
  }

  var inputs = Array.from(window.document.getElementsByTagName('input'));
  var links = Array.from(window.document.getElementsByTagName('a'));
  var buttons = Array.from(window.document.getElementsByTagName('button'));
  var elements = [...inputs, ...links, ...buttons];
  
  var vw = window.visualViewport.width;
  var vh = window.visualViewport.height;

  var elementBoundingRects = elements.map( el => {
    return el.getBoundingClientRect();
  });

  var onscreenElementBoundingRects = elementBoundingRects.filter( rect => {
    return (rect.top < vh && rect.left < vw) && (rect.width > 0 && rect.height > 0);
  });
  
  onscreenBoxes = onscreenElementBoundingRects.map( rect => {
    return  {
      left: rect.left,
      top: rect.top,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      corners: [
        [rect.left, rect.top],
        [rect.right, rect.top],
        [rect.right, rect.bottom],
        [rect.left, rect.bottom]
      ]
    }
  });

  var corners = [];
  onscreenBoxes.forEach( box => {
    corners.push(...box.corners)
  });

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('viewBox', "0 0 " + vw + " " + vh);
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute('stroke', "blue");
  svg.setAttribute('fill', "none");
  svg.style.position = "absolute";
  svg.style.width = vw + "px";
  svg.style.height = vh + "px";
  svg.style.top = 0;
  svg.style.left = 0;
  svg.style.zIndex = 999999;
  svg.style.pointerEvents = 'none';

  drawLinesByBoxes(onscreenBoxes);

  document.body.prepend(svg);

  function drawLinesByBoxes(boxes){
    for(var i = 0; i < boxes.length - 1; i++){
      var box1 = boxes[i];
      
      /*
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute('x', box1.left);
      rect.setAttribute('y', box1.top);
      rect.setAttribute('width', box1.width);
      rect.setAttribute('height', box1.height);
      svg.appendChild(rect);
      */

      for(var j = i+1; j < boxes.length; j++){
        var box2 = boxes[j];

        /*
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('x', box2.left);
        rect.setAttribute('y', box2.top);
        rect.setAttribute('width', box2.width);
        rect.setAttribute('height', box2.height);
        svg.appendChild(rect);
        */

        for(corner of box1.corners){
          for(let k = 0; k < 3; k++){
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('stroke-width', 0.25);
            line.setAttribute('stroke', lineColour);
            line.setAttribute('x1', corner[0]);
            line.setAttribute('y1', corner[1]);
            line.setAttribute('x2', box2.corners[k][0]);
            line.setAttribute('y2', box2.corners[k][1]);
            svg.appendChild(line); 
          }   
        }
      }
    }
  }

  function brightnessByColor (color) {
    var color = "" + color, isHEX = color.indexOf("#") == 0, isRGB = color.indexOf("rgb") == 0;
    if (isHEX) {
      const hasFullSpec = color.length == 7;
      var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
      if (m) var r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16), g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16), b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
    }
    if (isRGB) {
      var m = color.match(/(\d+){3}/g);
      if (m) var r = m[0], g = m[1], b = m[2];
    }
    if (typeof r != "undefined") return ((r*299)+(g*587)+(b*114))/1000;
  }

})();
