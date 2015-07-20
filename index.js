(function() {

	console.log('\n\n\n...initializing startup process.');

	// define contstants.
	var PORT = process.env.PORT || 3000;
	var ENV = process.env.NODE_ENV || 'development';

	// import dependencies.
	var path = require('path');

	// define globals.
	global.__base = path.normalize(__dirname + '/');

	// import server object.
	var server = require(__base + 'server/index.server');

	// determine if the module is being imported or executed directly.
	if (!module.parent) {
		server.start(PORT, ENV);
	} else {
		module.exports = server;
	}

	process.on('SIGTERM', function() {

	});

	// handle uncaught exceptions.
	process.on('uncaughtException', function(err) {
		console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
		console.error(err.stack);
		process.exit(1);
	});

}());
