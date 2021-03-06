#!/usr/bin/env node

"use strict";

const ytdl = require("ytdl-core");
const FFmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const fs = require("fs");
const backend = require("./src/backend.js");

// backend.getUrl();

if (!module.parent) {
  const youtubeUrl = process.argv.slice(2)[0];
  if (!youtubeUrl) throw new TypeError("youtube url not specified");
  streamify(youtubeUrl).pipe(process.stdout);
} else {
  module.exports = streamify;
}

function streamify(uri, opt) {
  opt = {
    ...opt,
    videoFormat: "mp4",
    quality: "lowest",
    audioFormat: "mp3",
    filter(format) {
      return format.container === opt.videoFormat && format.audioBitrate;
    },
  };

  const video = ytdl(uri, opt);
  const { file, audioFormat } = opt;
  console.log({ file });
  const stream = file ? fs.createWriteStream(file) : new PassThrough();
  const ffmpeg = new FFmpeg(video);
  console.log({ stream });
  process.nextTick(() => {
    console.log("ticl");
    const output = ffmpeg.format(audioFormat).pipe(stream);
    // console.log({ output });
    ffmpeg.once("error", (error) => stream.emit("error", error));
    output.once("error", (error) => {
      video.end();
      stream.emit("error", error);
    });
  });

  stream.video = video;
  stream.ffmpeg = ffmpeg;

  return stream;
}
