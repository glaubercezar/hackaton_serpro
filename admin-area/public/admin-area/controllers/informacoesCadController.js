"use strict";

angular.module("yapp")
    .config(function($provide) {
        // configurações para o editor de texto
        $provide.decorator('taOptions', ['$delegate', function(taOptions) {
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote'],
                ['redo', 'undo', 'bold', 'italics', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'ul', 'ol', 'clear', 'html', 'insertImage','insertLink', 'insertVideo']
            ];
            return taOptions;
        }])
    })
    .controller("InformacoesCadCtrl", function($scope, requests, modal, loading, access, $state, $rootScope, textAngularManager) {

    $rootScope.showScreen = false;
    
    if(!access.testLogin()){
        return $state.go("login");
    }else{
        $rootScope.showScreen = true;
    }

    $scope.form = {};
    $scope.sendButtonDisabled = false;

    $scope.sendPageForm = function () {

        $scope.sendButtonDisabled = true;

        requests.setInfoPage($scope.form, function(data){
            $scope.sendButtonDisabled = false;
            modal.showModal("Informação cadastrada com sucesso.<p align='center'>ID: "+data._id);
            $state.go("informacoes");
        },function (data, status) {
            modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
            $scope.sendButtonDisabled = false;
        });

    }


});