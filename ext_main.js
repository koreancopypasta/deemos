/**
 * @author Landmaster
 */


const SocketCodes = require('./socket_codes');

document.addEventListener('DOMContentLoaded', () => {
	let createRoomCode = document.getElementById('create_room_code');
	
	createRoomCode.addEventListener('click', e => {
		chrome.runtime.sendMessage({type: SocketCodes.REQUEST_CODE});
	});
}, false);
