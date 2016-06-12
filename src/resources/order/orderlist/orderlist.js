define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TplEvent = IBSS.tplEvent;

    var page = require('common/widget/page/page');

    //实验ng模块
    var main = angular.module('main',[]);



    //---------------
    // 表格模块
    //
    //----------------
    main.directive('grid',function(){
		return{
			restrict: 'E', //E element
            controller: ['$scope', '$element', function( $scope,$element ){

                console.log('directive grid controller is working');
                console.log( $scope );
                $scope.event = function(){
                    $scope.$emit('msg','helloworld')
                };
            }],
            
            scope:{
                'data':'=',
            },

		    template:"<div>" +
                        "<table>"  +
                            "<thead>" +
                                "<tr>" +
                                    "<th ng-repeat='th in data.thead'>{{th}}</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>"+
                                "<tr ng-repeat='tr in data.tbody'>" +

                                    "<td ng-repeat='td in tr.data'>{{td}}</td>" +
                                	"<td>  <><>  </td>"
                                	
                                "</tr>" +
                            "</tbody>" +
                        "</table>" + 
                    "</div>",
			replace: true   //是否替换原始自定义标签
		}
    });

	//列表控制器
	main.controller('orderlist',['$scope', function($scope){
            
        console.log('controller test is working');

        $scope.pagesize = 20;
        $scope.pagenumber = 0;


        $scope.data = {};
        $scope.data.thead = ['订单号','合同号','企业名称','账号','订单类型','提单人','所属部门/代理商','特批单','当前审批节点','到款认领状态','订单状态','付费状态','提单日期','操作'];
        $scope.data.tbody = [
                        { 'data': [1,2,3,4,5] , 'action': [{'text':'收尾款'},{'text':'删除'},{'text':'查看'},{'text':'联合跟进人'},{'text':'退款'},{'text':'发票'}]},
                        { 'data': [2,3,4,5,6] , 'action': [{'text':'收尾款'},{'text':'删除'},{'text':'查看'},{'text':'联合跟进人'},{'text':'退款'},{'text':'收尾款'}]},
                        { 'data': [3,4,5,6,7] , 'action': [{'text':'收尾款'},{'text':'删除'},{'text':'查看'},{'text':'联合跟进人'},{'text':'退款'},{'text':'收尾款'}]}
                     ];

        //搜索订单列表
        $scope.search = function(){
        	//console.log('search');
        	//console.log($scope.s);
        	$scope.data.tbody.push([Math.random(),Math.random(),Math.random(),Math.random()])
        }

        $scope.$on('msg',function(evt){
            console.log('get msg');
            console.log(evt);
        })
    }]);



    exports.init = function() {
        var $el = exports.$el;

        console.log('hello world!');
        angular.bootstrap( $el.find('.m-orderlist')[0] , ['main'] ); 
    }
} );

