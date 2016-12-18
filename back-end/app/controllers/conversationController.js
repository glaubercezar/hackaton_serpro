'use strict';

// Load required packages
var moment              = require('moment-timezone');
var User 		        = require('../models/UserModel');
var Conversation 		= require('../models/ConversationModel');
var Interaction 		= require('../models/InteractionModel');
var Protocol      		= require('../models/ProtocolModel');


//Index
module.exports = {
    postConversation: postConversation,
    listConversations: listConversations,
    delConversation: delConversation,
    endConversation: endConversation,
    endConversationRequest: endConversationRequest,
    verifyStatus: verifyStatus,
    speechToTextToken: speechToTextToken,
    textToSpeechToken: textToSpeechToken
};


/***
 * Functions of the conversations
 */

var watson        = require('watson-developer-cloud');
var general 	  = require('../../config/general');
var environment   = require('../../config/environments/'+general.environment);


function speechToTextToken(req, res){

    var authorization = new watson.AuthorizationV1({
        username: '56278d42-821e-427e-807e-862a26c179bd',
        password: '4XTtMmtrAtNa',
        url: 'https://stream.watsonplatform.net/speech-to-text/api',
        version: 'v1'
    });

    authorization.getToken({url: authorization.target_url}, function(err, token) {
        if (err) {
            res.sendStatus(404);
        }else{
            res.status(200).json(token);
        }

    });
}

function textToSpeechToken(req, res){

    var authorization = new watson.AuthorizationV1({
        username: '2d9b435d-d137-4377-84ed-42b7d371f1a0',
        password: 'qs7n2eZ4Ro2o',
        url: 'https://stream.watsonplatform.net/text-to-speech/api',
        version: 'v1'
    });

    authorization.getToken({url: authorization.target_url}, function(err, token) {
        if (err) {
            res.sendStatus(404);
        }else{
            res.status(200).json(token);
        }

    });


}

function endConversation(conversation_id, automatically){

    Conversation.findOne({
        conversation_id : conversation_id
    })
        .then(function (conversation) {

            conversation.timeEnd = moment.tz("America/Sao_Paulo").format("H:mm:ss");
            if(automatically){
                conversation.automaticallyClosed = true;
            }

            conversation.save().then(function () {

            }).catch(function () {

            });
        });
}

function verifyStatus(req, res){

    var msg 	            = require('../../config/messages.json');
    var conversation_id     = req.params.id;
    var errors;

    req.checkParams("id", msg.invalid_conversation_id).notEmpty();

    errors = req.validationErrors();


    if(errors){
        res.status(400).json({code: errors[0].msg.code, message: errors[0].msg.msg});
    }else {

        Conversation.findOne({
            conversation_id : conversation_id,
            timeEnd: ""
        })
            .then(function (conversation) {

                if(conversation){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(404);
                }

            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });
    }

}

function endConversationRequest(req, res){

    var msg 	            = require('../../config/messages.json');
    var conversation_id     = req.params.id;
    var errors;

    req.checkParams("id", msg.invalid_conversation_id).notEmpty();

    errors = req.validationErrors();


    if(errors){
        res.status(400).json({code: errors[0].msg.code, message: errors[0].msg.msg});
    }else {

        Conversation.findOne({
            conversation_id : conversation_id,
            timeEnd: ""
        })
            .then(function (conversation) {

                if(conversation){
                    conversation.timeEnd = moment.tz("America/Sao_Paulo").format("H:mm:ss");
                    conversation.save(function(err){})
                        .then(function (conversations) {
                            res.sendStatus(200);
                        })
                        .catch(function (err) {
                            res.status(500).json({code: 500, message: err.message, fields: []});
                        });
                }else{
                    res.sendStatus(404);
                }

            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });
    }

}

function listConversations(req, res) {

    Conversation.find({})
        .then(function (conversations) {

            res.json(conversations);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}


function delConversation(req, res){

    /*
        REMOVE ALL
        Conversation.remove({},function(err,numberRemoved){
            console.log("inside remove call back" + numberRemoved);
        });
    */


    var msg 	            = require('../../config/messages.json');
    var conversation_id     = req.params.id;
    var user;
    var errors;
    var userConversations;
    var conversationInteratcions;

    req.checkParams("id", msg.invalid_conversation_id).notEmpty();

    errors = req.validationErrors();

    if(errors){
        res.status(400).json({code: errors[0].msg.code, message: errors[0].msg.msg});
    }else {

        Conversation.findOne({
            conversation_id: conversation_id
        })
            .then(function (conversation) {


                if(conversation){

                    user                        = conversation.user;
                    conversationInteratcions    = conversation.interactions;

                    var len = conversationInteratcions.length;

                    for(var k=0; k < len; k++){
                        Interaction.remove({_id: conversationInteratcions[k]},function(err,numberRemoved){});
                    }

                    Conversation.remove({conversation_id: conversation_id},function(err,numberRemoved){});

                    User.findOne({
                        _id: user
                    })
                        .then(function(foundUser){

                            userConversations = foundUser.conversations;

                            userConversations = userConversations.filter(function(item) {
                                return item !== conversation_id;
                            });

                            foundUser.conversations = userConversations;

                            foundUser.save()
                                .then(function(){
                                    res.sendStatus(200);
                                })
                                .catch(function (err) {
                                    res.status(500).json({code: 500, message: err.message, fields: []});
                                });

                        });

                }else{
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });
    }
}


function storeConversation(conversation, user, res, cb){

    var time           = moment.tz("America/Sao_Paulo").format("H:mm:ss");
    var currDate       = moment.tz("America/Sao_Paulo").format("YYYY-M-DD H:mm:ss");

    var interactionTmp = new Interaction({
        interactionType: 'text',
        userTextInteraction: conversation.input.text,
        botTextInteraction: conversation.output.text,
        intents: conversation.intents,
        entities: conversation.entities,
        date: currDate
    });


    interactionTmp.save()
        .then(function (interactionData) {

            //Store interation in the new or existing conversation
            Conversation.findOne({
                conversation_id : conversation.context.conversation_id
            })
                .then(function (data) {

                    if(data){

                        data.interactions.push(interactionData._id);

                        data.save(function(err){})
                            .then(function(){
                                cb(moment.tz("America/Sao_Paulo").format("DD/M/YYYY H:mm:ss") + "h");
                            })
                            .catch(function (err) {
                                res.status(500).json({code: 500, message: err.message, fields: []});
                            });

                    }else{
                        var conversationTmp = new Conversation({
                            conversation_id: conversation.context.conversation_id,
                            date: currDate,
                            timeInitial: time,
                            timeEnd: "",
                            automaticallyClosed: false,
                            interactions: [interactionData._id],
                            user: user._id
                        });

                        conversationTmp.save()
                            .then(function(cv){

                                user.conversations.push(cv.conversation_id);
                                user.save()
                                    .then(function(){
                                        cb(moment.tz("America/Sao_Paulo").format("DD/M/YYYY H:mm:ss") + "h");
                                    })
                                    .catch(function(err){
                                        res.status(500).json({code: 500, message: err.message, fields: []});
                                    });
                            })
                            .catch(function (err) {
                                res.status(500).json({code: 500, message: err.message, fields: []});
                            });
                    }
                })
                .catch(function (err) {
                    res.status(500).json({code: 500, message: err.message, fields: []});
                });

        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}


function processActions(conversation, user, res, cb){

    var helpers                 = require('../middlewares/helpers');
    var actions                 = conversation.output.actions;
    var funcActions             = {};
    var newConversation         = conversation;

    funcActions.start_protocol  = function (user, action, c) {

        newConversation.protocol           = {};
        newConversation.protocol.code      = helpers.generateString();
        newConversation.protocol.subject   = action["act_subject"];
        newConversation.protocol.user      = user._id;
        newConversation.protocol.status    = "Criado";

        c();
    };

    funcActions.set_category_protocol  = function (user, action, c) {
        newConversation.protocol.category = action["act_category"];
        c();
    };

    funcActions.wait_documents  = function (user, action, c) {
        newConversation.canSendImage       = true;
        newConversation.blockUserInput     = true;
        newConversation.imagesToSend       = action["documents"];
        c();
    };

    funcActions.get_last_interaction  = function (user, action, c) {

        Conversation.findOne({
            conversation_id : newConversation.context.conversation_id
        })
            .then(function (data) {

                var lastInteraction = data.interactions[data.interactions.length-1];

                Interaction.findOne({
                    _id: lastInteraction
                }).then(function (interactionFound){
                    newConversation.protocol[action["act_attr_name"]] = interactionFound.userTextInteraction;
                    c();
                });

            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });

    };

    funcActions.get_last_protocol  = function (user, action, c) {

        Protocol.find({
            user: user._id
        }).limit(1).sort({$natural:-1})
            .then(function (data) {
                if(data){
                    newConversation.lastProtocol                = data[0];
                    newConversation.lastProtocol.interact       = true;
                    newConversation.lastProtocol.has            = true;
                }else{
                    newConversation.lastProtocol.has            = {};
                    newConversation.lastProtocol.has            = false;
                }

                c();
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });


    };

    funcActions.call_wish_algo   = function (user, action, c) {
        newConversation.wish_algo = true;
        c();
    };

    funcActions.wait_type_protocol   = function (user, action, c) {
        newConversation.wait_type_protocol = true;
        c();
    };

    if(actions && Array.isArray(actions) && actions.length > 0){

        var i       = 0;
        var len     = actions.length;
        var count   = 0;

        for(;i<len;i++){
            if(funcActions[actions[i]["act_type"]]){
                funcActions[actions[i]["act_type"]](user, actions[i], function (val) {

                    count++;

                    if(count == len){
                        cb(newConversation);
                    }

                });
            }
        }
    }else{
        cb(conversation);
    }

}

function filterInputAction(body, text, cb) {


    if(body.wait_type_protocol){

        Protocol.find({
            code: text
        }).limit(1).sort({$natural:-1})
            .then(function (data) {

                if(data.length > 0){
                    text = "yes_protocolo";
                    cb(text, "recovery_protocol", data[0]);
                }else{
                    text = "no_protocolo";
                    cb(text, "recovery_protocol", false);
                }

            })
            .catch(function (err) {
                cb(text);
                res.status(500).json({code: 500, message: err.message, fields: []});
            });

    }else{
        cb(text);
    }

}

function postConversation(req, res) {

    var msg 	        = require('../../config/messages.json');
    var helpers         = require('../middlewares/helpers');

    var text            = req.body.text;
    var userEmail       = req.body.email;
    var initial         = req.body.initial;
    var protocol        = req.body.protocol;
    var workspaceid     = req.body.workspaceid;
    var context         = {};
    var errors;
    var hasContext      = false;
    var onlyErrText     = true;
    var lenErrors;
    var i;

    req.checkBody("text", msg.invalid_text).notEmpty().lenMin(1);
    req.checkBody("email", msg.invalid_email).notEmpty().isEmail();

    errors = req.validationErrors();

    lenErrors       = errors.length;

    for(i = 0; i < lenErrors; i++){
        if(errors[i].param != 'text'){
            onlyErrText = false;
        }
    }

    if(errors && !(onlyErrText && initial == true)){
        res.status(400).json({code: errors[0].msg.code, message: errors[0].msg.msg});
    }else{

        User.findOne({
            email : userEmail
        })
            .then(function (user) {

                if(user){

                    var conversation = watson.conversation({
                         username: environment.watsonUsername,
                         password: environment.watsonPassword,
                         url: environment.watsonUrl,
                         version: environment.watsonVersion,
                         version_date: environment.watsonVersionDate
                    });

                    if(req.body.context){

                        context = JSON.parse(req.body.context);

                        if(!context.conversation_id){
                            context = {};
                        }else{
                            hasContext = true;
                        }
                    }

                    var wkid = workspaceid;
                    if(!workspaceid){
                        wkid = environment.watsonWorkspaceId;
                    }

                    if(hasContext){
                        Conversation.findOne({
                            conversation_id : context.conversation_id,
                            timeEnd: ""
                        })
                            .then(function (cvt) {

                                if(!cvt){
                                    res.sendStatus(404);
                                }else{

                                    filterInputAction(req.body, text, function (newText, attr, attrvalue) {
                                        conversation.message({
                                            workspace_id: wkid,
                                            input: {'text': newText},
                                            context: context
                                        },  function(err, response) {
                                            if (err){
                                                res.status(500).json({code: 500, message: err.message, fields: []});
                                            }else{
                                                storeConversation(response, user, res, function(date){
                                                    response.date       = date;
                                                    response.protocol   = protocol;

                                                    if(text == 'doubt'){
                                                        response.callConversationStart   = true;
                                                    }

                                                    if(text == 'call_reclamation'){
                                                        response.callReclamation   = true;
                                                    }
                                                    processActions(response, user, res, function (response) {
                                                        response[attr] = attrvalue;
                                                        res.status(200).json(helpers.filterMsg(response));
                                                    });

                                                });

                                            }
                                        });

                                    });
                                }

                            })
                            .catch(function (err) {
                                res.status(500).json({code: 500, message: err.message, fields: []});
                            });
                    }else{

                        conversation.message({
                            workspace_id: wkid,
                            input: {'text': text},
                            context: context
                        },  function(err, response) {
                            if (err)
                                res.status(500).json({code: 500, message: err.message, fields: []});
                            else{
                                storeConversation(response, user, res, function(date){
                                    response.date    = date;
                                    res.status(200).json(helpers.filterMsg(response));

                                });

                            }
                        });
                    }


                }else{
                    res.status(400).json({code: msg.invalid_email.code, message: msg.invalid_email.msg});
                }
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });

    }

}