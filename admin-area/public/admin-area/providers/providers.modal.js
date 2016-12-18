"use strict";


angular.module("yapp").factory('modal', function($http) {



    return {
        showModal: showModal,
        hideModal: hideModal
    };



    function showModal(text){
        var html = '<div class="alertModal"><div class="intern">'+text+'<div class="closeModal" onclick="internHideModal();"><i class="glyphicon glyphicon-remove"></i></div></div></div>';
        $("body").append(html);

        $('.alertModal').click(function (event) {
            if(event.target.className != "intern"){
                internHideModal();
            }
        })
    }

    function hideModal(){
        internHideModal();
    }


});


function internHideModal(){

    $('.alertModal').fadeOut();

    setTimeout(function(){
        $('.alertModal').remove();
    },300);
}