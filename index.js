SPI2.setup({ baud: 3200000, mosi: B15 });

const sunsetLights = (function () {
  var lights = [];
  for (var i = 0; i < 25; i++) {
    lights.push(255, 10, 10);
  }

  return lights;
}());

const daylights = (function () {
  var lights = [];
  for (var i = 0; i < 25; i++) {
    lights.push(150, 255, 255);
  }

  return lights;
}());

function randomFireLights() {
  var colours = [[255, 0, 0], [255, 10, 10], [200, 10, 0], [180, 5, 10], [150, 20, 0]];
  var lights = [];
  for (var i = 0; i < 25; i++) {
    lights = lights.concat(colours[Math.floor(Math.random() * colours.length)]);
  }

  return lights;
}

function updateLEDLights(lights) {
  SPI2.send4bit(lights, 0b0001, 0b0011);
}

function getTransitionLights(lightsFrom, lightsTo) {
  var transitionLights = [];
  for (var i = 0; i < lightsFrom.length; i++) {
    if (lightsFrom[i] < lightsTo[i]) {
      transitionLights[i] = lightsFrom[i] + 1;
    } else if (lightsFrom[i] > lightsTo[i]) {
      transitionLights[i] = lightsFrom[i] - 1;
    } else {
      transitionLights[i] = lightsTo[i];
    }
  }

  return transitionLights;
}

function lightsAreEqual(a, b) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function updateLightValues(from, to) {
  var tempLights = from;
  var transitionInterval = setInterval(function () {
    tempLights = getTransitionLights(tempLights, to);
    updateLEDLights(tempLights);
    if (lightsAreEqual(tempLights, to)) {
      clearInterval(transitionInterval);
    }
  }, 50);
}

(function start() {
  setInterval(function () {
    updateLEDLights(randomFireLights());
  }, 200);
}());
