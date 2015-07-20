// import dependencies.
var path = require('path');

// export module.
module.exports = {
  express: {
    opts: {
      'case sensitive routing': false,
      env: 'development',
      etag: undefined,
      'jsonp callback name': '?callback=',
      'json replacer': null,
      'json spaces': undefined,
      'query parser': 'extended',
      'strict routing': false,
      'subdomain offset': 2,
      'trust proxy': false,
      views: __base + 'app//views',
      'view cache': false,
      'view engine': 'jade',
      'x-powered-by': false
    },
    static: {
      dirs: [ 'dev/build' ],
      opts: {
        dotfiles: 'ignore',
        etag: true,
        extensions: false,
        index: 'index.html',
        lastModified: true,
        maxAge: 0,
        redirect: true,
        setHeaders: null
      }
    }
  },
  mongodb: {
    url: 'mongodb://localhost/aaronmartone_com_dev'
  }
};
