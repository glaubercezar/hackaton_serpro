'use strict';

// Load required packages
var User 		= require('../models/UserModel');


//Index
module.exports = {
    login: login
};


/***
 * Functions of the login
 */


function login(req, res) {

    var msg 	    = require('../../config/messages.json');
    var user        = new User();
    var fields      = req.body;
    var errors;

    user.email      = fields.email;

    req.checkBody("email", msg.invalid_email).notEmpty().isEmail();

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
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });

    }

}