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

const lowDayLights = (function () {
  var lights = [];
  for (var i = 0; i < totalLEDs; i++) {
    lights.push(0, 20, 150);
  }

  return lights;
}());

const mediumDayLights = (function () {
  var lights = [];
  for (var i = 0; i < totalLEDs; i++) {
    lights.push(0, 100, 200);
  }

  return lights;
}());

const highDayLights = (function () {
  var lights = [];
  for (var i = 0; i < totalLEDs; i++) {
    lights.push(3, 150, 255);
  }

  return lights;
}());

const whiteLights = (function () {
  var lights = [];
  for (var i = 0; i < totalLEDs; i++) {
    lights.push(255, 255, 255);
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
  return randomFireLights();
};

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

const transitionLightValues = (from, to, durationMs) => {
  let tempLights = from;
  setInterval(() => {
    tempLights = getLightTransitionValues(tempLights, to, durationMs);
    updateLEDLights(tempLights);
    if (lightsAreEqual(tempLights, to)) {
      clearInterval();
    }
  }, durationMs);
};

setWatch((function () {
  const states = [
    offLights, duskDawnLights,
    lowDayLights, mediumDayLights, highDayLights,
    whiteLights, playFireLights, duskDawnLights,
  ];
  let currentStateIndex = 0;
  let nextStateIndex;
  let currentLights = states[0];
  return () => {
    clearInterval();
    nextStateIndex = (currentStateIndex + 1 >= states.length) ? 0 : currentStateIndex + 1;
    if (typeof states[nextStateIndex] === 'function') {
      currentLights = states[nextStateIndex]();
    } else {
      transitionLightValues(currentLights, states[nextStateIndex], 50);
      currentLights = states[nextStateIndex];
    }

    currentStateIndex = nextStateIndex;
  };
}()), BTN, { edge: 'rising', repeat: true, debounce: 10 });
