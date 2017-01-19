// ----------------Configure--------------------
var config = require('./config.js')
// ---------------Environnement-----------------
var app = require('express')()
var server = require('http').Server(app)

var io = require('socket.io')(server)
var path = require('path')
var favicon = require('serve-favicon')
var sockets = [] // Liste des sockets client
var map = new Map() 

// ------------express-------------------
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(require('express').static(path.join(__dirname, 'public')))
server.listen(3000)
console.log('Server on 3000; http://localhost:3000')

//解决跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'GET,PUT, POST');
  if (req.method == 'OPTIONS') {
    /*让options请求快速返回*/
    res.send(200);
  }
  else {
    next();
  }
});

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/download', function (req, res) {
  var tmp = [];
  map.forEach(function(v,k){
    tmp=v+tmp
  });
  res.end(tmp);
})

// ------------------------------------------------
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function (socket) {

  //--------------ajouter le client--------------
  if (sockets.indexOf(socket) === -1) {
    sockets.push(socket);
  }

  socket.on('getNote', function (json) {
    var val = json.id + '|' + json.name + '|' + json.score + '|HUMAN_JUDGEMENT\n';
    map.set(json.id,val)
  });

  // ------------supprimer le client----------
  socket.on('disconnect', function (o) {
    var indexSocket = sockets.indexOf(socket);
    if (indexSocket !== -1) {
      sockets.splice(indexSocket, 1);
    }
  });

});
