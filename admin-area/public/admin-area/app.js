"use strict";


angular.module("yapp",[
        'ui.router', 
        'ngAnimate', 
        'ngCookies', 
        'lr.upload', 
        'textAngular'
    ]);


angular.module("yapp").config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("/dashboard", "/dashboard/informacoes"), $urlRouterProvider.otherwise("/login"), $stateProvider.state("base", {
        "abstract": !0,
        url: "",
        templateUrl: "views/base.html"

    })
        .state("login", {
            url: "/login",
            parent: "base",
            templateUrl: "views/login.html",
            controller: "LoginCtrl"
        })

        .state("dashboard", {
            url: "/dashboard",
            parent: "base",
            templateUrl: "views/dashboard.html",
            controller: "DashboardCtrl"
        })

        .state("informacoes", {
            url: "/informacoes",
            parent: "dashboard",
            templateUrl: "views/dashboard/informacoes.html",
            controller: "InformacoesCtrl",
        })

        .state("informacoesCad", {
            url: "/informacoes/cadastrar",
            parent: "dashboard",
            templateUrl: "views/dashboard/informacoes_page_manage.html",
            controller: "InformacoesCadCtrl",
        })

        .state("informacoesEdit", {
            url: "/informacoes/alterar/:id",
            parent: "dashboard",
            templateUrl: "views/dashboard/informacoes_page_manage.html",
            controller: "InformacoesAltCtrl",
        })

        .state("protocolos", {
            url: "/protocolos",
            parent: "dashboard",
            templateUrl: "views/dashboard/protocolos.html",
            controller: "ProtocolosCtrl",
        })

        .state("protocoloView", {
            url: "/protocolos/visualizar/:id",
            parent: "dashboard",
            templateUrl: "views/dashboard/protocolos_view.html",
            controller: "ProtocolosViewCtrl",
        })

        .state("procons", {
            url: "/procons",
            parent: "dashboard",
            templateUrl: "views/dashboard/procons.html",
            controller: "ProconsCtrl",
        })

        .state("proconCad", {
            url: "/procons/cadastrar",
            parent: "dashboard",
            templateUrl: "views/dashboard/procons_manage.html",
            controller: "ProconsCadCtrl",
        })

        .state("proconEdit", {
            url: "/procons/alterar/:id",
            parent: "dashboard",
            templateUrl: "views/dashboard/procons_manage.html",
            controller: "ProconsAltCtrl",
        })

        .state("configuracoes", {
            url: "/configuracoes",
            parent: "dashboard",
            templateUrl: "views/dashboard/configuracoes.html",
            controller: "ConfiguracoesCtrl",
        })

        .state("imagem", {
            url: "/imagem",
            parent: "dashboard",
            templateUrl: "views/dashboard/imagem.html",
            controller: "ImagemCtrl"
        });
});