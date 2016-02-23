var expect = require('chai').expect,
    response = require("supertest")(require('../app')),
    models = require('../models'),
    User = models.User,
    Tweet = models.Tweet;

describe('GET routes', function(){
   it('GETs the home route', function(done){
      response
        .get('/')
        .end(function(err,res){
            expect(res.text).to.include("Nimit");
            //console.log(res.body);
            done();
        })
   });
   xit('GETs a tweet with an id', function(done){
      response
        .get('/tweet/7')
        .end(function(err,res){
           console.log(res.text);
           done();
        });
   });
});

xdescribe('POST routes', function(){
   afterEach(function(done){
       User.destroy({where: {name: 'Testy McTest'}})
       .then(function(){
          return Tweet.destroy({where: {tweet: "Testy's test tweet!"}});
       })
       .then(function(){
          done(); 
       });
   });
   it('creates a new user with a tweet', function(done){
       response
        .post('/tweets')
        .type('form')
        .send({
            name: "Testy McTest",
            tweet: "Testy's test tweet!"
        })
        .end(function(){
           User.findOne({where: {name: 'Testy McTest'}, include: Tweet})
               .then(function(user){
                    expect(user).to.be.ok;
                    expect(user.Tweets.length).to.equal(1);
                    done();
                });
        });
   });
   it('Deletes a tweet', function(){
       
   });
});