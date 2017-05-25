angular.module('Mobile.controller', [])

.controller('loginCtrl', function ($scope, $state, $ionicPopup) {
    $scope.Url = "images/user.png";
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
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.applications = applicationService.getAllApplications();
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });
})
.controller('settingCtrl', function ($scope, $state, userService) {
    $scope.onSwipeRight = function () {
        $state.go("tab.application");
    };
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.UserInfo = userService.getUserInfo();
    });
})
;