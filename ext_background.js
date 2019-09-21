/**
 * @author Landmaster
 */

const SocketCodes = require('./socket_codes');

chrome.runtime.onConnect.addListener((port) => {
	let ws = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up
	ws.addEventListener('message', event => {
		let obj = JSON.parse(event.data);
		switch (obj.type) {
			// TODO cases?
		}
		port.postMessage(obj);
	});
	
	port.onMessage.addListener((msg) => {
		ws.send(JSON.stringify(msg));
	});
});

