"use strict";

angular.module("yapp")
    .controller("ProtocolosViewCtrl", function($scope, requests, modal, loading, access, $state, $stateParams, $rootScope, textAngularManager) {
    
        $rootScope.showScreen = false;

        if(!access.testLogin()){
            return $state.go("login");
        }else{
            $rootScope.showScreen = true;
        }

        $scope.sendButtonDisabled = false;

        loading.showLoading();

        $scope.download = function(protocol){
            requests.downloadPdf(protocol, function (data) {
                console.log(data);
            });
        }

        

        requests.getProtocol($stateParams.id, function (data) {
            $scope.response = data.data;
   
            $scope.imgs = [];

            var el = document.getElementById('imgss');
            var angEl = angular.element(el);
            var x;


            for(var i = 0; i < data.data2.length; ++i){

                var bytes;
                if(data.data2[i].image.data.data){
                    bytes = new Uint8Array(data.data2[i].image.data.data);
                }else{
                    bytes = new Uint8Array(data.data2[i].image.data);
                }

                x = "data:"+data.data2[i].image.contentType+";base64," + encodeImage(bytes);
                angEl.append("<img src='"+x+"'>");


            }

            loading.hideLoading();
        });

        function encodeImage (input) {
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            while (i < input.length) {
                chr1 = input[i++];
                chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
                chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }

        $scope.sendStatusForm = function () {
            $scope.sendButtonDisabled = true;

            requests.changeProtocolStatus($scope.response, $stateParams.id,  function(data){
                $scope.sendButtonDisabled = false;
                modal.showModal("Status alterado com sucesso.");
            },function (data, status) {
                modal.showModal("Ocorreu um erro de conexão, tente mais tarde.");
                $scope.sendButtonDisabled = false;
            });

        }


});