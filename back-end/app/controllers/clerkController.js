'use strict';

// Load required packages
var Clerk 		= require('../models/ClerkModel');
var msg 	    = require('../../config/messages.json');


//Index
module.exports = {
    postImage: postImage,
    listClerks: listClerks,
    getClerkImage: getClerkImage
};


/***
 * Functions of the clerk
 */


function postImage(req, res) {

    var fs = require('fs');

    if(req.files.image) {

        var clerk = new Clerk;

        clerk.image.data = fs.readFileSync(req.files.image.path);
        clerk.image.contentType = req.files.image.headers["content-type"];

        clerk.save()
            .then(function (data) {
                res.json(data);
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });
    }else{
        res.status(400).json({code: msg.invalid_image.code, message: msg.invalid_image.msg});

    }
}

function listClerks(req, res){

    Clerk.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

function getClerkImage(req, res){

    Clerk.findOne({})
        .sort({_id: -1})
        .limit(10, function (e, d) {})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}