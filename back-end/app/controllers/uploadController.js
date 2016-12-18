'use strict';

// Load required packages
var UploadProtocolImage     = require('../models/UploadProtocolImageModel');
var msg 	                = require('../../config/messages.json');


//Index
module.exports = {
    postProtocolImage: postProtocolImage,
    confirmImage: confirmImage,
    verifyPositiveImage: verifyPositiveImage,
    deleteAll: deleteAll
};


function deleteAll(req, res) {

    UploadProtocolImage.remove({},function(err,numberRemoved){
        res.status(200).json({numberRemoved: numberRemoved});
    });

}



/***
 * Functions of the clerk
 */


function postProtocolImage(req, res) {

    var fs          = require('fs');
    var url         = require('url');
    var url_parts   = url.parse(req.url, true);
    var query       = url_parts.query;
    var protocol    = query.protocol;
    var type        = query.type;
    var title       = query.title;
    var path        = require('path');


    if(req.files.image) {

        var Upload               = new UploadProtocolImage();
        var path                 = (req.files.image.path).split("/");
        var name                 = path[path.length-1];
        var idVisualRecognation  = "validate_documents_558162183";


        if(idVisualRecognation){
            verifyPositiveImage(req, res, idVisualRecognation, name, function (response) {

                if(response){

                    Upload.image.data        = fs.readFileSync(req.files.image.path);
                    Upload.image.contentType = req.files.image.headers["content-type"];
                    Upload.protocol          = protocol;
                    Upload.type              = type;
                    Upload.title             = title;
                    Upload.confirmed         = false;
                    Upload.name              = name;

                    Upload.save()
                        .then(function (data) {
                            res.json(data);
                        })
                        .catch(function (err) {
                            res.status(500).json({code: 500, message: err.message, fields: []});
                        });

                }else{
                    res.sendStatus(404);
                }

            });
        }else {
            res.sendStatus(404);
        }
    }else{
        res.status(400).json({code: msg.invalid_image.code, message: msg.invalid_image.msg});

    }
}

function verifyPositiveImage(req, res, classifier_id, image, cb){

    var watson        = require('watson-developer-cloud');
    var fs            = require('fs');


    var visual_recognition = watson.visual_recognition({
        api_key: 'be00ed5499e83e00eef60effb8e9cd2540e7ad17',
        version: 'v3',
        version_date: '2016-12-15',
        url: 'https://gateway-a.watsonplatform.net/visual-recognition/api'
    });

    var params = {
        "images_file": fs.createReadStream('./public/uploads/'+image),
        "classifier_ids": [classifier_id],
        "threshold": 0.5
    };

    visual_recognition.classify(params, function(err, res) {
        if (err){
            console.log(err);
            cb(false);
        }else{
            if(res.images[0] && res.images[0].classifiers && res.images[0].classifiers.length > 0){
                cb(true);
            }else{
                cb(false)
            }
        }

    });

}

function confirmImage(req, res) {

    var id_image = req.params.id;

    UploadProtocolImage
        .findOne({
            _id: id_image
        })
        .then(function (data) {
            if(data){
                data.confirmed = true;
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
