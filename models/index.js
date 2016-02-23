var Sequelize = require('sequelize');

var db = new Sequelize('twitterjs', 'distres117', null, {
    dialect: 'mysql',
    port: 3306
});

var connect = function(){
    
    return db
        .authenticate()
        .catch(function(err){
            console.log("Db connection error: " + err);
        })
        .then(function(){
           console.log("Successfully connected to db..."); 
        });
}

var Tweet = require('./tweet')(db);
var User = require('./user')(db);

User.hasMany(Tweet);
Tweet.belongsTo(User);

module.exports ={ User, Tweet, connect};