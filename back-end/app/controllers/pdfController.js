'use strict';

var Admin 		        = require('../models/AdminModel');
var Conversation 		= require('../models/ConversationModel');
var Interaction 		= require('../models/InteractionModel');
var User 		        = require('../models/UserModel');

//Index
module.exports = {
    generate               : generate,
    getInteractions        : getInteractions,
    downloadPdf            : downloadPdf
};

/***
 * Functions of the information pages
 */

function downloadPdf(req, res) {
        var path = require('path');
        var mime = require('mime');

        var file = './public/pdf/'+protocol+'.pdf';

        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
}

function getInteractions(req, res) {

    var conversationInteratcions;
    var conversations = [];

    Conversation.findOne({
            conversation_id : req.body.conversation_id
    })
        .then(function (conversation) {

                conversationInteratcions = conversation.interactions;
                var len = conversationInteratcions.length;
                console.log('quantidade= '+len);
                var k =0;               

                for(var k=0; k < len; k++){

                    Interaction.findOne({
                        _id: conversationInteratcions[k]
                    })
                        .then(function (data2) {
                            console.log('separa ------------------');
                            conversations.push(data2);
                            if(k==len){
                                console.log(conversations);
                                res.status(200).json(conversations);
                            }

                        });
                }
                
                //res.status(200).json(conversations);
            })
            .catch(function (err) {
                res.status(500).json({code: 500, message: err.message, fields: []});
            });

}


function generate(req, res) {
    console.log(req.body.res.length);
    console.log(req.body);
    var html = "";
    var msg = "";
    var dcolchetes      = /\[\[([^\]\]]+)\]\]/g;
    var dparenteses     = /\(\(([^\)\)]+)\)\)/g;

    for(var i=0; i < req.body.res.length; i++){
        msg = req.body.res[i].botTextInteraction.replace(dcolchetes, '');
        html += msg;
    }

    var fs      = require('fs');
    var pdf     = require('html-pdf');

    var options = { format: 'Letter' };

    pdf.create(html, options).toFile('./public/pdf/'+req.body.protocol.code+'.pdf', function(err2, res2) {

        if (err2) {
            res.status(500).json({});
        }else{
            sendEmail(req.body.protocol);
            res.status(200).json({});
        }

    });

}

function sendEmail(data) {
        
        console.log(data);

        var nodemailer      = require('nodemailer');
        var smtpTransport   = require('nodemailer-smtp-transport');

        User
            .findOne({
                _id : data.user
            })
                .then(function (user) {
                    //console.log(user);

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
                                subject: 'RoboCon - Resumo do atendimento',
                                attachments: [
                                    {filename: 'resumo_chat.pdf', path: './public/pdf/'+data.code+'.pdf'},
                                    {filename: 'modelo_peticao.docx', path: './public/peticao.docx'}
                                ],
                                html: "<p>Olá "+user.firstName+", a sua reclamação foi registrada com sucesso.<p>Segue em anexo o histórico da conversa e o modelo de petição, caso queira entrar na justiça.<p>Você poderá acompanhar pelo seu protocolo.<p>Nº de protocolo: <b>"+data.code+"</b>"
                            });
                        });

                });

}