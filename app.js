var express = require('express');
var app = express();
var swig = require('swig');
var routes = require('./routes');
var bodyParser = require('body-parser');
var port = process.env.port || 8080;

swig.setDefaults({cache: false});
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Logging middleware
app.use(function(req,res,next){
    var temp = res.end;
    res.end = function(){
        temp.apply(this, arguments);
        console.log(req.method, req.url, res.statusCode);
    };
    next();
});

app.use('/', routes);




app.listen(port, function(){
   console.log("Server started on port " + port); 
});