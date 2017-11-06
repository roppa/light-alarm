SPI2.setup({ baud: 3200000, mosi: B15 });

const neopixel = require('neopixel');
const Clock = require('clock').Clock;
let clock = new Clock();

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

function playFireLights() {
  setInterval(() => {
      updateLEDLights(randomFireLights());
    }, 75);
  return randomFireLights();
}

/*
* LED light controls
*/

function updateLEDLights(lights) {
  neopixel.write(B15, lights);
}

/*
* Utils
*/

function setClockMs(ms) {
  return clock.setClock(ms);
}

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

function transitionLightValues(from, to, durationMs) {
  let tempLights = from;
  let duration = durationMs || 50;
  setInterval(() => {
    tempLights = getLightTransitionValues(tempLights, to, duration);
    updateLEDLights(tempLights);
    if (lightsAreEqual(tempLights, to)) {
      clearInterval();
    }
  }, duration);
}

const states = [
  offLights, duskDawnLights,
  lowDayLights, mediumDayLights, highDayLights,
  whiteLights, playFireLights, duskDawnLights,
];

function getNextArrayIndex(currentIndex, array) {
  return (currentIndex + 1 >= array.length) ? 0 : currentIndex + 1;
}

function isFunction(object) {
  return typeof object === 'function';
}

function switchLights() {
  let currentStateIndex = 0;
  return () => {
    clearInterval();
    nextStateIndex = getNextArrayIndex(currentStateIndex, states);
    if (isFunction(states[nextStateIndex])) {
      currentLights = states[nextStateIndex]();
    } else {
      currentLights = states[nextStateIndex];
      updateLEDLights(currentLights);
    }

    currentStateIndex = nextStateIndex;
  };
}

function transitionLights() {
  let currentStateIndex = 0;
  let nextStateIndex;
  let currentLights = states[0];
  return () => {
    clearInterval();
    nextStateIndex = getNextArrayIndex(currentStateIndex, states);
    if (isFunction(states[nextStateIndex])) {
      currentLights = states[nextStateIndex]();
    } else {
      transitionLightValues(currentLights, states[nextStateIndex]);
      currentLights = states[nextStateIndex];
    }

    currentStateIndex = nextStateIndex;
  };
}

setWatch(switchLights(), BTN, { edge: 'rising', repeat: true, debounce: 10 });
