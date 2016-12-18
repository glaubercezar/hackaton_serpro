"use strict";

angular.module("yapp")
    .config(function($provide) {
        // configurações para o editor de texto
        $provide.decorator('taOptions', ['$delegate', function(taOptions) {
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote', 'clear', 'html'],
                ['redo', 'undo', 'bold', 'italics', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'ul', 'ol', 'insertImage','insertLink', 'insertVideo']
            ];
            return taOptions;
        }])
    })
    .controller("InformacoesAltCtrl", function($scope, requests, modal, loading, access, $state, $stateParams, $rootScope, textAngularManager) {
    
        $rootScope.showScreen = false;

        if(!access.testLogin()){
            return $state.go("login");
        }else{
            $rootScope.showScreen = true;
        }

        $scope.form = {};
        $scope.sendButtonDisabled = false;

        loading.showLoading();

        requests.getInfoPage($stateParams.id, function (data) {
            $scope.form = data;
            loading.hideLoading();
        },function () {

        });

        $scope.sendPageForm = function () {

            $scope.sendButtonDisabled = true;
            
            requests.altInfoPage($scope.form, $stateParams.id, function(){
                $scope.sendButtonDisabled = false;
                modal.showModal("Alteração realizada com sucesso.");
                $state.go("informacoes");
            },function (data, status) {
                modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
                $scope.sendButtonDisabled = false;
            });
        }


});