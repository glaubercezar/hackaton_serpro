'use strict';

// Load required packages
var User 		= require('../models/UserModel');


//Index
module.exports = {
    postUsers: postUsers,
    delUser: delUser,
    listUsers: listUsers
};


/***
 * Functions of the users
 */


function postUsers(req, res) {


    var msg 	        = require('../../config/messages.json');
    var user            = new User();
    var fields          = req.body;
    var errors;

    user.firstName      = fields.firstName;
    user.lastName       = fields.lastName;
    user.email          = fields.email;
    user.cep            = fields.cep;
    user.conversations  = [];

    req.checkBody("firstName", msg.invalid_first_name).notEmpty().len(3,200);
    req.checkBody("lastName", msg.invalid_last_name).notEmpty().len(3,200);
    req.checkBody("email", msg.invalid_email).notEmpty().isEmail();
    req.checkBody("cep", msg.invalid_cep).isCep();

    errors = req.validationErrors();

    if(errors){
        res.status(400).json({code: errors[0].msg.code, message: errors[0].msg.msg});
    }else {

        User.findOne({
            email : fields.email
        })
            .then(function (data) {

                if(data){
                    res.status(200).json(data);
                }else{
                    user.save()
                        .then(function () {
                            res.status(200).json(user);
                        })
                        .catch(function (err) {
                            res.status(500).json({code: 500, message: err.message, fields: []});
                        });
                }
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });

    }

}

function listUsers(req, res) {

    User.find({})
        .then(function (data) {

            res.json(data);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}


function delUser(req, res) {

    /*
         REMOVE ALL
         User.remove({},function(err,numberRemoved){
            console.log("inside remove call back" + numberRemoved);
         });
     */

    var msg 	    = require('../../config/messages.json');
    var fields      = req.body;
    var errors;

    var email      = fields.email;

    req.checkBody("email", msg.invalid_email).notEmpty().isEmail();


    errors = req.validationErrors();

    if(errors){
        res.status(400).json({code: errors[0].msg.code, message: errors[0].msg.msg});
    }else {

        User.remove({email: email}, function(err, result) {
            res.sendStatus(200);
        });
    }
}