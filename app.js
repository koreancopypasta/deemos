const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mustacheExpress = require('mustache-express');
const nocache = require('nocache');

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
}
DeemosInstance.prototype.initWS = function (wss) {
	this.wss = wss;
};

module.exports = DeemosInstance;
