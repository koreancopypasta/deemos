(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
	ViewManager.setView('create_code_view');
	
	domElems.createRoomCode = document.getElementById('create_room_code');
	domElems.currentCode = document.getElementById('current_code');
	
	domElems.createRoomCode.addEventListener('click', e => {
		port.postMessage({type: SocketCodes.REQUEST_CODE});
	});
	
	port.postMessage({type: SocketCodes.RELAY_FROM_BACKGROUND, property: 'code'})
}, false);

port.onMessage.addListener(msg => {
	switch (msg.type) {
		case SocketCodes.REQUEST_CODE:
			domElems.currentCode.textContent = msg.code;
			ViewManager.setView('current_code_view');
			break;
	}
});

},{"./socket_codes":2,"./view_manager":3}],2:[function(require,module,exports){
/**
 * @author Landmaster
 */

module.exports = {
	REQUEST_CODE: 'REQUEST_CODE', // code
	JOIN_SERVER: 'JOIN_SERVER', // code
	EVICT: 'EVICT', // reason
	RELAY_FROM_BACKGROUND: 'RELAY_FROM_BACKGROUND', // property
};
},{}],3:[function(require,module,exports){
/**
 * @author Landmaster
 */

/**
 *
 * @type {Map<string, Element>}
 */
const viewMap = new Map();

const viewToLinkID = new Map();

const ViewManager = {};
ViewManager.addView = function (viewID) {
	viewMap.set(viewID, document.getElementById(viewID));
};
ViewManager.setView = function (viewID) {
	for ([id, view] of viewMap) {
		if (id === viewID || (viewToLinkID.has(id) && viewToLinkID.has(viewID) && viewToLinkID.get(id) === viewToLinkID.get(viewID))) {
			view.style.display = '';
		} else {
			view.style.display = 'none';
		}
	}
};
ViewManager.linkViews = function (cname, ...viewIDs) {
	for (let viewID of viewIDs) {
		viewToLinkID.set(viewID, viewIDs);
		viewMap.get(viewID).classList.add(cname);
	}
};
module.exports = ViewManager;
},{}]},{},[1]);
