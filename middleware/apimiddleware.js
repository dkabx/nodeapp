var  jwt = require('jsonwebtoken');
var User = require('../model/usermodel');
var middleware =  function(req,res,next ) {
  var secret = 'putsomethingtopsecrethere';
  const authToken = req.headers['authorization'];

  if(authToken){
    var token = authToken.split(' ')[1];
  }

  if(token){
    jwt.verify(token,secret,function(err,decoded){
      if(err){
        res.status(401).json({error:"Failed to AUthenticate"});
      } else {
        User.find({id:decoded.id},function(err,user){
          if(!user) {
            res.status(404).json({error:"NO Such USer"});
          }
          req.currentUser = user;
          next();

        });
      }
    });
  }
  else{
    res.status(403).json({error:"No Token Provided"});
  }
};

module.exports = middleware;
