import animate from "../animate";
import { _bufferSize, _threshold } from "../const";
import { getMinMaxValues } from "./helpers";
import { getBpm } from "./getBpm";
import fftAnalyzer from "./fftAnalyzer";

export const handlePlay = () => {
	// audioSource.connect(audioContext.destination); // send unaffected audio source to speakers

	// creates an array of [_bufferSize] elements that can each be a value from 0 to 255
	var dataArray = new Uint8Array(_bufferSize);

	window.bs.analyser?.getByteTimeDomainData(dataArray);

	// alt fft analyzer ====
	fftAnalyzer();
	// ---------------------

	const peaksArray: number[] = [];
	let intervalCount = 0;

	/////////////////////
	// every (buffer length) seconds get more peaks
	/////////////////////
	window.bs.intervalId = setInterval(() => {
		window.bs.analyser?.getByteTimeDomainData(dataArray);
		const [min, max] = getMinMaxValues(dataArray);
		const _minVolumeThreshold = max * _threshold;
		// loop through data array item

		for (var i = 0; i < dataArray.length; i++) {
			const eightBitValue = dataArray[i];

			// do something if audio louder than threshold
			if (
				_minVolumeThreshold > 100 &&
				eightBitValue > _minVolumeThreshold
			) {
				// document.dispatchEvent(peakEvent);
				if (peaksArray.length > 50) {
					peaksArray.shift();
				}
				peaksArray.push(intervalCount * _bufferSize + i);
				// skip forward 1/4 second (means we're assuming slower than 240bpm)
				i += window.bs._sampleRate / 4;
			}
		}

		getBpm(peaksArray, window.bs._sampleRate);
		intervalCount++;
	}, window.bs._bufferLengthInSec * 1000);

	animate();
};
