var express = require('express');
var router = express.Router();
var User = require('../../model/usermodel');
var jwt = require('jsonwebtoken');
var secret ="putsomethingtopsecrethere" ;
var middleware = require('../../middleware/apimiddleware');
router.post('/authenticate', function(req, res) {

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else {

      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user, secret, {
            expiresIn: 10080 // in seconds
          });
          res.json({success:true,token:token});
        } else {
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});

router.get('/user-list',middleware,function(req,res){
	User.find({},function(err,docs){
		if(err) throw errr;
		res.json({success:true,userlist:docs});
	})
})
module.exports = router;
