export default function _input() {
  const container = document.getElementById("url_input");
  const input = document.getElementById("yt_url");
  const audio = document.getElementById("yt_audio");

  input.addEventListener("keyup", (e) => {
    if (/youtube.com\/watch\?v\=[A-Za-z0-9_]{11}/.test(input.value)) {
      container.classList.add("valid");
      audio.src = input.value;
    } else {
      container.classList.remove("valid");
    }
  });
}
