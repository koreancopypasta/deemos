/**
 * @author Landmaster
 */

const getWS = require('./get_ws');
const SocketCodes = require('./socket_codes');
const ViewManager = require('./view_manager');
const XMLHttpRequestPromise = require('xhr-promise');

ViewManager.addView('join_view');
ViewManager.addView('inside_view');

ViewManager.setView('join_view');

let code = undefined;

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
	new XMLHttpRequestPromise()
	.send({
		method: 'GET',
		url: "https://www.googleapis.com/youtube/v3/search?key="+encodeURIComponent(apiKey)+"&part=id%2Csnippet&q="+encodeURIComponent(searchBar.value)
	}).then(results => {
		if (results.status === 200) {
			searchResults.innerHTML = "";
			let jsonResult = results.responseText;
			for (let item of jsonResult.items) {
				
				console.log("youtube search results...");
				console.log(item);
				
				let newDiv = document.createElement("div");
				//newDiv.innerHTML = item.snippet.title;
				newDiv.dataset.videoId = item.id.videoId;
				newDiv.dataset.videoTitle = item.snippet.title;
				
				newDiv.className = "row searchPad";
				
				let newText = document.createElement("div");
				newText.className = "col-sm";
				newText.innerHTML = item.snippet.title;
				
				newDiv.appendChild(newText);
				
				let image = document.createElement("img");
				image.width = item.snippet.thumbnails.default.width;
				image.height = item.snippet.thumbnails.default.height;
				image.src = item.snippet.thumbnails.default.url;
				// image.className = "col-sm"
				
				newDiv.appendChild(image);
				newDiv.addEventListener('click', () => {
					ws.send(JSON.stringify({
						type: SocketCodes.VIDEO_REQUEST,
						videoId: newDiv.dataset.videoId,
						videoInfo: {title: newDiv.dataset.videoTitle, thumbnail: item.snippet.thumbnails.default.url},
						code: code}));
				});
				
				searchResults.appendChild(newDiv);
			}
		}
	});
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

let trendingList = document.getElementById('trending_list');

ws.addEventListener("message", e => {
	let obj = JSON.parse(e.data);
	switch (obj.type) {
		case SocketCodes.JOIN_SERVER:
			ViewManager.setView('inside_view');
			code = obj.code;
			break;
		case SocketCodes.EVICT:
			ViewManager.setView('join_view');
			code = undefined;
			alert(obj.reason);
			break;
		case SocketCodes.VOTE_UPDATES:
			console.log(obj.votes); // TODO remove
			console.log(obj.memberVotes);
			
			for (let tuple of obj.votes) {
				let newDiv = document.createElement("div");
				//newDiv.innerHTML = item.snippet.title;
				newDiv.dataset.videoId = tuple[0];
				newDiv.dataset.videoTitle = tuple[2].title;
				
				newDiv.className = "row searchPad";
				
				let newText = document.createElement("div");
				newText.className = "col-sm";
				newText.innerHTML = tuple[2].title;
				
				newDiv.appendChild(newText);
				
				let image = document.createElement("img");
				image.src = tuple[2].thumbnail;
				// image.className = "col-sm"
				
				newDiv.appendChild(image);
				
				trendingList.appendChild(newDiv);
			}
			
			break;
	}
});