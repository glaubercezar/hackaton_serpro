"use strict";


angular.module("yapp").factory('requests', function($http) {



    return {
        getInfoPage          : getInfoPage,
        getInfoPages         : getInfoPages,
        setInfoPage          : setInfoPage,
        altInfoPage          : altInfoPage,
        delInfoPage          : delInfoPage,
        getProcon            : getProcon,
        getProcons           : getProcons,
        setProcon            : setProcon,
        altProcon            : altProcon,
        delProcon            : delProcon,
        setAdminConfiguration: setAdminConfiguration,
        getAdminConfiguration: getAdminConfiguration,
        getClerk             : getClerk,
        login                : login,
        getProtocols         : getProtocols,
        getProtocol          : getProtocol,
        changeProtocolStatus : changeProtocolStatus,
        downloadPdf          : downloadPdf
    };

    function delInfoPage(id, onSuccess, onError) {

        $http.delete(globalConfig.serverUrl + "/admin/information/"+id)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })

    }

    function setInfoPage(data, onSuccess, onError) {

        $http.post(globalConfig.serverUrl + "/admin/information",data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function altInfoPage(data, id, onSuccess, onError) {
        
        $http.put(globalConfig.serverUrl + "/admin/information/"+id,data)
            .success(function () {
                onSuccess();
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getInfoPages(onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/admin/information")
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getInfoPage(id, onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/admin/information/"+id)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })

    }

    function delProcon(id, onSuccess, onError) {

        $http.delete(globalConfig.serverUrl + "/admin/procon/"+id)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })

    }

    function setProcon(data, onSuccess, onError) {

        $http.post(globalConfig.serverUrl + "/admin/procon",data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function altProcon(data, id, onSuccess, onError) {
        
        $http.put(globalConfig.serverUrl + "/admin/procon/"+id,data)
            .success(function () {
                onSuccess();
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getProcons(onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/admin/procon")
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getProcon(id, onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/admin/procon/"+id)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })

    }

    function getAdminConfiguration(onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/admin/configuration")
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function setAdminConfiguration(data, onSuccess, onError) {

        $http.post(globalConfig.serverUrl + "/admin/configuration",data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getClerk(onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/clerk/last")
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function login(data, onSuccess, onError) {

        $http.post(globalConfig.serverUrl + "/admin/login",data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getProtocols(onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/protocol/protocols")
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function getProtocol(id, onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/protocol/protocol/"+id)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function changeProtocolStatus(data, id, onSuccess, onError) {
        
        $http.put(globalConfig.serverUrl + "/protocol/protocol/"+id,data)
            .success(function () {
                onSuccess();
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }

    function downloadPdf(onSuccess, onError) {

        $http.get(globalConfig.serverUrl + "/pdf/download")
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            })
    }


});


