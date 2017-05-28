var loginCtrl = require('../controller/logincontroller');
var express = require('express');
var router = express.Router();
var mongoose  = require('mongoose');
var passport = require('passport');

// require('../auth/auth');

router.get('/',function(req,res){

  loginCtrl.getLogin(req,res);

});


module.exports = router;
// function isLog(req,res,next){
// 	if(req.isAuthenticated()){
// 		res.redirect('/user/home');
// 	}
// 	res.redirect('/');
// }