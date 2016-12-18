"use strict";

angular.module("yapp").controller("LoginCtrl", ["$scope", "$location","requests", "modal", "loading", "access", function($scope, $state, requests, modal, loading, access) {


    $scope.form                = {};
    $scope.disabledLoginButton = false;


    access.setLogout();

    $scope.logar = function() {

        $scope.disabledLoginButton = true;

        loading.showLoading();


        requests.login($scope.form, function(){

            loading.hideLoading();
            $scope.disabledLoginButton = false;

            access.setLogin();

            return $state.path("/dashboard");

        }, function () {

            loading.hideLoading();
            $scope.disabledLoginButton = false;

            modal.showModal("Os dados informados estão incorretos");
        });


    }

}]);
