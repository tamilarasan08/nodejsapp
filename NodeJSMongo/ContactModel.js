
var mongoose = require("mongoose");

var  Schema = mongoose.Schema;


var contactSchema = new Schema({
    name:String,
    phone_number:String,
    salutation:String

});

module.exports = mongoose.model('ContactModel',contactSchema);