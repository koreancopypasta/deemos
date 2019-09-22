/**
 * @author Landmaster
 */


const SocketCodes = require('./socket_codes');
const ViewManager = require('./view_manager');

let domElems = {};

let port = chrome.runtime.connect({name: "Deemos"});

document.addEventListener('DOMContentLoaded', () => {
	ViewManager.addView('create_code_view');
	ViewManager.addView('current_code_view');
	//ViewManager.setView('create_code_view');
	
	domElems.createRoomCode = document.getElementById('create_room_code');
	domElems.currentCode = document.getElementById('current_code');
	domElems.resetCode = document.getElementById('reset_code');
	
	domElems.createRoomCode.addEventListener('click', e => {
		port.postMessage({type: SocketCodes.REQUEST_CODE});
	});
	
	port.postMessage({type: SocketCodes.RELAY_FROM_BACKGROUND, property: 'code'});
	
	domElems.resetCode.addEventListener('click', e => {
		port.postMessage({type: SocketCodes.REQUEST_LEAVE});
	});
}, false);

port.onMessage.addListener(msg => {
	switch (msg.type) {
		case SocketCodes.REQUEST_CODE:
			domElems.currentCode.textContent = msg.code;
			ViewManager.setView('current_code_view');
			break;
		case SocketCodes.EVICT:
			ViewManager.setView('create_code_view');
			if (msg.reason) alert(msg.reason);
			break;
	}
});
