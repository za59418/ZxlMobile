angular.module('Mobile.router', [])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        views: {
            'body': {
                templateUrl: 'template/login.html',
                controller: "loginCtrl"
            }
        }
    })
    .state("tab", {
        url: "/tab",
        abstract: true,
        templateUrl: "template/main.html",
    })
    .state('tab.job', {
        url: '/job',
        views: {
            'tab-job': {
                templateUrl: 'template/tab-job.html',
                controller: "jobCtrl"
            }
        }
    })
    .state('tab.message', {
        url: '/message',
        views: {
            'tab-message': {
                templateUrl: 'template/tab-message.html',
                controller: "messageCtrl"
            }
        }
    })
    .state('tab.application', {
        url: '/application',
        views: {
            'tab-application': {
                templateUrl: 'template/tab-application.html',
                controller: "applicationCtrl"
            }
        }
    })
    .state('tab.setting', {
        url: '/setting',
        views: {
            'tab-setting': {
                templateUrl: 'template/tab-setting.html',
                controller: "settingCtrl"
            }
        }
    })
    ;

    //$urlRouterProvider.otherwise("/tab/message");

    $urlRouterProvider.otherwise("/login");
});