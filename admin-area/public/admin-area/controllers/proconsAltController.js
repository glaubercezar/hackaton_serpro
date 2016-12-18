"use strict";

angular.module("yapp")
    .controller("ProconsAltCtrl", function($scope, requests, modal, loading, access, $state, $stateParams, $rootScope, textAngularManager) {
    
        $rootScope.showScreen = false;

        if(!access.testLogin()){
            return $state.go("login");
        }else{
            $rootScope.showScreen = true;
        }

        $scope.form = {};
        $scope.sendButtonDisabled = false;

        loading.showLoading();

        requests.getProcon($stateParams.id, function (data) {
            $scope.form = data;
            loading.hideLoading();
        },function () {

        });

        $scope.sendProconForm = function () {

            $scope.sendButtonDisabled = true;
            
            requests.altProcon($scope.form, $stateParams.id, function(){
                $scope.sendButtonDisabled = false;
                modal.showModal("Alteração realizada com sucesso.");
                $state.go("procons");
            },function (data, status) {
                modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
                $scope.sendButtonDisabled = false;
            });
        }


});