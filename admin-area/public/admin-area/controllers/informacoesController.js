"use strict";

angular.module("yapp").controller("InformacoesCtrl", ["$scope", "requests", "modal", "loading", "access", "$location", "$rootScope", function($scope, requests, modal, loading, access, $state, $rootScope) {

    $rootScope.showScreen = false;

    if(!access.testLogin()){
        return $state.path("/login");
    }else{
        $rootScope.showScreen = true;
    }

    $scope.form = {};

    loading.showLoading();

    requests.getInfoPages(function (data) {
        $scope.infoPages = data;
        loading.hideLoading();
    },function () {
        modal.showModal("Erro ao recuperar dados");
    });


    $scope.removePage = function (id, index) {

        $scope.infoPages.splice(index, 1);   
        
        requests.delInfoPage(id, function(data){
            modal.showModal("Página apagada com sucesso.");
        },function (data, status) {
            modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
        });

    }


}]);