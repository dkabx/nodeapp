var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var notischema = new Schema({}, { strict: false });
module.exports = mongoose.model('notifications',notischema);


