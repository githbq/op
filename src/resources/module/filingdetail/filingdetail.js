/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var contentStr = require('./filingdetail.html');
    var AreaTree = require('module/areatree/areatree');

    var uploader = require('common/widget/upload').uploader;

    /////////////////
    //
    //  添加修改备案企业
    /////////////////
	var temObj={};
    var AddFiling = MClass( Slider ).include({

        content: contentStr,

        defaultAttr:{
            'width': 615,
            'title': '添加备案企业'
        },

        elements:{
            '.uploadcard': 'upload',
            '.detail-card': 'card',
            '.detail-card2': 'card2',
            '.imglink': 'imglink',
            '.imglink2': 'imglink2',
            '.filing-submit': 'submit',
			'.filing-save': 'btnSave',
            '.filing-entname': 'ename',
			'.firm-status':  'firmStatus',
			'.visite-time':  'visiteTime',
			'.state-info':  'stateInfo',
			'.state-person': 'statePerson',
			'.state-phone': 'statePhone',
			'.state-count' : 'stateCount',
			'.state-visite': 'stateVisite',
			'.person-taggle': 'personTaggle',
			'.count-taggle': 'countTaggle',
			'.open-taggle': 'openTaggle',
			'.phone-taggle': 'phoneTaggle',
			'.time-taggle': 'timeTaggle',
			'.state-check' :'stateCheck',
			'.free-reg'   :'freeReg',
			'.buy-reg'   :'buyReg',
			'.disabled-status':'noStatus',
            '.filing-drop': 'filingdrop',
            '.filing-region': 'filingRegion',
            '.emptyinfo': 'emptyinfo',
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.bind-link':'bindLink',
			'.remark-info':'remarkInfo',
			'.operat-status':'operatStatus',
        },
        
        events: {
            'click .filing-region': 'regionEve',     //选择区域
            'click .filing-reset': 'resetEve',
            'click .filing-submit': 'submitEve',
            'click .filing-return': 'hide',
			'click .filing-save': 'saveEve',
            'click .filing-drop': 'dropEve',
			'change .firm-status': 'changeFirmStatus',
			'click .free-reg': 'jumpFree',
			'click .buy-reg': 'jumpBuy',
			'click .bind-link': 'bindLinkEve'
        },

        init: function(){
            AddFiling.__super__.init.apply( this,arguments );
            var me = this;
			me.$remarkInfo.hide().text('');

            //查看备案企业名称是否重名
            me.$ename.on('focusout', function() {
                console.log( 'abcdefg' );
                var value = $( this ).val();
                util.api({
                    url: '/enterprisefiling/validateenterprisefilingname',
                    data: { enterpriseFilingName: value },
                    success: function( data ) {
                        if( data.success ){
                            if ( data.value.hint ) {
                                me.toggleDuplicateMessage( 0 );
                            } else {
                                me.toggleDuplicateMessage( 1 );
                            }
                        }
                    }
                });
            });
			me.getEnums();

            if( me.attrs && me.attrs.state){
                me.changeState( me.attrs.state );
            }
            //选择区域模块

            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });


            //初始化日期选择
            me.$visiteTime.datetimepicker({
                format: 'Y/m/d',
                timepicker: true
            });
        },

        //根据不同的状态显示不同内容
        //初始化的时候 进行状态变更
        changeState: function( state ){
            var me = this;

            me.$('[data-state]').hide();
            switch( state ){
               
                case 'add':
                    me._setTitle('添加备案企业');
                    me.$filingdrop.hide();
                    me.$('.icon-hide').show();
                    me.$('.text-disabled').removeAttr('disabled'); 
                    me.$('[data-state="add"]').show();
                    me.$stateInfo.css({'display':'none'});
                    break;

                case 'detail':
                    me._setTitle('备案企业详情');
                    me.$filingdrop.show();
                    me.$('.icon-hide').hide();
                    me.$('.text-disabled').attr({'disabled':'disabled'});
                    me.$('[data-state="detail"]').show();
                    break;
            }
        },

        /**
         * 
         * 获取状态枚举值
         */
        getEnums: function(){
            var me = this;
            var statusList = [{'name':'请选择','value':'0'}],
                industryList=[{'name':'请选择','value':''}],
                sourceList=[{'name':'请选择','value':''}];

            util.getEnums('LEADS_STATUS',function(data){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       statusList.push( {'name':item.text,'value':item.value} );
                    });
                    util.resetSelect( me.$firmStatus, statusList );
                }
            })
            util.getEnums('INDUSTRY',function(data){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       industryList.push( {'name':item.text,'value':item.value} );
                    });
                    util.resetSelect( me.$industry, industryList );
                }
            })
            util.getEnums('ENT_LST_SOURCE',function(data){
                if( data.success ){
                    console.log(data)
                    data.value.model.forEach(function( item, index){
                       sourceList.push( {'name':item.text,'value':item.value} );
                    });
                    util.resetSelect( me.$source, sourceList );
                }
            })
        },

        /**
         * 跟进opts里传入的state值 进行不同的状态切换
         * 显示备案企业详情
         */
        show: function( id , opts){
            var me = this;
			me.$stateInfo.attr({'data-id':id});
			me.$bindLink.attr({'data-entId':id});
            //详情状态
            if( id ){

                me.attrs.enterprisefilingid = id;
                util.api({
                    'url': '/enterprisefiling/getfiling',
                    'data': {
                        'enterpriseFilingId': id
                    },
                    'success': function( data ){
                        console.warn(data);
                        if( data.success ){

							temObj =data.value.model;
                            me.model.load( data.value.model );
							me.$firmStatus.val(data.value.model.status);

							me.getData(data);
                            me.model.set('creatorName', data.value.model.creator.name);
                            me.model.set('creatorUserName', data.value.model.creator.username);
							me.model.set('industry', data.value.model.industry);  //行业赋值
							me.model.set('source', data.value.model.source);  //行业赋值
							me.model.set('agentPerson', data.value.model.representative);
                            var createTimeStr = new Date( me.model.get('createTime') )._format('yyyy-MM-dd hh:mm');
                            me.model.set('createTimeStr',createTimeStr);
                            me.model.set('region',data.value.model.regionName);
                            if( data.value.model.cardPath ){
                                me.$card.attr('src', IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?enterpriseFilingId=' + data.value.model.id + '&cardPath=' + data.value.model.cardPath);
                                me.$imglink.attr('href',IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?enterpriseFilingId=' + data.value.model.id + '&cardPath=' + data.value.model.cardPath);
                            }
                            if( data.value.model.card2Path ){
                                me.$card2.attr('src', IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?cardPath=' + data.value.model.card2Path);
                                me.$imglink2.attr('href', IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?cardPath=' + data.value.model.card2Path);
                            }
                            if( !data.value.model.cardPath && !data.value.model.card2Path ){
                                me.$emptyinfo.show();
                            }else{
								 me.$emptyinfo.hide();
							}
                        }
                    }
                })
            
            //添加状态先获取默认区域
            }else{
                util.api({
                    'url':'/enterprisefiling/getregionforaddef',
                    'success': function( data ){
                        console.warn( data );
                        if( data.success ){
                            me.$filingRegion.val( data.value.model['name'] ).attr('data-code', data.value.model['code'] );
                        }
                    }
                })
            }

            AddFiling.__super__.show.apply( this,arguments );
        },

		//跳转免费注册
		jumpFree:function(){
			IBSS.tempEnterprise = temObj;

            //查看是否能注册
            util.api({
                'url':'/enterprisefiling/canAddEnterprise',
                'success': function( data ){
                    if( data.success ){
                        location.hash = '#agentsupport/freereg/link';
                    }
                }
            })

			//location.hash = '#agentsupport/freereg/link';
		},

		//跳转付费注册
		jumpBuy:function(){
			IBSS.tempEnterprise = temObj;
			
            //查看是否能注册
            util.api({
                'url':'/enterprisefiling/canAddEnterprise',
                'success': function( data ){
                    if( data.success ){
                        location.hash = '#agentsupport/payreg/link';
                    }
                }
            })

            //location.hash = '#agentsupport/payreg/link';
		},
		bindLinkEve:function(e){
			var me = this;
			var entId = $( e.currentTarget ).attr('data-entId');
			me.trigger('bindLink',entId);
			
		},

        //显示隐藏是否重名的提示
        toggleDuplicateMessage: function( m ) {
            var me = this;

            if ( m == 0 ) {
                me.$('.dnem' ).parent().css( 'display', 'none' );
            } else {
                me.$('.dnem' ).parent().css( 'display', 'inline-block' );
            }
        },

		//根据编辑企业状态显示不同的编辑内容
        getData: function(data){
            var me = this;
			me.$stateInfo.css({'display':'block'});
			var clientNum = data.value.model.accountAmount||'',
			kpPhone = data.value.model.representative_phone||'',
			companyNum = data.value.model.employeeNumber||'';
			var tempTime = data.value.model.visitTime?data.value.model.visitTime:new Date().getTime();
			var visiteTime = new Date( tempTime)._format('yyyy/MM/dd');
			var state = data.value.model.status+'';
			//me.$('.state-check input').val('');
			me.$firmStatus.css({'display':'block'});
			me.$noStatus.css({'display':'none'});
			me.$freeReg.css({'display':'none'});
			me.$buyReg.css({'display':'none'});
			me.$bindLink.css({'display':'none'});

            //放弃按钮先显示
            me.$filingdrop.show();
			me.$btnSave.show();
            switch( state ){
				case '1':	
					me.model.set('firmStatus','0');
					me.$firmStatus.val('0')
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone', kpPhone);
					me.model.set('visiteTime', visiteTime);
					me.model.set('companyNum', companyNum);
					break;
               /* case '6':
					//clientNum = data.value.model.accountAmount||'';
					me.model.set('clientNum', clientNum);
					break;
				case '7':
					//clientNum = data.value.model.accountAmount||''
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone',kpPhone);
					break;
				case '8':
					me.model.set('clientNum', clientNum);
					me.model.set('kpPhone', kpPhone);
					break;*/
				case '6':case '7':case '8':case '9':
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone', kpPhone);
					me.model.set('visiteTime', visiteTime);
					me.model.set('companyNum', companyNum);
					break;
				case '10':
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone', kpPhone);
					me.model.set('visiteTime', visiteTime);
					me.model.set('companyNum', companyNum);
					
					util.api({
						'url':'~/op/api/approval/checkbindingapproval',
						'data':{
							'enterpriseFilingId':me.$stateInfo.attr('data-id')
						},
						'success': function( data ){
							if( data.success ){
								if( !data.value.success ){
									me.$operatStatus.hide();
									me.$remarkInfo.show().text('(无法操作原因: '+ data.value.message +')');
									me.$('.operat-input').attr('disabled','disabled');
								}else{
									me.$operatStatus.show();
									me.$freeReg.show();
									me.$buyReg.show();
									me.$bindLink.show();
									me.$('.operat-input').removeAttr('disabled');
								}
							}
						}
						
					});
					
					break;
				default:
					//me.model.set('clientNum', '0');
					me.$stateInfo.css({'display':'none'});
					me.$btnSave.hide();
					me.$firmStatus.css({'display':'none'});
					me.$noStatus.css({'display':'block'});
                    me.$filingdrop.hide();

            }
			
        },
		
		//根据编辑企业状态显示不同的编辑内容
        changeFirmStatus: function( ){
            var me = this;
			me.model.set('visiteTime', new Date()._format('yyyy/MM/dd') );
        },

        //上传名片
        uploadCard: function( callback ){
            var me = this;
            uploader.send({
                'url': IBSS.API_PATH + '/enterprisefiling/uploadcard',
                'files': me.$upload[0].files,
                'success': function( response ){
                    if( response.success ){
                        callback && callback( response.value.model[0]['path'], response.value.model[1] && response.value.model[1]['path'] );
                    }
                }
            })
        },

        //选择区域
        regionEve: function(){
            var me = this;
            me.areaTree.show();
        },

        /**
         *
         * 提交
         * 添加备案企业
         */
        submitEve: function(){
            var me = this;

            if( !me.model.get('enterpriseName') ){
                util.showToast('请填写企业名称');
                return false;
            }
            if( !me.model.get('address') ){
                util.showToast('请填写地址');
                return false;
            }
            
            var regionCode = me.$filingRegion.attr('data-code');
            if( !regionCode ){
                util.showToast('请填写区域信息');
                return false;
            }
            if( !me.model.get('contactName') ){
                util.showToast('请填写联系人信息');
                return false;
            }
            if( !me.model.get('contactPost') ){
                util.showToast('请填写联系人职位信息');
                return false;
            }
            if( !me.model.get('contactPhone') ){
                util.showToast('请填写联系人电话');
                return false;
            }
            if( !me.model.get('industry') ){
                util.showToast('请选择行业');
                return false;
            }
            if( !me.model.get('source') ){
                util.showToast('请选择来源');
                return false;
            }

            //校验来源信息


            me.$submit.attr('disabled','disabled');
            me.$submit.addClass('disabled');
            me.$submit.text('提交中');

            if( me.$upload[0].files.length > 0 ){
                me.uploadCard( function( path , path2 ){
                    add( path , path2 );
                } );
            }else{
                add();
            }
            
            //最终的添加函数
            function add( path , path2 ){

                util.api({
                    'url':'/enterprisefiling/reportfiling',
                    'data':{
                       'enterpriseName': me.model.get('enterpriseName'),
                       'vendorId': IBSS.role_vendorId,
                       'address': me.model.get('address'),
                       'remark': me.model.get('remark'),
                       'region': regionCode,
					   'representative': me.model.get('agentPerson'),
                       'contactName': me.model.get('contactName'),
                       'contactPost': me.model.get('contactPost'),
                       'contactEmail': me.model.get('contactEmail'),
                       'contactPhone': me.model.get('contactPhone'),
					   'industry': me.model.get('industry'),   //行业
					   'source': me.model.get('source'),   //行业
                       'cardPath': path,
                       'card2Path': path2
                    },
                    'success': function( data ){

                        console.warn( data );
                        
                        if( data.success ){
                            if( data.value && data.value.hint ){

                                alert( data.value.hint );
                            }
                            me.hide();
                            me.trigger('addsuccess');
                        }
                    },
                    'complete': function(){
                        me.$submit.removeAttr('disabled');
                        me.$submit.removeClass('disabled');
                        me.$submit.text('提交');
                    }
                })
            }
        },

		saveEve:function(){
			var me = this;
			var objData ={};
			objData['enterpriseFilingId'] = me.$stateInfo.attr('data-id') ||'';

			if(me.$firmStatus.val()=='0'){
				util.showToast('请选择状态');
				return false;
			}
			objData['status'] = me.$firmStatus.val() || '';
			objData['accountAmount'] = parseInt(me.model.get('clientNum'))?parseInt(me.model.get('clientNum')):'';
			objData['representativePhone'] = me.model.get('kpPhone'); //(me.$phoneTaggle.css('display')=='block') ? me.$statePhone.val() :'';
			objData['employeeNumber'] = parseInt(me.model.get('companyNum'))?parseInt(me.model.get('companyNum')):'';
			if(!me.$stateVisite.val()){
				util.showToast('拜访时间不能为空');
				return false;
			}
			var state = true;
			me.$('.check-empty').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');
				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
					
				}else{
					util.unWarnInput( $this );
				}
			});
			if( !state ){
				util.showToast('填写信息不完整！');
				return false;
			}
			objData['visitTime'] = new Date( me.$stateVisite.val() ).getTime() ; 
			console.log(objData)
			me.$btnSave.attr('disabled','disabled');
            me.$btnSave.addClass('disabled');
            me.$btnSave.text('保存中');
			util.api({
				'url':'/enterprisefiling/updatefiling',
				'data':objData,
				'success': function( data ){
					if( data.success ){
						util.showTip( '保存成功' );
						me.trigger('savesuccess');
						me.show(me.$stateInfo.attr('data-id'),{'state':'detail'});
						
					}
				},
				'complete': function(){
					me.$btnSave.removeAttr('disabled');
					me.$btnSave.removeClass('disabled');
					me.$btnSave.text('保存');
				}
				
			});
		},
		
        //放弃该企业
        dropEve: function(){
            var me = this;

            var bool = confirm("是否放弃该企业 放弃企业后会进入公海?");
            if( bool ){
                util.api({
                    'url':'/enterprisefiling/dropfiling',
                    'data': {
                        'enterpriseFilingId': me.attrs.enterprisefilingid
                    },
                    'success': function( data ){
                        console.warn( data );
                        if( data.success ){
                            me.hide();
                            me.trigger('dropsuccess');
                        }
                    }
                })
            }
        },


        hide: function(){
            var me = this;
            me.model.clear();
            me.$bindLink.attr({'data-entId':''});
            me.$upload[0].value = '';
            me.toggleDuplicateMessage( 0 );
			me.$('.operat-input').removeAttr('disabled');
            me.$emptyinfo.hide();
            me.$card2.attr('src','');
            me.$card.attr('src','');
			me.$remarkInfo.hide().text('');

            AddFiling.__super__.hide.apply(this,arguments);
        }
    });
        
	module.exports = AddFiling;
});
