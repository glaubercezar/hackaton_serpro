'use strict';

var mongoose = require('mongoose');


var UserSchema   = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    cep: String,
    conversations: [String]
});


module.exports = mongoose.model('User', UserSchema);