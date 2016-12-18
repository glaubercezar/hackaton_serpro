'use strict';

var mongoose = require('mongoose');


var ClerkSchema   = new mongoose.Schema({
    image: { data: Buffer, contentType: String }

});


module.exports = mongoose.model('Clerk', ClerkSchema);