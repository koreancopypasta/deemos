const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mustacheExpress = require('mustache-express');
const nocache = require('nocache');
const Session = require('./session');
const SocketCodes = require('./socket_codes');

let indexRouter = require('./routes/index');

function DeemosInstance() {
	let app = express();

	// view engine setup
	app.engine('mustache', mustacheExpress());
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'mustache');
	
	app.use(nocache());
	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	
	app.use('/', indexRouter);
	app.get('/yt/:videoId', (req, res) => {
		res.locals.videoId = req.params.videoId;
		res.render('yt');
	});

	// catch 404 and forward to error handler
	app.use((req, res, next) => {
		next(createError(404));
	});

	// error handler
	app.use((err, req, res, next) => {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		
		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});
	
	this.app = app;
	
	/**
	 *
	 * @type {?WebSocket.Server}
	 */
	this.wss = null;
	
	/**
	 *
	 * @type {Session[]}
	 */
	this.codeToSessions = new Array(100000);
	this.codeIndex = 0;
	
	/**
	 *
	 * @type {Map<string, Object>}
	 */
	this.idToInfo = new Map();
	
	/**
	 *
	 * @type {WeakMap<WebSocket, number>}
	 */
	this.memberToCode = new WeakMap();
}
DeemosInstance.prototype.cleanup = function (ws, sendEvictMessage) {
	if (this.memberToCode.has(ws)) {
		let code = this.memberToCode.get(ws);
		let session = this.codeToSessions[code];
		if (session && session.members.has(ws)) {
			session.evictMember(session.members.get(ws));
			for (let member of session.members.values()) {
				session.sendVoteUpdates(member, this.idToInfo);
			}
			if (sendEvictMessage) {
				ws.send(JSON.stringify({type: SocketCodes.EVICT, reason: ''}));
			}
		}
		if (session && session.host === ws) {
			for (let member of session.members.values()) {
				member.ws.send(JSON.stringify({type: SocketCodes.EVICT, reason: 'Host disconnected'}));
			}
			this.codeToSessions[code] = undefined;
			if (sendEvictMessage) {
				ws.send(JSON.stringify({type: SocketCodes.EVICT, reason: ''}));
			}
		}
	}
};
DeemosInstance.prototype.initWS = function (wss) {
	this.wss = wss;
	this.wss.on('connection', (ws, req) => {
		ws.isAlive = true;
		
		ws.on('pong', () => ws.isAlive = true);
		
		ws.on('error', (e) => {});
		
		let pongInterval = setInterval(() => {
			wss.clients.forEach(ws => {
				if (ws.isAlive === false) return ws.terminate();
				
				ws.isAlive = false;
				ws.ping('', false, true);
			});
		}, 30000);
		
		ws.on('close', () => {
			this.cleanup(ws);
		});
		
		ws.on('message', data => {
			let obj = JSON.parse(data);
			let session;
			switch (obj.type) {
				case SocketCodes.REQUEST_CODE:
					for (;; this.codeIndex = (this.codeIndex+1) % this.codeToSessions.length) {
						if (!this.codeToSessions[this.codeIndex]) {
							break;
						}
					}
					this.codeToSessions[this.codeIndex] = new Session({
						host: ws,
						code: this.codeIndex
					});
					this.memberToCode.set(ws, this.codeIndex);
					ws.send(JSON.stringify({type: SocketCodes.REQUEST_CODE, code: this.codeIndex}));
					break;
				case SocketCodes.JOIN_SERVER:
					session = this.codeToSessions[obj.code];
					if (session) {
						session.addMember(ws);
						this.memberToCode.set(ws, obj.code);
						ws.send(JSON.stringify({type: SocketCodes.JOIN_SERVER, code: obj.code}));
						let member = session.members.get(ws);
						session.sendVoteUpdates(member, this.idToInfo);
					} else {
						ws.send(JSON.stringify({type: SocketCodes.EVICT, reason: 'Invalid code'}));
					}
					break;
				case SocketCodes.VIDEO_REQUEST:
					session = this.codeToSessions[obj.code];
					if (session && session.members.has(ws)) {
						session.addRequest(session.members.get(ws), obj.videoId);
						this.idToInfo.set(obj.videoId, obj.videoInfo);
						for (let member of session.members.values()) {
							session.sendVoteUpdates(member, this.idToInfo);
						}
					}
					break;
				case SocketCodes.INCREMENT_VOTE:
					//console.log(obj);
					session = this.codeToSessions[obj.code];
					if (session && session.members.has(ws)) {
						let theMember = session.members.get(ws);
						let increment = obj.isUpvote ? 1 : -1;
						if (theMember.votes.get(obj.videoId) === increment) {
							increment = 0; // reset if clicked again
						}
						session.vote(theMember, obj.videoId, increment);
						for (let member of session.members.values()) {
							session.sendVoteUpdates(member, this.idToInfo);
						}
					}
					break;
				case SocketCodes.REQUEST_LEAVE:
					this.cleanup(ws, true);
					break;
				case SocketCodes.REQUEST_NEXT_VIDEO:
					session = this.codeToSessions[obj.code];
					if (session && session.host === ws) {
						session.isRequestingNext = true;
						session.advanceAndSendVideo();
						for (let member of session.members.values()) {
							session.sendVoteUpdates(member, this.idToInfo);
						}
					}
					break;
			}
		});
	});
};

module.exports = DeemosInstance;
