'use strict';

//Load required packages
var server  = require('./config/initializers/server');
var async 	= require('async');
var logger 	= require('winston');

//Variables to this file
var appname     = "Admin-Area App";
var port        = 3004;

async.series([

		function initializeConfiguration(cb) {
		  cb();
		},

		function initializeServer(cb){
			server(port,cb);
		}

	],
	function(err) {

		if(!err){
			logger.info('['+appname+'] Started with success, on port: '+port+'.' , err);
		}else{
			logger.error('Initialization failed.', err);
		}
		
	}

);
