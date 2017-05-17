var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

module.exports.connect = function connect(callback) {
    MongoClient.connect("mongodb://dkabx:apple32gb@test-shard-00-00-mgf1o.mongodb.net:27017,test-shard-00-01-mgf1o.mongodb.net:27017,test-shard-00-02-mgf1o.mongodb.net:27017/test?ssl=true&replicaSet=test-shard-0&authSource=admin", function(err, conn){
        /* exports the connection */
        module.exports.db = conn;
        callback(err);
    });
};
