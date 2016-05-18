/**
 *  优惠码助手前端展现逻辑

 
   1.输入优惠方案名称，选择创建的截止时间，选择状态然后点击查询按钮就会从后端请求数据,然后填充到下面的列表中，方案包括‘优惠方案名称’和‘创建时间’，‘状态’，3个字段。

   2.当点击删除时给后端一个状态和当前的筛选条件，让他把指定的方案删除掉，然后从后端返回的方案中拿取数据，重新渲染列表


  3.当点击查看按钮时，弹出右画框，然后按照用户当初添加发方案时来展示，同时允许用户进行编辑允许提交。


  4.点击停用或者启用按钮时,给后端一个状态让后端把相应的方案状态改为索请求的值，然后返回给前端，渲染到列表中。

   5.当点击新建优惠方案时，会弹出右侧的浮框，，然后用户填写响应的项目。

   优惠方案名称为必填项，最多为20个字。

   优惠产品项目中，至少选择一个项目，不允许空着，优惠

  三个操作是在每一个优惠方案中都有的，当方案名称状态是启用时，后面的按钮状态为停用状态，当方案的状态是停用状态，后部的操作按钮是启用状态;
 */

define(function(require, exports, module) {

    exports.init = function(param) {

        $("#OpenSTime,#OpenETime").datetimepicker({ format: 'Y/m/d', timepicker: false }); //初始化日期插件

        $(".search").click(function() {
            console.log($('#OpenSTime').val()); //获取时间的方式

            var data={'tbody':[{ name: '名称1', date: '2016-05-01', status: '启用' },{ name: '名称1', date: '2016-05-01', status: '启用' }]} 

            var template = $("#list").html();

            template = _.template(template);


            var finishList = template(data);


            console.log($('.head').html() + finishList);

            $("#listContainer").html(finishList);
        });


        $('.header-close').click(function() {

            console.log("sssss");
            $(".m-slider").animate({ "display": "none", "right": (-680) }, { "speed": 1000 });
        });



        $(".new").click(function() {
            $(".m-slider").animate({ "display": "block", "right": 0 }, { "speed": 1000 });
        });

    }
});
