var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var RedisStore = require('connect-redis')(session);
var http = require('http');

var routes = require('./routes/index');
var login = require('./routes/login');
var add = require('./routes/add');
var chat = require('./routes/chat');
var users = require('./routes/users');

var app = express();
var server = http.createServer(app);
var sio = require('socket.io').listen(server);
server.listen(80);

var sessionMiddleware = session({
  secret: '4wq6cs3438WnP2pY72nIWla0t8SdbjRq',
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({})
});

sio.use(function(socket,next){
  sessionMiddleware(socket.request,socket.request.res,next);
});

app.use(sessionMiddleware);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle Socket Request
var clients = [];
var Chat = require('./model/chat');
sio.sockets.on('connection',function(socket){
  //console.log(socket.request.session);
  if(clients[socket.request.session.username]===undefined) {
    clients[socket.request.session.username] = socket;
  }

  socket.on('chat',function(data){
    //if user online
    if(clients[data.to]!==undefined){
      new Chat({fromUser:data.from,toUser:data.to,msg:data.msg,isRead:true}).save();
      clients[data.to].emit("chat",{from:data.from,msg:data.msg});
      //console.log({from:data.from,msg:data.msg});
    }
    else{ //User is not online
      new Chat({fromUser:data.from,toUser:data.to,msg:data.msg,isRead:false}).save();
      //console.log({from:data.from,msg:data.msg});
    }
  });

  socket.on('disconnect',function(data){
    if(clients[data.to]!==undefined){
      delete clients[socket.request.session.username];
      console.log(socket.request.session.username+ " Logout from chat" );
    }
  });

  socket.on('getHistory',function(data){
    Chat.find({$or : [{fromUser:data.fromUser,toUser:data.toUser},{fromUser:data.toUser,toUser:data.fromUser}]}, null, {sort: {datetime: -1}},function(err,chats){
      if(err) console.log(err);
      socket.emit('history',chats);
    });
  });

});



// Initialize MongoDB
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));


//Set static connect to route
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/fonts',express.static(path.join(__dirname, 'public/fonts')));

app.use('/', routes);
app.use('/login', login);
app.use('/add', add);
app.use('/chat', chat);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
