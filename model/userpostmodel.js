var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
	user_id:String,
	post_desc:String,
	
	
});

module.export = mongoose.model('users',userSchema);