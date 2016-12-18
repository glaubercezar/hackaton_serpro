'use strict';

// Load required packages
var bookshelf 	= require('../middlewares/database');

//require the model for this collection
var User 		= require('../models/User');

// define collection
var Users = bookshelf.Collection.extend({
  model: User
});

module.exports = bookshelf.collection('Users', Users);