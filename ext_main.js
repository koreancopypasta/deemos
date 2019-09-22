/**
 * @author Landmaster
 */


const SocketCodes = require('./socket_codes');
const ViewManager = require('./view_manager');

let curVideo = undefined;


let domElems = {};

let code = undefined;
let ws = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up

ws.addEventListener('message', event => {
	let obj = JSON.parse(event.data);
	switch (obj.type) {
		case SocketCodes.REQUEST_CODE:
			code = obj.code;
			domElems.currentCode.textContent = obj.code;
			ViewManager.setView('current_code_view');
			requestVideo();
			break;
		case SocketCodes.EVICT:
			ViewManager.setView('create_code_view');
			if (obj.reason) alert(obj.reason);
			code = undefined;
			break;
		case SocketCodes.REQUEST_NEXT_VIDEO:
			curVideo = obj.videoId;
			let newWind = window.open('localhost:3000/yt/'+curVideo, '_blank');
			newWind.focus();
			break;
	}
});

window.addEventListener('message', e => {
	if (e.data === 'close') {
		requestVideo();
	}
});

document.addEventListener('DOMContentLoaded', () => {
	ViewManager.addView('create_code_view');
	ViewManager.addView('current_code_view');
	ViewManager.setView('create_code_view');
	
	domElems.createRoomCode = document.getElementById('create_room_code');
	domElems.currentCode = document.getElementById('current_code');
	domElems.resetCode = document.getElementById('reset_code');
	domElems.youtubeCont = document.getElementById('youtube_container');
	
	domElems.createRoomCode.addEventListener('click', e => {
		ws.send(JSON.stringify({type: SocketCodes.REQUEST_CODE}));
	});
	
	domElems.resetCode.addEventListener('click', e => {
		ws.send(JSON.stringify({type: SocketCodes.REQUEST_LEAVE}));
	});
}, false);

let isReady = false;

let requestVideo = () => {
	if (code !== undefined) {
		ws.send(JSON.stringify({type: SocketCodes.REQUEST_NEXT_VIDEO, code: code}));
	}
};
