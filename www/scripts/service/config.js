angular.module('Mobile.service')
.factory('config', function () {

    var url = "";
    if (ionic.Platform.isAndroid()) {
        //url = "/android_asset/www/";
        url = "../";
    }

    return {
        url: url,
        host: 'http://192.168.1.115/',
    };
});