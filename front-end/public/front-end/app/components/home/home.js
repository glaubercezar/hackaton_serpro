
angular.module("cognitiveChatBox").controller('homeController', ['$scope', '$cookies', 'localStorageService', '$rootScope', 'requests', '$compile', function($scope, $cookies, localStorageService, $rootScope, requests, $compile) {

    var currProtocol;
    
    $scope.stateConversation       = null;
    $scope.stateConversationMin    = null;
    $scope.stateAttachMenu         = false;
    $scope.dragOptions             = null;
    $scope.dateExpPut              = new Date();
    $scope.currentPage             = '';
    $scope.allScreenLoading        = false;
    $scope.allScreenAlert          = false;
    $scope.allScreenAlertText      = "";
    $scope.allScreenAlertState     = "";
    $scope.userText                = "";
    $scope.assistantTyping         = false;
    $scope.loadReady               = false;
    $scope.quantityLoad            = 2;
    $scope.loggedIn                = {};
    $scope.decideLogin             = {};
    $scope.doLogin                 = {};
    $scope.doRegister              = {};
    $scope.loggedIn.status         = false;
    $scope.decideLogin.status      = false;
    $scope.doLogin.status          = false;
    $scope.doRegister.status       = false;
    $scope.doRegister.form         = {};
    $scope.assistantImage          = "";
    $scope.sendImageButton         = false;
    $scope.canSendImage            = false;
    $scope.imageUploadImageUrl     = "";


    /**
     * Mocks
     */

    $rootScope.serverAddress       = "http://172.16.1.246:3012/api/";

    $scope.decideLogin.headerText  = "Bem vindo ao nosso site! Selecione uma opção.";
    $scope.doLogin.headerText      = "Informe seus dados para realizar o login.";
    $scope.doRegister.headerText   = "Informe seus dados para realizar o cadastro.";
    $scope.errorGeneric            = "Ocorreu um erro de conexão. Tente novamente.";
    $scope.doRegister.registered   = "Você foi cadastrado com sucesso.";
    $scope.doLogin.errorData       = "O dado informa172.16.1.246172.16.1.246172.16.1.246do é inválido";
    $scope.loggedIn.errConn        = "Ocorreu um erro de conexão, envie sua pergunta novamente.";
    $scope.loggedIn.notInterac     = "Você foi desconectado por falta de interação.";
    $scope.errorImage              = "Você enviou uma imagem incorreta, por gentileza, envie novamente.";
    /**
     * Fim Mocks
     */

    // Get the height without px of the window chat
    var chatHeight = $(".chatbot-frame-conversation").height();

    requests.configuration(function(data){

        $scope.cognitiveChatBoxName  = data.name;
        $scope.cognitiveChatBoxTitle = data.title;


        if(!localStorageService.get('workspaceid')){
            localStorageService.set('workspaceid', data.watsonWorkspaceId);
        }

        $scope.showChat();

    }, function (data, status) {
        console.log("O Chat não iniciou, pois há um erro de conexão com o back-end. Error: " + data + " HTTP-Code: " + status);
    });

    requests.clerk(function(data){

        var bytes;

        if(data.image.data.data){
            bytes               = new Uint8Array(data.image.data.data);
        }else{
            bytes               = new Uint8Array(data.image.data);
        }

        var minWeb              = document.getElementById('assistant-minimized-web');
        var minMob              = document.getElementById('assistant-minimized-mob');
        var presentation        = document.getElementById('assistant-apresentation');
        $scope.assistantImage   = "data:" + data.image.contentType + ";base64," + encodeImage(bytes);


        minWeb.src              = $scope.assistantImage;
        minMob.src              = $scope.assistantImage;
        presentation.src        = $scope.assistantImage;

        minWeb.style.visibility = "visible";
        minMob.style.visibility = "visible";
        presentation.style.visibility = "visible";

        $scope.showChat();

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

        $scope.showConversationHistory();

    }, function (data, status) {
        console.log("O Chat não iniciou, pois há um erro de conexão com o back-end. Error: " + data + " HTTP-Code: " + status);
    });

    $scope.openBoxContentModal = function(id) {
        
        $(".modal-chatbot-content .content").html("");
        
        contentHeight = (chatHeight - 80) + "px";
        $(".modal-chatbot-content .content").css({"height" : contentHeight});
        $(".modal-chatbot-content").fadeIn();
        
        requests.boxContent(id, function(data){
            $scope.boxContentTitle = data.title;
            $(".modal-chatbot-content .content").html(data.text);
        }, function (data, status) {
            console.log("Houve um erro ao requisitar informações. Error: " + data + " HTTP-Code: " + status);
        });
    }

    $scope.closeBoxContentModal = function(){
        $(".modal-chatbot-content").fadeOut();
    }

    $scope.dateExpPut.setHours($scope.dateExpPut.getHours() + 2);

    $rootScope.putOpts = {
        expires: $scope.dateExpPut
    };

    $scope.showChat = function(){

        $scope.quantityLoad--;

        if($scope.quantityLoad == 0){
            $scope.loadReady = true;
        }

    };


    if($cookies.get('chatState') == 'active'){
        $scope.stateConversation        = true;
        $scope.stateConversationMin     = false;
    }else{
        $scope.stateConversation        = false;
        $scope.stateConversationMin     = true;

        if(!$cookies.get('chatState')){
            $cookies.put('chatState', 'inactive', $rootScope.putOpts);
        }
    }

    $scope.dragOptions = {
        start: function(e) {
            //console.log("STARTING");
        },
        drag: function(e) {
            //console.log("DRAGGING");
        },
        stop: function(e) {
            //console.log("STOPPING");
        },
        container: 'body',
        elemToMove: '.chatbot-frame-conversation'
    };


    $scope.toggleAttachMenu = function() {
        $scope.stateAttachMenu = !$scope.stateAttachMenu;
    };

    $scope.hideAttachMenu = function(event, forceClose){
        if((event && event.target && event.target.className != 'icon-attach' && event.target.className != 'fa fa-paperclip') || forceClose){
            $scope.stateAttachMenu = false;
        }
    };

    $scope.closeConversation = function(){
        $scope.stateConversation        = false;
        $scope.stateConversationMin     = false;
        localStorageService.set('currentPage', 'showDecideLogin');

        $cookies.put('chatState', 'inactive', $rootScope.putOpts);
        $cookies.put('chatPosition', JSON.stringify({bottom: '5px', right: '5px'}), $rootScope.putOpts);

        $scope.logout();
    };


    $scope.minimizeConversation = function(){
        $scope.stateConversation        = false;
        $scope.stateConversationMin     = true;
        $cookies.put('chatState', 'minimized', $rootScope.putOpts);
    };

    $scope.maximizeConversation = function(){
        $scope.stateConversationMin     = false;
        $scope.stateConversation        = true;

        $cookies.put('chatState', 'active', $rootScope.putOpts);
    };

    $scope.showRegister = function(){
        $scope.loggedIn.status         = false;
        $scope.decideLogin.status      = false;
        $scope.doLogin.status          = false;
        $scope.doRegister.status       = true;
        localStorageService.set('currentPage', 'showRegister');
        $scope.hideAllScreenLoading();
    };

    $scope.showLogin = function(){
        $scope.loggedIn.status         = false;
        $scope.decideLogin.status      = false;
        $scope.doLogin.status          = true;
        $scope.doRegister.status       = false;
        localStorageService.set('currentPage', 'showLogin');
        $scope.hideAllScreenLoading();
    };

    $scope.showDecideLogin = function(){
        $scope.loggedIn.status         = false;
        $scope.decideLogin.status      = true;
        $scope.doLogin.status          = false;
        $scope.doRegister.status       = false;

        localStorageService.set('currentPage', 'showDecideLogin');
        $scope.hideAllScreenLoading();
    };

    $scope.showLoggedIn = function(){
        $scope.loggedIn.status         = true;
        $scope.decideLogin.status      = false;

        if(!localStorageService.get('userCognitive')){
            $scope.loggedIn.status     = false;
            $scope.decideLogin.status  = true;
        }

        $scope.doLogin.status          = false;
        $scope.doRegister.status       = false;
        localStorageService.set('currentPage', 'showLoggedIn');

        if(!localStorageService.get('chatConversations') || localStorageService.get('chatConversations').length == 0) {

            var data = {};
            var el = document.getElementById('chatbot-conversation-area');
            var angEl = angular.element(el);

            data.email          = localStorageService.get('userCognitive').email;
            data.text           = "";
            data.initial        = true;
            data.workspaceid    = localStorageService.get('workspaceid');

            requests.doInteraction(data, function (returnData) {

                var audio;
                if(returnData.output.audio){
                    audio = returnData.output.audio;
                }

                var returnText = returnData.output.text;

                localStorageService.set('userContext', returnData.context);

                if(returnData.lastProtocol){
                    localStorageService.set('chatLastProtocol', returnData.lastProtocol);
                }

                if(returnData.recovery_protocol){
                    localStorageService.set('recovery_protocol', returnData.recovery_protocol);
                }

                if(returnData.output.workspaceid){
                    localStorageService.set('workspaceid', returnData.output.workspaceid);
                }

                if (returnText[0].trim().length > 0) {

                    var el = $compile(generateBotInteraction(returnText, returnData.date, returnData.blockUserInput, returnData.canSendImage, returnData.imagesToSend, audio))( $scope );

                    angEl.append(el);

                    scrollDownConversation();

                    var history = [];

                    history.push({
                        agent: 'assistant',
                        data: returnData
                    });

                    localStorageService.set('chatConversations', history);
                }

                $scope.hideAllScreenLoading();


            }, function (data, status) {

                if (status == 404) {
                    $scope.showAllScreenAlert($scope.loggedIn.notInterac);
                    $scope.logout();
                    $scope.showDecideLogin();
                }

            });
        }
    };

    $scope.sendRegisterForm = function(){

        $scope.showAllScreenLoading();

        requests.register($scope.doRegister.form,function (data) {

            $scope.hideAllScreenLoading();
            $scope.allScreenAlertState = "showLoggedIn";
            $scope.doRegister.form     = {};
            $scope.processLogin(data);
            $scope.showAllScreenAlert($scope.doRegister.registered);

        }, function (data, status) {

            if(status == 400){
                document.getElementById("error-"+data.code).style.display = 'inline';
                document.getElementById("input-"+data.code).focus();
            }else{
                $scope.showAllScreenAlert($scope.errorGeneric);
            }

            $scope.hideAllScreenLoading();
        });
    };

    $scope.sendLoginForm = function(){

        $scope.showAllScreenLoading();

        requests.login($scope.doLogin.form,function (data) {

            $scope.hideAllScreenLoading();
            $scope.doLogin.form     = {};
            $scope.processLogin(data);
            $scope.showLoggedIn();


        }, function (data, status) {

            if(status == 400){
                document.getElementById("error-"+data.code).style.display = 'inline';
                document.getElementById("input-"+data.code).focus();
            }else{
                $scope.showAllScreenAlert($scope.doLogin.errorData);
            }

            $scope.hideAllScreenLoading();
        });
    };


    $scope.showAllScreenLoading = function(){
        $scope.allScreenLoading = true;
    };

    $scope.hideAllScreenLoading = function(){
        $scope.allScreenLoading = false;
    };

    $scope.showAllScreenAlert = function(text){
        $scope.allScreenAlert     = true;
        $scope.allScreenAlertText = text;
    };

    $scope.hideAllScreenAlert = function(){

        var st                     = $scope.allScreenAlertState;

        $scope.allScreenAlertText  = "";
        $scope.allScreenAlert      = false;
        $scope.allScreenAlertState = "";

        if(st!= ""){
            $scope[st]();
        }
    };

    $scope.removeFormErros = function(){
        var x = document.getElementsByClassName("span-error");
        for (var i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
    };


    $scope.processLogin = function(data){
        $scope.logout();
        localStorageService.set('userCognitive', data);
    };

    $scope.logout = function(){

        var el = document.getElementById('chatbot-conversation-area');
        var angEl = angular.element(el);

        if(localStorageService.get('userContext') && localStorageService.get('userContext').conversation_id){
            requests.endConversation(localStorageService.get('userContext').conversation_id);
        }

        localStorageService.set('userCognitive', null);
        localStorageService.set('userContext', null);
        localStorageService.set('chatConversations', null);
        localStorageService.set('chatConversationsUser', null);
        localStorageService.set('chatLastProtocol', null);
        localStorageService.set('chatProtocol', null);
        localStorageService.set('workspaceid', null);

        angEl.html("");

        $scope.assistantTyping = false;
    };


    $scope.sendInteraction = function(e, text, notShowUserInteraction){

        var wait_type_protocol =  localStorageService.get('wait_type_protocol');

        if($scope.userText.trim().length > 1 || (text && text.trim().length > 1) ) {

            var el                  = document.getElementById('chatbot-conversation-area');
            var angEl               = angular.element(el);

            var textSend;

            if(text && text.trim().length > 1){
                textSend = text;
            }else{
                textSend = $scope.userText;
            }

            var userTextTemplate    = generateUserInteraction(textSend);
            var data                = {};
            var context             = localStorageService.get('userContext');
            data.email              = localStorageService.get('userCognitive').email;
            data.text               = textSend;
            $scope.userText         = "";
            $scope.assistantTyping  = true;
            data.workspaceid        = localStorageService.get('workspaceid');

            $("#user-text").val("");

            if (context) {
                data.context = JSON.stringify(context);
            }

            if(!notShowUserInteraction){
                angEl.append(userTextTemplate);
            }

            scrollDownConversation();

            if (!localStorageService.get('chatConversations')) {
                localStorageService.set('chatConversations', []);
                localStorageService.set('chatConversationsUser', localStorageService.get('userCognitive'));
            }

            var history = localStorageService.get('chatConversations');

            if(!notShowUserInteraction){
                history.push({
                    agent: 'user',
                    data: data
                });
            }

            if(localStorageService.get('chatProtocol')){
                data.protocol = localStorageService.get('chatProtocol');
            }

            if(wait_type_protocol){
                data.wait_type_protocol = true;
                localStorageService.set('wait_type_protocol', false);
            }

            requests.doInteraction(data, function (returnData) {
                var returnText = returnData.output.text;

                if(returnData.output.workspaceid){
                    localStorageService.set('workspaceid', returnData.output.workspaceid);
                }

                if(returnData.protocol){
                    localStorageService.set('chatProtocol', returnData.protocol);
                    currProtocol = returnData.protocol.code;
                }

                if(returnData.recovery_protocol){
                    localStorageService.set('recovery_protocol', returnData.recovery_protocol);
                }

                if(returnData.lastProtocol){
                    localStorageService.set('chatLastProtocol', returnData.lastProtocol);
                }

                if(returnData.wish_algo){
                    setTimeout(function () {
                        $scope.sendInteraction(null, "wish_algo", true);
                    },3000);
                }

                if(returnData.wait_type_protocol){
                    localStorageService.set('wait_type_protocol', true);
                }

                localStorageService.set('userContext', returnData.context);

                if(returnText[0] && returnText[0].trim().length > 0) {

                    var audio;
                    if(returnData.output.audio){
                        audio = returnData.output.audio;
                    }

                    var el = $compile(generateBotInteraction(returnText, returnData.date, returnData.blockUserInput, returnData.canSendImage, returnData.imagesToSend, audio))( $scope );

                    angEl.append(el);

                    scrollDownConversation();

                    returnData.output.text = filterFrontMessage(returnData.output.text);

                    history.push({
                        agent: 'assistant',
                        data: returnData
                    });

                    localStorageService.set('chatConversations', history);
                }

                $scope.assistantTyping = false;

                if(returnData.callConversationStart){
                    $scope.sendInteraction(null,"doubt_duvida", true);
                }

                if(returnData.callReclamation){
                    $scope.sendInteraction(null,"reclamacao", true);
                }

            }, function (data, status) {

                if(status == 404){
                    $scope.showAllScreenAlert($scope.loggedIn.notInterac);
                    $scope.logout();
                    $scope.showDecideLogin();
                }else{
                    $scope.assistantTyping = false;
                    $scope.showAllScreenAlert($scope.loggedIn.errConn);
                }

            });
        }

    };

    $scope.showConversationHistory = function () {

        var chatConversations       = localStorageService.get('chatConversations');
        var el                      = document.getElementById('chatbot-conversation-area');
        var angEl                   = angular.element(el);
        var i                       =0;

        if(chatConversations){

            var len                 = chatConversations.length;

            for(;i<len;i++){

                if(chatConversations[i].agent == "user"){
                    angEl.append(generateUserInteraction(chatConversations[i].data.text));
                }else{
                    if(chatConversations[i].agent == "assistant"){

                        var ele = $compile(generateBotInteraction(chatConversations[i].data.output.text, chatConversations[i].data.date, chatConversations[i].data.blockUserInput, chatConversations[i].data.canSendImage, chatConversations[i].data.imagesToSend))( $scope );
                        angEl.append(ele);
                    }
                }
            }

            $("button.btn_conversation").attr("disabled","disabled").css("opacity","0.5").css("cursor","default");

            var found = $(".chatbot-chat-area .interaction:last .interaction-text .intern-text .btn_conversation_one_column button.btn_conversation").removeAttr("disabled").css("opacity","1").css("cursor","pointer");

            if(!found.length){
                $scope.enableUserInput();
            }

            $scope.hideAllScreenLoading();

            setTimeout(function () {
                scrollDownConversation(400);
            },100);
        }

    };

    $scope.clickButton = function (e) {

        var value   = e.target.value;
        var idframe = e.target.attributes.idframe.nodeValue;

        $("#" + idframe + " button").attr("disabled","disabled").css("opacity","0.5").css("cursor","default");

        $scope.enableUserInput();
        $scope.sendInteraction(e,value, true);
    };


    $scope.enableUserInput = function () {
        $scope.userTextDisabled     = false;
    };


    $scope.disableUserInput = function () {
        $scope.userTextDisabled     = true;
    };

    //Upload image
    currProtocol                   = localStorageService.get("chatProtocol");
    var imgIdSent                      = localStorageService.get('imagesToSend');
    var imgTitleSent                   = null;

    if(currProtocol){
        currProtocol = currProtocol.code;
    }else{
        currProtocol = null;
    }

    if(imgIdSent && imgIdSent.length > 0){
        imgIdSent       = imgIdSent[0].id;
        imgTitleSent    = imgIdSent[0].name;
    }else{
        imgIdSent = null;
    }

    $scope.acceptImageTypes            = 'image/*';
    $scope.disableImageSendButton      = false;

    $scope.onUploadImg = function (files) {
        $scope.disableImageSendButton = true;
        $scope.showAllScreenLoading();
    };


    $scope.onUploadImgError = function (response) {
        $scope.showAllScreenAlert($scope.errorImage);
    };

    $scope.onUploadImgSuccess = function (response) {

        var bytes = new Uint8Array(response.data.image.data.data);
        var image = document.getElementById('imageShow');
        image.src = "data:" + response.data.image.contentType + ";base64," + encodeImg(bytes);

        $scope.lastImageUploaded = response.data._id;

    };

    $scope.onUploadImgComplete = function (response) {
        $scope.disableImageSendButton = false;
        $scope.hideAllScreenLoading();
        $scope.sendImageButton        = true;
    };

    $scope.closeSendImageModal = function(){
        $(".modal-chatbot-sendimage").fadeOut();
    };

    $scope.openImageModal = function () {

        $scope.imageUploadImageUrl = $rootScope.serverAddress + '/uploadprotocolimage?protocol='+currProtocol+'&type='+imgIdSent + '&title='+imgTitleSent;

        if($scope.canSendImage){
            $(".modal-chatbot-sendimage").fadeIn();
        }
    };

    $scope.confirmImageUpload = function(){

        $scope.showAllScreenLoading();

        $scope.sendImageButton        = false;

        requests.confirmImage($scope.lastImageUploaded, function (data) {

            var el                  = document.getElementById('chatbot-conversation-area');
            var angEl               = angular.element(el);

            $scope.hideAllScreenLoading();

            var image = document.getElementById('imageShow');
            image.src = "";


            var tmp = localStorageService.get('imagesToSend');

            if(tmp.length > 0){

                tmp.shift();
                localStorageService.set('imagesToSend', tmp);
                $scope.modalSendImageData = tmp[0];

            }

            if(tmp.length == 0){

                $scope.canSendImage            = false;
                $scope.modalSendImageData      = [];
                localStorageService.set('imagesToSend', []);

                requests.endProtocol(localStorageService.get('chatProtocol'), function (protocol) {

                    $scope.sendInteraction(null, "jpg", true);

                    setTimeout(function () {
                        $scope.sendInteraction(null, "nota", true);
                    },4000);

                });

                var ls = localStorageService.get('chatProtocol');
                ls.conversation_id = localStorageService.get('userContext').conversation_id;

                requests.getInteractions(ls, function (res) {

                    var newdata = {
                        res,
                        protocol: ls
                    }
                    requests.generatePdf(newdata, function () {
                        //
                    });
                });


            }

            var bytes    = new Uint8Array(data.image.data.data);
            var type     = data.image.contentType;

            var textSend            = '<img src="data:'+type+';base64,'+encodeImg(bytes)+'">';
            var userTextTemplate    = generateUserInteraction(textSend);

            var dataConv            = {};
            var context             = localStorageService.get('userContext');
            dataConv.email          = localStorageService.get('userCognitive').email;
            dataConv.text           = textSend;

            if (context) {
                data.context = JSON.stringify(context);
            }

            angEl.append(userTextTemplate);

            scrollDownConversation();

            var history = localStorageService.get('chatConversations');

            history.push({
                agent: 'user',
                data: dataConv
            });

            localStorageService.set('chatConversations', history);

            $scope.closeSendImageModal();

        },function (data, status) {
            $scope.hideAllScreenLoading();
        });
    };

    function encodeImg (input) {
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
    //Fim upload image


    $scope.enableSendImage = function () {
      $scope.canSendImage = true;
    };

    $scope.disableSendImage = function () {
        $scope.canSendImage = false;
    };


    $scope.conversationGrade = function(grade){

        var obj = {};
        obj.grade = grade;
        obj.code  = localStorageService.get('chatProtocol').code;

        requests.gradeProtocol(obj,function (data) {

        },function (status, data) {

        });


        $scope.sendInteraction(null, "bye", true);
    };


    $scope.textToSpeech = function(text){

        requests.getTextToSpeechToken(function (data) {

            WatsonSpeech.TextToSpeech.synthesize({
                text: text,
                token: data,
                voice: "pt-BR_IsabelaVoice"
            });

        }, function (data, status) {
            console.log("Erro ao criar o token do Speech.");
        });

    };


    $scope.speechToText = function () {

        requests.getSpeechToTextToken(function (data) {

            var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
                token: data,
                continuous: false,
                outputElement: '#user-text',
                model: 'pt-BR_NarrowbandModel'
            });

            stream.on('error', function(err) {
                console.log(err);
            });

            stream.on('data', function(result) {

                if(result.final){
                    $scope.sendInteraction(null, $('#user-text').val(), false);
                }
            });


        }, function (data, status) {
            console.log("Erro ao criar o token do Speech.");
        });

    };

    init();

    function init(){

        if(!localStorageService.get('currentPage')){
            localStorageService.set('currentPage', 'showDecideLogin');
        }

        if(!localStorageService.get('userCognitive')){
            $scope.showDecideLogin();
        }

        if(localStorageService.get('currentPage') == 'showLoggedIn'){
            $scope.showAllScreenLoading();
        }

        //Show current page
        $scope[localStorageService.get('currentPage')]();

        if(!$cookies.get('chatPosition')){
            $cookies.put('chatPosition', JSON.stringify({bottom: '5px', right: '5px'}), $rootScope.putOpts);
        }

        var frame           = document.getElementsByClassName("chatbot-frame-conversation")[0];

        if(frame){
            var chatPosition    = JSON.parse($cookies.get('chatPosition'));
            for (prop in chatPosition){
                frame.style.setProperty(prop, chatPosition[prop],'');
            }
        }


        if(localStorageService.get('chatConversationsUser') && localStorageService.get('userCognitive') && (localStorageService.get('chatConversationsUser').email != localStorageService.get('userCognitive').email)){
            localStorageService.set('chatConversations', null);
        }

        setInterval(function(){

            if(localStorageService.get('currentPage') == 'showLoggedIn' && localStorageService.get('userContext') && localStorageService.get('userContext').conversation_id){

                requests.status(localStorageService.get('userContext').conversation_id,function (data) {
                    //continue
                }, function (data, status) {
                    if(status == 404){
                        $scope.showAllScreenAlert($scope.loggedIn.notInterac);
                        $scope.logout();
                        $scope.showDecideLogin();
                    }
                });

            }

        }, 40000);

    }

    function generateUserInteraction(text){

        var refDown = document.getElementById("refDown");

        if(refDown){
            refDown.remove();
        }
        return '<div class="user-interaction interaction"><div class="line-user"></div><div class="interaction-text">'+text+'<div class="moment">'+dataFormatada()+'</div></div><div class="clear"></div></div><div id="refDown"></div>';
    }

    function filterFrontMessage(text){

        var i       = 0;
        var code    = "";
        var ls      = localStorageService.get('chatProtocol');
        var ls2     = localStorageService.get('userCognitive');
        var ls3     = localStorageService.get('chatLastProtocol');
        var ls4     = localStorageService.get('recovery_protocol');
        var last    = "-";
        var lastSt  = "-";
        var lastR   = "-";
        var lastStR = "-";

        if(ls && ls.code){
            code = ls.code;
        }

        if(ls3){
            last   = ls3.code;
            lastSt = ls3.status;
        }

        if(ls4){
            lastR   = ls4.code;
            lastStR = ls4.status;
        }


        if (text instanceof Array) {

            for (i; i < text.length; i++) {
                text[i] = text[i].replace("((protocol))", "<span class='protocolo'>" + code + "</span>");
                text[i] = text[i].replace("((name))", "<span class='name'>" + ls2.firstName + "</span>");
                text[i] = text[i].replace("((last_protocol))", "<span class='protocolo'>" + last + "</span>");
                text[i] = text[i].replace("((last_protocol_status))", "<span class='status_protocolo'>" + lastSt + "</span>");
                text[i] = text[i].replace("((recovery_protocol_status))", "<span class='status_protocolo'>" + lastStR + "</span>");
            }

        }else{
            text = text.replace("((protocol))", code);
            text = text.replace("((name))", ls2.firstName);
            text = text.replace("((last_protocol))", "<span class='protocolo'>" + last + "</span>");
            text = text.replace("((last_protocol_status))", "<span class='status_protocolo'>" + lastSt + "</span>");
            text = text.replace("((recovery_protocol_status))", "<span class='status_protocolo'>" + lastStR + "</span>");
        }


        if(ls3 && ls3.interact && ls3.has){
            ls3.interact = false;
            localStorageService.set('chatLastProtocol', ls3);
            $scope.sendInteraction(null, "yes_protocolo", true);
        }else{

            if(ls3 && !ls3.has){
                $scope.sendInteraction(null, "no_protocolo", true);
            }
        }

        return text;

    }

    function generateBotInteraction(text, date, blockUserInput, canSendImage, imagesToSend, audio){

        var refDown = document.getElementById("refDown");
        var i       = 0;
        var result;
        var completeText = '';
        var regexHtml = /(<([^>]+)>)/ig;


        if(refDown){
            refDown.remove();
        }

        text = filterFrontMessage(text);

        if (text instanceof Array) {

            result = '';
            for (i; i < text.length; i++) {
                completeText += text[i];
                result       += '<div class="assistant-interaction interaction"><div class="assistante-image-frame"><img src="'+$scope.assistantImage+'"><div class="line-assistent"></div></div><div class="interaction-text"><div class="intern-text">'+text[i]+'<div class="moment">'+date+'</div></div></div><div class="clear"></div></div>';
            }

            if(audio){
                completeText = completeText.replace(regexHtml, "");
                $scope.textToSpeech(completeText);
            }
        }else{

            if(audio){
                text = text.replace(regexHtml, "");
                $scope.textToSpeech(text);
            }

            result = '<div class="assistant-interaction interaction"><div class="assistante-image-frame"><img src="'+$scope.assistantImage+'"><div class="line-assistent"></div></div><div class="interaction-text"><div class="intern-text">'+text+'<div class="moment">'+date+'</div></div></div><div class="clear"></div></div>';
        }

        result += '<div id="refDown"></div>';

        if(blockUserInput){
            $scope.disableUserInput();
        }

        if(canSendImage){
            $scope.enableSendImage();
        }else{
            $scope.disableSendImage();
        }

        if(imagesToSend){
            localStorageService.set('imagesToSend', imagesToSend);
            $scope.modalSendImageData = imagesToSend[0];
        }

        return result;

    }

}]);
