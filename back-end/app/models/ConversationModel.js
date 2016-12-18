'use strict';

var mongoose = require('mongoose');


var ChoiceSchema    = new mongoose.Schema({
    choice: String,
    userSelected: Boolean
});


var QuizSchema    = new mongoose.Schema({
    type: String,
    question: String,
    choices: [ChoiceSchema]
});

var ConversationSchema   = new mongoose.Schema({
    conversation_id: String,
    date: String,
    timeInitial: String,
    timeEnd: String,
    automaticallyClosed: Boolean,
    interactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interaction'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quiz: [QuizSchema]
});


module.exports = mongoose.model('Conversation', ConversationSchema);