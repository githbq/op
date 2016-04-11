/**
 *
 *  添加企业
 *  todo
 *  接口校验
 *  初始化id时初始化选择产品
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./addenterprise.html');


	var industryMap = {},    //行业MAP
		productMap ={};      //产品MAP


	var AddEnt = MClass( Slider ).include({
		content: contentStr,
		defaultAttr:{
			'title': '添加企业',
			'width': 750
		},
		init: function(){
			AddEnt.__super__.init.apply( this,arguments );
			var me = this;

			me.$endTime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );

			me.getEnums();

			me.state = false;
			me.isSetProduct = false;
		},
		events:{
			'click .action-add': 'addEve',
			'click .action-reset': 'resetEve',
			'click .action-cancel': 'hide'
		},

		elements: {
			'.e-industry': 'industry',
			'.content-product': 'product',
			'.companyscale':'companyscale',
			'.saleteamscale':'saleteamscale',
			'.endTime': 'endTime',
			'.action-add': 'addBtn'
		},


		//获取枚举值
		getEnums: function(){
			var me = this;
			
			var state = {
				'a': false,
				'b': false,
				'c': false,
				'd': false
			};

			function check(){
				if( state.a && state.b && state.c && state.d){
					me.state = true;
					me.setProduct();
				}
			}

			//获取产品列表
			var productList = [],
				proTem = _.template("<%=name%>(<%=deviceMaxCount%>终端):终端<%=deviceMaxCount%>个/一次性赠送短信<%=textMessageCount%>条/<%=storage%>");
			util.api({
				'url': '/product/querypage',
				'data': {
					'isPage':1
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						data.value.model.content.forEach(function( item ){
							productMap[item.id] = item;
							productList.push({'name':proTem(item),'value':item.id});
							util.resetSelect(me.$product,productList); 
						})
						state.a = true;
						check();
					}
				}
			});

			//获取行业列表
			var industryList = [];
			util.getEnums('INDUSTRY',function( data ){
				data.value.model.forEach(function( item ){
					industryMap[item.value] = item;
					industryList.push({'name':item.text,'value':item.value});
					util.resetSelect(me.$industry,industryList);
				})
				state.b = true;
				check();
			});

			//获取团队规模
			var teamList = [];
			util.getEnums('CAMPANY_SCALE',function( data ){
				data.value.model.forEach(function( item ){
					teamList.push({'name':item.text,'value':item.value});
					util.resetSelect( me.$companyscale, teamList );
				})
				state.c = true;
				check();
			})

			//获取销售团队规模
			var saleList = [];
			util.getEnums('SALE_TEAM_SCALE',function( data ){
				data.value.model.forEach(function( item ){
					saleList.push({'name':item.text,'value':item.value});
					util.resetSelect( me.$saleteamscale, saleList );
				})
				state.d = true;
				check();
			})
		},
		
		//预设产品信息
		setProduct: function(){
			var me = this;
			
			if( me.isSetProduct == true ){
				return false
			};
			if( me.attrs['id'] && me.state == true ){
				console.log('set: ' + me.attrs['id'] );
				me.model.set( 'productId',me.attrs['id'] );
				me.isSetProduct = true;
			}
		},

		//显示
		show: function( info ){
			var me = this;
			console.log( info );
			//缓存productid
			me.attrs['id'] = info.id;
			me.model.set('accountTotalAmount', info.deviceMaxCount );
			me.model.set('smsTotalAmount', info.textMessageCount );
			me.model.set('storageTotalSpace', info.storage );
			me.setProduct();

			AddEnt.__super__.show.apply( this,arguments );
		},

		hide: function(){
			var me = this;
			delete me.attrs['id'];
			me.isSetProduct = false;
			me.model.clear();

			//重置基础数据
			me.model.set('industry',1);
			me.model.set('companyScale',2);
			me.model.set('isSaleTeam',1);
			me.model.set('saleTeamScale',1);
			me.model.set('isWillPin',1);
			me.model.set('isFirstmeetingSign',1);
			me.model.set('isStrangerVisits',1);

			AddEnt.__super__.hide.apply( this,arguments );
		},

		//添加企业
		addEve: function(){
			var me = this;

			var model = me.model,
				data = me.model.all();

			if( !me.state ){
				util.showTip('信息未获取完毕 请稍等');
				return;
			}

			//信息校验
			//逍客终端总量
			if( !model.get('accountTotalAmount') ){
				util.showToast('请填写逍客终端总量');
				return;
			}else if( isNaN( model.get('accountTotalAmount') ) ){
				util.showToast('终端总量请填写数字');
				return;
			}

			//短信总量
			if( !model.get('smsTotalAmount') ){
				util.showToast('请填写短信总量');
				return;
			}else if( isNaN( model.get('smsTotalAmount') ) ){
				util.showToast('短信总量请填写数字');
				return;
			}

			//空间总量
			if( !model.get('storageTotalSpace') ){
				util.showToast('请填写空间总量');
			}else if( isNaN( model.get('storageTotalSpace') ) ){
				util.showToast('空间总量请填写数字');
				return;
			}

			//企业名称
			if( !model.get('enterpriseName') ){
				util.showToast('请填写企业名称');
				return;
			}

			//企业简称
			/*if( !model.get('enterpriseShortName') ){
				utishowToastip('请填写企业简称');
				return;
			}*/

			//企业账号
			if( !model.get('enterpriseAccount') ){
				util.showToast('请填写企业账号');
				return;
			}

			//地址
			if( !model.get('address') ){
				util.showToast('请填写地址');
				return;
			}

			//姓名
			if( !model.get('keyContactName') ){
				util.showToast('请填写企业负责人姓名');
				return;
			}
			//电话
			if( !model.get('keyContactPhone') ){
				util.showToast('请填写企业负责人电话');
				return;
			}
			//电子邮箱
			if( !model.get('keyContactEmail') ){
				util.showToast('请填写企业负责人电子邮箱');
				return;
			}else if( !util.regMap.email.test( model.get('keyContactEmail') )){
				util.showToast('请填写正确格式的企业负责人电子邮箱地址');
				return;
			}

			//平台管理员姓名
			if( !model.get('contactName') ){
				util.showToast('请填写平台管理员姓名');
				return;
			}

			//平台管理员电话
			if( !model.get('contactPhone') ){
				util.showToast('请填写平台管理员电话');
				return;
			}

			//平台管理员电子邮箱
			if( !model.get('contactEmail') ){
				util.showToast('请填写平台管理员电子邮箱');
				return;
			}else if( !util.regMap.email.test( model.get('contactEmail') )){
				util.showToast('请填写正确格式的平台管理员电子邮箱地址');
				return;
			}


			//平台管理员常用QQ
			/*
			if( !model.get('contactIM') ){
				util.showTip('请填写平台管理员常用QQ');
				return;
			}
			*/

			var endTime;
			if( !me.$endTime.val() ){
				util.showToast('请选择逍客截止日期');
				return;
			}else{
				endTime = new Date( me.$endTime.val() ).getTime();
				if ( isNaN(endTime) ){
					util.showToast('请选择逍客截止日期');
					return;
				} 
				data.endTime = endTime;
			}


			me.$addBtn.addClass('disabled').attr('disabled','disabled').text('提交中');


			util.api({
				'url':'/enterprise/addenterprise',
				'data': data,
				'success': function( data ){
					console.warn(data);
					if( data.success ){
						util.showTip('新增企业成功');
						me.hide();
					}
				},
				'complete': function(){
					me.$addBtn.removeClass('disabled').removeAttr('disabled').text('提交');
				}
			})
		}

	});

	module.exports = AddEnt;
});
