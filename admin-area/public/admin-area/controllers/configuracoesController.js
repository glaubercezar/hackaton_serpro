"use strict";

angular.module("yapp").controller("ConfiguracoesCtrl", ["$scope", "requests", "modal", "loading", "access", "$location", "$rootScope", function($scope, requests, modal, loading, access, $state, $rootScope) {

    $rootScope.showScreen = false;

    if(!access.testLogin()){
        return $state.path("/login");
    }else{
        $rootScope.showScreen = true;
    }


    $scope.form               = {};
    $scope.sendButtonDisabled = false;


    loading.showLoading();


    requests.getAdminConfiguration(function (data) {
        $scope.form = data;
        loading.hideLoading();
    },function () {

    });


    $scope.sendConfigurationForm = function () {

        $scope.sendButtonDisabled = true;

        requests.setAdminConfiguration($scope.form, function(data){

            $scope.sendButtonDisabled = false;

            modal.showModal("Configuração enviada com sucesso.");

        },function (data, status) {

            modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
            $scope.sendButtonDisabled = false;
        });

    }


}]);