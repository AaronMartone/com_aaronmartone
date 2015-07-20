// import dependencies.
var express = require('express');
var path = require('path');

// define server-side routers.
var apiRouter = express.Router();

// mount paths to routers.
require(__base + 'server/routes/api.route')(apiRouter);

// export module.
module.exports = function(router) {

  // mount routers.
  router.use('/api', apiRouter);

  router.route('/')
    .all(function(req, res, next) {
      res.sendFile(__base + 'app/shared/shell.html');
    });

};
