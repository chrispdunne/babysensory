import { init } from "./audio/init";
import { _bufferSize, _filterFreq, _threshold } from "./const";
import { handlePlay } from "./audio/handlePlay";
import { Application, ICanvas } from "pixi.js";

interface BabySensoryData {
	peaks: number[];
	bpm: number;
	init: boolean;
	audioContext?: AudioContext;
	audioSource?: MediaElementAudioSourceNode;
	analyser?: AnalyserNode;
	intervalId?: ReturnType<typeof setInterval>;
	pixi?: Application<ICanvas>;
	_sampleRate?: number;
	_bufferLengthInSec?: number;
}

declare global {
	interface Window {
		bs: BabySensoryData;
	}
}

function ui() {
	// consts
	window.bs = { peaks: [], bpm: 0, init: false };

	// els
	const container = document.getElementById("url_input") as HTMLDivElement;
	const input = document.getElementById("yt_url") as HTMLInputElement;
	const audio = document.getElementById("yt_audio") as HTMLAudioElement;

	// update youtube link
	input?.addEventListener("keyup", (e) => {
		if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(input?.value)) {
			container?.classList.add("valid");
			audio.src = input.value;
		} else {
			container.classList.remove("valid");
		}
	});

	// play logic
	audio.addEventListener("play", () => {
		init();
		handlePlay();
	});

	// stop logic
	const stopAnalyzer = () => {
		clearInterval(window.bs.intervalId);
		window.bs = { peaks: [], bpm: 0, init: true };
	};
	audio.addEventListener("pause", () => stopAnalyzer());
}
ui();
