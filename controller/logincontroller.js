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
  signUp:function(req,res){

 //    var db = req.db;
 //    console.log(db);
 //    var user = {name:req.body.name,email:req.body.email,username:req.body.username,password:req.body.password};
 //    // var user = {name:"deepak",email:"dk693693@gmail.com"};
 //    db.collection("users").insert(user,function(err,s){
 //      if(err) throw err;
 //      console.log("inserted");
 //    });
 // res.redirect('/');
},
  getLogin:function(req,res){
    var messages = req.flash('error');
    res.render('pages/index',{csrfToken:req.csrfToken(),messages:messages,hasMessage:messages.length});
  },  
  functionB: function () {
    // TODO
  },
  postLogin:function(req,res){
   
    var db = req.db;
    var user = {username:req.body.username,password:req.body.password};
    db.collection("users").findOne(user,function(err,result){
      if(err) throw err;
      console.log(result);
    })
  }

};
