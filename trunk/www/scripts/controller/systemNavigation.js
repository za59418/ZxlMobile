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

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

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

    $scope.businessContentGo = function (BimId, ActId, key, title, isShowReceCaseButton, receCaseButton) {
        $state.go('nav.business.businessContent', { BimId: BimId, ActId: ActId, key: key, nid: $stateParams.nid, title: title, moreButtons: $scope.DataSourceListButtons, shortCutButtons: $scope.DataSourceShortCutButtons, hasMoreButtons: $scope.hasMoreButtons, isShowReceCaseButton: isShowReceCaseButton, receCaseButton: receCaseButton });
    }

})
.controller('businessContentCtrl', function ($scope, $http, $stateParams, $ionicModal, $timeout, formService, config) {//, form, refresh) {
//.controller('businessContentCtrl', function ($scope, $http, config, $sce, $stateParams, $ionicModal, $ionicPopup, $ionicScrollDelegate, pdfReview, FlowAction, $ionicPopover, $timeout, $cordovaInAppBrowser, $cordovaKeyboard){//, form, refresh) {
    $scope.title = $stateParams.title;

    $scope.buttonText = "保存";
    $scope.isShowReceCaseButton = $stateParams.isShowReceCaseButton;
    $scope.buttonClass = "icon-save";
    $scope.isDisabledBtn = false;

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.shortCutButtons = $stateParams.shortCutButtons;
    $scope.DataSourceListButtons = $stateParams.moreButtons;
    $scope.hasMoreButtons = $stateParams.hasMoreButtons;
    $scope.BimId = $stateParams.BimId;
    $scope.ActId = $stateParams.ActId == undefined ? '' : $stateParams.ActId;
    $scope.key = $stateParams.key == undefined ? "" : $stateParams.key;
    $scope.nid = $stateParams.nid;


    /**切换页签开始**/
    $scope.onCaseTabSelected = function (tabName) {
        if (tabName == 'workFlow' && !$scope.workFlowImgUrl) {
            loadWorkFlowData();
        } else if (tabName == 'file' && !$scope.fileNavLoaded) {
            loadFileNavData();
        }
        else if (tabName == 'opinonList' && !$scope.OpinonList) {
            //loadOpinonListData();
        }
    };
    /**切换页签开始**/

    /**表单**/
    formService($scope);

    /**附件开始**/
    var loadFileNavData = function () {
        $scope.isShowFile = false;

        $scope.fileNavLoaded = true;
        //附件导航
        $scope.fileNav = [];
        $scope.allExt = { 'bmp': 1, 'doc': 1, 'docx': 1, 'dwg': 1, 'gif': 1, 'jar': 1, 'jpeg': 1, 'jpg': 1, 'other': 1, 'pdf': 1, 'png': 1, 'ppt': 1, 'pptx': 1, 'rar': 1, 'txt': 1, 'xls': 1, 'xlsx': 1, 'zip': 1 };
        $scope.imgExt = { 'bmp': 1, 'gif': 1, 'jpeg': 1, 'jpg': 1, 'png': 1 }

        
        //获取附加列表
        $http({
            url: config.url + "data/json/affix.json",
            method: 'get',
            params: {
                bimId: $scope.BimId,
                actId: $scope.ActId,
                nId: $scope.nid,
                key: $scope.key
            }
        }).success(function (result) {
            if (result && result.ReturnCode == 0) {
                if (result.Data.length <= 0) return;

                if (result.Data.length == 1) {
                    $scope.fileList = result.Data[0].ITEMS;
                    $scope.currentFileList = result.Data[0].ITEMS;
                    $scope.fileNav[0] = { title: '全部', index: -1 }
                } else {
                    $scope.fileList = result.Data;
                    $scope.currentFileList = result.Data;
                    $scope.fileNav[0] = { title: '全部', index: -1 };
                }
            }
            else {
                if (result) {
                    alert('附件树获取失败,原因：' + result.Message);
                } else {
                    alert('没有附件');
                }
            }
            $scope.isShowFile = true;
        }).error(function () {
            alert('附件树获取失败');
        });

        //附件列表点击
        $scope.fileClick = function (index) {
            //判断内容是否存在
            if (index < $scope.currentFileList.length) {
                //判断点击的节点是否为目录
                if ($scope.currentFileList[index].ITEMTYPE != '5') {
                    $scope.fileNav[$scope.fileNav.length] = { title: $scope.currentFileList[index].ITEMNAME, index: index };
                    $scope.currentFileList = $scope.currentFileList[index].ITEMS;
                    $ionicScrollDelegate.scrollTop();
                } else {
                    $scope.affixPreview($scope.currentFileList[index]);
                }
            }
        }

        //预览
        $scope.affixPreview = function (file) {
            $http({
                url: config.url + "data/json/affixView.json",
                method: 'get',
                params: {
                    bimId: $scope.BimId,
                    actId: $scope.ActId,
                    bicId: file.ITEMID
                }
            }).success(function (result) {
                if (result.ReturnCode == 0) {
                    var ext = result.Data.substr(result.Data.lastIndexOf('.') + 1).toLowerCase();
                    if ($scope.imgExt[ext]) {
                        var modalScope = {};
                        modalScope.closeModal = $scope.closeModal;
                        $scope.affixShowImg = config.host + result.Data;
                        modalScope.workFlowImgUrl = result.Data;
                        $scope.showModal('template/business/affix/imageGallery.html', modalScope);
                    } else if (ext == 'pdf') {
                        //var serverUrl = config.host + result.Data;
                        //var fileName = result.Data.substr(result.Data.lastIndexOf('/') + 1);
                        //pdfReview.show($scope, serverUrl, fileName);
                    } else {
                        alert('此类型文件不支持预览');
                    }
                }
            }).error(function () {
                alert('附件地址获取失败');
            })
        }

        //附件导航点击
        $scope.fileNavClick = function (index) {
            //删除导航后面的元素
            $scope.fileNav.splice(index + 1, $scope.fileNav.length - index - 1);
            //重新定位currentFileList
            var tmpList = $scope.fileList;
            for (var i = 1; i < $scope.fileNav.length; i++) {
                tmpList = tmpList[$scope.fileNav[i].index].ITEMS;
            }
            $scope.currentFileList = tmpList;
        }

        //根据文件类型获取图标
        $scope.getFileType = function (file) {
            if (!file) return "";
            var tmp = " icon ";
            //目录
            if (file.ITEMTYPE != 5) {
                tmp += file.STATE ? " icon-filemanagement01 " : " icon-filemanagement022 ";
            } else {//文件
                tmp += " custome ";
                var ext = file.ITEMNAME.substr(file.ITEMNAME.lastIndexOf('.') + 1).toLowerCase();
                if ($scope.allExt[ext]) {
                    tmp = tmp + " " + ext + " ";
                    if ($scope.imgExt[ext]) {
                        file.isImg = true;
                    }
                } else {
                    tmp = tmp + " other ";
                }
            }
            return tmp;
        }
    }
    /**附件结束**/

    /**加载流程数据开始**/
    var loadWorkFlowData = function () {
        $scope.isShowWorkFlow = false;

        $http({
            url: config.url + "data/json/flowChart.json",
            method: 'get',
            params: {
                bimId: $scope.BimId
            }
        }).success(function (result) {
            if (result.ReturnCode == 0) {
                $scope.workFlowImgUrl = config.webUrl + result.Data.CaseFlowImgUrl + "?" + Math.random();
                $scope.workFlowCaseActivitys = result.Data.CaseActivitys;
            }
            else {
                alert('生成流程图图片及获取流程信息失败,原因：' + result.Message);
            }
        }).error(function () {
            alert('生成流程图图片及获取流程信息失败！');
        }).finally(function () {
            $scope.isShowWorkFlow = true;
        })

        $scope.ShowBigWorkFlowImage = function () {
            $scope.ModalImgUrl = $scope.workFlowImgUrl;
            $scope.ModalBgColor = "modalBgColorBlack";
            $scope.showModal('templates/workFlowModal/imageModal.html');
        };

        $scope.ShowWorkFlowDetailDropDownNext = function (nextCaseAcitivitys) {
            $scope.topLevelData.push($scope.caseAcitivitys);
            $scope.caseAcitivitys = nextCaseAcitivitys;
        };
        $scope.ShowWorkFlowDetailDropUp = function () {
            $scope.caseAcitivitys = $scope.topLevelData.pop();
        };

        $scope.ShowWorkFlowDetailDropDown = function (caseAcitivitys) {
            $scope.caseAcitivitys = caseAcitivitys;
            $scope.topLevelData = [];
            $scope.showModal('templates/workFlowModal/detailModal.html');
        }
    };
    /**加载流程数据结束**/

    $scope.showModal = function (templateUrl) {
        if (!$scope.modal) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
    };
    $scope.closeModal = function () {
        if ($scope.modal)
            $scope.modal.hide();
    };
    $scope.$on('modal.hidden', function () {
        $timeout(function () {
            if ($scope.modal) {
                $scope.modal.remove();
                delete $scope.modal;
            }
        })
    });


})