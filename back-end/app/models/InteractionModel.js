'use strict';

var mongoose = require('mongoose');


var EntitySchema   = new mongoose.Schema({
    entity: String,
    location: [Number],
    value: String
});


var IntentSchema   = new mongoose.Schema({
    intent: String,
    confidence: Number
});


var InteractionSchema   = new mongoose.Schema({
    interactionType: String,
    userTextInteraction: String,
    userImageInteraction: Buffer,
    userSoundInteraction: Buffer,
    botTextInteraction: String,
    botImageInteraction: Buffer,
    botSoundInteraction: Buffer,
    date: String,
    intents: [IntentSchema],
    entities: [EntitySchema]
});


module.exports = mongoose.model('Interaction', InteractionSchema);