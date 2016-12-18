angular.module('cognitiveChatBox').factory('requests', ['$http', '$rootScope',function ($http, $rootScope) {

    return {
        register: register,
        login: login,
        doInteraction: doInteraction,
        endConversation: endConversation,
        status: status,
        configuration: configuration,
        clerk: clerk,
        confirmImage: confirmImage,
        endProtocol: endProtocol,
        gradeProtocol: gradeProtocol,
        boxContent: boxContent,
        getTextToSpeechToken: getTextToSpeechToken,
        getSpeechToTextToken: getSpeechToTextToken,
        generatePdf: generatePdf,
        getInteractions: getInteractions
        
    };

    function boxContent(id, onSuccess, onError) {
        var url = $rootScope.serverAddress + "admin/information/" + id;
        
        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function clerk(onSuccess, onError) {

        var url = $rootScope.serverAddress + "clerk/last/";

        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function configuration(onSuccess, onError) {

        var url = $rootScope.serverAddress + "admin/configuration/";

        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function doInteraction(data, onSuccess, onError) {

        var url = $rootScope.serverAddress + "conversation";

        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function register(data, onSuccess, onError) {

        var url = $rootScope.serverAddress + "users";

        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function login(data, onSuccess, onError) {

        var url = $rootScope.serverAddress + "login";

        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function endConversation(id) {
        var url = $rootScope.serverAddress + "conversation/end/" + id;
        $http.get(url);
    }

    function getSpeechToTextToken(onSuccess, onError) {
        var url = $rootScope.serverAddress + "conversation/speechToTextToken";
        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function getTextToSpeechToken(onSuccess, onError) {
        var url = $rootScope.serverAddress + "conversation/textToSpeechToken";
        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function confirmImage(id, onSuccess, onError) {
        var url = $rootScope.serverAddress + "uploadprotocolimage/confirm/" + id;
        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function endProtocol(data, onSuccess, onError) {
        var url = $rootScope.serverAddress + "protocol/end";
        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function generatePdf(data, onSuccess, onError) {
        var url = $rootScope.serverAddress + "pdf/generate";
        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function getInteractions(data, onSuccess, onError) {
        var url = $rootScope.serverAddress + "pdf/interactions";
        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function gradeProtocol(data, onSuccess, onError) {
        var url = $rootScope.serverAddress + "protocol/grade";
        $http.post(url, data)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }

    function status(id, onSuccess, onError) {
        var url = $rootScope.serverAddress + "conversation/status/" + id;
        $http.get(url)
            .success(function (data) {
                onSuccess(data);
            })
            .error(function (data, status) {
                onError(data, status);
            });
    }



}]);