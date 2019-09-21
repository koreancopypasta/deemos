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
}
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
			// TODO Perform cleanup here.
		});
		
		ws.on('message', data => {
			let obj = JSON.parse(data);
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
					ws.send(JSON.stringify({type: SocketCodes.REQUEST_CODE, code: this.codeIndex}));
					break;
				case SocketCodes.JOIN_SERVER:
					let session = this.codeToSessions[obj.code];
					if (session) {
						session.addMember(ws);
						ws.send(JSON.stringify({type: SocketCodes.JOIN_SERVER, code: obj.code}));
					} else {
						ws.send(JSON.stringify({type: SocketCodes.EVICT, reason: 'Invalid code'}));
					}
					break;
			}
		});
	});
};

module.exports = DeemosInstance;
