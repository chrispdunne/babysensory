(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doubleIfBelowThreshold = doubleIfBelowThreshold;
exports.getMinMaxValues = getMinMaxValues;
exports.getPeakDistances = getPeakDistances;
exports.groupPeaks = groupPeaks;
exports.halveIfAboveThreshold = halveIfAboveThreshold;
exports.roundToThreePlaces = roundToThreePlaces;
exports.roundToTwoPlaces = roundToTwoPlaces;
function doubleIfBelowThreshold(num, threshold) {
  var newNum = num * 2;
  if (newNum >= threshold) {
    return newNum;
  }
  return doubleIfBelowThreshold(newNum, threshold);
}
function halveIfAboveThreshold(num, threshold) {
  var newNum = num / 2;
  if (newNum <= threshold) {
    return newNum;
  }
  return halveIfAboveThreshold(newNum, threshold);
}
function roundToTwoPlaces(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
function roundToThreePlaces(num) {
  return Math.round((num + Number.EPSILON) * 1000) / 1000;
}
function getMinMaxValues(array) {
  var max = 0;
  var min = 255;
  array.forEach(function (item) {
    if (item < min) {
      min = item;
    }
    if (item > max) {
      max = item;
    }
  });
  return [min, max];
}
function getPeakDistances(array, sampleRate) {
  var peaksDistanceArray = [];
  for (var i = 0; i < array.length; i++) {
    if (i > 0) {
      var diff = array[i] - array[i - 1];
      peaksDistanceArray.push(roundToThreePlaces(diff / sampleRate));
    }
  }
  return peaksDistanceArray;
}
function groupPeaks(array) {
  var group = {};
  array.forEach(function (item) {
    if (!group[item]) {
      group[item] = 1;
    } else {
      group[item]++;
    }
  });
  return group;
}

},{}],2:[function(require,module,exports){
"use strict";

var _helpers = require("./helpers.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ui() {
  var container = document.getElementById("url_input");
  var _input = document.getElementById("yt_url");
  var audio = document.getElementById("yt_audio");
  var _testBox = document.getElementById("box");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var stopBtn = document.getElementById("stop_draw");

  // update youtube link
  _input.addEventListener("keyup", function (e) {
    if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(_input.value)) {
      container.classList.add("valid");
      audio.src = _input.value;
    } else {
      container.classList.remove("valid");
    }
  });
  console.log("NOW UPDATED");
  _testBox.addEventListener("click", function () {
    init();
  });

  // stop logic
  var getAudioDataInterval;
  var stopAnalyzer = function stopAnalyzer() {
    return clearInterval(getAudioDataInterval);
  };
  stopBtn.addEventListener("click", stopAnalyzer);
  var init = function init() {
    // setup audio context
    var audioContext = new AudioContext();
    var audioSource = audioContext.createMediaElementSource(audio);

    // consts
    var _threshold = 0.98;
    var _filterFreq = 350; // default 350
    var _bufferSize = 32768; //@48khz = 0.682666 seconds

    // add low pass filter
    var loPassFilter = audioContext.createBiquadFilter();
    loPassFilter.type = "lowpass";
    loPassFilter.frequency.value = _filterFreq;
    loPassFilter.connect(audioContext.destination);

    // setup analyser
    var _sampleRate = audioContext.sampleRate; // 48000
    var _bufferLengthInSec = _bufferSize / _sampleRate; // 42.666ms or ~1/23 of a second
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = _bufferSize;
    audioSource.connect(analyser);
    analyser.connect(loPassFilter);
    // analyser.connect(audioContext.destination);

    // creates a an array of 2048 elements that can each be a value from 0 to 255
    var dataArray = new Uint8Array(_bufferSize);
    analyser.getByteTimeDomainData(dataArray);
    var peaksArray = [];
    var intervalCount = 0;
    /////////////////////
    // every (buffer length) seconds get more peaks
    /////////////////////
    getAudioDataInterval = setInterval(function () {
      analyser.getByteTimeDomainData(dataArray);
      var _getMinMaxValues = (0, _helpers.getMinMaxValues)(dataArray),
        _getMinMaxValues2 = _slicedToArray(_getMinMaxValues, 2),
        min = _getMinMaxValues2[0],
        max = _getMinMaxValues2[1];
      var _minVolumeThreshold = max * _threshold;
      // loop through data array item

      for (var i = 0; i < dataArray.length; i++) {
        var eightBitValue = dataArray[i];
        // do something if audio louder than threshold
        if (_minVolumeThreshold > 100 && eightBitValue > _minVolumeThreshold) {
          if (peaksArray.length > 99) {
            peaksArray.shift();
          }
          peaksArray.push(intervalCount * _bufferSize + i);
          // skip forward 1/4 second (means we're assuming slower than 240bpm)
          i += _sampleRate / 4;
        }
      }
      getBpm();
      intervalCount++;
      // console.log({ peaksArray });
    }, _bufferLengthInSec * 1000);

    /////////////////////
    // if sampleArray is full we have about 10 seconds of peak data
    /////////////////////
    var getBpm = function getBpm() {
      if (peaksArray.length > 10) {
        var peakDistances = (0, _helpers.getPeakDistances)(peaksArray, _sampleRate);
        // console.log({ peakDistances });
        var peakDistanceCounts = (0, _helpers.groupPeaks)(peakDistances);
        // console.log({ peakDistanceCounts });
        var highestPeakCount = Math.max.apply(Math, _toConsumableArray(Object.values(peakDistanceCounts)));
        var mostCommonInterval = Object.keys(peakDistanceCounts).find(function (key) {
          return peakDistanceCounts[key] === highestPeakCount;
        });
        // Object.keys(
        // 	peakDistanceCounts
        // ).reduce(
        // 	(acc, curr) =>
        // 		peakDistanceCounts[curr] > acc ? curr : acc,
        // 	0
        // );
        console.log({
          highestPeakCount: highestPeakCount,
          peakDistanceCounts: peakDistanceCounts,
          mostCommonInterval: mostCommonInterval
        });
        var bpm = 1 / mostCommonInterval * 60;
        if (bpm > 200) {
          bpm = (0, _helpers.halveIfAboveThreshold)(bpm, 200);
        }
        if (bpm < 90) {
          bpm = (0, _helpers.doubleIfBelowThreshold)(bpm, 90);
        }
        console.log({
          bpm: bpm
        });
        // const bpm = doubleIfBelowThreshold(theoreticalBpm, 90);

        // while (theoreticalBpm > 240) {
        // 	theoreticalBpm / 2;
        // }
        // while (theoreticalBpm < 60) {
        // 	theoreticalBpm * 2;
        // }
        // console.log({ bpm, theoreticalBpm });
        // console.log({ mostCommonInterval });
      }
    };
  };
}

ui();

},{"./helpers.js":1}]},{},[2]);
