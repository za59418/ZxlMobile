angular.module('Mobile.router', [])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        views: {
            'body': {
                templateUrl: 'template/login.html',
                controller: "loginCtrl"
            }
        },
        nativeTransitions: null
    })
    .state("tab", {
        url: "/tab",
        abstract: true,
        views: {
            'body': {
                templateUrl: "template/main.html"
            }
        },
        nativeTransitions: null
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
    .state('nav', {
        url: '/nav',
        abstract: true,
        views: {
            'body': {
                templateUrl: 'template/nav.html'
            }
        },
        nativeTransitions: null
    })
    .state('nav.modifypassword', {
        url: '/modifypassword',
        params: {
            subTitle: ''
        },
        views: {
            'content': {
                templateUrl: 'template/nav/modifyPassword.html',
                controller: 'modifyPasswordCtrl'
            }
        },
        nativeTransitions: null
    })
    .state('nav.modifyuserinfo', {
        url: '/modifyuserinfo',
        params: {
            subTitle: '',
            fileName: ''
        },
        views: {
            'content': {
                templateUrl: 'template/nav/modifyUserInfo.html',
                controller: 'modifyUserInfoCtrl'
            }
        },
        nativeTransitions: null
    })
    .state('nav.systemNavigations', {
        url: '/systemNavigations',
        params: {
            sysKey: 'YWSP',
            sysName: '业务审批系统'
        },
        views: {
            'content': {
                templateUrl: 'template/nav/systemNavigations.html',
                controller: 'systemNavigationsCtrl'
            }
        }
    })
    .state('nav.business', {
        url: '/business',
        abstract: true,
        views: {
            'content': {
                templateUrl: 'template/business.html'
            }
        }
    })

    .state('nav.business.businessBox', {
        url: '/businessBox?nid&systemKey&title',
        params: { isNeedData: false },
        views: {
            'content': {
                templateUrl: 'template/business/businessBox.html',
                controller: 'businessBoxCtrl'
            }
        }
    })
    ;
    //$urlRouterProvider.otherwise("/tab/message");

    $urlRouterProvider.otherwise("/login");


    //$ionicConfigProvider.backButton.previousTitleText(false)
    //    //.icon('ion-ios-arrow-back')
    //    .text('返回');
});