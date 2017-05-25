angular.module('Mobile.service')
.factory('config', function () {

    var url = "";
    if (ionic.Platform.isAndroid()) {
        //url = "/android_asset/www/";
        url = "../";
    }

    return { url: url };
});