import { Application, ICanvas, Spritesheet } from "pixi.js";

export interface PeakItem {
	interval: number;
	location: number;
}

export enum StartingPosition {
	N,
	NE,
	E,
	SE,
	S,
	SW,
	W,
	NW,
}

export interface BabySensoryData {
	peaks: number[];
	bpm: number;
	init: boolean;
	stopEvent?: Event;
	audioContext?: AudioContext;
	audioSource?: MediaElementAudioSourceNode;
	analyser?: AnalyserNode;
	intervalId?: ReturnType<typeof setInterval>;
	pixi?: Application<ICanvas>;
	spritesheet?: Spritesheet;
	_sampleRate?: number;
	_bufferLengthInSec?: number;
}
declare global {
	interface Window {
		bs: BabySensoryData;
	}
}
