'use strict';

//Load required packages
var mongoose       = require('mongoose');

//Load configurations from configs
var general 	   = require('../../config/general');
var environment    = require('../../config/environments/'+general.environment);
var database	   = require('../../config/database/'+environment.databaseCollection);


mongoose.Promise = global.Promise;
mongoose.connect(database[environment.databaseUse].database);

