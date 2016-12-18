"use strict";

angular.module("yapp").controller("ProconsCtrl", ["$scope", "requests", "modal", "loading", "access", "$location", "$rootScope", function($scope, requests, modal, loading, access, $state, $rootScope) {

    $rootScope.showScreen = false;

    if(!access.testLogin()){
        return $state.path("/login");
    }else{
        $rootScope.showScreen = true;
    }

    $scope.form = {};

    loading.showLoading();

    requests.getProcons(function (data) {
        $scope.procons = data;
        loading.hideLoading();
    },function () {
        modal.showModal("Erro ao recuperar dados");
    });


    $scope.removeProcon = function (id, index) {

        $scope.procons.splice(index, 1);   
        
        requests.delProcon(id, function(data){
            modal.showModal("Item apagado com sucesso.");
        },function (data, status) {
            modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
        });

    }


}]);