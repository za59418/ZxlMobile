angular.module('Mobile.controller')

.controller('systemNavigationsCtrl', function ($scope, $state, $http, $ionicPopup, $stateParams, config) {
    $scope.loadShow = true;
    $scope.contentShow = false;

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;

        $http({
            url: config.url + "data/json/navigations.json",
            method: 'get',
        }).success(function (result) {


            if (result.ReturnCode == 0) {
                $scope.sysName = $stateParams.sysName;
                $scope.sysKey = $stateParams.sysKey;
                var nidKeys = "";
                var iconIndex = 1;
                for (var i = 0; i < result.Data.length; i++) {
                    result.Data[i].active = false;
                    result.Data[i].activeclass = "";

                    //第三级加上图标和颜色
                    for (var j = 0; j < result.Data[i].SubSystemViewNavigations.length; j++) {
                        for (var k = 0; k < result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations.length; k++) {
                            if (!result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations[k].IconClass || result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations[k].IconClass == '') {
                                result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations[k].IconClass = "icon-banjie-work";
                            }
                            result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations[k].IconColorIndex = iconIndex;
                            if (iconIndex + 1 > 7) {
                                iconIndex = 1;
                            }
                            else {
                                iconIndex = iconIndex + 1;
                            }
                            //显示提示
                            if (result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations[k].ShowTip == "1") {
                                nidKeys += result.Data[i].SubSystemViewNavigations[j].SubSystemViewNavigations[k].Nid + ',';
                            }
                        }
                    }
                }
                result.Data[0].active = true;
                result.Data[0].activeclass = "active";
                $scope.systemNavigationList = result.Data;
                $scope.activeSysNav = $scope.systemNavigationList[0];
                if (nidKeys && nidKeys != '') {
                    //----------------------------获取业务箱提示start-------------------------
                    $http({
                        url: config.url + "data/json/tipcount.json",
                        method: 'get',
                        params: {
                            accountKeys: nidKeys
                        }
                    }).success(function (result) {
                        if (result.ReturnCode == 0) {
                            $scope.TipCounts = result.Data;
                        }
                        else {
                            alert('获取业务箱提示失败！错误：' + result.Message);
                        }
                    }).error(function () {
                        alert('获取业务箱提示失败！');
                    });
                    //----------------------------获取业务箱提示end---------------------------
                }
            }
            else {
                alert('获取业务箱结构失败！错误：' + result.Message);
            }
        }).error(function () {
            alert('获取业务箱结构失败！');
        }).finally(function () {
            $scope.loadShow = false;
            $scope.contentShow = true;
        });
    
    });

    $scope.changeTabShow = function (sysNav) {
        if ($scope.activeSysNav) {
            $scope.activeSysNav.active = false;
            $scope.activeSysNav.activeclass = "";
        }
        $scope.activeSysNav = sysNav;
        sysNav.active = true;
        sysNav.activeclass = "active";
    }

    $scope.LinkToBusinessBox = function (nid, navName) {
        $state.go('nav.business.businessBox', { nid: nid, systemKey: $scope.sysKey, title: navName });
    }
})
.controller('businessBoxCtrl', function ($scope, $state, $http, $timeout, $ionicPopup, $stateParams, config) {
    $scope.loadShow = true;
    $scope.contentShow = false;
    $scope.title = $stateParams.title;

    $scope.Filters = [];
    $scope.Query = "";

    $scope.page_no = 0;
    $scope.page_size = 10;
    $scope.page_total = 0;
    $scope.hasmore = true;

    function GetBusinessData(pageSize, pageIndex, callback)//* state:1初始化，2刷新，3加载更多 */
    {
        $http({
            url: config.url + "data/json/projects.json",
            method: 'get',
            data: $scope.Filters,
            params: {
                nid: $stateParams.nid,
                pageIndex: pageIndex,
                pageSize: pageSize,
                query: $scope.Query,
                sysKey: $stateParams.systemKey
            }
        }).success(function (result, status, header, config) {
            if (result.ReturnCode == 0) {
                $scope.lastCondition = {};
                $scope.lastCondition.pageIndex = angular.copy(config.params.pageIndex);
                $scope.lastCondition.pageSize = angular.copy(config.params.pageSize);
                $scope.lastCondition.query = angular.copy(config.params.query);

                $scope.seachHolderText = result.Data.SeachHolderText;
                var buttons = result.Data.Buttons;

                $scope.ButtonsWidthRatio = (1 / (parseFloat(result.Data.Buttons.length)) * 100).toString() + "%";
                if (result.Data.Buttons.length > 4) {
                    $scope.DataSourceShortCutButtons = result.Data.Buttons.slice(0, 3);
                    $scope.DataSourceListButtons = result.Data.Buttons.slice(3);
                    $scope.hasMoreButtons = true;
                } else {
                    $scope.DataSourceShortCutButtons = result.Data.Buttons;
                    $scope.hasMoreButtons = false;

                }
                //send.DataSourceList = result.Data;
                if (callback) {
                    callback(result);
                }
                else {
                    alert('获取业务箱业务数据失败！');
                }
            }
        });
    }


    $scope.$on("$ionicView.enter", function (event, data) {

        $scope.DataSourceListInstances = [];
        $timeout(function () {
            $scope.hasmore = true;
            $scope.page_no = 0;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    });

    $scope.$on("$ionicView.loaded", function () {
        $timeout(function () {
            $http({
                url: config.url + "data/json/filters.json",
                method: 'get',
                params: {
                    nid: $stateParams.nid
                }
            }).success(function (result) {
                if (result.ReturnCode == 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        for (var j = 0; j < result.Data[i].ConditionViewSubItems.length; j++) {
                            result.Data[i].ConditionViewSubItems[j].text = result.Data[i].ConditionViewSubItems[j].SubFilterTitle;
                            result.Data[i].ConditionViewSubItems[j].checked = false;
                        }

                        if (result.Data[i].FilterType == "0") {
                            result.Data[i].multiselect = false;
                        } else {
                            result.Data[i].multiselect = true;
                        }
                    }
                    $scope.queryPanelModel = angular.copy(result.Data);
                    $scope.dciSelectModel = result.Data;
                }
                else {
                    alert('获取业务箱筛选面板定制失败！');
                }
            }).error(function () {
                alert('获取业务箱筛选面板定制失败！');
            });
        }, 400);
    });


    $scope.loadMore = function () {

        var old = $scope.DataSourceListInstances;
        if (old != undefined) {
            $scope.page_no += 1;
            var GetBusinessDataDelegate = function () {
                GetBusinessData($scope.page_size, $scope.page_no, function (result) {
                    $scope.DataSourceListInstances = $scope.DataSourceListInstances.concat(result.Data.Instances);
                    if (result.Data.Instances.length != 10)
                        $scope.hasmore = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            if ($scope.page_no == 1 && $scope.enterView) {
                $timeout(GetBusinessDataDelegate, 400);
                $scope.enterView = false;
            } else {
                GetBusinessDataDelegate();
            }
        }
    };
})