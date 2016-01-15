/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
	var Slider = require('common/widget/slider/slider');
	 var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./bindentinfo.html');

    /////////////////
    //
    //  备案企业与自注册企业对比
    /////////////////
	var BindEntInfo = MClass( Slider ).include({

		view: contentStr,

		defaultAttr: {
			'title': '备案企业与自注册企业详情'
			
		},

		elements: {
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.e-province': 'province',
	
			'.status-disabled': 'statusDisabled',
			'.start-time-ht':'startTimeHt',
			'.end-time-ht':'endTimeHt',
			'.visite-time':  'visiteTime',
			
		},

		events:{
			
		},

		//获取枚举值
		getEnums: function(){
			var me = this;

			var state = {
				'i': false,
				'e': false
			};

			//检查是否获取完毕
			function check(){
				if( state.i && state.e  ){
					me.state = true;
				}
			}

			//获取枚举值 并赋值给select
			function generate( Ename , $select , str ){
				var list = [{'name':'请选择','value':''}];

				util.getEnums( Ename , function( data ){
					data.value.model.forEach( function( item ){
						list.push({'name':item.text,'value':item.value});
					});
					util.resetSelect($select,list);
					if( str ){
						state[ str ] = true;
					}

					check();
				})
			}

			//获取行业列表
			generate('INDUSTRY', me.$industry , 'i');

			//获取来源
			generate('ENT_LST_SOURCE', me.$source , 'e');

		},
		
		init: function(){
			BindEntInfo.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块

            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });
			
			me.$startTimeHt.datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$endTimeHt.val() ? me.$endTimeHt.val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$endTimeHt.datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$startTimeHt.val() ? me.$startTimeHt.val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			me.$('.start-time-ht-add').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDateAdd = me.$('.end-time-ht-add').val() ? me.$('.end-time-ht-add').val() : false;
					this.setOptions({
						maxDateAdd: maxDateAdd
					});
				},
				timepicker: false
			} );
			me.$('.end-time-ht-add').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDateAdd = me.$('.start-time-ht-add').val() ? me.$('.start-time-ht-add') : false;
					this.setOptions({
						minDateAdd: minDateAdd
					});
				},
				timepicker: false
			} );
			
			 //初始化日期选择
            me.$visiteTime.datetimepicker({
                format: 'Y/m/d',
                timepicker: true
            });
			
			
			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
				me.getdiscount();
			});

			//终端数量改变
			me.$deviceamount.on('focusout',function(){
				me.model.set('accountTotalAmount',parseInt(me.model.get('accountTotalAmount'))?parseInt(me.model.get('accountTotalAmount')):'');
				
				me.getdiscount();
			});
			//合同开始时间
			me.$startTime.on('focusout',function(){
				me.getdiscount();
			});
			//合同结束时间时间
			me.$endTime.on('focusout',function(){
				me.getdiscount();
			});

			
			

			me.getEnums();
			
		},

	
		/**
		 *
		 *撤销审批
		 */
		 //选择区域
        regionEve: function(){
            var me = this;
            me.areaTree.show();
        },

		
		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );

		},

		/**
		 *
		 *获取备案企业信息
		 */
		 getRecordEnterprise:function(data){
			var me = this;
			me.model.set('enterpriseNameRecord',data.value.enterpriseFiling.enterpriseName );
			me.model.set('addressRecord',data.value.enterpriseFiling.address );
			me.model.set('regionRecord', data.value.enterpriseFiling.regionName );
			me.$filingRegion.attr('data-code',data.value.enterpriseFiling.region);
			me.model.set('agentPersonRecord',data.value.enterpriseFiling.representative );
			me.model.set('industryRecord',data.value.enterpriseFiling.industry );
			me.model.set('sourceRecord',data.value.enterpriseFiling.source );
			me.model.set('contactNameRecord',data.value.enterpriseFiling.contactName );
			me.model.set('contactPostRecord',data.value.enterpriseFiling.contactPost );
			me.model.set('contactPhoneRecord',data.value.enterpriseFiling.contactPhone );
			me.model.set('contactEmailRecord',data.value.enterpriseFiling.contactEmail );
			me.model.set('remarkRecord',data.value.enterpriseFiling.remark );
			me.model.set('creatorNameRecord',data.value.enterpriseFiling.creator.name );
			me.model.set('creatorUserNameRecord',data.value.enterpriseFiling.creator.username );	
			me.$firmStatus.val(data.value.enterpriseFiling.status);
			me.model.set('clientNumRecord',data.value.enterpriseFiling.accountAmount );
			me.model.set('companyNumRecord',data.value.enterpriseFiling.employeeNumber );
			me.model.set('kpPhoneRecord',data.value.enterpriseFiling.representative_phone );
			var visiteTime = data.value.enterpriseFiling.visitTime?new Date( data.value.enterpriseFiling.visitTime)._format('yyyy/MM/dd'):'';
			me.model.set('visiteTimeRecord',visiteTime);
			me.attrs.enterpriseFilingId = data.value.enterpriseFiling.id;
		 },

		//重新发送
		hide: function(){
			var me = this;
			me.model.clear();
		
			BindEntInfo.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = BindEntInfo;
});
