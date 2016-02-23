var expect = require('chai').expect,
    db = require('../models'),
    User = db.User,
    Tweet = db.Tweet;

xdescribe('Db utility functions', function(){
   it('Connects to db', function(done){
       db.connect().then(done);
   });
   it('Gets data from db', function(done){
      User.findOne()
      .then(function(user){
         expect(user).to.be.ok;
         done();
      });
   });
   it('Gets related data from db', function(done){
      User.findOne()
      .then(function(user){
          return user.getTweets();
      })
      .then(function(tweets){
        expect(tweets).to.be.ok;
        done();
      });
   });
   it('Gets related data using eager loading', function(done){
      User.findOne({include: Tweet})
      .then(function(user){
         expect(user).to.have.property('Tweets');
         done();
      });
   });
});
