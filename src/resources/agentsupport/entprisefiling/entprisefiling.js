define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
        TplEvent = IBSS.tplEvent;

    var AddFiling = require('module/filingdetail/filingdetail');
    var FilingLog = require('module/filinglog/filinglog');
	var FilingAssgin = require('module/filingassgin/filingassgin');
	var Dialog = require('common/widget/dialog/dialog');
    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var tem = $( require('./template.html') );

    var statusMap = {},industryMap = {},sourceMap = {};
    
   /**
    *
    * 代理商用户
    * 备案企业列表
    */
    var FilingList = MClass( M.Center ).include({

    	init: function(){
    		FilingList.__super__.init.apply( this,arguments );

            var me = this;
    	    
            me.$startTime.datetimepicker({'timepicker': false,'format':'Y-m-d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y-m-d'});

            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            };

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            me.getEnums();
        },
        trTpl: _.template( tem.filter('#filinglist').html() ),
        events: {
            'click .add-filing': 'addEve',
            'click .filing-detail': 'detailEve',
            'click .filing-log': 'logEve',
			'click .filing-assgin': 'assginEve',
            'click .search': 'searchEve',
            'click .export': 'exportEve',
            'click .filing-reason': 'reasonEve',
			'click .bind-link':'bindLinkEve'
        },

        elements:{
            'tbody': 'tbody',
            '.startTime': 'startTime',
            '.endTime': 'endTime',
            '.status': 'status',
			'.status': 'status',
			'.industry-data': 'industryData',
			'.source-data':'sourceData'
        },

        //获取状态枚举值
        getEnums: function(){
            var me = this;
            var statusList = [{'name':'全部','value':''}],industryList=[{'name':'全部','value':''}],sourceList=[{'name':'全部','value':''}];

            var state = {
                a: false,
                b: false,
                c: false
            }

            //
            function checkState(){
                if( state.a && state.b && state.c ){
                    me.getList();
                }
            }

            util.getEnums('FILING_STATUS',function( data ){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       statusMap[ item.value ] = item.text;
                       statusList.push( {'name':item.text,'value':item.value} );
                    });

                    util.resetSelect( me.$status, statusList );
                    state.a = true;
                    checkState();
                }
            });

            util.getIndustry( me.$industryData,function( data ){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       industryMap[ item.value ] = item.text;
                    });
                    
                    state.b = true;
                    checkState();
                }
            });

			util.getEnums('ENT_LST_SOURCE',function( data ){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       sourceMap[ item.value ] = item.text;
                       sourceList.push( {'name':item.text,'value':item.value} );
                    });

                    util.resetSelect( me.$sourceData, sourceList );
                    state.c = true;
                    checkState();
                }
            })
        },

        searchEve: function(e){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        //导出excel
        exportEve: function(e){
            var me = this;

            var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }

            var queryData = {
                'venderId': IBSS.role_vendorId,
                'enterpriseName': me.model.get('enterpriseName'),
                'status': me.model.get('status'),
                'active': me.model.get('active'),
				'industry': me.model.get('industryList'),
				'source': me.model.get('sourceList'),
                'startTime': startTime,
                'entTime': endTime
            }
            
            window.open( IBSS.API_PATH + '/enterprisefiling/exportfiling?' + $.param( queryData ) );
        },

        //查看驳回原因
        reasonEve: function( e ){
            var reason = $( e.currentTarget ).attr('data-reason');
            this.trigger('reject',reason);
        },

        //获取备案企业列表
        getList: function(){
            var me = this;

            var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }


            util.api({
                'url':'/enterprisefiling/queryfiling',
                'data':{
                    'vendorId': IBSS.role_vendorId,
                    'enterpriseName': me.model.get('enterpriseFilingName'),
                    'status': me.model.get('status'),
                    'active': me.model.get('active'),
					'industry': me.model.get('industryList'),
					'source': me.model.get('sourceList'),
                    'startTime': startTime,
					'creatorName':me.model.get('creatorName'),
                    'endTime': endTime,
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize']
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.collection.reload( data.value.model.content, function( item ){
							item.creatorNameStr = item.creator ?(item.creator.name?item.creator.name:'——'):'——';
                            item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
                            item.statusStr = statusMap[ item.status ];
							item.industryStr = industryMap[ item.industry ];
							item.sourceStr = sourceMap[ item.source ];	
                        });

                        me.pagination.setTotalSize( data.value.model.itemCount );
                    }
                }
            })
        },

        //渲染列表
        renderList: function(){
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';

            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            }else{
                htmlStr = "<tr> <td colspan='11'><p class='info'>暂无数据</p></td> </tr>"
            }

            me.$tbody.html( htmlStr );
            TplEvent.setPermissions( me.$tbody );
        },

        addEve: function(){
            console.log('addfiling');
            this.trigger('add');
        },

        //查看详情
        detailEve: function( e ){

            var id = $(e.currentTarget).attr('data-id');
            this.trigger('detail',id);
        },
		//分配
        assginEve: function( e ){

            var id = $(e.currentTarget).attr('data-id');
            this.trigger('assgin',id);
        },
		//关联自注册企业
        bindLinkEve: function( e ){

            var id = $(e.currentTarget).attr('data-id');
            this.trigger('bindLink',id);
        },

        //查看备案企业跟踪记录
        logEve: function( e ){

            var id = $(e.currentTarget).attr('data-id'),
                name = $(e.currentTarget).attr('data-name');

            this.trigger( 'log', id, name );
        }
    })
    
    var RejectReason = MClass( Slider ).include({
        content: tem.filter('#rejectinfo').html(),
        defaultAttr:{
            'title':'驳回原因',
            'width': 400
        },
        init: function(){
            var me = this;

            RejectReason.__super__.init.apply(this,arguments);
        },
        show: function( contentStr ){
            var me = this;

            me.model.set('reason', contentStr);
            RejectReason.__super__.show.apply(this,arguments);
        },
        hide: function(){
            var me = this;

            me.model.clear();
            RejectReason.__super__.hide.apply(this,arguments);
        }
    });
	   /**
     * 备案企业绑定关联自注册企业
     */
   var BindLink = MClass( Dialog ).include({
        content: tem.filter('#bindLink').html(),
        events: {
            'click .action-link': 'actionLinkEve'
		},
        elements:{
			'.search-enterpriseAccount':'enterpriseAccount'
        },
        
        init: function(){
            BindLink.__super__.init.apply( this,arguments );
            var me = this;
			me._setTitle('备案企业关联自注册企业');
        },
        show: function( entId ){
            var me = this;

            me.attrs['entId'] = entId || '';

            BindLink.__super__.show.apply( this,arguments );
        },
		actionLinkEve:function(){
			var me = this;
			var enterpriseAccount = me.model.get('enterpriseAccount').replace(/^\s+|\s+$/g,"");
			if(!me.model.get('enterpriseAccount')){
				util.showToast('请填写完整自注册企业账号！');
				return false;
			}
			var val = me.$('input:radio[name="newType"]:checked').val();
			if( !val ){
				util.showToast('请选择开通版本！');
				return false;
			}
			
			util.api({
				'url': '/enterprisefiling/canbinding',
				'data': {
					'enterpriseAccount':enterpriseAccount
				},
				'button': {
					'el': me.$enterpriseAccount,
					'text':'提交中......'
				},
				'success': function( data ){
					if( data.success ){
						IBSS.tempEnterprise.enterpriseaccount = enterpriseAccount;
						if( val == 'newOffice' ){
							location.hash = '#order/newmarketying/releateOffice';
						}else{
							location.hash = '#order/newmarketying/releateMarket';
						}
					   //location.hash = '#agentsupport/bindinfo/'+me.attrs['entId']+'/'+enterpriseAccount;
					} 
				}
			})
			 
			return false;
		},

        hide: function(){
            var me = this;
            
            me.model.clear();
           
            BindLink.__super__.hide.apply( this,arguments );
        }

	});


    exports.init = function() {
        var $el = exports.$el;
        
        var addFiling = new AddFiling({'state':'add'});          //添加备案企业
        var filingDetail = new AddFiling({'state':'detail'})     //查看备案企业详情

        var filingList = new FilingList( {'view': $el.find('.m-filinglist')} );
        var filingLog = new FilingLog();
		var filingassgin = new FilingAssgin();
        var rejectReason = new RejectReason(); //查看驳回原因
		var bindLink = new BindLink();


        filingList.on('add',function(){
            
            addFiling.show('');
        });

        filingList.on('detail',function(id){
            
            filingDetail.show(id);
        });
		filingList.on('assgin',function(id){
    
            filingassgin.show(id);
        });
		filingList.on('bindLink',function(id){
            bindLink.show(id);
        });
		filingassgin.on('success',function(id){
    
            filingList.getList();
        });

        filingList.on('log',function( id , name ){
            filingLog.show( id , name , IBSS.role_vendorId );
        });

        filingList.on('reject',function( reason ){
            rejectReason.show( reason );
        });

        addFiling.on('addsuccess',function(){
            filingList.getList();
        });
		filingDetail.on('savesuccess',function(){
            filingList.getList();
        });
        filingDetail.on('dropsuccess',function(){
            filingList.getList();
        });
		filingDetail.on('bindLink',function(entId){
            bindLink.show(entId);
        });
		bindLink.on('bindLinkSuccess',function(){
            filingList.getList();
			filingDetail.hide();
        });

    }
} );

