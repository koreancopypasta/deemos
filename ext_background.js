/**
 * @author Landmaster
 */

const SocketCodes = require('./socket_codes');

let code = undefined;

chrome.runtime.onConnect.addListener((port) => {
	let ws = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up
	ws.addEventListener('message', event => {
		let obj = JSON.parse(event.data);
		switch (obj.type) {
			case SocketCodes.REQUEST_CODE:
				code = obj.code;
				break;
		}
		port.postMessage(obj);
	});
	
	port.onMessage.addListener((msg) => {
		if (msg.type === SocketCodes.RELAY_FROM_BACKGROUND) {
			if (msg.property === 'code') {
				if (code !== undefined) {
					port.postMessage({type: SocketCodes.REQUEST_CODE, code: code});
				}
			}
		} else {
			ws.send(JSON.stringify(msg));
		}
	});
});

