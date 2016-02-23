var express = require('express');
var app = express();
var swig = require('swig');
var routes = require('./routes');
var bodyParser = require('body-parser');
var port = process.env.port || 8080;
var morgan = require('morgan');
var socketio = require('socket.io')

swig.setDefaults({cache: false});
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(function(req,res,next){
    if (req.query.method){
        req.method = req.query.method;
    }
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


var server = app.listen(8080, function(){
   console.log('Server is running...'); 
});

var io = socketio.listen(server);
app.use('/', routes(io));

module.exports = app;







