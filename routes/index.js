module.exports = function(io){
  var router = require('express').Router(),
  db = require('../models'),
  User = db.User,
  Tweet = db.Tweet;
  //var tweetBank = require('../tweetBank.js');

  router.get('/', function(req, res, next){
     Tweet.findAll({include: User})
     .then(function(tweets){
       res.render('index', {title:'Twitter.js', tweets: mergeUsers(tweets), showForm: true});
     })
     .catch(function(err){
       next(err);
     });
     
  });

  router.get('/users/:name', function(req,res, next){
      var name = req.params.name;
     User.findOne({where: {name: name }, include: Tweet})
     .then(function(user){
       res.render('index', {title: 'Twitter-js - Posts by ' + name, tweets: mergeTweets(user), username: name, showForm:true });
     })
     .catch(function(err){
       next(err);
     });
     
  });
  

  router.route('/tweet/:id')
    .get(function(req,res){
       var id = req.params.id;
       Tweet.findById(id, {include: User})
       .then(function(tweet){
         res.render('index', {title: 'Twitter-js - Tweet #' + id, tweets: mergeUsers([tweet])});
       })
    })
      .delete(function(req, res){
        Tweet.destroy({where: {id: Number(req.params.id)}})
        .then(function(){
          res.redirect('/');
        });
      });
     
  
  

  router.post('/tweets', function(req,res, next){
     var username = req.body.name;
     User.findOrCreate({
       where: {name: username},
       defaults : {
         name: username,
         pictureUrl: 'https://unsplash.it/50?image=' + Math.round(Math.random() * 994)
       }
     })
     .then(function(user){
       return Tweet.create({
         tweet: req.body.tweet,
         UserId: user[0].id
       });
     })
     .then(function(tweet){
         tweet['name'] = username; 
        res.render('users', tweet, function(err, rtn){
            io.sockets.emit('new_tweet', rtn);
            res.redirect('/');
        });
     })
     .catch(function(err){
       next(err);
     });
  });
  return router;
};

function mergeUsers(tweets){
    var rtn = [];
    tweets.forEach(function(tweet){
        var _tweet = JSON.parse(JSON.stringify(tweet));
        var newObj = {};
        Object.keys(_tweet).forEach(function(key){
           newObj[key] = tweet[key]; 
        });
        newObj['name'] = tweet.User.name;
        rtn.push(newObj);
    });
    return rtn;

}

function mergeTweets(user){
    var rtn = [];
    user.Tweets.forEach(function(tweet){
        var _tweet = JSON.parse(JSON.stringify(tweet));
        var newObj = {};
        Object.keys(_tweet).forEach(function(key){
           newObj[key] = tweet[key]; 
        });
        newObj['name'] = user.name;
        rtn.push(newObj);
    });
    return rtn;
}
