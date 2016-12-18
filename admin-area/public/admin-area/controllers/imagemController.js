"use strict";

angular.module("yapp").controller("ImagemCtrl", ["$scope", "requests", "loading", "access", "$location", "$rootScope", function($scope, requests, loading, access, $state, $rootScope) {

    $rootScope.showScreen = false;

    if(!access.testLogin()){
        return $state.path("/login");
    }else{
        $rootScope.showScreen = true;
    }

    $scope.acceptTypes            = 'image/*';
    $scope.clerkUploadUrl         = globalConfig.serverUrl + '/clerk';
    $scope.disableImageSendButton = false;

    loading.showLoading();

    requests.getClerk(function (data) {

        loading.hideLoading();

        var bytes = new Uint8Array(data.image.data.data);
        var image = document.getElementById('imageShow');
        image.src = "data:" + data.image.contentType + ";base64," + encode(bytes);


    }, function (data, status) {

    });

    $scope.onUpload = function (files) {
        $scope.disableImageSendButton = true;
        loading.showLoading();
    };


    $scope.onUploadError = function (response) {


    };

    $scope.onUploadSuccess = function (response) {
        var bytes = new Uint8Array(response.data.image.data.data);
        var image = document.getElementById('imageShow');
        image.src = "data:" + response.data.image.contentType + ";base64," + encode(bytes);

    };

    $scope.onUploadComplete = function (response) {
        $scope.disableImageSendButton = false;
        loading.hideLoading();
    };


    function encode (input) {
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


}]);
