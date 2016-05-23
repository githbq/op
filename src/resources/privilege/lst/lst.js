/**
  优惠码助手前端展现逻辑

 
   1.输入优惠方案名称，选择创建的截止时间，选择状态然后点击查询按钮就会从后端请求数据,然后填充到下面的列表中，方案包括‘优惠方案名称’和‘创建时间’，‘状态’，3个字段。

   2.当点击删除时给后端一个状态和当前的筛选条件，让他把指定的方案删除掉，然后从后端返回的方案中拿取数据，重新渲染列表

   3.当点击查看按钮时，弹出右画框，然后按照用户当初添加发方案时来展示，同时允许用户进行编辑允许提交。
 
   4.点击停用或者启用按钮时,给后端一个状态让后端把相应的方案状态改为索请求的值，然后返回给前端，渲染到列表中。

   5.当点击新建优惠方案时，会弹出右侧的浮框，，然后用户填写响应的项目。

   6.优惠方案名称为必填项，最多为20个字。

   7.优惠产品项目中，至少选择一个项目，不允许空着，优惠

   8.三个操作是在每一个优惠方案中都有的，当方案名称状态是启用时，后面的按钮状态为停用状态，当方案的状态是停用状态，后部的操作按钮是启用状态;
 */

window.upId = null; //用来保存方案id;

define(function(require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination'); //分页组件

    exports.init = function(param) {

        function List() {
            this.init.apply(this, arguments);
        };
        List.prototype = {

            init: function() {
                var me = this;
                me.bindSearch();
                me.initDateWidget();
                me.closePlan();
                me.newPlan();

                me.pagination = new Pagination({
                    wrapper: $('.p-list .list-pager'),
                    pageSize: 20,
                    totalSize: 0
                });

                me.pagination.render();
            },

            bindSearch: function() { //查询优惠方案列表
                var me = this;
                $(".search").click(function() {
                    util.api({
                        url: '~/op/api/coupon/packages/querypage',
                        type: 'POST',
                        data: me.getSearchData(),
                        beforeSend: function() {

                            $("#listContainer").html('<tr><td colspan="10"><p class="info">加载中...</p></td></tr>')
                        },
                        dataType: 'json',
                        success: function(resp) {

                            if (resp.success == true) {

                                $.each(resp.model.content, function(index, value) {
                                    value.createTime = me.transformTtoDate(value.createTime);
                                });


                                me.pagination.setTotalSize(resp.model.itemCount);

                                /**
                                 *@ desc 切换分页时发送当前的查询条件，以便后台知道是在同一个查询条件下进行的页数的切换。并且向后台发送当前点击的页数
                                 *
                                 */

                                me.pagination.onChange = function() {

                                    var pageIndex = me.pagination.attr['pageNumber'] + 1;


                                    /**
                                     * @ queryData type{Object}
                                     *
                                     */
                                    var queryData = me.getSearchData();
                                    queryData.pageIndex = pageIndex;

                                    util.api({
                                        url: '~/op/api/coupon/packages/querypage',
                                        type: 'POST',
                                        data: queryData,
                                        beforeSend: function() {

                                            $("#listContainer").html('<tr><td colspan="10"><p class="info">加载中...</p></td></tr>') //数据请求回来前的显示
                                        },
                                        dataType: 'json',
                                        success: function(resp) {

                                            if (resp.success == true) {

                                                me.reload(resp);
                                                me.delete();
                                                me.viewProject();
                                                me.deactive();

                                            } else {

                                                me.pagination.setPage(0, false);
                                                $("#listContainer").html("<tr><td colspan='10'><p class='info'>暂无数据</p></td></tr>"); //没有数据时的显示
                                            }

                                        },
                                        error: function() {

                                            $("#listContainer").html('<tr><td colspan="11"><p class="info">数据加载失败</p></td></tr>'); //数据加载失败时的显示
                                        }
                                    });
                                };
                                me.reload(resp); //渲染数据进列表
                                me.delete(); //绑订删除事件
                                me.viewProject(); //绑定查看事件
                                me.deactive(); //切换停用还是启用的状态
                            } else {

                                me.pagination.setPage(0, false);
                                $("#listContainer").html("<tr><td colspan='10'><p class='info'>暂无数据</p></td></tr>");

                            }
                        },
                        error: function() {
                            $("#listContainer").html('<tr><td colspan="11"><p class="info">数据加载失败</p></td></tr>');
                        }
                    });
                });
            },

            initDateWidget: function() { //  初始化日期插件

                $("#OpenSTime,#OpenETime").datetimepicker({ format: 'Y/m/d', timepicker: false }); //初始化日期插件
            },

            closePlan: function() { //点击优惠方案右上部的叉号时，关闭右划出框


                $('.header-close').click(function() {
                    $(".m-slider").animate({ "display": "none", "right": (-680) }, { "speed": 1000 });


                });
            },
            newPlan: function() { // 点击新建优惠方案时弹出右划出框

                var me = this;

                $(".new").click(function() {
                    $(".m-slider").animate({ "display": "block", "right": 0 }, { "speed": 1000 });

                    $('.slider-body .cancel').click(function() {

                        $(".m-slider").animate({ "display": "none", "right": (-680) }, { "speed": 1000 });
                    });

                    $(".slider-body input").removeAttr("checked");

                    $(".slider-body input,.slider-body textarea").val('');
                });


                $(".slider-body .submit").click(function() { //新建方案时不用传递方案id 参数

                    var judgeObject = { a: false, b: false, c: false }

                    me.inputingCheckout(judgeObject);

                    if (judgeObject.a == true && judgeObject.b == true && judgeObject.c == true) {

                        console.log(window.upId);
                        me.sendData(window.upId);
                        window.upId = null;
                    }
                });

            },

            getSearchData: function() { //收集方案列表的筛选信息
                var obj = {};
                obj.name = $(".name").val();
                obj.startAt = $("#OpenSTime").val() ? new Date($("#OpenSTime").val()).getTime() : "";
                obj.endAt = $("#OpenETime").val() ? new Date($("#OpenETime").val()).getTime() : "";
                obj.status = $(".status").val();
                obj.type = "";
                obj.pageSize = 20;
                obj.pageIndex = 1;
                return obj;
            },

            delete: function(e) { //点击方案的删除链接
                var me = this;
                $('.delete').click(function() {
                    var _this = $(this);
                    var id = $(this).attr('data-name');
                    var url = '~/op/api/coupon/packages/' + id + '/delete';
                    util.api({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        success: function(resp) {
                            if (resp.success == true) { //后台返回true 时,说明后台删除成功;前端要重新渲染页面
                                $(_this).parent().parent().css("display", 'none');
                            }
                        }
                    });
                });
            },
            viewProject: function() { //  查询优惠套餐详情
                var me = this;
                $(".view").click(function(e) {
                    var id = $(this).attr('data-name');
                    var url = '~/op/api/coupon/packages/' + id + '/info';
                    util.api({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        success: function(resp) { //传回指定的方案的各种指标然后弹出右拉框，然后填充到右拉框中。

                            if (resp.success == true) {

                                window.upId = resp.model.id;

                                $(".new").trigger("click"); //弹出右拉框
                                $('#chpPlanName').val(resp.model.name); //填充右拉框中的优惠方案名称
                                $("#content").val(resp.model.description); //填充优惠介绍

                                var array = [4, 5, 12, 15, 14, 7, 17, 18, 8]; //各种产品的id 按页面展现顺序

                                for (var i = 0; i < resp.model.items.length; i++) {

                                    for (var m = 0; m < array.length; m++) { //各种产品助手的匹配

                                        if (resp.model.items[i].productId == array[m]) {

                                            me.match(resp.model.items[i].productId, resp.model.items[i].quota);
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
            },
            deactive: function() { //更新产品启停状态
                var me = this;
                $(".disable").click(function(e) {

                    var status = null;

                    var statusStr = $(this).text();

                    status = (statusStr == "启用" ? 1 : 0);

                    var id = $(this).attr('data-name'); //禁用某个方案时，把需要禁用的方案的名称和筛选数据传给后台，然后拿到状态已经改变后的数据渲染，同时要把当前操作中的禁用和启用状态相互颠倒；

                    var url = '~/op/api/coupon/packages/' + id + '/' + 'status';
                    util.api({
                        url: url,
                        type: 'POST',
                        data: { status: status },
                        dataType: 'json',

                        success: function(resp) {

                            if (resp.success == true) {

                                $('.search').trigger('click');
                            }
                        }
                    });
                })
            },
            reload: function(data) {
                var template = $("#planList").html(); //方案列表模板的渲染 

                template = _.template(template);

                var finishList = template(data);

                $("#listContainer").html(finishList);
            },

            sendData: function(id) {

                var me = this;
                var obj = {};
                obj.name = $('#chpPlanName').val();
                obj.description = $("#content").val(); //保存或者新建方案时，提交给后台的方案信息：
                obj.type = "";
                obj.items = me.getProIfo();
                console.log(me.getProIfo());
                if (!id) {
                    obj.id = "";
                } else {
                    obj.id = id;
                }

                util.api({
                    url: '~/op/api/coupon/packages/save', //点击提交按钮时的更新或者新建方案
                    type: 'POST',
                    data: JSON.stringify(obj),
                    contentType: 'application/json;charset=UTF-8',
                    dataType: 'json',
                    success: function(resp) {
                        if (resp.success == true) {

                            $(".header-close").trigger('click');

                            alert("提交成功");

                            $(".search").trigger("click");
                        }
                    }
                });
            },

            //把后台传给的时间戳参数转换成日期格式填充到方案列表中
            transformTtoDate: function(str) {
                var data = parseInt(str);
                var date = new Date(data);
                Y = date.getFullYear() + '-';
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                D = date.getDate() + ' ';

                var targetDate = (Y + M + D);
                return targetDate;
            },


            //查看方案的详细信息时把后台的传给的产品信息展现到右拉框中
            match: function(id, quota) {
                var me = this;
                $("input[type=checkbox]").each(function(index, value) {
                    if ($(this).attr('data-id') == id) {
                        if (id == 8) {
                            if (quota == -1) {
                                $(this).prop('checked', 'checked').siblings('#noLimit').prop('checked', 'checked');

                            } else {

                                $(this).prop('checked', 'checked').siblings('input').val(quota);

                                $('#count').prop('checked', 'checked');
                            }

                        } else {

                            $(this).prop('checked', 'checked').siblings('input').val(quota);
                        }
                    }
                });
            },


            //更新方案信息时或者新建方案信息时获取产品信息列表;
            getProIfo: function() {
                var me = this;
                var dataArray = [];
                $(".slider-body input[type=checkbox]").each(function(index, value) {

                    if ($(this).is(':checked')) {

                        if ($(this).attr('data-id') != '8') {
                            var obj = {};
                            obj.productId = $(this).attr('data-id');
                            obj.productName = $(this).next('.cliName').html();
                            obj.quota = $(this).siblings('input').val();
                            dataArray.push(obj);
                        } else {
                            var obj = {};
                            obj.productId = "8";

                            if ($('#count').is(':checked')) {
                                obj.quota = $(this).siblings('input').val();

                            } else {
                                obj.quota = '-1';
                            }
                            dataArray.push(obj);
                        }
                    }
                });
                return dataArray;
            },
            inputingCheckout: function(obj) {
                var me = this;

                //方案名称输入验证

                var chpValue = $("#chpPlanName").val();

                if (chpValue == "") {
                    alert("请重新输入，方案不能为空");
                } else if (chpValue.length > 20) {


                    alert("方案名称最多20字")
                } else {

                    obj.a = true;
                }


                //优惠介绍输入验证

                var conValue = $("#content").val();

                if (conValue == "") {
                    alert("请重新输入，优惠介绍不能为空");
                } else if (conValue.length > 100) {

                    alert("优惠介绍最多100字");
                } else {

                    obj.b = true
                }

                //产品选择验证

                $("input[type=checkbox]").each(function(index, value) {

                    if ($(this).is(':checked')) {

                        if ($(this).attr('data-id') == '8') {

                            if ($("#count").is(':checked')) {
                                if ($("#count").next('input').val() && (isNaN($("#count").next('input').val()) == false)) {
                                    obj.c = true;

                                }

                            } else if ($("#noLimit").is(':checked')) {

                                obj.c = true;

                            }
                        } else {

                            if ($(this).siblings('input').val() && (isNaN($(this).siblings('input').val()) == false)) {

                                obj.c = true;

                            }

                        }

                    }
                });
            }
        };
        var list = new List(); //实例化List类;
    };
});
