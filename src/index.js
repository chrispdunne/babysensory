"use strict";

const http = require("http");
const fs = require("fs");
const stream = require("..");
const path = require("path");
var nodeStatic = require("node-static");

http.createServer(youtubeServer).listen(3333);

var file = new nodeStatic.Server(__dirname, {
	cache: process.env.NODE_ENV === "development" ? 0 : undefined,
});

function youtubeServer(req, res) {
	console.log({ res });
	if (req.url === "/") {
		return fs
			.createReadStream(path.join(__dirname, "/index.html"))
			.pipe(res);
	} else if (req.url === "/ping") {
		res.end("pong");
	} else if (/youtube/.test(req.url)) {
		const aaa = stream("http:/" + req.url);
		console.log({ aaa });
		stream("http:/" + req.url).pipe(res);
	} else {
		file.serve(req, res);
	}
}
if (!process.env.CI) {
	console.log("open http://localhost:3333 for audio stream");
}
