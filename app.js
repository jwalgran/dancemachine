var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var itunes = require('playback');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  itunes.on('playing', function(currentTrack){
    socket.emit('currentTrack', currentTrack);
  });
  itunes.on('paused', function(){
    socket.emit('paused');
  });
  socket.on('play', function () {
    itunes.play();
  });
  socket.on('pause', function () {
    itunes.pause();
  });
  socket.on('stop', function () {
    itunes.stop();
  });
  socket.on('next', function () {
    itunes.next();
  });
  socket.on('previous', function () {
    itunes.previous();
  });
});