"use strict";


angular.module("yapp").factory('loading', function() {



    return {
        showLoading: showLoading,
        hideLoading: hideLoading
    };



    function showLoading(){

        var html = '<div class="alertLoading"><div class="intern"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div></div>';
        $("body").append(html);

    }

    function hideLoading(){
        internHideLoading();
    }


});


function internHideLoading(){

    $('.alertLoading').fadeOut();

    setTimeout(function(){
        $('.alertLoading').remove();
    },300);
}