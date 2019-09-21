/**
 * @author Landmaster
 */

let searchBar = document.getElementById("search_bar");
let searchButton = document.getElementById("search_enter");

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
			let jsonResult = JSON.parse(xhr.responseText);
			console.log(jsonResult);
		}
	};
	xhr.open("GET",
		"https://www.googleapis.com/youtube/v3/search?key=AIzaSyCG74FlNuLpX97L_rybBJh2CuutcLBWupQ&part=id%2Csnippet&q="
		+encodeURIComponent(searchBar.value), true);
	xhr.send();
});