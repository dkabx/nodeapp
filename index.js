var express = require('express');
var http = require('http');
var app = express();
var mongoose= require('mongoose');
var userroutes = require('./src/routes/users');
var home = require('./src/routes');
app.set('port', (process.env.PORT || 5000));
var monk = require('monk');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var validator = require('express-validator');
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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

	res.locals.u = req.user;
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
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

io.sockets.on('connection', function (socket) {
  console.log('a user connected');
  var d = '';
  socket.on('join', function (data) {
  	d = data;
  	console.log(data);
    socket.join(data.id); // We are using room of socket io
  });




  socket.broadcast.to('59300e0c9877731a6c5cf83d').emit('new_msg', {msg: 'hello'});
  //  socket.on('chat message', function(msg){
  //   io.emit('chat message', msg);
  // });
});



server.listen(5000);
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
