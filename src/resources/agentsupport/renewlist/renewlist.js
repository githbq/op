define( function( require, exports, module ) {
      var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
	var Slider = require('common/widget/slider/slider');
	var uploader = require('common/widget/upload').uploader;
	var DetailBind = require('module/detailbind/detailbind');

    var tem = $( require('./template.html') );

    //审批列表
    var RenewList = MClass( M.Center ).include({

        init: function(){
            RenewList.__super__.init.apply( this,arguments );
            var me = this;
			me.attrs.state ="wait";  //当前列表处于哪种状态
            me.pagination = new Pagination( {
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            };

            me.$starttime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );
            me.$endtime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );
            me.$estime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );
            me.$eetime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );

           
            me.getEnums();           

            var trlength = 0;
            me.on('empty:list',function(){
                if( me.attrs.state == "refuse" ){	
                    trlength = 12;
                }else if( me.attrs.state == "wait" ){
                    trlength = 11;
                }else{
					trlength = 10;
				}

                me.$tbody.html("<tr><td colspan='" + trlength + "'><p class='info'>暂无数据</p></td></tr>");
            });
			me.setState();
            me.list.on('reload',function(){
                me.setState();
            });
        },

        elements:{
            '.applytype': 'applytype',
            '.starttime': 'starttime',
            '.endtime': 'endtime',
            '.estime': 'estime',
            '.eetime': 'eetime',
            'tbody': 'tbody'
        },

        events:{
            'click .search': 'searchEve',
            'click .detail': 'detailEve',
            'click .toggle b': 'toggleEve',
			'click .detail-bind':'detailBindEve'
        },

        //获取审批类型枚举值
        getEnums: function(){
            var me = this;

            util.getEnumsSelect('APPROVAL_TYPE',me.$applytype,function( data ){
                me.getList();
            });
        },
        
        //查询
        searchEve: function(){
            var me = this;
            me.pagination.setPage( 0,false );
            me.getList();
        },

        //查看详情
        detailEve: function( e ){
            var me = this;

            var $target = $( e.currentTarget );

            var id = $target.attr('data-id');
            var eid = $target.attr('data-eid');
            var type = $target.attr('data-type');
            var canCancel = $target.attr('data-cancel');
			var applicantYn = $target.attr('data-applicantYn')||'false';
            var isCurrentTask = $target.attr('data-task');
			var isCanEdit = $target.attr('data-edit')||'false';
			//var processInstanceId = $target.attr('data-processInstanceId')||'';
			if ( me.attrs.state == "refuse"){
                me.trigger( 'detail', id , eid , type ,canCancel , isCurrentTask ,isCanEdit,me.attrs.state);
            }else if ( me.attrs.state == "wait"){
                me.trigger( 'detail', id , eid , type , canCancel , isCurrentTask,isCanEdit ,me.attrs.state);
            }else {
                me.trigger( 'detail', id , eid , type ,canCancel , isCurrentTask,isCanEdit,me.attrs.state);
            }
        },
		detailBindEve:function( e ){
			var me = this;

            var $target = $( e.currentTarget );

            var id = $target.attr('data-id');
            var eid = $target.attr('data-eid');
            var type = $target.attr('data-type');
            var canCancel = $target.attr('data-cancel');
			var applicantYn = $target.attr('data-applicantYn')||'false';
            var isCurrentTask = $target.attr('data-task');
			var isCanEdit = $target.attr('data-edit')||'false';
			//var processInstanceId = $target.attr('data-processInstanceId')||'';
			
			if ( me.attrs.state == "refuse"){
                me.trigger( 'detailBind', id , eid , type ,canCancel , isCurrentTask );
            }else if ( me.attrs.state == "wait"){
                me.trigger( 'detailBind', id , eid , type , canCancel , isCurrentTask,isCanEdit );
            }else if( me.attrs.state == "end") {
                me.trigger( 'detailBind', id , eid , type ,canCancel , isCurrentTask,isCanEdit, me.attrs.state);
            }
		},

        //审批状态变更
        toggleEve: function( e ){
            var me = this;
            var $target = $( e.currentTarget );
            $target.addClass('active').siblings().removeClass('active');
            me.attrs.state = $target.attr('data-state');
			console.log(me.attrs.state)
            me.setState();
            me.searchEve();
        },

        //设置状态变更
        setState: function( element ){
            var me = this;
			
            var $parent = element || me.$view;

            $parent.find('.state').hide();
            if( me.attrs.state ){
                $parent.find( '.state-' + me.attrs.state ).show();
				$parent.find( '.' + me.attrs.state+'-approve' ).show();
            }               
        },
		//设置状态
        setNum: function( state,data){
            var me = this;
			var listNum = data.value.model.itemCount||0;
			$('.' + state+'-approve').text(listNum);
        },

        //获取审批中列表
        getList: function(){                                                      
            var me = this;

            var endTimeStart = '',
                endTimeEnd = '',
                applyTimeStart = '',
                applyTimeEnd = '';

            if( me.model.get('applyTimeStart') ){
                applyTimeStart = new Date( me.model.get('applyTimeStart') ).getTime();
            }
            if( me.model.get('applyTimeEnd') ){
                applyTimeEnd = new Date( me.model.get('applyTimeEnd') ).getTime();
            }
            if( me.model.get('endTimeStart') ){
                endTimeStart = new Date( me.model.get('endTimeStart') ).getTime();
            }
            if( me.model.get('endTimeEnd') ){
                endTimeEnd = new Date( me.model.get('endTimeEne') ).getTime();
            }

            var data = {
                'approvalType': me.model.get('approvalType'),
                'enterpriseName': me.model.get('enterpriseName'),
                'enterpriseAccount': me.model.get('enterpriseAccount'),
                'enterpriseShortName': me.model.get('enterpriseShortName'),
                'applyTimeStart': applyTimeStart,
                'applyTimeEnd': applyTimeEnd,
                'pageIndex': me.pagination.attr['pageNumber'],
                'pageSize': me.pagination.attr['pageSize']
            }

            var url;
            switch( me.attrs.state ){
				case 'refuse':
                    url = '/approval/getrefusedapprovalbyapplicant';
					break;
                case 'wait':
                    url = '/approval/getongoingapprovalbyapplicant';
                break;
                case 'end':
                    url = '/approval/getcompletedapprovalbyapplicant';
                    data.endTimeStart = endTimeStart;
                    data.endTimeEnd = endTimeEnd;
					break;
            }

            me.$tbody.html('<tr><td colspan="11"><p class="info">加载中...</p></td></tr>');
            me.xhr && me.xhr.abort();
			console.log(120)
            me.xhr = util.api({
                'url': '~/op/api' + url,
                'data': data,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						me.setNum(me.attrs.state,data);
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.list.reload( data.value.model.content , function( item ){
                            item.applyTimeStr = new Date( item.applyTime )._format('yyyy-MM-dd hh:mm');
                        });
                    }
                }
            })
        }
    });
    
    //审批详情
    var RenewDetail = MClass( Slider ).include({
        //content: tem,
        defaultAttr: {
            width: 700,
            title: '审批详情'
        },
        init: function(){
            RenewDetail.__super__.init.apply( this,arguments );
        },
        show: function( id ){
            var me = this;

            console.log( id );
            RenewDetail.__super__.show.apply( this,arguments );
            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.load( data.value.model );
                    }
                }
            });
        }
        //取消审批

        //
    });

    /**
     *
     *付费开通审批详情
     */
    var OpenApproval = MClass( Slider ).include({
        
        content: tem.filter('#openapproval').html(),

        defaultAttr: {
            'title': '审批详情',
            'width': 700
        },

        elements: {
            '.e-industry': 'industry',
            '.e-source': 'source',
            '.e-province': 'province',
            '.e-group': 'group',
            '.e-knowsource': 'knowsource',
            '.e-motive': 'motive',
            '.contract': 'contract',
			'.contractCopy':'contractCopy',
			'.mtzhizhao': 'mtzhizhao',
			'.yyzhizhao': 'yyzhizhao',
            '.content-product': 'product',
            '.companyscale':'companyscale',
            '.saleteamscale':'saleteamscale',
			'.yearlimit': 'yearlimit',               //合同年限
			'.contractprice': 'contractprice',       //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
			'.marketingAccountAmount':'marketingAccountAmount',
            '.endTime': 'endTime',
			'.status-disabled': 'statusDisabled',
			'.show-type':'showType',
			'.start-time-ht':'startTimeHt',
			'.end-time-ht':'endTimeHt',
			'.look-card':'lookCard',
			'.up-card':'upCard',
			'.look-contract':'lookContract',
			'.contract-hide':'contractHide',
			'.look-yyzhizhao':'lookYyzhizhao',
			'.yyzhizhao-hide':'yyzhizhaoHide',
			'.look-mtzhizhao':'lookMtzhizhao',
			'.mtzhizhao-hide':'mtzhizhaoHide',
			'.contract-link':'contractLink',
			'.img-contract' :'imgContract',
			'.yyzhizhao-link':'yyzhizhaoLink',
			'.img-yyzhizhao' :'imgYyzhizhao',
			'.mtzhizhao-link':'MtzhizhaoLink',
			'.img-mtzhizhao' :'imgMtzhizhao',
			'.look-contractCopy':'lookContractCopy',
			'.contractCopy-link':'contractCopyLink',
			'.img-contractCopy' :'imgContractCopy',
			'.contractCopy-hide' :'contractCopyHide',
			'.action-save':'actionSave',
			'.action-resend':'actionResend',
			'.useBusinessCard':'useBusinessCard',
			'.card-price':'cardPrice',
			'.action-backout':'actionBackout',
			'.add-type':'addType',
			'.up-card-add':'upCardAdd',
			'.status-disabled-add':'statusDisabledAdd',
			'.contractCopyAdd':'contractCopyAdd',
			'.contractAdd':'contractAdd',
			'.action-submit':'actionSubmit',
			'.expenseType':'expenseType',
			'.show-service':'showService',
			'.refuse-disabled':'refuseDisabled'
        },

        events:{
            'click .action-cancel': 'cancelEve',     //取消审批
            'click .action-backout': 'backoutEve',   //撤销审批
            'click .action-resend': 'resendEve'  ,    //重新发送
			'click .action-save': 'saveEve' ,
			'click .action-submit':'submitEve'
        },

        //获取枚举值
        getEnums: function(){
            var me = this;
            
            var state = {
                'i': false,
                'e': false,
                'p': false,
                'g': false,
                'k': false,
                'r': false,
                'c': false,
                's': false,
                'pr': false
            };

            //检查是否获取完毕
            function check(){
                if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.s && state.pr ){
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

            if( me.attrs['isPay'] == true ){

            }

            //获取产品列表
            /*util.api({
                'url': '/product/querypage',
                'data': {
                    'isPage':1
                },
                'success': function( data ){
                    var list = [{'name':'请选择'}]
                    if( data.success ){
                        data.value.model.content.forEach( function( item ){
                            list.push( {'name':item.name,'value':item.id} );
                        });
                        util.resetSelect( me.$product,list );
                        state['pr'] = true;

                        check();
                    }
                }
            });*/
			//年限改变
			/*me.$yearlimit.on('change',function(){
				me.getdiscount();
			});*/

			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
				me.getdiscount();
			});


			me.$deviceamount.on('focusout',function(){
				var buyCount = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
				me.model.set('marketingAccountAmount',parseInt(me.model.get('marketingAccountAmount'))?parseInt(me.model.get('marketingAccountAmount')):'');
				me.model.set('accountTotalAmount',parseInt(me.model.get('accountTotalAmount'))?parseInt(me.model.get('accountTotalAmount')):'');
				if(buyCount>0){
					me.getFreeNum();
				}
				
			});

			//营销版数量改变
			me.$marketingAccountAmount.on('focusout',function(){
				
				me.getFreeNum();
				me.getdiscount();
			});
			
			//合同开始时间
			me.$startTimeHt.on('focusout',function(){
				me.getdiscount();
			});
			//合同介绍时间
			me.$endTimeHt.on('focusout',function(){
				me.getdiscount();
			});
			//是否使用名片
			me.$useBusinessCard.on('change',function(){
				me.getdiscount();
			});
			
			//增购合同金额改变
			me.$('.contractpriceAdd').on('focusout',function(){
			
				//me.model.set('contractPriceAdd',parseFloat(me.model.get('contractPriceAdd'))?parseFloat(me.model.get('contractPriceAdd')):'');
				me.getdiscountAdd();
			});
			
			//服务费修改
			me.$expenseType.on('change',function(){
				if(me.$expenseType.val()==1){
					me.$showService.show();
				}else{
					me.$showService.hide();
				}
			});

			me.$('.accountTotalAmountAdd').on('focusout',function(){
				
				var buyCount = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0;
				me.model.set('marketingAccountAmountAdd',parseInt(me.model.get('marketingAccountAmountAdd'))?parseInt(me.model.get('marketingAccountAmountAdd')):'');
				me.model.set('accountTotalAmountAdd',parseInt(me.model.get('accountTotalAmountAdd'))?parseInt(me.model.get('accountTotalAmountAdd')):'');
				//if(buyCount>0){
					me.getFreeNumAdd();
				//}
				
			});

			//营销版数量改变
			me.$('.marketingAccountAmountAdd').on('focusout',function(){
	
				me.getFreeNumAdd();
				me.getdiscountAdd();
			});
			
			//合同开始时间
			me.$('.start-time-ht-add').on('focusout',function(){
				me.getdiscountAdd();
			});
			//合同介绍时间
			me.$('.end-time-ht-add').on('focusout',function(){
				me.getdiscountAdd();
			});
			//是否使用名片
			me.$('.useBusinessCardAdd').on('change',function(){
				me.getdiscountAdd();
			});

            //获取行业列表
            generate('INDUSTRY', me.$industry , 'i');

            //获取来源
            generate('ENT_LST_SOURCE', me.$source , 'e');

            //获取省市
            generate('PROVINCE', me.$province , 'p');

            //获取团队类型
            generate('GROUP_TYPE', me.$group , 'g');

            //获取了解渠道
            generate('KNOW_SOURCE', me.$knowsource , 'k');

            //获取注册动机
            generate('REGISTER_MOTIVE', me.$motive , 'r');

            //获取公司规模
            generate('CAMPANY_SCALE', me.$companyscale , 'c');

            //获取销售团队规模
            generate('SALE_TEAM_SCALE', me.$saleteamscale ,'s');
			
			
        },
		//增购获取赠送数量
		getFreeNumAdd: function(){
			var me = this;

			var buyCount = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0;
			var	sumNum =  me.$('.accountTotalAmountAdd').val()?parseInt(me.$('.accountTotalAmountAdd').val()):0;
			if(sumNum>0&&sumNum<buyCount){
				util.showToast('营销版数量不能大于销客终端数量');
				me.model.set('marketingAccountAmountAdd','');
				return false;
			}

			/*if(buyCount>0 && me.attrs.type  == 'addPurchaseApproval'){
				me.model.set('isPaidAdd','1');
			}else{
				me.model.set('isPaidAdd','0');
			}*/
		},
		//增购获取折扣
		getdiscountAdd: function(){
			var me = this;
			var contractStartTime = new Date( me.$('.start-time-ht-add').val() ).getTime()||'' ,
				contractEndTime = new Date( me.$('.end-time-ht-add').val() ).getTime()||'',
				contractPrice =me.$('.contractpriceAdd').val(),
				accountAmount = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0,
				buyBusinessCard = me.model.get('useBusinessCardAdd');
				//me.model.set('discountAdd', '0');
			if( contractStartTime && contractEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':contractStartTime,
						'contractEndTime':contractEndTime
					},
					'success': function( data ){
						if( data.success ){
							me.model.set('cardPriceAdd', data.value.model);
							me.$('.card-price-add').show();
							console.log(data);
							return false;
						}
					}
				});
			}
			if(buyBusinessCard =='0'){
				me.$('.card-price-add').hide();
				me.model.set('cardPriceAdd','');
			}

			if( contractStartTime && contractEndTime && accountAmount && contractPrice && buyBusinessCard ){
				
				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'contractStartTime': contractStartTime,
						'contractEndTime': contractEndTime,
						'accountAmount': accountAmount,
						'contractPrice': contractPrice,
						'buyBusinessCard':buyBusinessCard
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							var tempDiscount = parseFloat(data.value.model).toFixed(1);
							if(tempDiscount<0){
								me.model.set('discountAdd', '');
								util.showToast('计算所得折扣小于0,合同金额需大于等于名片金额！');
								return false;
							}
							me.model.set('discountAdd', tempDiscount);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						}else{
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						}
					}
				})
			}
		},
		//获取赠送数量
		getFreeNum: function(){
			var me = this;

			var buyCount = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
			var	sumNum =  me.$deviceamount.val()?parseInt(me.$deviceamount.val()):0;
			if(sumNum>0&&sumNum<buyCount){
				util.showToast('营销版数量不能大于销客终端数量');
				me.model.set('marketingAccountAmount','');
				return false;
			}
            /*
			if(sumNum!=0&&(sumNum-buyCount)>15){
				util.showToast('终端赠送上限为15,请修改终端总量!');
				me.$deviceamount.val('');
				return false;
			}
            */
			if(buyCount>0 && me.attrs.type  == 'payLaunchApproval'){
				me.model.set('isPaid','1');
			}else{
				me.model.set('isPaid','0');
			}
		},
		//获取折扣
		getdiscount: function(){
			var me = this;
			var contractStartTime = new Date( me.$startTimeHt.val() ).getTime()||'' ,
				contractEndTime = new Date( me.$endTimeHt.val() ).getTime()||'',
				contractPrice = me.model.get('contractPrice'),
				accountAmount = me.model.get('marketingAccountAmount'),
				buyBusinessCard = me.model.get('useBusinessCard');
				
			if( contractStartTime && contractEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':contractStartTime,
						'contractEndTime':contractEndTime
					},
					'success': function( data ){
						if( data.success ){
							me.model.set('cardPrice', data.value.model);
							me.$cardPrice.show();
							console.log(data);
							return false;
						}
					}
				});
			}
			if(buyBusinessCard =='0'){
				me.$cardPrice.hide();
				me.model.set('cardPrice','');
			}

			if( contractStartTime && contractEndTime && accountAmount && contractPrice && buyBusinessCard ){
				
				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'contractStartTime': contractStartTime,
						'contractEndTime': contractEndTime,
						'accountAmount': accountAmount,
						'contractPrice': contractPrice,
						'buyBusinessCard':buyBusinessCard
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							var tempDiscount = parseFloat(data.value.model).toFixed(1);
							if(tempDiscount<0){
								me.model.set('discount', '');
								util.showToast('计算所得折扣小于0,合同金额需大于等于名片金额！');
								return false;
							}
							me.model.set('discount', tempDiscount);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						}else{
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						}
					}
				})
			}
		},

        init: function(){
            OpenApproval.__super__.init.apply( this,arguments );
            var me = this;
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
			me.$('.money-date').datetimepicker( {
                format: 'Y/m/d',
                timepicker: false
            } );

            me.getEnums();
			/**
			 *
			 * 合同上传'actionSave',
			'.action-resend':'actionResend',
			 * input[file]变更时 合同文件自动上传
			 */
			me.$contract.on('change',function(){
				var fileExtension =me.$contract[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					console.log(me.$contract[0].files)
					console.log(333)
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contract[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('contract', response.value.model.path );
							me.model.set('contractFileName', response.value.model.FileName );
							me.$lookContract.show();
							me.$contractHide.hide();
							me.$contractLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgContract.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$contract.val('');
							return false;
						}
					})
				}else{
					me.$contract.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$contractCopy.on('change',function(){
				var fileExtension =me.$contractCopy[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contractCopy[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){	
							console.warn( response );
							me.model.set('contractCopy', response.value.model.path );
							me.model.set('contractCopyFileName', response.value.model.FileName );
							me.$lookContractCopy.show();
							me.$contractCopyHide.hide();
							me.$contractCopyLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgContractCopy.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$contractCopy.val('');
							return false;
						}
					})
				}else{
					me.$contractCopy.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$mtzhizhao.on('change',function(){
				var fileExtension =me.$mtzhizhao[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$mtzhizhao[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('companyGatePicture', response.value.model.path );
							me.model.set('companyGatePictureFileName', response.value.model.FileName );
							me.$lookMtzhizhao.show();
							me.$mtzhizhaoHide.hide();
							me.$MtzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgMtzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$mtzhizhao.val('');
							return false;
						}
					})
				}else{
					me.$mtzhizhao.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$yyzhizhao.on('change',function(){
				var fileExtension =me.$yyzhizhao[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					 uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$yyzhizhao[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('businessLicense', response.value.model.path );
							me.model.set('businessLicenseFileName', response.value.model.FileName );
							me.$lookYyzhizhao.show();
							me.$yyzhizhaoHide.hide();
							me.$yyzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgYyzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$yyzhizhao.val('');
							return false;
						}
					})
				}else{
					me.$yyzhizhao.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			//增购合同与合同副本
			me.$('.contractAdd').on('change',function(){
				var fileExtension = me.$contractAdd[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contractAdd[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){	
							console.warn( response );
							me.model.set('contractAdd', response.value.model.path );
							me.model.set('contractFileNameAdd', response.value.model.FileName );
							me.$('.contract-link-add').show();
							me.$('.contract-hide-add').hide();
							me.$('.contract-link-add').attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$('.img-contract-add').attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$contractCopy.val('');
							return false;
						}
					})
				}else{
					me.$('.contractAdd').val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			//增购合同与合同副本
			me.$('.contractCopyAdd').on('change',function(){
				var fileExtension =me.$contractCopyAdd[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contractCopyAdd[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){	
							console.warn( response );
							me.model.set('contractCopyAdd', response.value.model.path );
							me.model.set('contractCopyFileNameAdd', response.value.model.FileName );
							me.$('.contractCopy-link-add').show();
							me.$('.contractCopy-hide-add').hide();
							me.$('.contractCopy-link-add').attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$('.img-contractCopy-add').attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$contractCopy.val('');
							return false;
						}
					})
				}else{
					me.$('.contractCopyAdd').val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
        },

        //设置状态
        setState: function(){
            var me = this;

            me.$('.state').hide();

            if( me.attrs.canCancel == 'true' ){
                me.$('.state-cancel').show()
				me.$statusDisabled.attr('disabled','disabled');
				me.$refuseDisabled.attr('disabled','disabled');
            }
			if( me.attrs.canCancel == 'false' ){
				me.$statusDisabled.attr('disabled','disabled');
            }
            if( me.attrs.isCurrentTask  == 'true' && (me.attrs.type  != 'addPurchaseApproval' && me.attrs.type  != 'addFreeApproval ')  ){
				if( me.attrs.runStatus == '1' || me.attrs.runStatus == '0' ){
					me.$('.state-current').show();
					me.$statusDisabled.removeAttr('disabled');
					//me.$lookCard.hide()
					me.$upCard.show();
					me.$upCardAdd.hide();
					
				}else{
					me.$actionSubmit.show();
					me.$upCard.hide();
				}
                
            }else if( me.attrs.isCurrentTask  == 'true' && (me.attrs.type  == 'addPurchaseApproval' || me.attrs.type  == 'addFreeApproval') ){
				me.$statusDisabled.attr('disabled','disabled');
				me.$statusDisabledAdd.removeAttr('disabled');
				me.$('.state-current').show();
				me.$upCardAdd.show();
				me.$upCard.hide();
			}else{
				me.$statusDisabled.attr('disabled','disabled');
				//me.$lookCard.show()
				me.$upCard.hide();
				me.$upCardAdd.hide();
				me.$('.state-current').hide();
				me.$statusDisabledAdd.attr('disabled','disabled');
			}
			me.setType();
        },
		//根据申请类型不同显示不同的信息
        setType: function(){
            var me = this;
			me.attrs.orderId = '';

            me.$showType.hide();
			me.$addType.hide();
			me.$('.show-service').hide();
			
            if( me.attrs.type  == 'payLaunchApproval' ){
                me.$showType.show();
            }else if( me.attrs.type  == 'freeLaunchApproval' ){
				me.$showType.hide();
				if( me.attrs.currentState=='end'){
					util.api({
						'url':'/order/getOrderDetailByEnterpriseId ',
						'data':{
							'enterpriseId': me.attrs.eid
						},
						'success': function( data ){
							if( data.success ){
								if( data.value.model.invoice ){
									me.$('.show-service').show();
									me.model.load( data.value.model.invoice )
									me.model.set('amountService', data.value.model.invoice.amount);
									var payDate = data.value.model.invoice.payDate? new Date( data.value.model.invoice.payDate  )._format('yyyy/MM/dd'):'';
									me.model.set('payDate', payDate);
									me.attrs.orderId = data.value.model.invoice.orderId;
								}else{
									me.model.set('expenseType', 0);
								}
							}
						}
					});
				}else{
					util.api({
						'url':'/order/getOrderDetailByProcessInstanceId',
						'data':{
							'processInstanceId': me.attrs.id
						},
						'success': function( data ){
							if( data.success ){
								if( data.value.model.isPayServiceCharge ){
									me.attrs.saveFlag = 1;
									me.$('.show-service').show();
									me.model.load( data.value.model.invoice )
									me.model.set('amountService', data.value.model.invoice.amount);
									var payDate = data.value.model.invoice.payDate? new Date( data.value.model.invoice.payDate  )._format('yyyy/MM/dd'):'';
									me.model.set('payDate', payDate);
									me.attrs.orderId = data.value.model.invoice.orderId;
								}else{
									me.attrs.saveFlag = 0;
									me.model.set('expenseType', 0);
								}
								if(  me.attrs.isCurrentTask  == 'true' ){
									me.$refuseDisabled.removeAttr('disabled');
									if( data.value.model.isServiceChargeReject ){
										me.$expenseType.attr('disabled','disabled');
									}
									
								}
							}
						}
					});
				}
				
			}else if( me.attrs.type  == 'addPurchaseApproval' || me.attrs.type  == 'addFreeApproval' ){
				me.$addType.show();
				//获取增购信息
				util.api({
					'url': '/enterprise/getIncreaseEnterpriseAccountDetail',
					'data':{
						'processInstanceId': me.attrs.id,
						'enterpriseId': me.attrs.eid
						
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							
							if(!data.value.model.isAddFree){
								me.attrs.isAddFree = 0;
								me.$('.buy-box').show();
								var contractStartTimeAdd = data.value.model.contractStartTime ?new Date( data.value.model.contractStartTime  )._format('yyyy/MM/dd'):'';
								var contractEndTimeAdd =data.value.model.contractEndTime? new Date( data.value.model.contractEndTime  )._format('yyyy/MM/dd'):'';
								me.model.set('accountTotalAmountAdd',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
								me.model.set('marketingAccountAmountAdd',(data.value.model.marketingAccountAmount ? data.value.model.marketingAccountAmount:'0') );
								me.model.set('storageTotalSpaceAdd',(data.value.model.storageTotalSpace ? data.value.model.storageTotalSpace:'0') );
								me.model.set('contractStartTimeAdd',(contractStartTimeAdd ? contractStartTimeAdd:'') );
								me.model.set('contractEndTimeAdd',(contractEndTimeAdd ? contractEndTimeAdd:'') );
								
								//me.$('.contractAdd').val(data.value.model.contract);
								if(data.value.model.contract){
									me.model.set('contractAdd',data.value.model.contract );
									me.$('.contract-link-add').show();
									me.$('.contract-hide-add').hide();
									me.$('.contract-link-add').attr('href', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contract);
									me.$('.img-contract-add').attr('src', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contract);
								}else{
									me.model.set('contractAdd','');
									me.$('.contract-link-add').hide();
									me.$('.contract-hide-add').show();
									me.$('.contract-link-add').attr('href', '');
									me.$('.img-contract-add').attr('src', '');
								}
								//显示合同副本
								if(data.value.model.contractCopy){
									me.model.set('contractCopyAdd',data.value.model.contractCopy );
									me.$('.contractCopy-link-add').show();
									me.$('.contractCopy-hide-add').hide();
									me.$('.contractCopy-link-add').attr('href', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contractCopy);
									me.$('.img-contractCopy-add').attr('src', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contractCopy);
								}else{
									me.model.set('contractCopyAdd','' );
									me.$('.contractCopy-link-add').hide();
									me.$('.contractCopy-hide-add');
									me.$('.contractCopy-link-add').attr('href', '');
									me.$('.img-contractCopy-add').attr('src', '');
								}
								me.model.set('contractPriceAdd',(data.value.model.contractPrice ? data.value.model.contractPrice:'0') );
								me.model.set('discountAdd',(data.value.model.discount ? data.value.model.discount.toFixed(1):'0') );
								me.model.set('invoiceTitleAdd',(data.value.model.invoiceTitle ? data.value.model.invoiceTitle:'') );
								var marketingAccountAmountNum = data.value.model.marketingAccountAmount?parseInt(data.value.model.marketingAccountAmount):0;
								
								/*if( marketingAccountAmountNum > 0){
									me.model.set('isPaidAdd','1');
								}else{
									me.model.set('isPaidAdd','0');
								}*/

								if( data.value.model.useBusinessCard == '1'){
									me.$('.card-price-add').show();
									me.model.set('useBusinessCardAdd','1');
									//me.model.set('cardPriceAdd',data.value.model.businessCardPrice);
									util.api({
										'url':'/enterprise/getbusinesscardprice',
										'data':{
											'contractStartTime':data.value.model.contractStartTime,
											'contractEndTime':data.value.model.contractEndTime
										},
										'success': function( data ){
											if( data.success ){
												me.model.set('cardPriceAdd', data.value.model);
											}
										}
									});
								}else{
									
									me.model.set('cardPriceAdd','');
									me.model.set('useBusinessCardAdd','0');
									me.$('.card-price-add').hide();
								}
							}else{
								me.attrs.isAddFree = 1;
								me.$('.free-box').show();
								me.model.set('freeAccountTotalAmount',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
								me.model.set('freeStorageTotalSpace',(data.value.model.storageTotalSpace ? data.value.model.storageTotalSpace:'0') );
								
							}
							
						
						}
					}
				});
			}
        },

        /**
         *
         * 取消审批
         */
         /*
        cancelEve: function(){
            var me = this;

            var bool = confirm("是否取消此次审批 取消后审批将删除?");

            if( bool == true ){
                util.api({
                    'url':'/cancelapproval',
                    'data':{
                        'processInstanceId': me.attrs.id,
                    },
                    'success': function( data ){
                        if( data.success ){
                            util.showTip('取消成功');
                            me.trigger('update');
                            me.hide();
                        }
                    }
                });
            }
        },
        */
        
        /**
         *
         *撤销审批
         */
        backoutEve: function(){
            var me = this;
			
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
            util.api({
                'url': '~/op/api/approval/withdrawapproval',
                'data':{
                    'processInstanceId': me.attrs.id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        util.showTip('撤销成功');
						me.trigger( 'saveSuccess');
						me.$statusDisabled.removeAttr('disabled');
                        me.attrs.canCancel = 'false';
                        me.attrs.isCurrentTask = 'true';
                        me.setState();
                    }
                },
				'complete': function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
            })
        },

        /**
         *
         *保存不提交
         */
		saveEve: function(){
            var me = this;
			if( me.attrs.type  == 'payLaunchApproval' || me.attrs.type  == 'freeLaunchApproval'){
				me.saveFreeBuyEve();
			} else if( me.attrs.type  == 'addPurchaseApproval' ||  me.attrs.type  == 'addFreeApproval' ){
				me.saveAddEve();
			}
            
        },  
		//保存并提交
        resendEve: function(){
			var me = this;
			if( me.attrs.type  == 'payLaunchApproval' || me.attrs.type  == 'freeLaunchApproval'){
				me.resendFreeBuyEve();
			} else if( me.attrs.type  == 'addPurchaseApproval'||  me.attrs.type  == 'addFreeApproval' ){
				me.resendAddEve();
			}
            
        }, 
		//免费开通付费开通的保存
		saveFreeBuyEve: function(){
            var me = this;
			me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
			me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
			var objDate = me.model.all();
			objDate['contract']=me.model.get('contract');
			objDate['contractFileName']=me.model.get('contractFileName');
			objDate['contractCopy']=me.model.get('contractCopy');
			objDate['contractCopyFileName']=me.model.get('contractCopyFileName');
			objDate['companyGatePicture']=me.model.get('companyGatePicture');
			objDate['companyGatePictureFileName']=me.model.get('companyGatePictureFileName');
			objDate['businessLicense']=me.model.get('businessLicense');
			objDate['businessLicenseFileName']=me.model.get('businessLicenseFileName');
			objDate['contractStartTime']=new Date( me.$startTimeHt.val() ).getTime();
			objDate['contractEndTime']=new Date( me.$endTimeHt.val() ).getTime();
			if( me.attrs.type  == 'payLaunchApproval' ){
                objDate['contractType'] = 1;
				objDate['contractPrice']=me.model.get('contractPrice');
				objDate['discount']=me.model.get('discount');
				objDate['useBusinessCard']=me.model.get('useBusinessCard');
				objDate['invoiceTitle']=me.model.get('invoiceTitle');
				objDate['isPaid']=me.model.get('isPaid');
				var countNum = me.model.get('accountTotalAmount')?parseInt(me.model.get('accountTotalAmount')):0;
				var singleNum = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
				objDate['marketingAccountAmount'] = me.model.get('marketingAccountAmount');
				if(countNum==0 && singleNum==0){
					util.showToast('销客终端数量与营销版数量不能同时为零！');
					return false;
				}
				if(countNum!=0&&(countNum<singleNum)){
					
					util.showToast('营销版数量不能大于销客终端数量');
					return false;
				}
				if(countNum==0&&singleNum>0){
					//me.model.set('accountTotalAmount',me.model.get('marketingAccountAmount'));
					objDate['accountTotalAmount']=me.model.get('marketingAccountAmount');
				}
				if(!objDate['contractPrice']|| !objDate['discount'] || !objDate['invoiceTitle']){
					util.showToast('信息填写不完整');
					return false;
				}
				
            }else{
				objDate['contractType'] = 0;
				objDate['contractPrice']='';
				objDate['discount']='';
				objDate['invoiceTitle']='';
				objDate['accountTotalAmount']=me.model.get('accountTotalAmount');
				objDate['marketingAccountAmount'] = 0;
				objDate['isPaid']='0';
				objDate['useBusinessCard']='0';
				var countNum=parseInt(me.model.get('accountTotalAmount'));
                /*
				if(countNum==0||countNum>15){
					util.showToast('销客终端数量不能为零且上限为15！');
					return false;
				}
                */
			}
			
			//检测必填项
			var state = true; 
			me.$('.required').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');
				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
					
				}else{
					util.unWarnInput( $this );
				}
			});
			if( !me.model.get('contract')){
				util.warnInput( $('.contract') );
				state = false;
			}else{
				util.unWarnInput( $('.contract') );
			}

			if( !objDate['contractStartTime'] ){
				util.warnInput( $('.start-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.start-time-ht') );
			}

			if( !objDate['contractEndTime'] ){
				util.warnInput( $('.end-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.end-time-ht'));
			}

			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
			
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
            util.api({
                url: '/enterprise/updateenterprise',
                data: objDate,
                success: function( data ) {

                    if ( data.success && me.attrs.type != 'freeLaunchApproval' && !me.attrs.orderId ) {
                         util.showTip('保存更新成功！');
						 me.trigger( 'saveSuccess');
						 me.hide();
                    }else if( data.success && me.attrs.type == 'freeLaunchApproval'){
						var serviceObj = {};
						
						/**
						 * 被驳回后原本不收取服务费的审批修改成收取服务费，需要创建服务费相关信息
						 * @param request request
						 * @param processInstanceId 审批流ID
						 * @param serviceChargeAmount 服务费金额
						 * @param invoiceHead 发票抬头
						 * @param payerName 付款人姓名
						 * @param payDate 付款日期
						 * @return
						 */
						if(me.attrs.saveFlag != me.$expenseType.val()){ 
							serviceObj['processInstanceId'] = me.attrs.id;
							serviceObj['serviceChargeAmount'] = me.model.get('amountService');
							serviceObj['payServiceCharge'] = me.model.get('expenseType');
							serviceObj['invoiceHead'] = me.model.get('invoiceHead');
							serviceObj['payerName'] = me.model.get('payerName');
							serviceObj['payDate'] = me.$('.money-date').val()? new Date( me.$('.money-date').val() ).getTime():'';
							
							 util.api({
								'url': '/order/changeToPayServiceCharge',
								'data':serviceObj,
								'success': function( data ){
									
									if( data.success ){
										util.showTip('保存更新成功！');
										me.trigger( 'saveSuccess');
										me.hide();
									}
								}
							});
						}else if( me.$expenseType.val()==1 && me.attrs.saveFlag == me.$expenseType.val()){
							serviceObj['orderId'] = me.attrs.orderId;
							serviceObj['amount'] = me.model.get('amountService');
							serviceObj['expenseType'] = me.model.get('expenseType');
							serviceObj['invoiceHead'] = me.model.get('invoiceHead');
							serviceObj['payerName'] = me.model.get('payerName');
							serviceObj['payDate'] = me.$('.money-date').val()? new Date( me.$('.money-date').val() ).getTime():'';
							
							util.api({
								'url': '/order/updateOrderInvoice',
								'data':serviceObj,
								'success': function( data ){
									
									if( data.success ){
										util.showTip('保存更新成功！');
										me.trigger( 'saveSuccess');
										me.hide();
									}
								}
							});
						}else{
							util.showTip('保存更新成功！');
							 me.trigger( 'saveSuccess');
							 me.hide();
						}
					}
                },
				complete: function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
            });
            
        },  
		saveAddEve: function(){
            var me = this;
			
			if(!me.attrs.isAddFree){
				var objDate = {};
				objDate['processInstanceId'] = me.attrs.id;
				objDate['enterpriseId']= me.attrs.eid;
				objDate['accountTotalAmount'] = me.model.get('accountTotalAmountAdd');
				objDate['marketingAccountAmount'] = me.model.get('marketingAccountAmountAdd');
				var tempNum = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0;
				if(tempNum == 0){
					//me.model.set('discountAdd', '1');
					me.model.set('contractPriceAdd','0');
				}else{
					if( !me.model.get('invoiceTitleAdd')){
						util.warnInput( $('.invoiceTitleAdd') );
						state = false;
					}else{
						util.unWarnInput( $('.invoiceTitleAdd') );
					}
				}
				objDate['storageTotalSpace']=me.model.get('storageTotalSpaceAdd');
				objDate['contract']=me.model.get('contractAdd');
				objDate['contractFileName']=me.model.get('contractFileNameAdd');
				objDate['contractCopy']=me.model.get('contractCopyAdd');
				objDate['contractCopyFileName']=me.model.get('contractCopyFileNameAdd');
				objDate['contractPrice']=me.model.get('contractPriceAdd');
				objDate['contractStartTime']=new Date( me.$('.start-time-ht-add').val() ).getTime();
				objDate['contractEndTime']=new Date( me.$('.end-time-ht-add').val() ).getTime();
				objDate['discount']=me.model.get('discountAdd');
				objDate['invoiceTitle']=me.model.get('invoiceTitleAdd');
				objDate['useBusinessCard']=me.model.get('useBusinessCardAdd');
					
				//检测必填项
				var state = true; 
				me.$('.required-add').each(function(){
					var $this = $( this );
					var attr = $this.attr('ce-model');
					if( !me.model.get(attr) ){
						util.warnInput( $this );
						state = false;
						
					}else{
						util.unWarnInput( $this );
					}
				});
				if( !me.model.get('contractAdd')){
					util.warnInput( $('.contractAdd') );
					state = false;
				}else{
					util.unWarnInput( $('.contractAdd') );
				}

				if( !objDate['contractStartTime'] ){
					util.warnInput( $('.start-time-ht-add') );
					state = false;
				}else{
					util.unWarnInput( $('.start-time-ht-add') );
				}

				if( !objDate['contractEndTime'] ){
					util.warnInput( $('.end-time-ht-add') );
					state = false;
				}else{
					util.unWarnInput( $('.end-time-ht-add'));
				}

				if( state == false ){
					util.showToast('信息填写不完整');
					return ;
				}
				
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
				me.$actionSave.text('提交中....');
				me.$actionSave.attr('disabled','disabled');
				me.$actionBackout.text('提交中....');
				me.$actionBackout.attr('disabled','disabled');
				util.api({
					url: '/enterprise/updateincreaseenterpriseaccount',
					data: objDate,
					success: function( data ) {

						if ( data.success ) {
							 util.showTip('保存更新成功！');
							 me.trigger( 'saveSuccess');
							 me.hide();
						}
					},
					complete: function(){
						me.$actionResend.text('保存提交');
						me.$actionResend.removeAttr('disabled');
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
						me.$actionBackout.text('撤销审批');
						me.$actionBackout.removeAttr('disabled');
					}
				});
			}else{
				var  me = this;
				var objDate = {};
			
				if(!parseInt(me.model.get('freeAccountTotalAmount')) || parseInt(me.model.get('freeAccountTotalAmount'))<1){
					util.showToast('增购办公版数量不能小于等于0！');
					return false;
				}
				if(!parseFloat(me.model.get('freeStorageTotalSpace')) || parseFloat(me.model.get('freeStorageTotalSpace'))<0){
					util.showToast('增购空间数量不能小于等于0！');
					return false;
				}
				objDate['processInstanceId'] = me.attrs.id;
				objDate['enterpriseId']= me.attrs.eid;
				objDate['accountTotalAmount'] = me.model.get('freeAccountTotalAmount');
				objDate['storageTotalSpace'] = me.model.get('freeStorageTotalSpace');
				
				util.api({
					'url': '/enterprise/updateincreaseenterpriseaccountfree',
					'data': objDate,
					'success': function( data ) {
						 util.showTip('保存更新成功！');
						 me.trigger( 'saveSuccess');
						 me.hide();
					},
					complete: function(){
						me.$actionResend.text('保存提交');
						me.$actionResend.removeAttr('disabled');
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
						me.$actionBackout.text('撤销审批');
						me.$actionBackout.removeAttr('disabled');
					}
				});
				
			}
			
			
            
        },  
		//免费开通付费开通的保存提交
        resendFreeBuyEve: function(){
			var me = this;
			me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
			me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
			var objDate = me.model.all();
			objDate['contract']=me.model.get('contract');
			objDate['contractFileName']=me.model.get('contractFileName');
			objDate['contractCopy']=me.model.get('contractCopy');
			objDate['contractCopyFileName']=me.model.get('contractCopyFileName');
			objDate['companyGatePicture']=me.model.get('companyGatePicture');
			objDate['companyGatePictureFileName']=me.model.get('companyGatePictureFileName');
			objDate['businessLicense']=me.model.get('businessLicense');
			objDate['businessLicenseFileName']=me.model.get('businessLicenseFileName');
			objDate['contractStartTime']=new Date( me.$startTimeHt.val() ).getTime();
			objDate['contractEndTime']=new Date( me.$endTimeHt.val() ).getTime();
			if( me.attrs.type  == 'payLaunchApproval' ){
				
                objDate['contractType'] = 1;
				objDate['contractPrice']=me.model.get('contractPrice');
				objDate['discount']=me.model.get('discount');
				objDate['invoiceTitle']=me.model.get('invoiceTitle');
				objDate['useBusinessCard']=me.model.get('useBusinessCard');
				
				objDate['isPaid']=me.model.get('isPaid');
				var countNum = me.model.get('accountTotalAmount')?parseInt(me.model.get('accountTotalAmount')):0;
				var singleNum = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
				if(countNum==0 && singleNum==0){
					util.showToast('销客终端数量与营销版数量不能同时为零！');
					return false;
				}
				if(countNum!=0&&(countNum<singleNum)){
					
					util.showToast('营销版数量不能大于销客终端数量');
					return false;
				}
				objDate['marketingAccountAmount']=me.model.get('marketingAccountAmount');
				if(countNum==0&&singleNum>0){
					//me.model.set('accountTotalAmount',me.model.get('marketingAccountAmount'));
					objDate['accountTotalAmount']=me.model.get('marketingAccountAmount');
				}
				if(!objDate['contractPrice']|| !objDate['discount'] || !objDate['invoiceTitle']){
					util.showToast('信息填写不完整');
					return false;
				}
				
            }else{
				objDate['contractType'] = 0;
				objDate['contractPrice']='';
				objDate['discount']='';
				objDate['invoiceTitle']='';
				objDate['marketingAccountAmount'] = 0;
				objDate['accountTotalAmount']=me.model.get('accountTotalAmount')
				objDate['isPaid']='0';
				objDate['useBusinessCard'] = '0';
				
				var countNum = me.model.get('accountTotalAmount')?parseInt(me.model.get('accountTotalAmount')):0;
				/*
                if(countNum==0||countNum>15){
					util.showToast('销客终端数量不能为零且上限为15！');
					return false;
				}
                */
			}
			
			//检测必填项
			var state = true; 
			me.$('.required').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');

				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
				}else{
					util.unWarnInput( $this );
				}
			});
			if( !me.model.get('contract')){
				util.warnInput( $('.contract') );
				state = false;
			}else{
				util.unWarnInput( $('.contract') );
			}

			if( !objDate['contractStartTime'] ){
				util.warnInput( $('.start-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.start-time-ht') );
			}

			if( !objDate['contractEndTime'] ){
				util.warnInput( $('.end-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.end-time-ht'));
			}

			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
            //移交至下一个节点
            function changeNode(){
                util.api({
                    'url':'~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.id,
                        'approved': true,
                        'opinion':''
                    },
                    'success':function( data ){
                        if( data.success ){
                            util.showTip('保存提交发送成功');
							me.trigger( 'saveSuccess');
							me.$statusDisabled.attr('disabled','disabled');
                            me.hide();
                        }
                    }
                })
            };
			 //保存服务信息
            function saveService(){
				var serviceObj = {};

				if(me.attrs.saveFlag != me.$expenseType.val()){ 
					serviceObj['processInstanceId'] = me.attrs.id;
					serviceObj['serviceChargeAmount'] = me.model.get('amountService');
					serviceObj['payServiceCharge'] = me.model.get('expenseType');
					serviceObj['invoiceHead'] = me.model.get('invoiceHead');
					serviceObj['payerName'] = me.model.get('payerName');
					serviceObj['payDate'] = me.$('.money-date').val()? new Date( me.$('.money-date').val() ).getTime():'';
					
					 util.api({
						'url': '/order/changeToPayServiceCharge',
						'data':serviceObj,
						'success': function( data ){
							
							if( data.success ){
								changeNode();
							}
						}
					});
				}else if( me.$expenseType.val()==1 && me.attrs.saveFlag == me.$expenseType.val()){
					serviceObj['orderId'] = me.attrs.orderId;
					serviceObj['amount'] = me.model.get('amountService');
					serviceObj['expenseType'] = me.model.get('expenseType');
					serviceObj['invoiceHead'] = me.model.get('invoiceHead');
					serviceObj['payerName'] = me.model.get('payerName');
					serviceObj['payDate'] = me.$('.money-date').val()? new Date( me.$('.money-date').val() ).getTime():'';
					
					util.api({
						'url': '/order/updateOrderInvoice',
						'data':serviceObj,
						'success': function( data ){
							
							if( data.success ){
								changeNode();
							}
						}
					});
				}else{
					changeNode();
				}
            };

            //更新企业详情
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
			
            util.api({
                url: '/enterprise/updateenterprise',
                data: objDate,
                success: function( data ) {

                    if ( data.success ) {
						if( me.attrs.type != 'freeLaunchApproval'){
							changeNode();
						}else{
							saveService();
						}
                    }
                },
				complete: function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
            });
            
        },  
		//增购审批的保存提交
        resendAddEve: function(){
			var me = this;
			if(!me.attrs.isAddFree){
				var objDate = {};
				objDate['processInstanceId'] = me.attrs.id;
				objDate['enterpriseId']= me.attrs.eid;
				objDate['accountTotalAmount'] = me.model.get('accountTotalAmountAdd');
				objDate['marketingAccountAmount'] = me.model.get('marketingAccountAmountAdd');
				objDate['storageTotalSpace']=me.model.get('storageTotalSpaceAdd');
				objDate['contract']=me.model.get('contractAdd');
				objDate['contractFileName']=me.model.get('contractFileNameAdd');
				objDate['contractCopy']=me.model.get('contractCopyAdd');
				objDate['contractCopyFileName']=me.model.get('contractCopyFileNameAdd');
				objDate['contractPrice']=me.model.get('contractPriceAdd');
				objDate['contractStartTime']=new Date( me.$('.start-time-ht-add').val() ).getTime();
				objDate['contractEndTime']=new Date( me.$('.end-time-ht-add').val() ).getTime();
				objDate['discount']=me.model.get('discountAdd');
				objDate['invoiceTitle']=me.model.get('invoiceTitleAdd');
				objDate['useBusinessCard']=me.model.get('useBusinessCardAdd');
				//检测必填项
				var state = true; 
				me.$('.required-add').each(function(){
					var $this = $( this );
					var attr = $this.attr('ce-model');
					if( !me.model.get(attr) ){
						util.warnInput( $this );
						state = false;
						
					}else{
						util.unWarnInput( $this );
					}
				});
				if( !me.model.get('contractAdd')){
					util.warnInput( $('.contractAdd') );
					state = false;
				}else{
					util.unWarnInput( $('.contractAdd') );
				}

				if( !objDate['contractStartTime'] ){
					util.warnInput( $('.start-time-ht-add') );
					state = false;
				}else{
					util.unWarnInput( $('.start-time-ht-add') );
				}

				if( !objDate['contractEndTime'] ){
					util.warnInput( $('.end-time-ht-add') );
					state = false;
				}else{
					util.unWarnInput( $('.end-time-ht-add'));
				}

				if( state == false ){
					util.showToast('信息填写不完整');
					return ;
				}
				
				//移交至下一个节点
				function changeNode(){
					util.api({
						'url':'~/op/api/approval/directapprove',
						'data':{
							'processInstanceId': me.attrs.id,
							'approved': true,
							'opinion':''
						},
						'success':function( data ){
							if( data.success ){
								util.showTip('保存提交发送成功');
								 me.trigger( 'saveSuccess');
								me.$statusDisabled.attr('disabled','disabled');
								me.hide();
							}
						}
					})
				};
				
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
				me.$actionSave.text('提交中....');
				me.$actionSave.attr('disabled','disabled');
				me.$actionBackout.text('提交中....');
				me.$actionBackout.attr('disabled','disabled');
				util.api({
					url: '/enterprise/updateincreaseenterpriseaccount',
					data: objDate,
					success: function( data ) {

						if ( data.success ) {
							  changeNode();
						}
					},
					complete: function(){
						me.$actionResend.text('保存提交');
						me.$actionResend.removeAttr('disabled');
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
						me.$actionBackout.text('撤销审批');
						me.$actionBackout.removeAttr('disabled');
					}
				});

			}else{
				var  me = this;
				var objDate = {};

				if(!parseInt(me.model.get('freeAccountTotalAmount')) || parseInt(me.model.get('freeAccountTotalAmount'))<1){
					util.showToast('增购办公版数量不能小于等于0！');
					return false;
				}
				if(!parseFloat(me.model.get('freeStorageTotalSpace')) || parseFloat(me.model.get('freeStorageTotalSpace'))<0){
					util.showToast('增购空间数量不能小于等于0！');
					return false;
				}
				objDate['processInstanceId'] = me.attrs.id;
				objDate['enterpriseId']= me.attrs.eid;
				objDate['accountTotalAmount'] = me.model.get('freeAccountTotalAmount');
				objDate['storageTotalSpace'] = me.model.get('freeStorageTotalSpace');
				
				//移交至下一个节点
				function changeNode(){
					util.api({
						'url':'~/op/api/approval/directapprove',
						'data':{
							'processInstanceId': me.attrs.id,
							'approved': true,
							'opinion':''
						},
						'success':function( data ){
							if( data.success ){
								util.showTip('保存提交发送成功');
								 me.trigger( 'saveSuccess');
								me.$statusDisabled.attr('disabled','disabled');
								me.hide();
							}
						}
					})
				};
				
				util.api({
					'url': '/enterprise/updateincreaseenterpriseaccountfree',
					'data': objDate,
					'success': function( data ) {
						   changeNode();
					},
					complete: function(){
						me.$actionResend.text('保存提交');
						me.$actionResend.removeAttr('disabled');
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
						me.$actionBackout.text('撤销审批');
						me.$actionBackout.removeAttr('disabled');
					}
				});
				
			}
			
        }, 
		/**
         *
         *提交到下一节点
         */
		submitEve:function(){
			var me = this;
			
			 //保存服务信息
            function saveService(){
				var serviceObj = {};

				if(me.attrs.saveFlag != me.$expenseType.val()){ 
					serviceObj['processInstanceId'] = me.attrs.id;
					serviceObj['serviceChargeAmount'] = me.model.get('amountService');
					serviceObj['payServiceCharge'] = me.model.get('expenseType');
					serviceObj['invoiceHead'] = me.model.get('invoiceHead');
					serviceObj['payerName'] = me.model.get('payerName');
					serviceObj['payDate'] = me.$('.money-date').val()? new Date( me.$('.money-date').val() ).getTime():'';
					
					 util.api({
						'url': '/order/changeToPayServiceCharge',
						'data':serviceObj,
						'success': function( data ){
							
							if( data.success ){
								me.savePassInfo();
							}
						}
					});
				}else if( me.$expenseType.val()==1 && me.attrs.saveFlag == me.$expenseType.val()){
					serviceObj['orderId'] = me.attrs.orderId;
					serviceObj['amount'] = me.model.get('amountService');
					serviceObj['expenseType'] = me.model.get('expenseType');
					serviceObj['invoiceHead'] = me.model.get('invoiceHead');
					serviceObj['payerName'] = me.model.get('payerName');
					serviceObj['payDate'] = me.$('.money-date').val()? new Date( me.$('.money-date').val() ).getTime():'';
					
					util.api({
						'url': '/order/updateOrderInvoice',
						'data':serviceObj,
						'success': function( data ){
							
							if( data.success ){
								me.savePassInfo();
							}
						}
					});
				}else{
					me.savePassInfo();
				}
            };
			saveService();
		},
		 /**
         *
         *已经开通直接
         */
		savePassInfo:function(){
			var me = this;
			
			util.api({
				'url':'~/op/api/approval/directapprove',
				'data':{
					'processInstanceId': me.attrs.id,
					'approved': true,
					'opinion':''
				},
				'success':function( data ){
					if( data.success ){
						util.showTip('提交发送成功');
						 me.trigger( 'saveSuccess');
						me.$statusDisabled.attr('disabled','disabled');
						me.hide();
					}
				}
			})
		},

        /**
         *
         * @param id   实例id
         * @param eid  企业id
         * @param type 类型
         */
        show: function( id , eid , type , canCancel , isCurrentTask,isCanEdit ,currentState ){
            var me = this;

            me.attrs.id = id;
            me.attrs.eid = eid;
            me.attrs.type = type||'false';
            me.attrs.canCancel = canCancel || 'false';
            me.attrs.isCurrentTask = isCurrentTask || 'false';
			me.attrs.isCanEdit = isCanEdit || 'false';
			me.attrs.runStatus = '';
			me.attrs.currentState = currentState;
			//me.attrs.processInstanceId = processInstanceId||''; 
			//me.attrs.applicantYn = applicantYn || 'false';

            function translateBool( key , value ){
                if(value){
                    me.model.set(key,'true');
                }else{
                    me.model.set(key,'false');
                }
            }

            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': me.attrs.eid
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.load( data.value.model );
						me.downFile(data);
						var contractStartTime = data.value.model.contractStartTime ?new Date( data.value.model.contractStartTime  )._format('yyyy/MM/dd'):'';
						var contractEndTime =data.value.model.contractEndTime? new Date( data.value.model.contractEndTime  )._format('yyyy/MM/dd'):'';
						me.model.set('accountTotalAmount',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
						me.model.set('marketingAccountAmount',(data.value.model.marketingAccountAmount ? data.value.model.marketingAccountAmount:'0') );
						me.model.set('isPaid',(data.value.model.isPaid ? data.value.model.isPaid:'0') );
						
						if( data.value.model.useBusinessCard){
							me.$cardPrice.show();
							me.model.set('useBusinessCard','1');
							me.model.set('cardPrice',data.value.model.businessCardPrice);
						}else{
							me.model.set('cardPrice','');
							me.model.set('useBusinessCard','0');
							me.$cardPrice.hide();
						}
						me.model.set('discount',(data.value.model.discount ? data.value.model.discount.toFixed(1):'0') );
						//me.model.set('autoclaveDays',(data.value.model.autoclaveDays ? data.value.model.autoclaveDays:'0') );
						me.model.set('dealDays',(data.value.model.dealDays ? data.value.model.dealDays:'0') );
						me.model.set('city',(data.value.model.city ? data.value.model.city:'') );
						me.model.set('contractStartTime',(contractStartTime ? contractStartTime:'') );
						me.model.set('regionName',data.value.model.regionName?data.value.model.regionName:data.value.model.regionCode);
						me.model.set('contractEndTime',(contractEndTime ? contractEndTime:'') );
                        translateBool( 'isSaleTeam' , data.value.model['isSaleTeam'] );
                        translateBool( 'isFirstmeetingSign' , data.value.model['isFirstmeetingSign'] );
                        translateBool( 'isWillPin' , data.value.model['isWillPin'] );
                        translateBool( 'isStrangerVisits', data.value.model['isStrangerVisits'] );
                        translateBool( 'isFastSign' , data.value.model['isFastSign'] );
                        translateBool( 'isAutoClave', data.value.model['isAutoClave'] );
                        translateBool( 'isReferral', data.value.model['isReferral'] );
						me.attrs.runStatus = data.value.model.runStatus||'';
						me.setState();
                    }
                }
            })
           
			//me.setType();
            OpenApproval.__super__.show.apply( this,arguments );
        },
		/**
         *
         *显示文件
         */
		downFile: function(data){
            var me = this;
			var contractFilePath = data.value.model.contract||'';
			var contractCopyFilePath = data.value.model.contractCopy||'';
			var businessLicense = data.value.model.businessLicense||'';
			var companyGatePicture = data.value.model.companyGatePicture||'';
            //更新企业详情
			//var a = '~/op/api/file/previewimage ' + '?fileName=' + fileName ;
			//显示合同下载
            if(contractFilePath){
				me.$lookContract.show();
				me.$contractHide.hide();
				me.$contractLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
				me.$imgContract.attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
			}else{
				me.$lookContract.hide();
				me.$contractHide.show();
				me.$contractLink.attr('href', '');
				me.$imgContract.attr('src', '');
			}
			//显示合同副本
            if(contractCopyFilePath){
				me.$lookContractCopy.show();
				me.$contractCopyHide.hide();
				me.$contractCopyLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + contractCopyFilePath);
				me.$imgContractCopy.attr('src', '/op/api/file/previewimage' + '?filePath=' + contractCopyFilePath);
			}else{
				me.$lookContractCopy.hide();
				me.$contractCopyHide.show();
				me.$contractCopyLink.attr('href', '');
				me.$imgContractCopy.attr('src', '');
			}
			//显示营业执照下载
            if(businessLicense){
				me.$lookYyzhizhao.show();
				me.$yyzhizhaoHide.hide();
				me.$yyzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + businessLicense);
				me.$imgYyzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + businessLicense);
			}else{
				me.$lookYyzhizhao.hide();
				me.$yyzhizhaoHide.show();
				me.$yyzhizhaoLink.attr('href', '');
				me.$imgYyzhizhao.attr('src', '');
				
			}
			//显示门头执照下载
            if(companyGatePicture){
				me.$lookMtzhizhao.show();
				me.$mtzhizhaoHide.hide();
				me.$MtzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + companyGatePicture);
				me.$imgMtzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + companyGatePicture);
			}else{
				me.$lookMtzhizhao.hide();
				me.$mtzhizhaoHide.show();
				me.$MtzhizhaoLink.attr('href', '');
				me.$imgMtzhizhao.attr('src', '');
			}
        },  
        //重新发送
        hide: function(){
            var me = this;
			me.model.clear();
			me.$contractLink.attr('href', '');
			me.$imgContract.attr('src', '');
			me.$MtzhizhaoLink.attr('href', '');
			me.$imgMtzhizhao.attr('src', '');
			me.$yyzhizhaoLink.attr('href', '');
			me.$('.free-box').hide();
			me.$('.buy-box').hide();
			me.$imgYyzhizhao.attr('src', '');
			me.$contractCopyLink.attr('href','');
			me.$imgContractCopy.attr('src', '');
			me.$('.contract-link-add').attr('href','');
			me.$('.img-contract-add').attr('src', '');
			me.$('.contractCopy-link-add').attr('href','');
			me.$('.img-contractCopy-add').attr('src', '');
            me.$('.state').hide();
            OpenApproval.__super__.hide.apply( this,arguments );
        }
    })
    
    exports.init = function( param ) {
        var $el = exports.$el;

        //审批中列表
        var renewList = new RenewList( {'view':$el.find('.m-renewlist')} );

        //付费开通审批详情
        var openApproval = new OpenApproval();
		var detailBind = new DetailBind();


        renewList.on('detail',function( id , eid , type , state,isCurrentTask,isCanEdit,currentState ){
            
            openApproval.show( id , eid , type , state,isCurrentTask,isCanEdit ,currentState );
        });
		renewList.on('detailBind',function( id , eid , type , state,isCurrentTask,isCanEdit, activeStatus ){
		
            detailBind.show( id , eid , type , state,isCurrentTask,isCanEdit ,activeStatus );
        });

        openApproval.on('update',function(){
            renewList.searchEve();
        });
		openApproval.on('saveSuccess',function(){
            renewList.getList();
        });
		detailBind.on('sendsuccess',function(){
            renewList.searchEve();
        });
    }

} );

