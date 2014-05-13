// dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var graph = require('fbgraph');
var passport = require('passport');
var util = require('util');
// load environment variables
var dotenv = require('dotenv');
dotenv.load();

var app = express();

// route files to load
var index = require('./routes/index');

// fitbit api keys
var CONSUMER_KEY = process.env.fitbit_consumer_key;
var CONSUMER_SECRET = process.env.fitbit_consumer_secret;
var AUTH_URL = process.env.fitbit_auth_URL;
var ACCESS_TOKEN = "";
var ACCESS_TOKEN_SECRET = "";

// yelp api required info
var YELP_CONSUMER_KEY = process.env.yelp_consumer_key;
var YELP_CONSUMER_SECRET = process.env.yelp_consumer_secret;
var YELP_TOKEN = process.env.yelp_token;
var YELP_TOKEN_SECRET = process.env.yelp_token_secret;
var YELP_ACCESS_TOKEN = "";
var YELP_ACCESS_TOKEN_SECRET = "";

var yelp = require("yelp").createClient({
	consumer_key: YELP_CONSUMER_KEY, 
	consumer_secret: YELP_CONSUMER_SECRET,
	token: YELP_TOKEN,
	token_secret: YELP_TOKEN_SECRET
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "food", location: "Montreal"}, function(error, data) {
  console.log(error);
  console.log(data);
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
//routes
app.get('/', index.view);


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});