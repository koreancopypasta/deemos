(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}]},{},[1]);
