import { Application } from "pixi.js";
import { _bufferSize, _filterFreq } from "../const";

export const init = () => {
	if (window.bs.init) return;
	// setup audio context
	const audio = document.getElementById("yt_audio") as HTMLAudioElement;

	const audioContext = new AudioContext();
	window.bs.audioSource = audioContext.createMediaElementSource(audio);
	window.bs.audioContext = audioContext;

	console.log("INIT");
	// new custom event "peak" which is probably a 1/4 note
	const peakEvent = new CustomEvent("peak");

	// setup analyser
	window.bs._sampleRate = audioContext.sampleRate; // 48000
	window.bs._bufferLengthInSec = _bufferSize / window.bs._sampleRate; // 42.666ms or ~1/23 of a second
	const analyser = audioContext.createAnalyser();
	analyser.fftSize = _bufferSize;
	window.bs.analyser = analyser;
	// audioSource.connect(analyser); // send audio from source to analyzer

	// add low pass filter
	const loPassFilter = audioContext.createBiquadFilter();
	loPassFilter.type = "lowpass";
	loPassFilter.frequency.value = _filterFreq;
	window.bs.audioSource.connect(loPassFilter); // send audio to filter
	loPassFilter.connect(analyser); // send filter to analyzer

	// delay audio output by buffer length
	const delay = audioContext.createDelay(10);
	delay.delayTime.value = window.bs._bufferLengthInSec;
	window.bs.audioSource.connect(delay); // send audio to delay
	delay.connect(audioContext.destination); // send delayed audio to speakers

	// setup pixi stage
	const app = new Application();
	//@ts-ignore
	document.body.appendChild(app.view);
	window.bs.pixi = app;

	window.bs.init = true;

	return;
};
