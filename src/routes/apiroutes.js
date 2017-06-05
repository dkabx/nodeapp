var express = require('express');
var router = express.Router();
var User = require('../../model/usermodel');

router.post("/user-login", function(req, res) {
  if(req.body.name && req.body.password){
    var name = req.body.name;
    var password = req.body.password;
  }
  // usually this would be a database call:
  User.find({email:req.body.email,password:req.body.password},function(err,user){
  	if(err) throw err;
  	if( ! user ){
    res.status(401).json({message:"Invalid credentials"});
  }

   
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
 

});
  


});
module.exports = router;