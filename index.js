var express = require('express');
var app = express();
var mongoose= require('mongoose');
var userroutes = require('./src/routes/users');
var home = require('./src/routes');
app.set('port', (process.env.PORT || 5000));
var monk = require('monk');
var session = require('express-session');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://dkabx:apple32gb@test-shard-00-00-mgf1o.mongodb.net:27017,test-shard-00-01-mgf1o.mongodb.net:27017,test-shard-00-02-mgf1o.mongodb.net:27017/test?ssl=true&replicaSet=test-shard-0&authSource=admin');
require('./auth/auth');
// app.use(function(req,res,next){
//     req.db = db;
//     next();
// });

app.use(session({secret:"deepak",
	resave:false,
	saveUninitialized:true,
store: new MongoStore({mongooseConnection:mongoose.connection}),
cookie:{maxAge:180*60*1000}}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrfProtection);
app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated();
	next();
});
app.use('/', home);
app.use('/user', userroutes);
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//
// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
