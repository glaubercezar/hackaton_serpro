'use strict';

// Load required packages

var express 				= require('express');
var bodyParser 				= require('body-parser');
var validator               = require('express-validator');
var helpers                 = require('../../app/middlewares/helpers');
var cron                    = require('node-cron');
var multiparty              = require('connect-multiparty');

var start =  function(port, cb) {

    require('../../app/middlewares/database');


    /**
     * Controllers
     */
    var usersController 	       = require('../../app/controllers/usersController');
    var loginController 	       = require('../../app/controllers/loginController');
    var conversationController 	   = require('../../app/controllers/conversationController');
    var clerkController 	       = require('../../app/controllers/clerkController');
    var interactionController 	   = require('../../app/controllers/interactionController');
    var adminController 	       = require('../../app/controllers/adminController');
    var uploadController           = require('../../app/controllers/uploadController');
    var protocolController         = require('../../app/controllers/protocolController');
    var pdfController              = require('../../app/controllers/pdfController');

	// Create our Express application
	var app = express();

	// Set view engine to ejs
	app.set('view engine', 'ejs');

    // parse application/json
    app.use(bodyParser.json());


	// Use the body-parser package in our application
	app.use(bodyParser.urlencoded({
		extended: true
	}));

    //To uploads of files
    var multipartyMiddleware = multiparty({ uploadDir: __dirname + "/../../public/uploads/" });


    // Library to form validate with Customs Validators
    app.use(validator({
        customValidators: {

            isCep: function(value){
                return helpers.isCep(value);
            },
            lenMin: function(value, min){
                return value.trim().length >= min;
            }
        }
    }));


	// Create our Express router
	var router = express.Router();


    //Cross-origin permissions
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, UPDATE, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    /**
     * Cron Jobs
     */

    //Each 5 minutes close conversations
    cron.schedule('*/2 * * * *', function(){
        helpers.closeConversationsAutomatically();
    });


    /**
     * API'S
     */

    var routerApi   = express.Router();

    /* Root Api */
    routerApi.route('/')
        .get(function(req, res) {
            res.json({ message: 'Bem vindo a AnaclaraBot.' });
        });


    /* Users  */
    routerApi.route('/users')
        .post(usersController.postUsers)
        .delete(usersController.delUser)
        .get(usersController.listUsers);


    /* Login  */
    routerApi.route('/login')
        .post(loginController.login);


    /* Conversation  */
    routerApi.route('/conversation')
        .post(conversationController.postConversation)
        .get(conversationController.listConversations);

    routerApi.route('/conversation/:id')
        .delete(conversationController.delConversation);

    routerApi.route('/conversation/end/:id')
        .get(conversationController.endConversationRequest);

    routerApi.route('/conversation/status/:id')
        .get(conversationController.verifyStatus);

    routerApi.route('/conversation/speechToTextToken')
        .get(conversationController.speechToTextToken);

    routerApi.route('/conversation/textToSpeechToken')
        .get(conversationController.textToSpeechToken);

    /* Clerk  */
    routerApi.route('/clerk')
        .post(multipartyMiddleware,clerkController.postImage)
        .get(clerkController.listClerks);

    routerApi.route('/clerk/last')
        .get(clerkController.getClerkImage);


    /* Interactions  */
    routerApi.route('/interactions')
        .get(interactionController.listInteractions);

    routerApi.route('/interactions/:id')
        .get(interactionController.getInteraction);


    /* Admin  */
    routerApi.route('/admin/configuration')
        .post(adminController.storeConfigurations)
        .get(adminController.listConfigurations);

    /* Informations  */
    routerApi.route('/admin/information')
        .post(adminController.storeInfoPage)
        .get(adminController.listInfoPages);

    /* Informations  */
    routerApi.route('/admin/information/:id')
        .get(adminController.getInfoPage)
        .delete(adminController.delInfoPage)
        .put(adminController.altInfoPage);

    /* Procons  */
    routerApi.route('/admin/procon')
        .post(adminController.setProcon)
        .get(adminController.getProcons);

    /* Procons  */
    routerApi.route('/admin/procon/:id')
        .get(adminController.getProcon)
        .delete(adminController.delProcon)
        .put(adminController.altProcon);

    /* Login  */
    routerApi.route('/admin/login')
        .post(adminController.login);


    /* UploadImage  */
    routerApi.route('/uploadprotocolimage')
        .post(multipartyMiddleware,uploadController.postProtocolImage);

    routerApi.route('/uploadprotocolimage/confirm/:id')
        .get(uploadController.confirmImage);

    routerApi.route('/uploadprotocolimage/deleteall')
        .get(multipartyMiddleware,uploadController.deleteAll);


    /* PDF  */
    routerApi.route('/pdf/generate')
        .post(pdfController.generate);

    routerApi.route('/pdf/interactions')
        .post(pdfController.getInteractions);

    routerApi.route('/pdf/download')
        .post(pdfController.downloadPdf);


    /* Protocol  */
    routerApi.route('/protocol/protocol/:id')
        .get(protocolController.getProtocol)
        .put(protocolController.changeStatus);

    routerApi.route('/protocol/protocols')
        .get(protocolController.getProtocols);

    routerApi.route('/protocol/deleteall')
        .get(protocolController.deleteAll);

    routerApi.route('/protocol/end')
        .post(protocolController.endProtocol);

    routerApi.route('/protocol/grade')
        .post(protocolController.gradeProtocol);


    routerApi.route('/protocol/last')
        .get(protocolController.lastProtocol);

    // Register all our routes with /api
    app.use('/api', routerApi);

	// Start the server
	app.listen(port);

	if (cb) {
	   return cb();
	}
};


module.exports = start;



