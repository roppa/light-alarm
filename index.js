SPI2.setup({ baud: 3200000, mosi: B15 });

/*
* Config
*/

const totalLEDs = 25;

/*
* Light Arrays
*/

const offLights = (function () {
  var lights = new Array(totalLEDs * 3);
  lights.fill(0);
  return lights;
}());

const duskDawnLights = (function () {
  var lights = [];
  for (var i = 0; i < totalLEDs; i++) {
    lights.push(255, 10, 10);
  }

  return lights;
}());

const daylights = (function () {
  var lights = [];
  for (var i = 0; i < totalLEDs; i++) {
    lights.push(150, 255, 255);
  }

  return lights;
}());

const randomFireLights = (function () {
  var colours = [
    [255, 0, 0], [255, 10, 10], [200, 10, 0], [180, 5, 10], [150, 20, 0], [130, 20, 0],
  ];
  return () => {
    var lights = [];
    for (var i = 0; i < totalLEDs; i++) {
      lights = lights.concat(colours[Math.floor(Math.random() * colours.length)]);
    }

    return lights;
  };
}());

/*
* Light algorithms/functions
*/

const playFireLights = () => {
  setInterval(() => {
      updateLEDLights(randomFireLights());
    }, 75);
};

const playOffLights = () => updateLEDLights(offLights);

const playDuskDawnLights = () => updateLEDLights(duskDawnLights);

const playDaylights = () => updateLEDLights(daylights);

/*
* LED light controls
*/

function updateLEDLights(lights) {
  SPI2.send4bit(lights, 0b0001, 0b0011);
}

/*
* Utils
*/

function getLightTransitionValues(lightsFrom, lightsTo) {
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

const transitionLightValues = (function () {
  let transitionInterval = null;
  return function (from, to) {
    if (transitionInterval) {
      return transitionInterval;
    }

    let tempLights = from;
    transitionInterval = setInterval(function () {
      tempLights = getLightTransitionValues(tempLights, to);
      updateLEDLights(tempLights);
      if (lightsAreEqual(tempLights, to)) {
        clearInterval();
        transitionInterval = null;
      }
    }, 100);
  };
}());

setWatch((function () {
  const states = [playDuskDawnLights, playDaylights, playFireLights,
    playDuskDawnLights, playOffLights,
  ];
  let currentStateIndex = 0;

  return () => {
    clearInterval();
    interval = states[currentStateIndex]();
    currentStateIndex = (currentStateIndex + 1 >= states.length) ? 0 : currentStateIndex + 1;
  };
}()), BTN, { edge: 'rising', repeat: true, debounce: 10 });
