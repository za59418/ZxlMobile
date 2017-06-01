angular.module('Mobile.directive', [])
.directive('dciSelect', function ($ionicPopup) {
    return {
        /* <dci-select>标签 */
        restrict: 'E',

        /* 模板 */
        template: '<span ng-click="showPopup()">{{text}}</span>',

        scope: {
            'model': '=',
            'click': '=',
            'change': '=',
            'readonly': '=',
            'ngRequired': '=',
            'value': '=',
            'callback': '=',
            'paramer': '='
        },
        //可用参数
        //1.model:数据，必须有两个字段,text,checked
        //2.click:点击事件，用于其他地方触发这个插件的点击事件
        //3.defaul-text:默认“请选择”
        //4.title:默认“选择框”，弹出框的标题
        //5.multi-select:默认false，意思为是否多选
        //6.is-required:默认false，是否必选
        link: function (scope, element, attrs) {
            //设置显示text默认值
            if (!attrs.defaultText) {
                attrs.defaultText = '请选择';
            }
            scope.text = currentText();
            //设置弹窗标题默认值
            var title = '选择框';
            if (attrs.title) {
                title = attrs.title;
            }
            //设置模板
            var template;
            if (attrs.multiSelect === "true") {
                template = '<ion-checkbox ng-repeat="item in temp" ng-model="item.checked" ng-checked="item.checked"> {{ item.text }} </ion-checkbox>';
            } else {
                template = '<ion-checkbox ng-change="cheChange(item)" ng-repeat="item in temp" ng-model="item.checked" ng-checked="item.checked"> {{ item.text }} </ion-checkbox>';
            }

            var isRequired = attrs.isRequired === "true";

            //以上为默认值设置
            //===========================================================

            scope.showPopup = function () {
                //使用temp是为了解决闪烁
                scope.temp = {};
                //把model的值赋值到temp中
                if (scope.model) {
                    for (var i = 0; i < scope.model.length; i++) {
                        scope.temp[i] = { text: '', checked: false }
                        scope.temp[i].text = scope.model[i].text;
                        scope.temp[i].checked = scope.model[i].checked;
                    }
                }

                $ionicPopup.show({
                    template: template,
                    title: title,
                    scope: scope,
                    buttons: [
                        {
                            text: '取消'
                        },
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function () {
                                //把temp的值赋值到model上
                                for (var i = 0; i < scope.model.length; i++) {
                                    scope.model[i].checked = scope.temp[i].checked;
                                }
                                scope.text = currentText();

                                if (scope.change) {
                                    scope.change();
                                }

                                if (scope.callback) {
                                    scope.callback(scope.paramer);
                                }
                            }
                        }
                    ]
                });
            }

            //如果属性有click，则赋值点击事件，原点击事件取消
            if (attrs.click) {
                scope.click = scope.showPopup;
                scope.showPopup = function () {

                }
            }

            //如果是只读，则不弹出窗
            if (scope.readonly) {
                scope.click = scope.showPopup = function () {

                }
            }

            scope.cheChange = function (item) {
                if ((isRequired === true || scope.ngRequired) && item.checked === false) {
                    item.checked = true;
                } else {
                    var b = item.checked;
                    for (var i = 0; i < scope.model.length; i++) {
                        scope.temp[i].checked = false;
                    }
                    item.checked = b;
                }
            }

            //监听model值变化
            scope.$watch("model", function () {
                scope.text = currentText();
            });

            //在外部修改了model，必须调用此update方法才能修改页面text值
            if (scope.model) {
                scope.model.update = function () {
                    scope.text = currentText();
                }
            }

            //返回当前选择项
            function currentText() {
                var text = "";
                if (scope.model) {
                    for (var i = 0; i < scope.model.length; i++) {
                        if (scope.model[i].checked) {
                            text += scope.model[i].text + ',';
                        }
                    }
                }

                if (attrs.value) {
                    if (text.length > 0)
                        scope.value = text.substring(0, text.length - 1);
                    else
                        scope.value = text;
                }

                if (text === '') {
                    if (!attrs.defaultText) {
                        return '请选择';
                    } else {
                        return attrs.defaultText;
                    }
                } else {
                    return text.substring(0, text.length - 1);
                }
            }
        }
    }
})