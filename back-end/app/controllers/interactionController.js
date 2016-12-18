'use strict';

// Load required packages
var Interaction 		= require('../models/InteractionModel');


//Index
module.exports = {
    getInteraction: getInteraction,
    listInteractions: listInteractions
};


/***
 * Functions of the interactions
 */

function listInteractions(req, res) {

    /*

     REMOVE ALL
     Interaction.remove({},function(err,numberRemoved){
        console.log("inside remove call back" + numberRemoved);
     });

    */


    Interaction.find({})
        .then(function (interactions) {
            res.json(interactions);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

function getInteraction(req, res) {

    Interaction.findOne({
        _id: req.params.id
    })
        .then(function (interaction) {
            res.json(interaction);
        })
        .catch(function (err) {
            res.status(500).json({code: 500, message: err.message, fields: []});
        });
}

