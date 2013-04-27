
/**
 * Module dependencies.
 */

var express = require('express')
  , app = exports.app = express()
  , fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('cer/privatekey.pem'),
  cert: fs.readFileSync('cer/certificate.pem')
};

var server = exports.server = require('http').createServer(app)
  //, server = require('https').createServer(options, app)
  , path = require('path')
  //, io = require('socket.io').listen(server)
  //, tones = require('tones')
  , passport = require('passport')
  , config = require('./config.json')
  , mongo = require('mongodb')
  , mongoose = require('mongoose')
  , MongoStore = require('express-session-mongo');
  //, SessionStore = require("session-mongoose")(express);

/*
 * initialize mongoose
 */
mongoose.connect('mongodb://localhost/tonesdb');
 
var db = exports.db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to tonesdb DB');
});

var sessionStore = exports.sessionStore = new MongoStore();

app.configure(function(){
  app.set('port', process.env.PORT || config.app.port || 3000);
  app.set('views', __dirname + '/views/');
  app.set('view engine', 'jade');
  app.set('strict routing', true);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.session.secret));
  app.use(express.session({ 
      key:'tones',
      store: sessionStore
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Passportjs auth strategy
 */
require('./strategy')(app, passport);

/*
 * Create the routes
 */
require('./routes')(app, passport);

/*
* utilities
*/
require('./utilities')(app);


server.listen(app.get('port'), function(){
  console.log("PublicTones started http listening on port " + app.get('port'));
});

/*
 * Socket.io
 */

require('./sockets');


/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});
