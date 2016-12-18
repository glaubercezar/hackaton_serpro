'use strict';

var mongoose = require('mongoose');

var ProconSchema   = new mongoose.Schema({
    name: String,
    latitude: String,
    longitude: String,
    cep: String,
    address: String
});

module.exports = mongoose.model('Procon', ProconSchema);