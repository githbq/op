define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var EntDetail = require('module/enterprisedetail/enterprisedetail');    //企业详情Slider
    var EntTrace = require('module/enttrace/enttrace');                     //企业跟踪记录
    var uploader = require('common/widget/upload').uploader;
    var InputHandler = require('common/widget/input-handler/inputhandler');
    var Select = require('common/widget/select/select');

    var tem = $( require('./template.html') );

    var pMap = {},           //产品状态
        industryMap = {},    //行业
        activityMap = {};    //活跃度

    /**
     * 增购续费申请
     */
    var RenewApply = MClass( Slider ).include({
        content: tem.filter('#renewapply').html(),
        defaultAttr:{
            'title': '增购续费申请',
            'width': 600
        },
        elements:{
            '.contract': 'contract'
        },
        events:{
            'click .getdiscount': 'getdiscountEve',
            'click .submit': 'sendEve'
        },
        init: function(){
            RenewApply.__super__.init.apply( this, arguments );
            var me = this;

            me.$contract.on('change',function(){
                uploader.send({
                    'url': '/op/api/file/uploadsinglefile',
                    'files': me.$contract[0].files,
                    'success': function( response ){
                        console.warn( response );
                        me.model.set('contract', response.value.model.id );
                        me.model.set('contractName', response.value.model.fileName );
                    }
                })
            });
        },
        getdiscountEve: function(){
            var me = this;

            util.api({
                'url':'/enterprise/getdiscount',
                'data':{
                    'enterpriseId': me.model.get('enterpriseId'),
                    'buyCount': me.model.get('buyCount'),
                    'renewYearCount': me.model.get('renewYearCount'),
                    'amount': me.model.get('amount')
                },
                'success': function( data ){
                    if( data.success ){
                        me.model.set('discount',data.value.model+' ( 折 )');
                    }
                }
            })
        },
        sendEve: function(){
            var me = this;
            util.api({
                'url':'/enterprise/addapply',
                'data':{
                    'enterpriseId': me.model.get('enterpriseId'),
                    'buyCount': me.model.get('buyCount'),
                    'renewYearCount': me.model.get('renewYearCount'),
                    'discount': me.model.get('discount'),
                    'invoiceTitle': me.model.get('invoiceTitle'),
                    'contract': me.model.get('contract'),
                    'contractName': me.model.get('contractName'),
                    'amount': me.model.get('amount')
                },
                'success': function( data ){
                    
                    console.warn( data );
                    if( data.success ){
                        me.hide();
                    }
                }
            })
        },
        show: function( obj ){
            var me = this;

            me.model.set('enterpriseId', obj.enterpriseId);
            me.model.set('enterpriseName', obj.enterpriseName);
            me.model.set('enterpriseAccount', obj.enterpriseAccount);
            me.model.set('address', obj.address);
            me.model.set('productName', obj.productName);
            me.model.set('endTimeStr', new Date( obj.endTime )._format('yyyy-MM-dd') );

            RenewApply.__super__.show.apply( this, arguments );
        },
        hide: function(){
            var me = this;

            me.$contract[0].value='';
            me.model.clear();
            RenewApply.__super__.hide.apply( this, arguments );
        }
    });
    
    
    /**
     *
     * 企业列表
     */
    var EntList = MClass( M.Center ).include({

        elements:{
           '#qcIndustry': 'industry',
            '#qcPModule': 'pModule',
            '#qcSource': 'source',
            '#qcFStatus': 'fstatus',
            '#qcAct': 'activity',
            '#qcSb': 'sb',
            '#qcCode': 'code',
            '#qcATBegin': 'atBegin',
            '#qcATEnd': 'atEnd',
            '#qcOTBegin': 'otBegin',
            '#qcOTEnd': 'otEnd',
            '#qcACBegin': 'acBegin',
            '#qcACEnd': 'acEnd',
            '#qcBCOTBegin': 'bcOTBegin',
            '#qcBCOTEnd': 'bcOTEnd',
            '#qcBCACBegin': 'bcACBegin',
            '#qcBCACEnd': 'bcACEnd',

            '#eiProvince': 'province',
            '#eiPStatus': 'pstatus',

            '.header-info': 'headerInfo',
            'tbody': 'tbody',
			'.trtabList':'trtabList'
        },

        events:{
            'click .search': 'searchEve',
            'click .detail': 'detailEve',
            'click .trackrecord': 'trackEve',
            'click .renew': 'renewEve',
			'click .enterpriseAssign': 'enterpriseAssignEve'
        },

        init: function(){
            EntList.__super__.init.apply( this,arguments );
            var me = this;
            
            me.pagination = new Pagination( {
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
			
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            }
			/*
            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });
			*/
            me.getEnums();
            me.on('empty:list',function(){
                me.$tbody.html("<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>");
            })


            me.attrs['vendorId'] = IBSS.role_vendorId;
            me.model.set('promotionCode', me.attrs['vendorId']);

            me.$atBegin.datetimepicker( { timepicker: false, format: 'Y/m/d' } );
            me.$atEnd.datetimepicker( { timepicker: false, format: 'Y/m/d' } );

            me.$otBegin.datetimepicker( { timepicker: false, format: 'Y/m/d' } );
            me.$otEnd.datetimepicker( {timepicker: false, format: 'Y/m/d'} );

            me.$bcOTBegin.datetimepicker( {timepicker: false, format: 'Y/m/d'} );
            me.$bcOTEnd.datetimepicker( {timepicker: false, format: 'Y/m/d'} );

            /**
             *
             * 如果hash参数中有productId 
             * 则增加produceId 的 筛选条件
             */
            if( me.attrs['productId'] && me.attrs['productId'].length > 0 ){
                
                //获取产品列表
                util.api({
                    'url': '/product/querypage',
                    'data':{
                        'isPage': 1
                    },
                    'success': function( data ){
                        console.warn( data );
                        if( data.success ){
                            var pStr = "";
                            data.value.model.content.forEach(function(item){
                                if( item.id == me.attrs['productId'] ){
                                    pStr = '(' + item.name + '(' + item.deviceMaxCount + '终端)：' + '终端' + item.deviceMaxCount + '个/一次性赠送短信' + item.textMessageCount + '条/' + item.storage + ')';
                                }
                            });
                            me.$headerInfo.text( pStr );     
                        }
                    }
                });
            }

            /*
            var ih2 = new InputHandler({ view: me.$view.find('.m-ih-space'), target: me.$view.find('#qcSb')  });

            var ih3 = new Select({'view': me.$view.find('.select-kt') });
            var ih4 = new Select({'view': me.$view.find('.select-dq') });
            var ih5 = new Select({'view': me.$view.find('.select-zl') });
            var ih6 = new Select({'view': me.$view.find('.select-bcdq') });
            var ih7 = new Select({'view': me.$view.find('.select-bczl') });
            ih3.on('select',function( value ){
                var beginTime = '',
                    endTime = '';

                switch( value ){
                    case '1':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(0);
                    break;
                    case '2':
                        beginTime = util.getDateStr(-1);
                        endTime = util.getDateStr(-1);
                    break;
                    case '3':
                        beginTime = util.getDateStr(-2);
                        endTime = util.getDateStr(-2);
                    break;
                }
                
                me.$atBegin.val( beginTime );
                me.$atEnd.val( endTime );

            });

            ih4.on('select',function( value ){
                var beginTime = '',
                    endTime = '';
                switch( value ){
                    case '1':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(7);
                    break;
                    case '2':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(15);
                    break;
                    case '3':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(30);
                    break;
                    case '4':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(60);
                    break;
                }
                me.$otBegin.val( beginTime );
                me.$otEnd.val( endTime );
            });

            ih5.on('select',function( value ){
                var beginCount = '',
                    endCount = '';

                switch( value ){
                    case '1':
                        beginCount = 0,
                        endCount = 20;
                    break;
                    case '2':
                        beginCount = 0,
                        endCount = 100;
                    break;
                    case '3':
                        beginCount = 0,
                        endCount = 200;
                    break;
                    case '4':
                        beginCount = 0,
                        endCount = 500;
                    break;
                }

                me.$acBegin.val( beginCount );
                me.$acEnd.val( endCount );
            });

            ih6.on('select',function( value ){
                var beginTime = '',
                    endTime = '';
                switch( value ){
                    case '1':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(7);
                    break;
                    case '2':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(15);
                    break;
                    case '3':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(30);
                    break;
                    case '4':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(60);
                    break;
                }
                me.$bcOTBegin.val( beginTime );
                me.$bcOTEnd.val( endTime );
            });

            ih7.on('select',function( value ){
                var beginCount = '',
                    endCount = '';

                switch( value ){
                    case '1':
                        beginCount = 0,
                        endCount = 20;
                    break;
                    case '2':
                        beginCount = 0,
                        endCount = 100;
                    break;
                    case '3':
                        beginCount = 0,
                        endCount = 200;
                    break;
                    case '4':
                        beginCount = 0,
                        endCount = 500;
                    break;
                }

                me.$bcACBegin.val( beginCount );
                me.$bcACEnd.val( endCount );
            });
            */
        },

        trTpl: _.template( tem.filter('#trTpl').html() ),
        
        //获取枚举值
        getEnums: function(){
            var me = this;

            var state = {
                'i': false,
                'p': false,
                's': false,
                'a': false,
                'pro': false,
                'ps': false
               
            };

            function checkReady(){
                if( state.i && state.p && state.s && state.a && state.pro && state.ps  ){
                    me.getList();
                }
            }

            //行业模块
            var ilist = [{'name':'全部','value':''}];
            
            util.getEnums('INDUSTRY',function( data ){

                data.value.model.forEach(function( item ){
                    ilist.push( {'name':item.text,'value':item.value} );
                    industryMap[item.value] = item.text;
                });
                util.resetSelect( me.$industry, ilist );
                state.i = true;
                checkReady();
            });

            //产品模块
            var plist = [{'name':'全部','value':''}];

            util.getEnums('PRODUCT_MODULE',function( data ){

                data.value.model.forEach(function( item ){
                    plist.push( {'name':item.text,'value':item.value} );
                });
                util.resetSelect( me.$pModule, plist );
                state.p = true;
                checkReady();
            })

            //来源模块
            var slist = [{'name':'全部','value':''}];

            util.getEnums('ENT_LST_SOURCE',function( data ){

                data.value.model.forEach(function( item ){
                    slist.push( {'name':item.text,'value':item.value} );
                });
                util.resetSelect( me.$source, slist );
                state.s = true;
                checkReady();
            });


            var alist = [{'name':'全部','value':''}];
            //活跃度
            util.getEnums('ENT_LST_ACTIVITY',function( data ){

                data.value.model.forEach(function( item ){
                    alist.push( {'name':item.text,'value':item.value} );
                    activityMap[item.value] = item.text;
                });
                util.resetSelect( me.$activity, alist );
                state.a = true;
                checkReady();
            })

            //省市
            var proList = [{'name':'全部','value':''}];
            util.getEnums('PROVINCE',function( data ){

                data.value.model.forEach(function( item ){
                    proList.push( {'name':item.text,'value':item.value} );
                });
                util.resetSelect( me.$province ,proList );
                state.pro = true;
                checkReady();
            })

            //产品状态
            var psList = [{'name':'全部','value':''}];
            util.getEnums('ENT_LST_PSTS',function( data ){

                data.value.model.forEach(function( item ){
                    psList.push( {'name':item.text,'value':item.value} );
                    pMap[item.value] = item.text;
                });
                util.resetSelect( me.$pstatus , psList );
                state.ps = true;
                checkReady();
            })
            
            //培训服务费
            /*var serviceList = [{'name':'全部','value':''}];
            util.getEnums('OPEN_VERSION_NUM',function( data ){
                
                data.value.model.forEach(function( item ){
                    serviceList.push( {'name':item.text,'value':item.value} );
                });
                util.resetSelect( me.$('#servicecost'), serviceList );
                state.service = true;
                checkReady();
            })*/
        },

        searchEve: function(){
            this.pagination.setPage( 0 ,false );
            this.getList();
        },

        //查看企业详情
        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger( 'detail', id );
        },
		//代理商内部管理员分配企业给销售
		enterpriseAssignEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');

            this.trigger('enterpriseAssign',id);
        },

        //查看企业跟踪记录
        trackEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger( 'track', id );
        },

        //增购续费
        renewEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            var obj = this.collection.find('id',id);

            this.trigger( 'renew', obj );
        },

        // 获取企业列表数据
    	getList: function(){
            var me = this;

            var data = me.model.all();

            //开通时间开始
            if ( me.$atBegin.val() ) {
                data.fromAppStartTime = new Date( me.$atBegin.val() ).getTime();
            }

            //开通时间结束
            if ( me.$atEnd.val() ) {
                data.toAppStartTime = new Date( me.$atEnd.val() ).getTime();
            }

            //到期时间开始
            if ( me.$otBegin.val() ) {
                data.fromEndTime = new Date( me.$otBegin.val() ).getTime();
            }

            //到期时间结束
            if ( me.$otEnd.val() ) {
                data.toEndTime = new Date( me.$otEnd.val() ).getTime();
            }

            //销客用户总量启
            if ( me.$acBegin.val() ){
                data.fromAccountTotalAmount = me.$acBegin.val(); 
            }

            //销客用户总量止
            if ( me.$acEnd.val() ){
                data.toAccountTotalAmount = me.$acEnd.val();
            }
            
            data.pageIndex = me.pagination.attr['pageNumber'] + 1; 
            data.pageSize = me.pagination.attr['pageSize'];
            data.product = me.attrs['productId'];
            

            util.api({
                'url': '/enterprise/queryeapage',
                'data': data,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){

                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.list.reload( data.value.model.content ,function( item ){
                            item.runStatusStr = pMap[item.runStatus]; 
                            item.industryStr =  industryMap[item.industry];
                            item.activityStr =  activityMap[item.activity];
                        });
                    }
                }
            })
    	},

        //渲染企业列表数据
    	renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var htmlStr = '';

            if( collection.length > 0){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>"
            }
            me.$tbody.html( htmlStr );
    	}

    });
	/**
     * 分配详情
     */
    var EnterpriseAssign = MClass( Slider ).include({

        content: tem.filter('#enterpriseAssignTem').html(),
	
        defaultAttr:{
            'width': 616,
            'title': '企业分配详情'
        },
		accountList:[],
        elements: {
            '.enterprise-assign-Info tbody': 'tbenterpriseAssList',
			'#entAssgin':'entAssginId',
			'.search-name':'searchName'
        },

        events: {
            'click .sale-bind-enterprise': 'saleBindEnterprise',
            'click .btn-search': 'searchEve'
        },
		tpassginEntList: _.template( tem.filter('#trenterpriseAssign').html() ),

        init: function(){
            EnterpriseAssign.__super__.init.apply( this,arguments );
			var me = this;
			me.$searchName.on('keyup',function(){
				 var wd = $(this).val();
				if(wd == ''){
					$('.enterprise-assign-Info tbody tr').show();
				}else{
					$('.enterprise-assign-Info tbody tr').each(function(){
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
		saleBindEnterprise:function(e){
			var me = this,
				$target = $( e.currentTarget ),
				accountId = $target.attr( 'data-id' ),
				enterpriseId = me.$entAssginId.attr('data-enterprise'),
				data = {
					accountId: accountId,
					enterpriseId: enterpriseId
				};
				if(confirm("确定要将企业分配给该销售人员吗？")){
					util.api({
						url: '/enterprise/assignenterprise',
						data: data,
						success: function( data ) {
							if ( data.success ) {
								util.showTip('绑定成功');
								me.trigger('success');
                                me.hide();
							}
						}
					}) ;
				}
				return false;
		},
  		searchEve: function(){
  			var me = this;
  			util.api({
                'url': '/agent/getassignchannellist',
                'data': {
                	'name': me.model.get('name')
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.model.length > 0 ) {
							me.$tbenterpriseAssList.html(me.tpassginEntList( { content: data.model } ));
						} else {
							me.$tbenterpriseAssList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })
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
        //显示代理商列表
        show: function( id ){
            var me = this;
			me.$entAssginId.attr('data-enterprise',id);
		
            util.api({
                'url': '/agent/querysalesaccount',
                'data': {
                	'name': ''
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.value.model.length > 0 ) {
							me.accountList = data.value.model;
							me.$tbenterpriseAssList.html(me.tpassginEntList( { content: data.value.model } ));
						} else {
							me.accountList = [];
							me.$tbenterpriseAssList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })
            EnterpriseAssign.__super__.show.apply( this,arguments );
        },

        hide: function(){
            this.model.clear();
			this.$entAssginId.attr('data-enterprise','');
			this.accountList=[];
            this.$('.state').hide();
            EnterpriseAssign.__super__.hide.apply( this,arguments );
        }
    });

    exports.init = function( param ) {
        var $el = exports.$el;

		var entList = new EntList( { 'view':$el.find('.m-vendorEnt'), 'productId': param && param[0] } );
        var entDetail = new EntDetail( {'isAgent':true} );
		var enterpriseAssign = new EnterpriseAssign();
        var entTrace = new EntTrace();
        var renewApply = new RenewApply();
		
		entList.on('enterpriseAssign',function( id ){
			 enterpriseAssign.show( id );
		});

        entList.on('detail', function( id ){
            entDetail.show( id );
        });

        entList.on('track', function( id ){
            entTrace.show( id );
        });

        entList.on('renew', function( obj ){
            renewApply.show( obj );
        });
		enterpriseAssign.on('success',function(){
			entList.getList();
		})
    }
} );

