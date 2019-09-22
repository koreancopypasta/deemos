/**
 * @author Landmaster
 */

const SocketCodes = require('./socket_codes');

let code = undefined;
let ws = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up

let port;
ws.addEventListener('message', event => {
	let obj = JSON.parse(event.data);
	switch (obj.type) {
		case SocketCodes.REQUEST_CODE:
			code = obj.code;
			break;
		case SocketCodes.EVICT:
			code = undefined;
			break;
	}
	if (port) port.postMessage(obj);
});

chrome.runtime.onConnect.addListener((fetchedPort) => {
	port = fetchedPort;
	
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
	
	port.onDisconnect.addListener(e => (port = undefined));
});

