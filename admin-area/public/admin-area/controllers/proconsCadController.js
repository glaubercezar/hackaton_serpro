"use strict";

angular.module("yapp")
    .controller("ProconsCadCtrl", function($scope, requests, modal, loading, access, $state, $rootScope, textAngularManager) {

    $rootScope.showScreen = false;
    
    if(!access.testLogin()){
        return $state.go("login");
    }else{
        $rootScope.showScreen = true;
    }

    $scope.form = {};
    $scope.sendButtonDisabled = false;

    $scope.sendProconForm = function () {

        $scope.sendButtonDisabled = true;

        requests.setProcon($scope.form, function(data){
            $scope.sendButtonDisabled = false;
            modal.showModal("PROCON cadastrado com sucesso.");
            $state.go("procons");
        },function (data, status) {
            modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
            $scope.sendButtonDisabled = false;
        });

    }


});