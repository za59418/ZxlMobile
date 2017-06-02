angular.module('Mobile.service')

.factory("formService", function ($http, $stateParams, $timeout,$sce, config) {
    return function($scope) {
        $scope.title = $stateParams.title;

        var userId = "UE000001";

        $scope.getFormList = function () {
            $http({
                url: config.url + "data/json/formList.json",
                method: 'get',
                params: {
                    userId: userId,
                    bimId: $scope.BimId,
                    actId: $scope.ActId,
                    nId: $scope.nid,
                    key: $scope.key
                }
            }).success(function (result) {
                if (result.ReturnCode === 0) {
                    if (result.Data.length === 0) {
                        $scope.isShowForm = true;
                        $scope.isShowTitle = false;
                        alert("此业务没有表单");
                        return;
                    }
                    $scope.isShowTitle = true;

                    for (var i = 0; i < result.Data.length; i++) {
                        result.Data[i].text = result.Data[i].ITEMNAME;
                        result.Data[i].checked = false;
                    }
                    result.Data[0].checked = true;
                    $scope.model = result.Data;

                    $scope.isShowForm = true;
                    $scope.selectChange = function () {
                        for (var j = 0; j < $scope.model.length; j++) {
                            if ($scope.model[j].checked) {
                                $scope.isShowForm = false;
                                getForm($scope.model[j]);
                                return;
                            }
                        }
                    }

                    $timeout(function () {
                        getForm(result.Data[0]);
                    }, 500);
                }
                else {
                    alert('获取表单列表失败！原因：' + result.Message);
                }
            }).error(function () {
                alert('获取表单列表失败！');
            });

        }

        $scope.getFormList();

        //获取表单
        var getForm = function (data) {
            if ($scope.Funs) {
                for (var j = 0; j < $scope.Funs.length; j++) {
                    $scope.Funs[j]();
                }
                $scope.Funs = null;
            }

            delete $scope.F;
            $scope.FormContent = "";

            //设置属性
            $scope.IId = data.IID;
            $scope.FormId = data.FORMID;

            //获取表单数据
            $http({
                url: config.url + "data/json/form.json",
                method: 'get',
                params: {
                    iid: $scope.IId,
                    bimId: $scope.BimId,
                    formId: $scope.FormId,
                    actId: $scope.ActId,
                    key: $scope.key,
                    type: data.READONLY ? '0' : '1', //（0是readonly 1是可编辑）
                    contextId: $scope.nid
                }
            }).success(function (result) {
                if (result.ReturnCode === 0) {
                    //设置表单参数
                    $scope.F = result.Data.F;
                    $scope.G = result.Data.G;
                    $scope.IsReadOnly = result.Data.IsReadOnly;
                    for (var i in result.Data.CodeImage) {
                        //initCodeImage(i, result.Data.CodeImage[i]);
                    }
                    $scope.CodeImage = result.Data.CodeImage;
                    //绑定表单html并渲染
                    $scope.FormContent = $sce.trustAsHtml(result.Data.Html);
                    $scope.isShowForm = true;
                } else
                    alert("获取表单视图失败！");
            }).error(function () {
                alert('获取表单视图失败！');
            });
            /*
            //定义表单事件
            form_handler($scope);
            */
            //保存表单
            $scope.formSave = function (callback) {
                $http({
                    url: config.url + "data/json/formSave.json",
                    method: 'get',
                    data: {
                        F: $scope.F,
                        G: $scope.G,
                        IID: $scope.IId,
                        BimId: $scope.BimId,
                        FormId: $scope.FormId,
                        ActId: $scope.ActId,
                        Key: $scope.key,
                        ContextId: $scope.nid
                    }
                }).success(function (result) {
                    if (result.ReturnCode === 0) {
                        if (callback) {
                            callback();
                        } else {
                            alert("保存成功");
                        }
                    } else {
                        alert("保存失败：" + result.Message);
                    }
                }).error(function () {
                    alert("保存失败：" + "无法连接服务器");
                });
            }

            $scope.submitForm = function (form) {
                if ($stateParams.isShowReceCaseButton == "true")//接件
                {
                    /*var confirmPopup = $ionicPopup.confirm({
                        title: '提示',
                        template: '你确定要接件么?',
                        cancelText: '取消',
                        okText: '确认',
                        okType: '',
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            userGetCase($stateParams.BimId, $stateParams.key);
                        }
                    });*/
                } else {
                    if (form.$valid && !$scope.IsReadOnly) {
                        $scope.formSave();
                    }
                }
            }
        }
    };
})