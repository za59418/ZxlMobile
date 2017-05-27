angular.module('Mobile.controller', [])

.controller('loginCtrl', function ($scope, $state, $ionicPopup) {
    $scope.Url = "img/user.png";
    $scope.login = function (username, password) {
        $state.go('tab.job');
    };
})
.controller('jobCtrl', function ($scope, $state, $ionicPopup, jobService) {
    $scope.onSwipeLeft = function () {
        $state.go("tab.message");
    };
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.projects = jobService.getAllProjects();
    });
})
.controller('messageCtrl', function ($scope, $http, $state, $ionicPopup, config, messageService) {
    $scope.onSwipeLeft = function () {
        $state.go("tab.application");
    };
    $scope.onSwipeRight = function () {
        $state.go("tab.job");
    };
    $scope.$on("$ionicView.beforeEnter", function () {

        var allMsgs = null;
        $http({
            url: config.url + "data/json/messages.json",
            method: 'get',
        }).success(function (result) {
            allMsgs = result;
            $scope.type = "noReadMessage";
            $scope.messages = allMsgs.noReadMessages;
        }).error(function () {
            alert('获取未读消息数据失败！');
        });

        var activeItem;
        /**切换页签开始**/
        $scope.onCaseTabSelected = function (item) {
            if (activeItem) {
                activeItem.active = false;
                activeItem.activeclass = "";
            }
            $scope.List[0].active = false;
            $scope.List[0].activeclass = "";
            activeItem = item;
            activeItem.active = true;
            activeItem.activeclass = "active";

            if (item.tabName == 'noReadMessage') {
                $scope.type = "noReadMessage";
                $scope.messages = allMsgs.noReadMessages;

            } else if (item.tabName == 'readMessage') {
                $scope.type = "readMessage";
                $scope.messages = allMsgs.readMessages;
            }

            $scope.DataSourceListInstances = [];
            $scope.hasmore = true;
            $scope.page_no = 0;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        /**切换页签结束**/
        $scope.List = [
        {
            text: "未读消息",
            active: true,
            activeclass: "active",
            isShowTip: true,
            boderClass: 'borderright',
            searchText: '查询未读消息',
            tabName: "noReadMessage",
            query: ''
        },
        {
            text: "已读消息",
            active: false,
            activeclass: "",
            boderClass: 'borderleft',
            isShowTip: false,
            searchText: '查询已读消息',
            tabName: "readMessage",
            query: ''
        }];

    });
})
.controller('applicationCtrl', function ($scope, $state, $ionicPopup, applicationService) {
    $scope.onSwipeLeft = function () {
        $state.go("tab.setting");
    };
    $scope.onSwipeRight = function () {
        $state.go("tab.message");
    };

    $scope.mainGo = function (systemKey, systemName) {
        $state.go('nav.systemNavigations', { sysKey: systemKey, sysName: systemName });
    }

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.applications = applicationService.getAllApplications();
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });
})
.controller('settingCtrl', function ($scope, $state, $ionicLoading, $timeout, userService, userViewModel) {
    $scope.onSwipeRight = function () {
        $state.go("tab.application");
    };
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.UserInfo = userService.getUserInfo();
        userViewModel.UserInfo = $scope.UserInfo;
        $scope.ModifyUserInfo = function (subTitle, fileName) {
            $state.go('nav.modifyuserinfo', { subTitle: subTitle, fileName: fileName });
        };
        $scope.ModifyPassWord = function (subTitle) {
            $state.go('nav.modifypassword', { subTitle: subTitle });
        };
        $scope.LogOff = function () {
            $ionicLoading.show();
            $timeout(go2, 500);
        };
    });

    function go2() { //跳转
        $state.go('login');
        $ionicLoading.hide();
    }

})
.controller('modifyPasswordCtrl', function ($scope, $stateParams, $ionicHistory) {
    $scope.title = $stateParams.subTitle;
    $scope.PassModel = { OLDPWD: "", NEWPWD: "", NEWPWD2: "" };
    $scope.TipText = "两次输入的密码不一致！";
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
    $scope.savePassWord = function () {
        if ($scope.PassModel.NEWPWD2 == $scope.PassModel.NEWPWD) {
            //保存密码

            $ionicHistory.goBack();
        }
    };
})
.controller('modifyUserInfoCtrl', function ($scope, $stateParams, $ionicHistory, userViewModel) {
    $scope.title = $stateParams.subTitle;

    $scope.modifyValue = {};
    $scope.modifyValue.value = userViewModel.UserInfo[$stateParams.fileName];

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
    $scope.SaveUserInfoChange = function () {
        //保存信息
        userViewModel.UserInfo[$stateParams.fileName] = $scope.modifyValue.value;
        $ionicHistory.goBack();
    };
})
;