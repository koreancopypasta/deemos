/**
 * @author Landmaster
 */

const SocketCodes = require('./socket_codes');

let ws = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up
ws.addEventListener('message', event => {
	let obj = JSON.parse(event.data);
	switch (obj.type) {
		case SocketCodes.REQUEST_CODE:
			alert(obj.code);
	}
});
chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
	ws.send(JSON.stringify(req));
	sendResp(null);
});
