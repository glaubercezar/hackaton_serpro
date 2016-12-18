'use strict';

// Load required packages
var Admin 		= require('../models/AdminModel');
var Info 		= require('../models/InfoPageModel');
var Procon 		= require('../models/ProconModel');


//Index
module.exports = {
    storeConfigurations : storeConfigurations,
    listConfigurations  : listConfigurations,
    altInfoPage         : altInfoPage,
    delInfoPage         : delInfoPage,
    getInfoPage         : getInfoPage,
    storeInfoPage       : storeInfoPage,
    listInfoPages       : listInfoPages,
    altProcon           : altProcon,
    delProcon           : delProcon,
    getProcon           : getProcon,
    setProcon           : setProcon,
    getProcons          : getProcons,
    login               : login
};

/***
 * Functions of the information pages
 */

function storeInfoPage(req, res) {

    var info    = new Info();
    var fields  = req.body;

    info.title  = fields.title;
    info.text   = fields.text;

    info.save()
        .then(function () {
            res.status(200).json(info);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });

}

function altInfoPage(req, res) {

    var msg    = require('../../config/messages.json');
    var field  = req.body;

    Info
        .findOne({
            _id: req.params.id
        })
        .then(function (data) {
            if(data){
                data.title = field.title;
                data.text = field.text;
                data.save()
                    .then(function (data) {
                        res.status(200).json(data);
                    })
                    .catch(function (err) {
                        res.status(500).json({code: 500, message: err.message,fields: []});
                    });

            }else{
                res.status(400).json({code: msg.not_found.code, message: msg.not_found.msg,fields: []});
            }
        })
        .catch(function (err){
            res.status(500).json({code: 500, message: err.message,fields: []});
        });

}

function listInfoPages(req, res) {
    Info.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

function getInfoPage(req, res) {

    var msg    = require('../../config/messages.json');

    Info
        .findOne({
            _id: req.params.id
        })
        .then(function (data) {
            if(data){
                res.status(200).json(data);
            }else{
                res.status(400).json({code: msg.not_found.code, message: msg.not_found.msg,fields: []});
            }
        })
        .catch(function (err){
            res.status(500).json({code: 500, message: err.message,fields: []});
        });

}

function delInfoPage(req, res) {

    var id = req.params.id;
    Info.remove({_id: id}, function(err, result) {
        res.sendStatus(200);
    });
}

function setProcon(req, res) {

    var proc    = new Procon();
    var fields  = req.body;

    proc.name  = fields.name;
    proc.latitude   = fields.latitude;
    proc.longitude   = fields.longitude;
    proc.cep = fields.cep;
    proc.address = fields.address;

    proc.save()
        .then(function () {
            res.status(200).json(proc);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });

}

function altProcon(req, res) {

    var msg    = require('../../config/messages.json');
    var field  = req.body;

    Procon
        .findOne({
            _id: req.params.id
        })
        .then(function (data) {
            if(data){
                data.name = field.name;
                data.latitude  = field.latitude;
                data.longitude  = field.longitude;
                data.cep = field.cep;
                data.address = field.address;
                data.save()
                    .then(function (data) {
                        res.status(200).json(data);
                    })
                    .catch(function (err) {
                        res.status(500).json({code: 500, message: err.message,fields: []});
                    });

            }else{
                res.status(400).json({code: msg.not_found.code, message: msg.not_found.msg,fields: []});
            }
        })
        .catch(function (err){
            res.status(500).json({code: 500, message: err.message,fields: []});
        });

}

function getProcons(req, res) {
    Procon.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

function getProcon(req, res) {

    var msg    = require('../../config/messages.json');

    Procon
        .findOne({
            _id: req.params.id
        })
        .then(function (data) {
            if(data){
                res.status(200).json(data);
            }else{
                res.status(400).json({code: msg.not_found.code, message: msg.not_found.msg,fields: []});
            }
        })
        .catch(function (err){
            res.status(500).json({code: 500, message: err.message,fields: []});
        });

}

function delProcon(req, res) {

    var id = req.params.id;
    Procon.remove({_id: id}, function(err, result) {
        res.sendStatus(200);
    });
}


/***
 * Functions of the configurations to integration watson
 */

function storeConfigurations(req, res) {

    var admin                     = new Admin();
    var fields                    = req.body;
    var general 	              = require('../../config/general');
    var environment               = require('../../config/environments/'+general.environment);
    var fs                        = require("fs");
    var responseWrite;

    admin.name                    = fields.name;
    admin.title                   = fields.title;
    admin.watsonWorkspaceId       = fields.watsonWorkspaceId;
    admin.watsonUsername          = fields.watsonUsername;
    admin.watsonPassword          = fields.watsonPassword;
    admin.watsonUrl               = fields.watsonUrl;
    admin.watsonVersion           = fields.watsonVersion;
    admin.watsonVersionDate       = fields.watsonVersionDate;
    admin.mailSmtp                = fields.mailSmtp;
    admin.mailPort                = fields.mailPort;
    admin.mailUser                = fields.mailUser;
    admin.mailPass                = fields.mailPass;


    Admin.remove({},function(err,numberRemoved){});


    environment.watsonWorkspaceId = fields.watsonWorkspaceId;
    environment.watsonUsername    = fields.watsonUsername;
    environment.watsonPassword    = fields.watsonPassword;
    environment.watsonUrl         = fields.watsonUrl;
    environment.watsonVersion     = fields.watsonVersion;
    environment.watsonVersionDate = fields.watsonVersionDate;
    environment.mailSmtp          = fields.mailSmtp;
    environment.mailPort          = fields.mailPort;
    environment.mailUser          = fields.mailUser;
    environment.mailPass          = fields.mailPass;

    fs.writeFileSync("./config/environments/" + general.environment + ".json", JSON.stringify(environment));

    admin.save()
        .then(function () {
            res.status(200).json(admin);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });

}

function listConfigurations(req, res){

    Admin.find({})
        .then(function (configs) {
            if(configs){
                configs = configs[0];



            }

            res.json(configs);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

/***
 * Functions of the login
 */
function login(req, res){

    var fields              = req.body;

    if(fields.email == "admin@email" && fields.password == "123456"){
        res.json({});
    }else{
        res.sendStatus(403);

    }
}
