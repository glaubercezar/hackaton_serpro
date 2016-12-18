"use strict";

angular.module("yapp").controller("ProtocolosCtrl", ["$scope", "requests", "modal", "loading", "access", "$location", "$rootScope", function($scope, requests, modal, loading, access, $state, $rootScope) {

    $rootScope.showScreen = false;

    if(!access.testLogin()){
        return $state.path("/login");
    }else{
        $rootScope.showScreen = true;
    }

    $scope.form = {};

    loading.showLoading();

    requests.getProtocols(function (data) {
        $scope.protocols = data;
        loading.hideLoading();
    },function () {
        modal.showModal("Erro ao recuperar dados");
    });


}]);