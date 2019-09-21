/**
 * @author Landmaster
 */

const getWS = require('./get_ws');
const SocketCodes = require('./socket_codes');
const ViewManager = require('./view_manager');

ViewManager.addView('join_view');
ViewManager.addView('inside_view');

ViewManager.setView('join_view');

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
				
				console.log("youtube search results...")
				console.log(item);
				
				let newDiv = document.createElement("div");
				//newDiv.innerHTML = item.snippet.title;
				newDiv.dataset.videoId = item.id.videoId;
				
				newDiv.className = "row searchPad";

				let newText = document.createElement("div");
				newText.className = "col-sm"
				newText.innerHTML = item.snippet.title;

				newDiv.appendChild(newText);
				
				let image = document.createElement("img");
				image.width = item.snippet.thumbnails.default.width;
				image.height = item.snippet.thumbnails.default.height;
				image.src = item.snippet.thumbnails.default.url;
				// image.className = "col-sm"

				newDiv.appendChild(image);

				searchResults.appendChild(newDiv);
			}
		}
	};
	xhr.open("GET",
		"https://www.googleapis.com/youtube/v3/search?key="+encodeURIComponent(apiKey)+"&part=id%2Csnippet&maxResults=50&q="
		+encodeURIComponent(searchBar.value), true);
	xhr.send();
});

let codeBar = document.getElementById("enter_code");
let codeButton = document.getElementById("send_code");

codeBar.addEventListener("keyup", e => {
	if (e.keyCode === 13) {
		e.preventDefault();
		codeButton.click();
	}
});
codeButton.addEventListener("click", e => {
	ws.send(JSON.stringify({type: SocketCodes.JOIN_SERVER, code: parseInt(codeBar.value, 10)}));
});

ws.addEventListener("message", e => {
	let obj = JSON.parse(e.data);
	switch (obj.type) {
		case SocketCodes.JOIN_SERVER:
			ViewManager.setView('inside_view');
			// TODO more initialization?
			break;
		case SocketCodes.EVICT:
			ViewManager.setView('join_view');
			alert(obj.reason);
			break;
	}
});