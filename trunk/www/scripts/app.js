angular.module('Mobile', ['ionic', 'Mobile.controller', 'Mobile.service', 'Mobile.router'])

.config(['$ionicConfigProvider', function ($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])
.run(function ($ionicPlatform, $http, config, jobService, applicationService, messageService, userService) {

    // if (localStorage.getItem("messageID") === null) {

    $http.get(config.url + "data/json/job.json").then(function (response) {
        jobService.init(response.data.projects);
    });
    $http.get(config.url + "data/json/applications.json").then(function (response) {
        applicationService.init(response.data.applications);
    });
    //$http.get(url + "data/json/messages.json").then(function (response) {
    //    messageService.init(response.data.messages);
    //});
    $http.get(config.url + "data/json/userinfo.json").then(function (response) {
        userService.init(response.data);
    });

    // }
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)


        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});