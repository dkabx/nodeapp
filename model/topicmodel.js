var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var topicSchema = new Schema({
	topic:{type:String,required:true},
	nickname:{type:String,required:true},
	user_id:{type:String,required:true},
	user_email:{type:String,required:true}
});

module.exports = mongoose.model('topics',topicSchema);