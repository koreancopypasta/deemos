(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @author Landmaster
 */


const SocketCodes = require('./socket_codes');

document.addEventListener('DOMContentLoaded', () => {
	const ws = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up
	ws.addEventListener('message', event => {
		let obj = JSON.parse(event.data);
		switch (obj.type) {
			case SocketCodes.REQUEST_CODE:
				alert(obj.code);
		}
	});
	
	let createRoomCode = document.getElementById('create_room_code');
	
	createRoomCode.addEventListener('click', e => {
		ws.send(JSON.stringify({type: SocketCodes.REQUEST_CODE}));
	});
}, false);

},{"./socket_codes":2}],2:[function(require,module,exports){
/**
 * @author Landmaster
 */

module.exports = {
	REQUEST_CODE: 'REQUEST_CODE', // code
	JOIN_SERVER: 'JOIN_SERVER', // code
	EVICT: 'EVICT' // reason
};
},{}]},{},[1]);
