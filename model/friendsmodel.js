var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
	sender:{type:String,required:true},
	sendto:{type:String,required:true},
	approve:{type:Boolean,required:true}
});
module.exports = mongoose.model("friends",schema);