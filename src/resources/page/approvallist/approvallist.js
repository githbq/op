/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){

	
	//var OpenApprovalList = require('module/openapprovallist/openapprovallist');
	var DetailApproval = require('../../order/detailapproval/detailapproval');
	var DetailPayment = require('../../order/detailpayment/detailpayment');
	var BackMoney = require('../../order/backmoney/backmoney');                       //回款
	
	var page = require('common/widget/page/page');  //ng分页组件

	var main = angular.module('list',['common']);

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
                'tabledata':'=',
            },

		    template: "<table class='m-grid'>"  +
                            "<thead>" +
                                "<tr>" +
                                    "<th></th>" +
                                    "<th ng-repeat='th in tabledata.thead'>{{th}}</th>" +
                                    "<th></th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>"+
                                "<tr ng-repeat='tr in tabledata.tbody'>" +
                                    "<td></td>"+
                                    "<td ng-repeat='td in tr'>{{td}}</td>" +
                                	"<td></td>"+
                                "</tr>" +
                            "</tbody>" +
                        "</table>" ,
			replace: true   //是否替换原始自定义标签
		}
    });

	//审批列表控制器
	main.controller('approvallist',['$scope', '$element', function( $scope , $element ){
            
        console.log('controller approvallist is working');
        $scope.tabledata = {};
        $scope.tabledata.thead = ['订单号','合同号','企业名称','账号','订单类型','提单人','所属部门/代理商','特批单','当前审批节点','到款认领状态','订单状态','付费状态','提单日期','操作'];
        $scope.tabledata.tbody = [
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1'],
                        [1234,5678,'莲花乡池水沟子','lianhuaxiangchishuigouzi','普通订单','小沈阳','小品侠','是','数据中心','已认领','大订单','已付费','2016-6-1']
                     ];

        //搜索订单列表
        $scope.search = function(){
        	//console.log('search');
        	//console.log($scope.s);
        	$scope.data.tbody.push([Math.random(),Math.random(),Math.random(),Math.random()])
        }

        //初始化页数相关
        $scope.pagenumber = 0;
        $scope.pagesize = 20;
        $scope.total = 126;

        //状态变化
        $scope.state = "wait";
        $scope.changestate = function( e,state ){
            $scope.state = state;

            $element.find('.toggle span').removeClass('active');
            angular.element(e.target).addClass('active');
        };

        $scope.$on('pagechange', function( evt , pagenumber ){
            console.log('pagechange');
            console.log( pagenumber ); 
        });

    }]);


	exports.init = function( param ){
		var $el = exports.$el;
		
		param = param || [];
		console.log( param );
		
		angular.bootstrap( $el.find('.m-approvallist')[0] , ['list'] );
		/*
		var approvalList = new OpenApprovalList( { 'wrapper':$el,'limits':true  } );  	//
		approvalList.render();
		
		approvalList.on('ceshi',function(jump){
			approvalList.jumpEve(jump);
		})
		if( param.length>0 ){
			approvalList.trigger('ceshi',param[0]);
		}


		var detailApproval,
			detailPayment;

		approvalList.on('detail',function( detail, state ){
			console.log( detail )

			var editFlag = false;
			if( state == "refuse" || state == "mygoing" ){
				editFlag = detail.canEdit;
			}

			var data = {
				'id' : detail.orderId,
                'enterpriseId': detail.enterpriseId, 
                'editFlag': editFlag,                          	//detail.canEdit || '',
                'orderType': detail.orderType,
                'opinion': detail.lastAssigneeOpinion,
                'isTp': detail.isTp,
                'state': state,
                'ea': detail.enterpriseAccount,
                'currentTask': detail.currentTask,
                'processInstanceId': detail.processInstanceId,
                'contractNo': detail.contractNo,
                'rejectsFrom': detail.rejectsFrom
			};
			if( detail.approvalTypeId =='refundApproval' ){
				detailApproval = new BackMoney();
                detailApproval.show( data );
                detailApproval.on('saveSuccess',function(){
                    approvalList.getList();
                })
				return false;
			}
			if( data.orderType != 17 ){

				detailApproval = new DetailApproval();
				detailApproval.show( data );
				detailApproval.on('saveSuccess',function(){
					approvalList.getList();
				});
			} else {

				detailPayment = new DetailPayment();
				detailPayment.show( data );
				detailPayment.on('saveSuccess',function(){
					approvalList.getList();
				});
			}
		});
		*/
	}
});
