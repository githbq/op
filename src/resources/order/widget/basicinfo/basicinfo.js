/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){
	
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./basicinfo.html');
	//var uploader = require('../common/widget/upload').uploader;
	var AreaTree = require('module/areatree/areatree'); 

	var industryMap = {},    //行业MAP
		productMap = {},     //产品MAP
		sourceMap = {},      //来源MAP
		provinceMap = {},    //省市MAP
		groupMap = {};       //团队类型MAP
		
	/* new 对象是传递的参数;
    this.data = opts.data || {}; //基本信息数据
    this.editFlag = opts.editFlag || false; //是否可编辑参数
	this.type = opts.type || 'common'; // common-普通审批，special-特殊审批*/;
    
	var AddEnt = MClass( M.Center ).include({
		view: contentStr,
		/*
		defaultAttr:{
			'title': '添加企业',
			'width': 680
		},
		*/
		events:{

	
		},

		elements: {
			'.enterprise-content h3': 'title',
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.e-province': 'province',
			'.e-group': 'group',
			'.e-knowsource': 'knowsource',
			'.e-motive': 'motive',
			'.contract': 'contract',
			'.contractCopy': 'contractCopy',
			'.companyscale':'companyscale',
			'.saleteamscale':'saleteamscale',
			'.endTime': 'endTime',
			'.action-add': 'actionAdd',

			'.startTime': 'startTime',                //合同开始时间
            '.endTime': 'endTime',                    //合同结束时间
            '.businessLicense':'businessLicense',
            '.companyGate':'companyGate',
            '.contract':'contract',
			'.useBusinessCard':'useBusinessCard',
			'.card-price':'cardPrice',
			'.regionName': 'regionName',
			
		},
		init: function(){
			AddEnt.__super__.init.apply( this,arguments );
			var me = this;
			//企业5星后传递的企业基本信息
			me.getBasicInfo();
			//记录所有的枚举信息是否获取完毕
			me.state = false;

			//获取所有必须的枚举信息
			me.getEnums( function(){
				//显示基本信息模块
				me.render();
			});



		},
		//企业5星后传递的企业基本信息
		getBasicInfo:function(){
			var me = this;
			/**
			 *
			 * 选择区域初始化
			 */
			me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$regionName.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });
            me.$regionName.on('click',function(){
            	me.areaTree.show();
            });
			IBSS.tempEnterprise = IBSS.tempEnterprise ? IBSS.tempEnterprise :{};
			me.model.set('enterprisename', IBSS.tempEnterprise['enterpriseName']);

			//me.model.set('regionName', IBSS.tempEnterprise['regionName']);
			me.model.set('address', IBSS.tempEnterprise['address']);
			me.model.set('keycontactname', IBSS.tempEnterprise['representative']);
			me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);
			me.model.set('source', IBSS.tempEnterprise['source']);
			me.model.set('industry', IBSS.tempEnterprise['industry']);
			me.model.set('vendorid',IBSS.role_vendorId);
			me.model.set('storagetotalspace',0);
			me.model.set('useBusinessCard',1);

			IBSS.tempEnterprise['enterpriseName'] && me.$('.enterpriseName').attr('disabled','disabled');
			IBSS.tempEnterprise['address'] && me.$('.address').attr('disabled','disabled');
			IBSS.tempEnterprise['representative'] && me.$('.keyContactName').attr('disabled','disabled');
			IBSS.tempEnterprise['source'] && me.$('.e-source').attr('disabled','disabled');
			IBSS.tempEnterprise['industry']&& me.$('.e-industry').attr('disabled','disabled');
			IBSS.tempEnterprise['enterpriseaccount'] && me.model.set('enterpriseaccount',IBSS.tempEnterprise['enterpriseaccount']);
			IBSS.tempEnterprise['enterpriseaccount']&& me.$('.enterpriseaccount').attr('disabled','disabled');
		
			me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);

			if( IBSS.tempEnterprise['regionName'] ){
				me.$regionName.val( IBSS.tempEnterprise['regionName'] ).attr('disabled','disabled');
			}

			IBSS.tempEnterprise['id'] && me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);
			
			//代理商所属区域
			if (me.attrs.ea ){
				util.api({
					'url': '~/op/api/region/getbyea',
					'data':{'ea':me.attrs.ea},
					'success': function( data ){
						console.warn( data );
						if (data.success && data.value.model.length>0 ) {
							var quyuName = []
							for(var i =0; i<data.value.model.length; i++){
								quyuName.push(data.value.model[i].name)
							}
							me.$('.proxy-area').val(quyuName.join(','));
						}else{
							me.$('.proxy-area').val('');
						}
					}
				});
			}else{
				util.api({
					'url': '~/op/api/region/getagentregion',
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							me.$('.proxy-area').val(data.value.model.name);
						}
					}
				});
			}
			
		},
		//获取枚举值
		getEnums: function( callback ){
			var me = this;
			
			var state = {
				'i': false,
				'e': false,
				'p': false,
				'g': false,
				'k': false,
				'r': false,
				'c': false,
				's': false
			};

			//检查是否获取完毕
			function check(){
				if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.s){
					me.state = true;
					me.model.set('source', IBSS.tempEnterprise['source']);
					me.model.set('industry', IBSS.tempEnterprise['industry']);
					callback && callback();
				}
			}

			//获取枚举值 并赋值给select
			function generate( Ename , Map , $select , str ){
				var list = [{'name':'请选择','value':''}];

				util.getEnums( Ename , function( data ){
					data.value.model.forEach( function( item ){
						Map[item.value] = item;
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
			generate('INDUSTRY', industryMap , me.$industry , 'i');

			//获取来源
			generate('ENT_LST_SOURCE', sourceMap , me.$source , 'e');

			//获取省市
			generate('PROVINCE', provinceMap , me.$province , 'p');

			//获取团队类型
			generate('GROUP_TYPE', groupMap , me.$group , 'g');

			//获取了解渠道
			generate('KNOW_SOURCE', {} , me.$knowsource , 'k');

			//获取注册动机
			generate('REGISTER_MOTIVE', {} , me.$motive , 'r');

			//获取公司规模
			generate('CAMPANY_SCALE', {} , me.$companyscale , 'c');

			//获取销售团队规模
			generate('SALE_TEAM_SCALE', {} , me.$saleteamscale ,'s');

			//$('.e-industry').val(me.model.get('INDUSTRY'));
		},
		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
			me.checkEdit(me.attrs.editFlag)
			me.setValue();
			(!me.$('.enterpriseaccount').val()) && me.$('.enterpriseaccount').removeAttr('disabled');
		},
		//数据渲染显示
		setValue:function(){
			var me = this;

			me.model.load( me.attrs.data )
			me.attrs.data.industry && me.model.set('industry', me.attrs.data.industry);
			me.attrs.data.source && me.model.set('source', me.attrs.data.source);
			me.attrs.data.grouptype && me.model.set('grouptype', me.attrs.data.grouptype);
			me.attrs.data.province && me.model.set('province', me.attrs.data.province);
			me.attrs.data.knowsource && me.model.set('knowsource', me.attrs.data.knowsource);
			me.attrs.data.registermotive && me.model.set('registermotive', me.attrs.data.registermotive);
			me.attrs.data.companyscale && me.model.set('companyscale', me.attrs.data.companyscale);
		},
		//检测是否可编辑
		checkEdit:function(editFlag){
			var me = this;
			if(editFlag){
				me.$('.edit-flag').removeAttr('disabled');
				me.$('.check-edit').show();
			}else{
				me.$('.edit-flag').attr('disabled','disabled')
				me.$('.check-edit').hide();
			}
			
		},
		//对外获取文本框值
		getValue:function(){
			var me = this;
			if(me.checkVaild()){
				return me.model.all();

			}
			return false;
		},
		//检测数据有效和必填项
		checkVaild:function(){
			var me = this;
			//检测必填项
			var state = true; 
			me.$('.required-basic').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');
				if( me.model.get(attr)==='' || me.model.get(attr)=== undefined ){
					if(me.model.get(attr) ==='0'){
						
					}else{
						util.warnInput( $this );
						state = false;
					}
					
				}else{
					util.unWarnInput( $this );
				}
			});
			if( state == false ){
				util.showToast('信息填写不完整');
				return  false;
			}
			return  {};
		}
		
	});

	module.exports = AddEnt;

});