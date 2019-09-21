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
