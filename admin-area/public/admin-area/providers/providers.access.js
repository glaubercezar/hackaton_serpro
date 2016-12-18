"use strict";


angular.module("yapp").factory('access', function($cookies) {


    var dateExpPut          = new Date();

    dateExpPut.setHours(dateExpPut.getHours() + 2);

    var putOpts = {
        expires: dateExpPut
    };


    return {
        setLogin: setLogin,
        setLogout: setLogout,
        testLogin: testLogin
    };


    function setLogout() {
        $cookies.remove('logged');
    }

    function setLogin() {
        $cookies.put('logged', true, putOpts);
    }

    function testLogin(){

        if($cookies.get('logged')){
            return true;
        }

        return false;
    }


});


