'use strict';

// Load required packages
var express 				= require('express');
var bodyParser 				= require('body-parser');
var passport                = require('passport');
var cookieParser            = require('cookie-parser');
var session                 = require('express-session');

var start =  function(port, cb) {


    var app = express();

    // get information from html forms
    app.use(bodyParser.json());

    // Use the body-parser package in our application
    app.use(bodyParser.urlencoded({ extended: true }));

    // Indicate use express session
    app.use(session({
        secret: "angularCourseBackend",
        resave: true,
        saveUninitialized: true
    }));


    var routerFont  = express.Router();

    routerFont.route('/*')
        .get(function(req, res){
            res.sendFile('index.html', {root: './public'});
        });

    // Register path to static files like as js, css and img
    app.use(express.static('./public'));


    // Register rest routers to front
    app.use(routerFont);


    /***
     * Server configurations
     */

	app.listen(port);

	if (cb) {
	   return cb();
	}
};


module.exports = start;



