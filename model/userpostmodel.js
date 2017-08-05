var mongoose = require('mongoose');
var userpostschema = mongoose.Schema({
	text:{type:String},
	filename:{type:String},
	username:{type:String,required:true},
	text:{type:String}
});
module.exports = mongoose.model("userposts",userpostschema);