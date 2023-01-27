import {
	doubleIfBelowThreshold,
	getPeakDistances,
	groupPeaks,
	halveIfAboveThreshold,
} from "./helpers";
import { PeakItem } from "../types";
// peaks array has exact location e.g. 12383458345 (dunno... some big number)

// peak distances have PeakItems,
// which contain interval (distance in secs from prev peak)
// and location (distance in seconds from start of song)

/////////////////////
// if peaksArray has some values (10 ish) get bpm
/////////////////////
export const getBpm = (peaksArray: number[], sampleRate: number) => {
	if (peaksArray.length > 10) {
		const bpmDisplay = document.getElementById("bpm") as HTMLSpanElement;

		const peakDistances = getPeakDistances(peaksArray, sampleRate);

		// object where KEY = peak distance in seconds, VALUE = time from start in secs
		// e.g. { 0.5:  [1.224, 5.653] }
		const peakDistanceCounts = groupPeaks(peakDistances);

		// get most common interval count
		const highestPeakCount = Math.max(
			...Object.values(peakDistanceCounts).map((array) => array.length)
		);

		// get most common interval in seconds
		const mostCommonInterval = Object.keys(peakDistanceCounts).find(
			(key: string) =>
				peakDistanceCounts[Number(key)].length === highestPeakCount
		);

		const getPeakLocations = () =>
			peakDistanceCounts[Number(mostCommonInterval)];

		// console.log({
		// 	mostCommonInterval,
		// 	pl: getPeakLocations(),
		// });
		window.bs.peaks = getPeakLocations();

		let bpm = (1 / Number(mostCommonInterval ?? 1)) * 60;

		if (bpm > 200) {
			bpm = halveIfAboveThreshold(bpm, 200);
		}
		if (bpm < 90) {
			bpm = doubleIfBelowThreshold(bpm, 90);
		}

		window.bs.bpm = bpm;
		bpmDisplay.innerHTML = bpm.toFixed(2);
	}
};
