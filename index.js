var express = require('express');
var http = require('http');
var app = express();
var mongoose= require('mongoose');
var userroutes = require('./src/routes/users');
var apiroutes = require('./src/routes/apiroutes');
var home = require('./src/routes');
// app.set('port', (process.env.PORT || 5000));

var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var validator = require('express-validator');
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');


var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(validator());
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://dkabx:apple32gb@test-shard-00-00-mgf1o.mongodb.net:27017,test-shard-00-01-mgf1o.mongodb.net:27017,test-shard-00-02-mgf1o.mongodb.net:27017/test?ssl=true&replicaSet=test-shard-0&authSource=admin');
require('./auth/auth');

// app.use(function(req,res,next){
//     req.db = db;
//     next();
// });
var port = process.env.PORT || 5000
app.use(session({secret:"deepak",
	resave:false,
	saveUninitialized:true,
store: new MongoStore({mongooseConnection:mongoose.connection}),
cookie:{maxAge:180*60*1000}}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(csrfProtection);
app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated();

	res.locals.u = req.user;
	next();
});
app.use('/', home);
app.use('/user', userroutes);
app.use('/api', apiroutes);
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//
// app.get('/', function(request, response) {
//   response.render('pages/index');
// });
var server = http.createServer(app);
var clients = [];
var io = require('socket.io').listen(server);  //pass a http.Server instance

var connections = {};

io.sockets.on('connection', function (socket) {
  connections[socket.id]  = {socket:socket};

  console.log('a user connected');
  var d = '';
  socket.on('join', function (data) {
    // connections[socket.id].data = data.email;
    //console.log(data.email);
    connections[socket.id].email = data.email;
    // console.log(data);

    

     Object.keys(connections).forEach(function(key,index) {
     if(connections[key].email)
        io.sockets.emit('online',{data:connections[key].email});     
});

    // io.sockets.emit('online',{data:connections});
    socket.join(data.id); // We are using room of socket io

  });


  socket.on('new', function (newmsg) {
  
    socket.broadcast.to(newmsg.id).emit('new_msg', {msg: newmsg.data,name:newmsg.name,online:"asdasdad"}); // We are using room of socket io
  });

socket.on('s_user',function(data){
   socket.broadcast.to(data.id).emit('t_user', {row: data.row,col: data.col,name:data.name}); // We are using room of socket io
 });

   socket.on('disconnect', function() {
    // 
     Object.keys(connections).forEach(function(key,index) {
      // console.log(socket.id);
      //  console.log(connections[key].socket.id);
      if(connections[key].socket.id == socket.id){
        
        io.sockets.emit('offline',{data:connections[key].email});
      }
     
     });
  // 
   delete connections[socket.id];
    console.log('disconnect');
            });
 

  //  socket.on('chat message', function(msg){
  //   io.emit('chat message', msg);
  // });
});



server.listen(port);
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
