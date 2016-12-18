'use strict';

//Load required packages
var server  = require('./config/initializers/server');
var async 	= require('async');
var logger 	= require('winston');

//Variables to this file
var appname;
var port;

async.series([

		function initializeConfiguration(cb) {
		  
		  var packageNode = require('./package');
		  var general 	  = require('./config/general');
		  var environment = require('./config/environments/'+general.environment);

		  appname	      = packageNode.name;
		  port			  = environment.port;

		  logger.info('['+appname+'] Load initials configurations.');

		  cb();
		},

		function initializeServer(cb){
			server(port,cb);			
		}

	],
	function(err) {

		if(!err){
			logger.info('['+appname+'] Started with success, on port: '+ port + '.' , err);
		}else{
			logger.error('Initialization failed.', err);
		}
		
	}

);