module.exports = function(io){
  var router = require('express').Router();
  var tweetBank = require('../tweetBank.js');

  router.get('/', function(req, res){
     var tweets = tweetBank.list();
     res.render('index', {title:'Twitter.js', tweets: tweets, showForm: true});
  });

  router.get('/users/:name', function(req,res){
      var name = req.params.name;
     var list = tweetBank.find({name: name });
     res.render('index', {title: 'Twitter-js - Posts by ' + name, tweets: list, username: name, showForm:true });
  });

  router.get('/tweet/:id', function(req,res){
     var id = req.params.id;
     var tweet = tweetBank.find({id:id});
     res.render('index', {title: 'Twitter-js - Tweet #' + id, tweets: tweet});
  });

  router.post('/tweets', function(req,res){
     var tweet = tweetBank.add(req.body.name, req.body.text);
     res.render('users', tweet, function(err, rtn){
       io.sockets.emit('new_tweet', rtn);
       res.redirect('/');
     });
  });
  return router;
};
