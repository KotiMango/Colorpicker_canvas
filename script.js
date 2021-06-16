//canvas
const canvas = document.getElementById("canvas");

//element location
const getElementPosition = (obj) => {
  let cordLeft = 0,
    cordTop = 0;
  if (obj.offsetParent != null) {
    cordLeft += obj.offsetLeft;
    cordTop += obj.offsetTop;
    return { x: cordLeft, y: cordTop };
  } else {
    return undefined;
  }
};

//mouse location
const getEventLocation = (element, e_vent) => {
  const posit = getElementPosition(element);
  return {
    x: e_vent.pageX - posit.x,
    y: e_vent.pageY - posit.y,
  };
};

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

//turns values from binary representation to percentile
const hslFactor = (val) => {
  val = Math.round(val * 100);
  return val;
};

//Draws white to black vertically and red across the alpha horizontally
const drawPallete = () => {
  const workCanvas = canvas.getContext("2d");
  const gradientCanvasV = workCanvas.createLinearGradient(0, 0, 0, 255);
  gradientCanvasV.addColorStop(0, "white");
  gradientCanvasV.addColorStop(1, "black");
  const gradientCanvasH = workCanvas.createLinearGradient(0, 0, 255, 0);
  gradientCanvasH.addColorStop(0, "hsla(0, 100%, 50%, 0)");
  gradientCanvasH.addColorStop(1, "hsla(0, 100%, 50%, 1)");

  workCanvas.scale(0.39607, 0.39607);
  workCanvas.fillStyle = gradientCanvasV;
  workCanvas.fillRect(0, 0, 255, 255);
  workCanvas.fillStyle = gradientCanvasH;
  workCanvas.globalCompositeOperation = "multiply";
  workCanvas.fillRect(0, 0, 255, 255);
  workCanvas.globalCompositeOperation = "multiply";
};

drawPallete();
//fetching mouse location and the pixel which it sits on
canvas.addEventListener(
  "click",
  (e) => {
    let eventLocation = getEventLocation(canvas, e);
    //pixel mouse sits on
    let context = canvas.getContext("2d");
    let pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1)
      .data;
    let hsl = rgbToHsl(pixelData[0], pixelData[1], pixelData[2]);
    document.getElementById("status").innerHTML = `hsl(${hsl[0]}, ${hslFactor(
      hsl[1]
    )}%, ${hslFactor(hsl[2])}%)`;
    document.getElementById(
      "color"
    ).style.backgroundColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
  },
  false
);
