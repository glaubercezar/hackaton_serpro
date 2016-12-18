'use strict';

var mongoose = require('mongoose');


var ProtocolSchema   = new mongoose.Schema({
    code: String,
    subject: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    description: String,
    date: String,
    grade: Number,
    status: String,
    message: String,
    interact: Boolean,
    has: Boolean
});


module.exports = mongoose.model('Protocol', ProtocolSchema);