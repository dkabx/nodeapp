var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var userSchema = new Schema({
	// name:{type:String,required:true},
	email:{type:String,required:true},
	password:{type:String,required:true},
  name:{type:String}
});
userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}
userSchema.methods.validPassword = function(password){

	return bcrypt.compareSync(password,this.password);
}
userSchema.methods.comparePassword = function(pw, cb) {  
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('users',userSchema);