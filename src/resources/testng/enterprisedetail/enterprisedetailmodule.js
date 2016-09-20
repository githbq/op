define(function (require, exports, module) {
    var math2 = require('common/widget/math/math');
    require('common/widget/select2/select2');
    require('./refs/directives');
    require('./refs/filters');
    var myApp = angular.module('formApp', ['angular.filter', 'ngMessages', 'common.directives', 'common.filters']);
    require('./refs/products-directive');
    require('./refs/product-services');//对应的远程服务
    var mainCtrlScope = null;//主$scope
    var mainData = null;//被调用时接收的参数 
    var validate = true;//参数的调用与否受validate控制
    var Page = MClass(M.Center).include({
        view: require('./template.html'),
        init: function (data) {
            var me = this;
            mainData = data;

            Page.__super__.init.apply(me, arguments);

            angular.bootstrap(me.$view, ['formApp']);
            me.mainCtrlScope = null;
        },
        //渲染
        render: function () {
            this.attrs['wrapper'].empty().append(this.$view);
        },
        hideTopBar: function () {
            var me = this;
            if (mainCtrlScope) {
                mainCtrlScope.$apply(function () {
                    mainCtrlScope.hideTopBar = true;
                });
            }
        },
        hideFootBtns: function () {
            var me = this;
            if (mainCtrlScope) {
                mainCtrlScope.$apply(function () {
                    mainCtrlScope.hideFootBtns = true;
                });
            }
        },
        nextStep: function () {
            mainCtrlScope.$apply(function () {
                mainCtrlScope.nextStep()
            });
        },
        prevStep: function () {
            mainCtrlScope.$apply(function () {
                mainCtrlScope.prevStep();
            });
        },
        goToStep: function (step) {//跳到指定的某一步
            debugger
            return mainCtrlScope.goToStep(step);
        }, getReturnData: function () {
            if (mainCtrlScope.mainForm.$valid || (mainCtrlScope.globalInfo.isAdd
                && (!mainCtrlScope.mainForm.stepForm3 || (mainCtrlScope.mainForm.stepForm3
                    && mainCtrlScope.mainForm.stepForm3.$valid))
                && (!mainCtrlScope.mainForm.stepForm2 || (mainCtrlScope.mainForm.stepForm2
                    && mainCtrlScope.mainForm.stepForm2.$valid))
            )) {
                if (mainCtrlScope.globalInfo.isAdd || mainCtrlScope.hideEnterprise) {
                    mainCtrlScope.entInfo = null;
                }
                return mainCtrlScope;
            } else {
                return false;
            }
        }
    });

    module.exports = Page;
    myApp.controller('form1Controller', ['$scope', '$timeout', function ($scope, $timeout) {
        var today = new Date();
        //today.setDate(today.getDate() + 1);//获取AddDayCount天后的日期 
        $scope.TOMORRAY = today.getTime();//明天
    }]);
    myApp.controller('form2Controller', ['$scope', 'productService', '$timeout', function ($scope, productService, $timeout) {

        $scope.getEnterpriseHistory($timeout);
        productService.getDiyOrderFormLogic($scope.globalInfo.enterpriseId || '', $scope.globalInfo.orderId, function (data) {
            $timeout(function () {
                $scope.productJson = angular.fromJson(data);
            }, 10);
        });
    }]);
    myApp.controller('form3Controller', ['$scope', 'productService', 'select2Query', function ($scope, productService, select2Query) {
        $scope.bankAjaxConfig = select2Query.getBankAjaxConfig();
        //付款信息
        $scope.payInfo.currPayList = $scope.payInfo.currPayList || [];
        $scope.$watch('payInfo.currPayList', function (newVal, oldVal) {
            console.log('payInfo.currPayList')
            var contractPrice = 0;
            _.each($scope.payInfo.currPayList, function (item) {
                if (item.purchaseAmount) {
                    contractPrice = math2.numAdd(contractPrice, item.purchaseAmount);
                }
            });
            $scope.payInfo.contractPrice = contractPrice || 0;
            $scope.payStatusChange($scope.payInfo.payStatus);
        });

        $scope.testResult3 = function (form) {

        };
        //付款状态改变事件
        $scope.payStatusChange = function (value) {
            _.each($scope.payInfo.currPayList, function (item, i) {
                item.currPayAmount = item.currPayAmount || 0;
            });
            $scope.payInfo.agentCurrPayAmount = $scope.payInfo.agentCurrPayAmount || 0;
            $scope.payInfo.currPayAmount = $scope.payInfo.currPayAmount || 0;
            switch (value.toString()) {
                case '1':
                    {
                        $scope.payInfo.agentCurrPayAmount = 0;
                        $scope.payInfo.currPayAmount = 0;
                        //全额
                        _.each($scope.payInfo.currPayList, function (item, i) {
                            if (item.toAgent) {
                                $scope.payInfo.agentCurrPayAmount = math2.numAdd($scope.payInfo.agentCurrPayAmount, item.purchaseAmount);
                            } else {
                                $scope.payInfo.currPayAmount = math2.numAdd($scope.payInfo.currPayAmount, item.purchaseAmount);
                            }
                            item.currPayAmount = 0;
                        });
                    }
                    ;
                    break;
                case '3':
                    {
                        //未付
                        $scope.payInfo.agentCurrPayAmount = 0;
                        $scope.payInfo.currPayAmount = 0;
                        _.each($scope.payInfo.currPayList, function (item, i) {
                            if (item.toAgent) {
                                $scope.payInfo.agentCurrPayAmount = math2.numAdd($scope.payInfo.agentCurrPayAmount, item.purchaseAmount);
                            }
                            item.currPayAmount = 0;
                        });

                    }
                    ;
                    break;
                case '2':
                    {
                        $scope.payInfo.agentCurrPayAmount = 0;
                        $scope.payInfo.currPayAmount = 0;
                        //分期
                        _.each($scope.payInfo.currPayList, function (item, i) {
                            if (item.toAgent) {
                                item.currPayAmount = 0;
                                $scope.payInfo.agentCurrPayAmount = math2.numAdd($scope.payInfo.agentCurrPayAmount, parseFloat(item.purchaseAmount));
                            } else {
                                $scope.payInfo.currPayAmount = math2.numAdd($scope.payInfo.currPayAmount, parseFloat(item.currPayAmount));
                            }
                        });
                    }
                    ;
                    break;
            }
        };
        $scope.payStatusChange($scope.payInfo.payStatus);
        //分期金额值改变事件
        $scope.currPayAmountChange = function (currPayList) {
            var agentPrice = 0;
            var companyPrice = 0;
            _.each(currPayList, function (item, i) {
                if (item.toAgent) {
                    agentPrice = math2.numAdd(agentPrice, parseFloat(item.purchaseAmount));
                } else {
                    companyPrice = math2.numAdd(companyPrice, parseFloat(item.currPayAmount));
                }
            });
            $scope.payInfo.agentCurrPayAmount = agentPrice;
            $scope.payInfo.currPayAmount = companyPrice;
        };
        $scope.getDataByContractNo = function () {
            var contractNo = $scope.payInfo.contractNo;
            if (!contractNo) {
                return;
            }
            productService.getDataByContractNo(contractNo, function (result) {
                if (!result) {//合同号不可用
                    util.showToast('合同号不可用,请重新输入');
                    $scope.$apply(function () {
                        $scope.payInfo.contractNo = '';
                    });
                }
            })
        };
        //receiptsAccountConfig
        //总部到款账户
        $scope.receiptsAccountConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '必须与实际打款的单位/个人名称一致',
            search: false,
            maximumInputLength: 50
        };
    }]);
    myApp.controller('mainController', ['$scope', '$timeout', 'select2Query', 'getEnumService', 'cascadeSelectService', 'productService', function ($scope, $timeout, select2Query, getEnumService, cascadeSelectService, productService) {
        $scope.productInfos = { data: [] };
        //获取企业历史详情
        $scope.getEnterpriseHistory = function (timeout) {
            $timeout = timeout || $timeout;
            if ($scope.globalInfo.submitType == 2 || mainData.isOpen) {//只有增购与续费才显示 现在开源也显示了
                productService.getOrderList($scope.globalInfo.enterpriseAccount || $scope.orderInfo.enterpriseAccount, function (data, valueData) {
                    $timeout(function () {
                        $scope.productInfos.data = data;
                        $scope.globalInfo.enterpriseName = $scope.globalInfo.enterpriseName || valueData.enterpriseName;
                        $scope.globalInfo.enterpriseAccount = $scope.globalInfo.enterpriseAccount || valueData.enterpriseAccount;
                        var train_Helper = _.findWhere($scope.productInfos.data, { code: 'Train_Helper' });
                        var train_Hepler_Capacity = _.findWhere($scope.productInfos.data, { code: 'Train_Hepler_Capacity' });
                        if (train_Helper && train_Hepler_Capacity) {
                            train_Helper.timeLongData = train_Hepler_Capacity;
                            train_Hepler_Capacity.hidden = true;
                        }
                    }, 10);
                });
            }
        }
        //全局性信息
        $scope.globalInfo = mainData || {};
        $scope.orderInfo = $scope.orderInfo || {};
        $scope.globalInfo = angular.extend($scope.globalInfo, $scope.globalInfo.data);

        $scope.globalInfo.submitType = mainData.isNew ? 1 : mainData.isAdd ? 2 : mainData.isRef ? 3 : 1;
        if (!mainData.isNew && !mainData.isAdd && !mainData.isRef) {
            mainData.isOpen = true;//开源状态
        }
        getInitData();//获取初始化数据 每次必调
        //企业详情信息
        var entInfo = $scope.entInfo = {};
        entInfo.area = '';//代理区域现在统一从接口中取
        if (!$scope.globalInfo.orderId) {
            productService.getAgentArea(function (str) {
                $timeout(function () {
                    entInfo.area = str;
                }, 10);
            });
        }

        entInfo.enterpriseName = $scope.globalInfo.enterpriseName;
        entInfo.enterpriseAccount = $scope.globalInfo.enterpriseAccount;
        //产品信息模块
        var productInfo = $scope.productInfo = {};
        //付款信息
        $scope.payInfo = { payStatus: 1 };
        //全局行为状态
        var action = $scope.action = { doing: false };
        $scope.goToStepTest = function (step) {
            $scope.step = step;
        };
        $scope.goToStep = function (step) {
            if (step && mainCtrlScope.showValid($scope.step) && step > 0 && step <= 3) {
                $scope.step = step;
                if (step == 3 && $scope.globalInfo.orderId && !$scope.globalInfo.readonly) {
                    productService.getCurrPayList($scope.getProductInfo(true), function (data) {
                        $timeout(function () {
                            debugger
                            $scope.payInfo.currPayList = $scope.payInfo.currPayList || [];
                            var tempCurrPayArray = angular.fromJson(data);
                            _.each(tempCurrPayArray, function (item, index) {
                                var findItem = _.findWhere($scope.payInfo.currPayList, { productId: item.productId, isMain: item.isMain });
                                if (findItem && findItem.purchaseAmount == item.purchaseAmount) {
                                    _.extend(item, findItem);
                                }
                            });
                            $scope.payInfo.currPayList = tempCurrPayArray;
                        }, 10);
                    });
                }
                return true;
            } else {
                return false;
            }
        };
        $scope.enterpriseReadonly = $scope.globalInfo.readonly;//企业详情信息 只读
        $scope.payInfoReadonly = $scope.globalInfo.readonly;//企业详情信息 只读
        $scope.productReadonly = $scope.globalInfo.readonly;//产品信息 只读
        $scope.editMode = false;
        $scope.orderFromData = [];//产品模块的数据来源用于编辑时
        productService.getOrderDetailByOrderId($scope.globalInfo.orderId, function (data) {
            $timeout(function () {
                if (!$scope.globalInfo.readonly) {//传过来的只读为false才同远程数据对接
                    $scope.enterpriseReadonly = !data.canEditEnterprise;
                    $scope.productReadonly = !data.canEditOrder;
                    $scope.payInfoReadonly = !data.canEditPaidInfo;
                }
                $scope.rejectFrom = data.rejectFrom;
                $scope.isCaiWu = data.rejectFrom == 2;
                if (data.odrDraftEnterprise) {
                    data.odrDraftEnterprise.area = entInfo.area || data.odrDraftEnterprise.area;
                }
                $scope.entInfo = data.odrDraftEnterprise || {};
                $scope.entInfo.contractEnterpriseName = data.contractEnterpriseName;
                if (!data.odrDraftEnterprise) {//如何后端没有返回
                    $scope.hideEnterprise = true;
                    $('.approval-title [data-index=1]').hide();
                    $('.approval-title [data-index]').removeClass('active').filter('[data-index=2]').addClass('active')
                    $scope.step = 2;
                }
                $scope.productInfo = data.odrDraftOrder || {};
                $scope.orderInfo = data.odrOrder || {};
                $scope.getEnterpriseHistory();//获取企业产品历史信息
                $scope.globalInfo.enterpriseId = $scope.productInfo && $scope.productInfo.enterpriseId;
                $scope.orderFromData = angular.fromJson(data.odrDraftOrder.content);//订单来源数据
                $scope.payInfo = data.odrDraftPaidInfo;
                if (data.odrDraftPaidInfo.currPayList) {
                    $scope.payInfo.currPayList = angular.fromJson(data.odrDraftPaidInfo.currPayList);
                }
                $scope.editMode = true;
                setSelect(false);
            }, 10)
        });
        //$timeout(function () {
        //    //模拟数据
        // entInfo = $scope.entInfo = {"province": "130000", "city": "130400", "county": "130404", "provinceDataValue": {"id": "130000", "text": "河北省"}, "cityDataValue": {"id": "130400", "text": "邯郸市"}, "countyDataValue": {"id": "130404", "text": "复兴区"}, "industryFirst": "100", "industrySecond": "112", "industryThird": "115", "industryFirstDataValue": "", "industrySecondDataValue": {"id": "112", "text": "计算机硬件"}, "industryThirdDataValue": {"id": "115", "text": "平板电脑"}, "groupType": "3", "groupTypeDataValue": {"text": "全公司", "id": "3"}, "saleTeamScale": "2", "saleTeamScaleDataValue": {"text": "1-5人", "id": "2"}, "isSaleTeam": "0", "isSaleTeamDataValue": {"id": "0", "text": "否"}, "companyScale": "4", "companyScaleDataValue": {"text": "11-20人", "id": "4"}, "isReferral": "0", "isReferralDataValue": {"id": "0", "text": "否"}, "isReference": "0", "isReferenceDataValue": {"id": "0", "text": "否"}, "keyContactName": "7676", "keyContactPhone": "18203459685", "contactName": "765576", "contactPhone": "18203459685", "address": "765576", "enterpriseName": "576576", "area": "576576", "enterpriseAccount": "348", "keyContactEmail": "765576@fds.gfh", "contactEmail": "756756@gbfc.df", "contactIm": "434343"};
        //    setSelect(false);
        //    //
        //}, 5000);
        mainCtrlScope = $scope;


        $scope.testBasicForm = function () {
        };

        //多功能下拉选框
        //$scope.entInfo.province = '110000';
        //$scope.entInfo.city = '140000';
        //$scope.entInfo.county = '110000';

        $scope.entInfo.provinceDataValue = '';
        $scope.entInfo.cityDataValue = '';
        $scope.entInfo.countyDataValue = '';

        $scope.provinceConfig = {
            //data: [{id: 1, text: '北京'}, {id: 2, text: '上海'}, {id: 3, text: '广东'}, {id: 4, text: '湖北'}],
            data: [],
            multiple: false,
            placeholder: '请选择'
            //, minimumResultsForSearch: Infinity//不显示搜索框
            ,
            search: false,
            maximumInputLength: 50
        };

        $scope.cityConfig = {
            //data: [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false,
            maximumInputLength: 50
        };
        $scope.countyConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false,
            maximumInputLength: 50
        };


        //end多功能下拉选框　


        //多功能下拉选框　行业
        //entInfo.industryFirst = '100';
        //entInfo.industrySecond = '150';
        //entInfo.industryThird = '100';

        entInfo.industryFirstDataValue = '';
        entInfo.industrySecondDataValue = '';
        entInfo.industryThirdDataValue = '';


        $scope.industryFirstConfig = {
            //data: [{id: 1, text: '行业A'}, {id: 2, text: '行业B'}, {id: 3, text: '行业C'}, {id: 4, text: '行业D'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false,
            maximumInputLength: 50
        };

        $scope.industrySecondConfig = {
            // data: [{id: '1-1', text: '行业A－1'}, {id: '2-1', text: '行业B－1'}, {id: '3-1', text: '行业C－1'}, {id: '4-1', text: '行业D－1'}, {id: '4-2', text: '行业D－2'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false,
            maximumInputLength: 50
        };
        $scope.industryThirdConfig = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false,
            maximumInputLength: 50
        };

        //end 多功能下拉选框　行业
        function setSelect(needWatch) {
            cascadeSelectService.cascadeSelect($scope, [
                { ngModelName: 'entInfo.province', config: $scope.provinceConfig },
                { ngModelName: 'entInfo.city', config: $scope.cityConfig },
                { ngModelName: 'entInfo.county', config: $scope.countyConfig }
            ], cascadeSelectService.createPullFunc({ url: '~/op/api/district/getListByParent', data: { name: 'parentValue' } }, function (data, item) {
                data.push({ id: item.value.toString(), text: item.name });
            }), needWatch);
            cascadeSelectService.cascadeSelect($scope, [
                { ngModelName: 'entInfo.industryFirst', config: $scope.industryFirstConfig },
                { ngModelName: 'entInfo.industrySecond', config: $scope.industrySecondConfig },
                { ngModelName: 'entInfo.industryThird', config: $scope.industryThirdConfig }
            ], needWatch);
        }

        setSelect();
        //公司规模
        $scope.companyScaleConfig = {
            data: [],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        getEnumService.load('CAMPANY_SCALE', function (list) {
            $timeout(function () {
                $scope.companyScaleConfig.data = list;
                $scope.companyScaleConfig.placeholder = '请选择';
            }, 10);
        });
        //使用对象类型
        $scope.groupTypeConfig = {
            data: [],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //使用对象类型
        getEnumService.load('GROUP_TYPE', function (list) {
            $timeout(function () {
                $scope.groupTypeConfig.data = list;
                $scope.groupTypeConfig.placeholder = '请选择';
            }, 10);
        });
        //是否有销售团队
        $scope.isSaleTeamConfig = {
            data: [{ id: '1', text: '是' }, { id: '0', text: '否' }],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //销售团队规模
        $scope.saleTeamScaleConfig = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        getEnumService.load('SALE_TEAM_SCALE', true, function (list) {
            $timeout(function () {
                $scope.saleTeamScaleConfig.data = list;
                $scope.saleTeamScaleConfig.placeholder = '请选择';
            }, 10);
        });
        //是否转介绍
        $scope.isReferralConfig = {
            data: [{ id: '1', text: '是' }, { id: '0', text: '否' }],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //是否标杆
        $scope.isReferenceConfig = {
            data: [{ id: '1', text: '是' }, { id: '0', text: '否' }],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        $scope.saving = false;
        $scope.step = 1;//步骤
        $scope.prevStep = function () {
            $scope.step--;
        };
        //显示错误
        $scope.showValid = function (step) {
            if ($scope.globalInfo.isAdd && step == 1) {//增购续费下 不走验证直接通过
                return true;
            }
            $timeout(function () {
                $scope['step_' + step + '_validate_error'] = true;
            }, 10);
            return $scope.mainForm['stepForm' + step].$valid;
        }
        $scope.nextStep = function (form) {
            if ($scope.step == 1 || $scope.step == 2 || $scope.step == 3) {//企业详情界面
                form.$commitViewValue();
                if (form.$invalid) {
                    $scope['step_' + $scope.step + '_validate_error'] = true;
                    return;
                }
            }
            switch ($scope.step) {
                case 1:
                    {//企业详情界面
                        submitStepEntInfo(function (result) {

                            if (result.success) {
                                $scope.$apply(function () {
                                    var data = result.value.model;
                                    $scope.entInfo.draftEnterpriseId = data.id;
                                    $scope.productInfo.draftEnterpriseId = data.id;
                                    $scope.payInfo.draftEnterpriseId = data.id;
                                    $scope.step++;
                                });
                            }
                        });
                        return;
                    }
                    ;
                    break;
                case 2:
                    {//产品信息
                        submitStepProductInfo(function (result) {

                            if (result.success) {
                                $scope.$apply(function () {
                                    var data = result.value.model;
                                    $scope.productInfo.draftOrderId = data.draftOrderId;
                                    $scope.payInfo.draftOrderId = data.draftOrderId;
                                    $scope.payInfo.currPayList = data.currPayList;
                                    $scope.step++;
                                });
                            }
                        });
                        return;
                    }
                    ;
                    break;
            }
            //$scope.step++;
        };
        //获取
        function getInitData() {
            productService.getInitData($scope.globalInfo.enterpriseId, $scope.globalInfo.submitType, function (data) {
                $timeout(function () {
                    $scope.productInfo.initData = data || [];
                }, 10);
            })
        }

        //企业草稿提交  需要enterpriseAccount
        function submitStepEntInfo(callback) {
            action.doing = true;
            debugger
            productService.submitStepEntInfo({
                odrDraftEnterprise: angular.toJson(angular.extend({ enterpriseAccount: $scope.globalInfo.enterpriseAccount, enterpriseFilingId: $scope.globalInfo.enterpriseFilingId, id: entInfo.draftEnterpriseId }, $scope.entInfo))
            }
            ).success(function (result) {
                callback(result);
            }).always(function () {
                $scope.$apply(function () {
                    action.doing = false;
                });
            });
        }

        $scope.getProductInfo = function (needToJson) {
            var dataResultCopy = angular.copy($scope.productInfo.dataResult);
            var newDataResult = [];
            _.each(dataResultCopy, function (item) {
                item.show && (newDataResult.push(item));
                var tempData = [];
                _.each(item.data, function (dataItem) {
                    dataItem.hidden !== true && (tempData.push(dataItem));
                    delete dataItem.hidden;
                });
                item.data = tempData;
            });
            var odrDraftOrder = {
                enterpriseId: $scope.globalInfo.enterpriseId,
                draftEnterpriseId: $scope.productInfo.draftEnterpriseId,
                id: $scope.productInfo.draftOrderId || $scope.productInfo.id,
                content: needToJson ? angular.toJson(newDataResult) : newDataResult,
                createTime: $scope.productInfo.createTime,
                creatorId: $scope.productInfo.creatorId,
                orderId: $scope.productInfo.orderId,
                status: $scope.productInfo.status,
                updateTime: $scope.productInfo.updateTime
            };
            var data = {
                odrDraftOrder: needToJson ? angular.toJson(odrDraftOrder) : odrDraftOrder
            };
            return data;
        };
        //订单草稿  需要 enterpriseId
        function submitStepProductInfo(callback) {
            action.doing = true;
            productService.submitStepProductInfo($scope.getProductInfo(true), callback).always(function () {
                $scope.$apply(function () {
                    action.doing = false;
                });
            });
        }

        //付款信息
        function submitStepPayInfo(callback) {
            action.doing = true;
            productService.submitStepPayInfo({ submitType: $scope.globalInfo.submitType, odrDraftPaidInfo: angular.toJson($scope.payInfo) }, callback).always(function () {
                $scope.$apply(function () {
                    action.doing = false;
                });
            });
        }

        //保存提交按钮
        $scope.save = function (form) {
            form.$commitViewValue();
            if (form.$invalid) {
                $scope['step_' + $scope.step + '_validate_error'] = true;
                return;
            }
            //付款信息
            submitStepPayInfo(function (result) {
                if (result.success) {
                    util.showTip('操作成功');
                    IBSS.tplEvent.trigger('order1.2Success');
                }
            });
        };
        //取消按钮
        $scope.close = function () {
            IBSS.tplEvent.trigger('order1.2Close');
        };
    }
    ])
        ;

})
    ;