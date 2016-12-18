'use strict';

var mongoose = require('mongoose');


var UploadProtocolImageShchema   = new mongoose.Schema({
    image: { data: Buffer, contentType: String },
    protocol: String,
    type: String,
    confirmed: Boolean,
    title: String,
    name: String

});


module.exports = mongoose.model('UploadProtocolImage', UploadProtocolImageShchema);