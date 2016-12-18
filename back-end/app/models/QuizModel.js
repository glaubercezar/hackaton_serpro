'use strict';

var mongoose = require('mongoose');


var QuizSchema   = new mongoose.Schema({});


module.exports = mongoose.model('Quiz', QuizSchema);