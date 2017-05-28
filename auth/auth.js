var passport = require('passport');
var User = require('../model/usermodel');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
	done(null,user.id);
});
passport.deserializeUser(function(id,done){
	User.findById(id,function(err,user){
		done(err,user);
	});
});
passport.use('local-signup',new LocalStrategy({
	usernameField:"email",
	passwordField:"password",
	passReqToCallback:true
},function(req,email,password,done){
	req.checkBody("email","Invalid Email").notEmpty().isEmail();
	req.checkBody("password","Invalid Password").notEmpty().isLength({min:4});
	var errors = req.validationErrors();
	if(errors){
		var messages= [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null,false,req.flash('error',messages));
	}

	User.findOne({'email':email},function(err,user){
		if(err) return done(err);
		if(user){
			return done(null,false,{message:"Email already Exist"});
		}
	
	});
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.save(function(err,result){
			if(err) return done(err);
			if(result) return done(null,newUser);
		});
}));

passport.use("local-login",new LocalStrategy({
	usernameField:"email",
	passwordField:"password",
	passReqToCallback:true,
},function(req,email,password,done){
	req.checkBody("email","invalid Email").isEmail();
	req.checkBody("password","Invalid").notEmpty().isLength({min:4});
	var errors = req.validationErrors();
	if(errors){
			var messages= [];
			errors.forEach(function(error){
			messages.push(error.msg);
		});

		return done(null,false,req.flash('error',messages));
	}
	var n = new User();
	User.findOne({"email":email},function(err,user){
		if(err){
			return done(err);
		}
		if(!user){
			return done(null,false,{message:"no user found"});
		}

		if(!user.validPassword(password)){
			return done(null,false,{message:"Invalid Credentials"});
		}
		return done(null,user);
	})
}));