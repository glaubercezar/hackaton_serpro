'use strict';

var mongoose = require('mongoose');


var AdminSchema   = new mongoose.Schema({
    name: String,
    title: String,
    watsonWorkspaceId: String,
    watsonUsername: String,
    watsonPassword: String,
    watsonUrl: String,
    watsonVersion: String,
    watsonVersionDate: String,
    mailSmtp: String,
    mailPort: String,
    mailUser: String,
    mailPass: String
});


module.exports = mongoose.model('Admin', AdminSchema);