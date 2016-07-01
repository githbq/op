//
//
// 我的审批列表
//=========================================
define( function(require, exports, module){

	
    var enumdata = require('module/data/data').data;
    var resetSelect = require('module/data/data').resetSelect;

	//var OpenApprovalList = require('module/openapprovallist/openapprovallist');
	var DetailApproval = require('../../order/detailapproval/detailapproval');        //普通订单
	var DetailPayment = require('../../order/detailpayment/detailpayment');           //收尾款
	var BackMoney = require('../../order/detailbackmoney/detailbackmoney');           //退款
    
    var Pagination = require('common/widget/pagination/pagination');      //分页组件
    var pagination;


	var main = angular.module('list',[]);   //

    var isFinance = false;

	//审批列表控制器
	main.controller('approvallist',['$scope', '$element', function( $scope , $element ){
            
        console.log('controller approvallist is working');

        $element.find('.starttime').datetimepicker({'timepicker': false,'format':'Y/m/d'})
        $element.find('.endtime').datetimepicker({'timepicker': false,'format':'Y/m/d'})

        $scope.tabledata = {};
        $scope.tabledata.thead = ['订单号','合同号','企业名称','账号','订单类型','提单人','所属部门/代理商','审批类型','当前审批节点','付费状态','订单状态','提单日期','操作'];

        $scope.financeshow = !isFinance;
        
        if( !isFinance ){
            console.log($element.find('.financeshow'))
            $element.find('.financeshow').show();
        }

        //获取列表
        $scope.getList = function(){
            var state = $scope.state;
            var url;
            switch ( state ){
                case 'wait':
                    url = "/approval/getongoingapprovalpage";
                break;
                case 'going':
                    url = "/approval/getapprovedongoingapprovalpage";
                break;
                case 'done':
                    url = "/approval/getcompletedapprovalpage";
                break;
                case 'reject':
                    url = "/approval/getrefusedapprovalpage";
                break;
            };

            var appTimeStart = '';
            var appTimeEnd = '';

            if( $element.find('.starttime').val() ){
                appTimeStart = new Date( $element.find('.starttime').val() ).getTime();
            }
            if( $element.find('.endtime').val() ){
                appTimeEnd = new Date( $element.find('.endtime').val() ).getTime();
            }

            util.api({
                'url': url,
                'data': {
                    'orderId': $scope.orderId,
                    'contractNo': $scope.contractNo,
                    'en': $scope.en,
                    'ea': $scope.ea,
                    'orderType': $scope.orderType,
                    'applicantname': $scope.applicantname,
                    'payStatus': $scope.payStatus,
                    'agentName': $scope.agentName,
                    'orderStatus': $scope.orderStatus,
                    'appTimeStart': appTimeStart,
                    'appTimeEnd': appTimeEnd,
                    'pageIndex': pagination.attr['pageNumber'],
                    'pageSize': pagination.attr['pageSize']
                },
                'beforeSend': function(){
                    var me = this;
                    $scope.tipshow = true;
                    $scope.tip = "加载中......";
                    $scope.contentshow = false;
                },
                'success': function( data ){

                    if( data.success ){
                        
                        if( data.value.model.content && data.value.model.content.length > 0 ){

                            $scope.tipshow = false;
                            $scope.contentshow = true;

                            data.value.model.content.forEach(function( item ){
                                item.currentTaskStr = enumdata['approvalnodemap'][item.currentTask];
                                item.orderTypeStr = enumdata['ordermap'][item.orderType];
                                item.payStatusStr = enumdata['paystatus'][item.payStatus];
                                item.orderstatusStr = enumdata['orderstatus'][item.orderStatus];
                                item.applyTimeStr = new Date( item.applyTime )._format('yyyy/MM/dd hh:mm');
                            });
                            $scope.tabledata.tbody = data.value.model.content;
                        } else {

                           $scope.tipshow = true;
                           $scope.contentshow = false;

                           $scope.tip = "暂无数据";
                        }
                        pagination.setTotalSize( data.value.model.itemCount );
                        $scope.$apply();
                    }
                }
            });
        }

        //搜索订单列表
        $scope.search = function(){
            pagination.setPage( 0,false );
            $scope.getList();
        }

        //查看订单状态
        $scope.detail = function( e ){
            e.stopPropagation();
            var id = angular.element(e.target).attr('data-id'),
                inId = angular.element(e.target).attr('data-inid'),
                status = angular.element(e.target).attr('data-status'),
                dstatus = angular.element(e.target).attr('data-dstatus');

            var type;
            //待审核的
            if( $scope.state == 'wait' ){
                
                type = 'c';
            //非待审核的
            }else{
                
                type = 'd';
            }
            
            var detailApproval = new DetailApproval();
            detailApproval.show( id , type , status , dstatus , { 'processInstanceId': inId } );
             //注册事件
            detailApproval.on('approvalSuccess',function(){
                $scope.search();
            });
            return false;
        }

        //状态变化
        $scope.state = "wait";
        $scope.changestate = function( e,state ){
            $scope.state = state;

            $element.find('.toggle span').removeClass('active');
            angular.element(e.target).addClass('active');
            $scope.search();
        };

        pagination.onChange = function(){
            $scope.getList();
        };

        $scope.search();
    }]);


	exports.init = function( param ){
		var $el = exports.$el;
        
        //初始化老分页组件		
        pagination = new Pagination({
            wrapper: $el.find('.list-pager'),
            pageSize: 20,
            pageNumber: 0
        });
        pagination.render();

		param = param || [];
        console.log( '================' );
		console.log( param );
        if( param[0] == 'finance' ){
            isFinance = true;
        }
        //重置select的值
		resetSelect( $el,'ordermap' );
        resetSelect( $el,'orderstatus' );

		angular.bootstrap( $el[0] , ['list'] );

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
