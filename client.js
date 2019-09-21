/**
 * @author Landmaster
 */

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
			for (let item of jsonResult["items"]) {
				let newDiv = document.createElement("div");
				newDiv.textContent = item.snippet.title;
				newDiv.dataset.videoId = item.id.videoId;
				searchResults.appendChild(newDiv);
			}
		}
	};
	xhr.open("GET",
		"https://www.googleapis.com/youtube/v3/search?key="+encodeURIComponent(apiKey)+"&part=id%2Csnippet&q="
		+encodeURIComponent(searchBar.value), true);
	xhr.send();
});