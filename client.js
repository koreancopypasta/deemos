/**
 * @author Landmaster
 */

const getWS = require('./get_ws');
const SocketCodes = require('./socket_codes');

const ws = new WebSocket(getWS('/'));

let searchBar = document.getElementById("search_bar");
let searchButton = document.getElementById("search_enter");
let searchResults = document.getElementById("search_results");

searchBar.addEventListener("keyup", e => {
	if (e.keyCode === 13) {
		e.preventDefault();
		searchButton.click();
	}
});
searchButton.addEventListener("click", e => {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4 && xhr.status === 200) {
			searchResults.innerHTML = "";
			let jsonResult = JSON.parse(xhr.responseText);
			for (let item of jsonResult.items) {
				let newDiv = document.createElement("div");
				newDiv.innerHTML = item.snippet.title;
				newDiv.dataset.videoId = item.id.videoId;
				let image = document.createElement("img");
				image.width = item.snippet.thumbnails.default.width;
				image.height = item.snippet.thumbnails.default.height;
				image.src = item.snippet.thumbnails.default.url;
				newDiv.appendChild(image);
				searchResults.appendChild(newDiv);
			}
		}
	};
	xhr.open("GET",
		"https://www.googleapis.com/youtube/v3/search?key="+encodeURIComponent(apiKey)+"&part=id%2Csnippet&q="
		+encodeURIComponent(searchBar.value), true);
	xhr.send();
});

ws.addEventListener("message", e => {
	let obj = JSON.parse(e.data);
	switch (obj.type) {
		// TODO add cases
	}
});