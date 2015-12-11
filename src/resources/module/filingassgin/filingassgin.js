/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var contentStr = require('./filingassgin.html');

    /////////////////
    //
    //  添加备案企业
    /////////////////
    var AssginList = MClass( Slider ).include({
        content: contentStr,
        defaultAttr:{
            'width': 560,
            'title': '分配备案企业'
        },
		tpassginEntList: _.template( $(contentStr).filter('#trAssignEnt').html() ),
		tpcustomervalueList: _.template( $(contentStr).filter('#trCustomervalue').html() ),
        elements: {
            '.assign-ent-Info tbody': 'tbassginEntList',
			'.assign-ent-Info .agent-bind-channel': 'btnagentBindChannl',
			'#agentId':'agentId',
			'.search-name':'searchName'
        },

        events: {
            'click .agent-bind-channel': 'agentBindChannel',
			 'click .customervalue-bind-channel': 'customervalueBindChannel',
            
        },
		accountList:[],

        init: function(){
            AssginList.__super__.init.apply( this,arguments );
			var me = this;
			me.$searchName.on('keyup',function(){
				 var wd = $(this).val();
				if(wd == ''){
					$('.assign-ent-Info tbody tr').show();
				}else{
					$('.assign-ent-Info tbody tr').each(function(){
						var feed = me.getList($(this).attr('data-id'));
						if( feed.name.match(wd)){
							$(this).show();
						}else{
							$(this).hide();
						}
					});
				}
				return false;
			});
           
        },
		agentBindChannel:function(e){
			var me = this,
				$target = $( e.currentTarget ),
				assignAccount = $target.attr( 'data-id' ),
				enterpriseFilingId = me.$agentId.attr('data-agent'),
				data = {
					enterpriseFilingId: enterpriseFilingId,
					assignAccount: assignAccount
				};
				if(confirm("确定要将备案企业分配给该账户吗？")){
					util.api({
						url: '/enterprisefiling/assignenterprisefiling',
						data: data,
						success: function( data ) {
							if ( data.success ) {
								util.showTip('绑定成功');
								me.trigger('success');
							}
						}
					}) ;
				}
				return false;	
			
		},
		customervalueBindChannel:function(e){
			var me = this,
				$target = $( e.currentTarget ),
				addedValueStaff = $target.attr( 'data-id' ),
				enterpriseId  = me.$agentId.attr('data-agent'),
				data = {
					enterpriseId  : enterpriseId ,
					addedValueStaff: addedValueStaff
				};
				if(confirm("确定要将该企业分配给该增值人员吗？")){
					util.api({
						url: '/enterprise/assignvalueaddedstaff',
						data: data,
						success: function( data ) {
							if ( data.success ) {
								util.showTip('绑定成功');
								me.trigger('success');
							}
						}
					}) ;
				}
				return false;	
			
		},

        //分配备案企业详情
        show: function( id){
            var me = this;
			me.agentId = id;
			me.$agentId.attr('data-agent',id);
		
            util.api({
                'url': '/agent/querysalesaccount',
                'data': '',
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.model.length > 0 ) {
							me.accountList = data.value.model;
							me.$tbassginEntList.html(me.tpassginEntList( { content: data.model } ));
						} else {
							me.accountList = [];
							me.$tbassginEntList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })

            AssginList.__super__.show.apply( this,arguments );
        },
		//分配增值客户详情
        showCustomervalue: function( id){
            var me = this;
			me.agentId = id;
			me.$agentId.attr('data-agent',id);
			 me._setTitle('分配增值客户');
		
            util.api({
                'url': '/agent/queryvalueaddedaccount',
                'data': '',
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.model.length > 0 ) {
							me.$tbassginEntList.html(me.tpcustomervalueList( { content: data.model } ));
						} else {
							me.$tbassginEntList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })

            AssginList.__super__.show.apply( this,arguments );
        },
		getList: function(id){
  			var me = this;
			var list = me.accountList;
  			for(var i=0; i<list.length; i++){
				if(list[i].id == id){
					return list[i];
				}
			}
			return null;
  		},
		hide: function(){
            this.model.clear();
			this.$agentId.attr('data-agent','');
			this.accountList=[];
            this.$('.state').hide();
            AssginList.__super__.hide.apply(this,arguments);
        }
       
    });

	module.exports = AssginList;
});
