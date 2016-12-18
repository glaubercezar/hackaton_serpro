'use strict';

// Load required packages
var msg 	                = require('../../config/messages.json');
var moment                  = require('moment-timezone');
var Protocol                = require('../models/ProtocolModel');
var Admin                   = require('../models/AdminModel');
var UploadImg               = require('../models/UploadProtocolImageModel');

//Index
module.exports = {
    getProtocol: getProtocol,
    getProtocols: getProtocols,
    changeStatus: changeStatus,
    endProtocol: endProtocol,
    gradeProtocol: gradeProtocol,
    deleteAll: deleteAll,
    lastProtocol: getLastProtocol
};

function deleteAll(req, res) {

    Protocol.remove({},function(err,numberRemoved){
        res.status(200).json({numberRemoved: numberRemoved});
    });

}

function getProtocol(req, res) {

    Protocol
        .findOne({
            _id: req.params.id
        })
        .populate([{path:'user', select:'firstName lastName'}])
        .then(function (data) {
            if(data){
                UploadImg.find({
                    protocol: data.code,
                    confirmed: true
                }).then(function (data2) {

                    var x   = {};
                    x.data  = data;
                    x.data2 = data2;

                    res.status(200).json(x);
                });
            }else{
                res.status(400).json({code: msg.not_found.code, message: msg.not_found.msg,fields: []});
            }
        })
        .catch(function (err){
            res.status(500).json({code: 500, message: err.message,fields: []});
        });

}

function getLastProtocol(req, res) {

    Protocol.find({
        user: "584f3b076c274c4da2d9ec9c"
    }).limit(1).sort({$natural:-1})
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });

}

function getProtocols(req, res) {

    Protocol.find().populate("user")
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

function changeStatus(req, res) {

    var msg             = require('../../config/messages.json');
    var field           = req.body;

    Protocol
        .findOne({
            _id: req.params.id
        })
        .populate([{path:'user', select:'firstName email'}])
        .then(function (data) {
            if(data){
                data.status = field.status;
                data.message  = field.message;
                data.save()
                    .then(function (data) {
                        sendEmail(data.status, data.message, data.code, data.user);
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

function gradeProtocol(req, res) {

    var fields              = req.body;
    var code                = fields.code;
    var grade               = fields.grade;

    Protocol
        .findOne({
            code: code
        })
        .then(function (data) {
            if(data){
                data.grade = grade;
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

function endProtocol(req, res) {
    
    var protocol            = new Protocol();
    var fields              = req.body;

    protocol.code           = fields.code;
    protocol.subject        = fields.subject;
    protocol.user           = fields.user;
    protocol.description    = fields.description;
    protocol.status         = "Criado";
    protocol.message        = "";
    protocol.date           = moment.tz("America/Sao_Paulo").format("YYYY-M-DD H:mm:ss");

    protocol.save()

     .then(function () {
        //sendEmail(protocol.status, data.message, protocol.code);
        res.status(200).json(protocol);
     })
     .catch(function (err) {
        res.status(500).json({code: 500, message: err.message, fields: []});

     });

}


function sendEmail(status, message, protocol, user) {
        
        var nodemailer      = require('nodemailer');
        var smtpTransport   = require('nodemailer-smtp-transport');

        Admin.find({})
            .then(function (configs) {
                if(configs){
                    configs = configs[0];
                }
                var transporter = nodemailer.createTransport(smtpTransport({
                    host: configs.mailSmtp,
                    port: configs.mailPort,
                    secure: true,
                    debug: true,
                    auth: {
                        user: configs.mailUser,
                        pass: configs.mailPass
                    }
                }));

                transporter.sendMail({
                    from: configs.mailUser,
                    to: user.email,
                    subject: 'RoboCon - Status alterado',
                    html: "<p>Olá "+user.firstName+", o status da sua reclamação foi alterado.</p><p>Status: "+status+"</p><p>"+message+"</p><p>Nº protocolo: "+protocol+"</p>"
                });
            });

}
