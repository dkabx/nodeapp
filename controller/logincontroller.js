var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var u = require('../src/database/config');

module.exports = {
  functionA: function (req,res) {
    MongoClient.connect("mongodb://dkabx:apple32gb@test-shard-00-00-mgf1o.mongodb.net:27017,test-shard-00-01-mgf1o.mongodb.net:27017,test-shard-00-02-mgf1o.mongodb.net:27017/test?ssl=true&replicaSet=test-shard-0&authSource=admin", function(err, db) {
    	  if (err) throw err;

        db.createCollection("customers", function(err, res) {
       if (err) throw err;
       console.log("Table created!");
       db.close();
     });


    		});

  },
  functionB: function () {
    // TODO
  },

};
