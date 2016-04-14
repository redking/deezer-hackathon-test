'use strict';

var app = require('../app');
var http = require('http');

// Setup server
var port = process.env.PORT ? parseInt(process.env.PORT) : '3000';
var server = http.createServer(app);
server.listen(port);
server.on('error', _onError);
server.on('listening', _onListening);

function _onError(e) {
	if (e.syscall !== 'listen') {
		throw e;
	}

	// handle specific listen errors with friendly messages
	switch(e.code) {
		case 'EACCES':
			console.error('Port ' + port + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error('Port ' + port + ' is already in use');
			process.exit(1);
			break;
		default:
			throw e;
	}
}

function _onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}