var loginCtrl = require('../../controller/logincontroller');
var express = require('express');
var router = express.Router();
var mongoose  = require('mongoose');
var passport = require('passport');



router.post('/signup',passport.authenticate('local-signup',{
	successRedirect:'/user/home',
	failureRedirect:'/',
	failureFlash:true
}));

router.post('/signup',function(req,res){
	loginCtrl.signUp(req,res);

});
router.post('/login',passport.authenticate('local-login',{
	successRedirect:"/user/home",
	failureRedirect:"/",
	failureFlash:true
}));
router.get('/home',isLogin,function(req,res){
	res.render('pages/home');

});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
})


// var userSchema = new Schema({name:String});



module.exports = router;

function isLogin(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	
	res.redirect('/');
}