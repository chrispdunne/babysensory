function input() {
	const container = document.getElementById("url_input");
	const _input = document.getElementById("yt_url");
	const audio = document.getElementById("yt_audio");

	_input.addEventListener("keyup", (e) => {
		if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(_input.value)) {
			container.classList.add("valid");
			audio.src = _input.value;
		} else {
			container.classList.remove("valid");
		}
	});
}

module.exports = {
	input,
};
