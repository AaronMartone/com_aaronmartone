// import dependencies.
var express = require('express'),
   favicon = require('serve-favicon');
   
// var acl = require('acl');
// var compression = require('compression');
// var cookie_parser = require('cookie-parser');
// var csrf = require('csurf');
// var logger = require('winston');
// var mongoose = require('mongoose');
// var method_override = require('method-override');
// var session = require('express-session');
// var url_rewrite = require('express-url-rewrite');
// var validator = require('validator');

// define the server construct.
var server = {

   // gracefully suspends and then restarts server operations.
   restart: function() {},

   // starts server operations.
   start: function(PORT, ENV) {

      // import the server configuration and define the application.
      var cfg = require(__base + 'server/config/' + ENV + '.config'),
         app = express(),
         temp;

      // configure the application: iterate over each key in the configuration object and as long as it is not 
      // undefined, set the key and value into the application.
      temp = cfg.express.opts;
      Object.keys(temp)
      .forEach(function(app_setting) {
         if (typeof temp[app_setting] !== 'undefined') {
            app.set(app_setting, temp[app_setting]);
         }
      });

      // define application static directories.
      temp = cfg.express.static
      temp.dirs.forEach(function(static_dir) {
         app.use(express.static(static_dir, temp.opts));
      });

      // mount routes to router.
      require(__base + 'server/routes/index.route')(app);

      // 404 handler.
      app.use(function(req, res, next) {

         console.log('404 ERROR', req.method + ' ' + req.url);
         res.status(404)
            .set('Content-Type', 'text/plain')
            .send('Error 404 - ' + req.url + ' does not exist.');

      });

      // 500 handler.
      app.use(function(err, req, res, next) {

         console.log('500 ERROR', err.message, err.stack);
         res.status(500)
            .set('Content-Type', 'text/plain')
            .send('Error 500 - Internal Server Error');
      });

      // start application.
      app.listen(PORT, function() {
         console.log('\n\n\nServer started on port ' + PORT + '\nPress CTRL + C to terminate...');
      });

   },

   // gracefully stops server operations.
   stop: function() {}

};

// export the module.
module.exports = server;
