/**
 * @author Landmaster
 */

//const getWS = require('./get_ws');
const socket = new WebSocket('ws://localhost:3000/'); // TODO change when heroku's up
socket.onmessage = function(event){
	let obj = JSON.parse(event.data);
	switch (obj.type) {
	
	}
};