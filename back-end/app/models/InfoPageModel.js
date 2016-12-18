'use strict';

var mongoose = require('mongoose');

var InfoPageSchema   = new mongoose.Schema({
    title: String,
    text: String
});

module.exports = mongoose.model('InfoPage', InfoPageSchema);