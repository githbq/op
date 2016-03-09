define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

   	var Pagination = require('common/widget/pagination/pagination');
    var FilingLog = require('module/filinglog/filinglog');
    var Slider = require('common/widget/slider/slider');

    var Tem = $( require('./template.html') );

    var statusMap = TPL.statusMap = {},industryMap = {},sourceMap = {};;  //备案企业状态
    var logMap = TPL.logMap = {};        //记录状态

    /**
     * 备案企业列表
     * 
     */
    var FilingList = MClass( M.Center ).include({
        trTpl: _.template( Tem.filter('#trTpl').html() ),

    	init: function(){
    		FilingList.__super__.init.apply( this,arguments );
    		var me = this;
            
            if( me.attrs['id'] ){
                me.model.set('vendorId', me.attrs['id']);
            }

            if( me.attrs['name'] ){
                me.$('.header-title').text( '(代理商    ' + me.attrs['name'] + ')' );
            }




            me.$startTime.datetimepicker({'timepicker': false,'format':'Y-m-d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y-m-d'});
    		
            me.pagination = new Pagination({
    			'wrapper': me.$view.find('.list-pager'),
    			'pageNumber': 0,
    			'pageSize': 20
    		});
    		me.pagination.render();
    		me.pagination.onChange = function(){
    			me.getList();
    		}


    		me.collection = new M.Collection;
    		me.collection.on('reload',function(){
    			me.renderList();
    		});

    		me.getEnums();
    	},

    	elements:{
    		'tbody': 'tbody',
            '.status': 'status',
            '.startTime': 'startTime',
            '.endTime': 'endTime',
			'.industry-data': 'industryData',
			'.source-data':'sourceData'
    	},

        events:{
            'click .filing-detail': 'detailEve',
            'click .filing-service': 'serviceEve',
            'click .filing-request': 'requestEve',
            'click .action-openall': 'openAllEve',
            'click .action-openbatch': 'openBatchEve',
            'click .search': 'searchEve',
            'click .filing-check': 'checkEve'
        },

        // 获取客户状态枚举值
        getEnums: function(){
            var me = this;
            var statusList = [{'name':'全部','value':''}],sourceList=[{'name':'全部','value':''}];

            var state = {
                a: false,
                b: false,
                c: false
            }

            function checkState(){
                if( state.a && state.b && state.c ){
                    me.getList();
                }
            }

            util.getEnums('FILING_STATUS',function( data ){
                if( data.success ){
                    data.value.model.forEach(function(item){
                        statusList.push( {'name':item.text,'value':item.value} );
                        statusMap[ item.value ] = item.text;
                    });
                    util.resetSelect( me.$status, statusList);
                    state.a = true;
                    checkState();
                }
            });

            util.getIndustry( me.$industryData, function(data){
                if( data.success ){
                    data.value.model.forEach(function( item, index){
                       industryMap[ item.value ] = item.text;
                    });
                    state.b = true;
                    checkState();
                }
            })
			util.getEnums('ENT_LST_SOURCE',function(data){
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

        searchEve: function(){
            var me = this;

            me.pagination.setPage( 0,false );
            me.getList();
        },

        //审核
        checkEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger('check', id);
        },

        //获取列表
    	getList: function(){
    		var me = this;

            var startTime ='',
                endTime ='';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }

            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }


    		util.api({
    			'url':'/enterprisefiling/queryfiling',
    			'data':{
    				'vendorId': me.model.get('vendorId'),
    				'enterpriseName': me.model.get('enterpriseName'),
    				'status': me.model.get('status'),
    				'active': me.model.get('active'),
					'industry': me.model.get('industryList'),
					'source': me.model.get('sourceList'),
    				'startTime': startTime,
    				'endTime': endTime,
    				'serviceTimeBegin': me.model.get('serviceTimeBegin'),
    				'serviceTimeEnd': me.model.get('serviceTimeEnd'),
    				'pageIndex': me.pagination.attr['pageNumber'],
    				'pageSize': me.pagination.attr['pageSize']
    			},
    			'success': function( data ){
    				console.warn( data );
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content,function( item ){
                            item.statusStr = statusMap[item.status];
							item.industryStr = industryMap[ item.industry ];
							item.sourceStr = sourceMap[ item.source ];	
                            item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
                            
                            if( item.active ){
                                item.activeStr = '已启用';
                            }else{
                                item.activeStr = '已停用';
                            }
                        });
                    }
    			}
    		})
    	},

        //
        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');

            this.trigger('detail',id);
        },

        //查看服务列表详情
        serviceEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id'),
                name = $( e.currentTarget ).attr('data-name');

            this.trigger('service', id , name );
        },

        //公开申请
        requestEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id'),
                name = $(e.currentTarget).attr('data-name');
            this.trigger('request', id , name );
        },

        //公开全部
        openAllEve: function( ){
            var me = this;

            util.api({
                'url': '/enterprisefiling/openallfiling',
                'success': function( data ){
                    if( data.success ){
                        me.searchEve();
                    }
                }
            })
        },

        //公开部分
        openBatchEve: function( ){
            console.log('openBatch');
            var me = this;

            var ids = '';
            me.$('.open-input:checked').each(function(){
                ids = ids + $(this).attr('data-id') + ',';
            });

            if( ids.length <= 0 ){
                util.showToast('请勾选需要公开的企业');
                return false;
            }

            if( ids ){
                ids = ids.slice( 0,-1 );
            };
            
            util.api({
                'url': '/enterprisefiling/openfiling',
                'data': {
                    'enterpriseFilingIds': ids
                },
                'success': function( data ){
                    if( data.success ){
                        me.searchEve();
                    }
                }
            })

        },

    	renderList: function(){
    		var me = this;

            var collection = me.collection.all();
            var htmlStr = '';
            
            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='11'><p class='info'>暂无数据</p></td></tr>";
            }

            me.$tbody.html( htmlStr );
    	}
    });
    

    /**
     * 备案详情
     */
    var FilingInfo = MClass( Slider ).include({

        content: Tem.filter('#filingInfo').html(),
        
        defaultAttr:{
            'width': 660,
            'title': '查看备案企业'
        },

        elements: {
            '.state-title': 'stateTitle',
            '.visitcard': 'visitcard',
            '.visitcard2': 'visitcard2',
            '.vc_link': 'imglink',
            '.vc2_link': 'imglink2',
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.img-info':'imgInfo'
        },

        events: {
            'click .back': 'hide',
            'click .action-deactive': 'deactiveEve',
            //'click .action-deal': 'dealEve',
            'click .action-public': 'publicEve'
        },

        init: function(){
			var me =this;
            FilingInfo.__super__.init.apply( this,arguments );
			me.getEnums();
        },
		//获取状态枚举值
        getEnums: function(){
            var me = this;
            var industryList=[{'name':'请选择','value':''}],sourceList=[{'name':'请选择','value':''}];

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

                    data.value.model.forEach(function( item, index){
                       sourceList.push( {'name':item.text,'value':item.value} );
                    });
                    console.log( sourceList );
                    util.resetSelect( me.$source, sourceList );
                }
            })
        },

        //停用
        deactiveEve: function(){
            var me = this;
            util.api({
                'url': '/enterprisefiling/closefiling',
                'data': {
                    'enterpriseFilingId': me.model.get('id')
                },
                'success': function( data ){
                    if( data.success ){
                        me.hide();
                        me.trigger('success');
                    }
                }
            })
        },

        //成交
        dealEve: function(){
            var me = this;
            util.api({
                'url': '/enterprisefiling/completefiling',
                'data':{
                    'enterpriseFilingId': me.model.get('id')
                },
                'success': function( data ){
                    if( data.success ){
                        me.hide();
                        me.trigger('success');
                    }
                }
            })
        },

        //公开
        publicEve: function(){
            var me = this;
            util.api({
                'url': '/enterprisefiling/openfiling',
                'data':{
                    'enterpriseFilingIds': me.model.get('id')
                },
                'success': function( data ){
                    if( data.success ){
                        me.hide();
                        me.trigger('success');
                    }
                }
            })
        },

        //显示备案企业详情
        show: function( id ){
            var me = this;

            util.api({
                'url': '/enterprisefiling/getfiling',
                'data': {
                    'enterpriseFilingId': id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.load( data.value.model );
                        me.model.set('creator_name',me.model.get('creator')['name']);
                        me.model.set('creator_username',me.model.get('creator')['username'] );
                        me.model.set('createTimeStr', new Date( me.model.get('createTime') )._format('yyyy-MM-dd hh:mm') );

                        me.model.set('statusStr',statusMap[ me.model.get('status') ]);
						me.model.set('industry', data.value.model.industry);  //行业赋值
						me.model.set('source', data.value.model.source);      //来源赋值
						if( data.value.model.cardPath ){
							me.$visitcard.attr('src',IBSS.API_PATH + '/enterprisefiling/downloadcard?enterpriseFilingId=' + id + '&cardPath='+ data.value.model.cardPath );
							me.$imglink.attr('href',IBSS.API_PATH + '/enterprisefiling/downloadcard?enterpriseFilingId=' + id + '&cardPath='+ data.value.model.cardPath);
							//me.$imgInfo.hide();
							me.$visitcard.show()
						}else{
							me.$visitcard.attr('src','' );
							me.$imglink.attr('href','');
							//me.$imgInfo.show();
							me.$visitcard.hide()
						}
                        if( data.value.model.card2Path ){
                            me.$visitcard2.attr('src', IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?cardPath=' + data.value.model.card2Path);
                            me.$imglink2.attr('href',IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?cardPath=' + data.value.model.card2Path)
							
							me.$visitcard2.show();
                        }else{
							me.$visitcard2.attr('src','');
                            me.$imglink2.attr('href','');
							//me.$imgInfo.show();
							me.$visitcard2.hide();
						}
						if((!data.value.model.cardPath) && (!data.value.model.card2Path)){
							me.$imgInfo.show();
						}else{
							me.$imgInfo.hide();
						}
                        //状态切换
                        var activeStr = "已停用";
                        if( me.model.get('active') ){
                            activeStr = "已启用";

                            switch( me.model.get('status') ){
                                case 1:
                                    me.$('.action-public').show();
                                    //me.$('.action-deal').show();
                                    me.$('.action-deactive').show();
                                break;
                                case 2:
                                    me.$('.action-deactive').show();
                                break;
                                case 3:
                                    me.$('.action-deactive').show();
                                break;
                            }
                        }

                        if( me.model.get('status') == 2){

                            me.$stateTitle.text('审核信息');
                        } else {

                            me.$stateTitle.text('申请信息');
                        }

                        me.model.set('activeStr',activeStr);
                    }
                }
            })
            FilingInfo.__super__.show.apply( this,arguments );
        },

        hide: function(){
            this.model.clear();
            this.$('.state').hide();
            FilingInfo.__super__.hide.apply( this,arguments );
        }
    });
    

    /**
     * 驳回
     */
    var Reject = MClass( Slider ).include({
        content: Tem.filter('#rejectinfo').html(),
        defaultAttr: {
            'title': '审核',
            'width': 400
        },

        events:{
            'click .pass-action': 'passEve',
            'click .reject-action': 'rejectEve' 
        },

        hide: function(){
            var me = this;
            me.model.clear();
            Reject.__super__.hide.apply( this, arguments );
        },

        show: function( id ){
            var me = this;
            me.model.set('enterpriseFilingId', id );
            Reject.__super__.show.apply( this, arguments );
        },

        //通过
        passEve: function(){
            var me = this;
            var checkReason = me.model.get('checkReason');

            if( checkReason.length <= 0 ){
                util.showToast('请填写审核原因');
                return false;
            }

            util.api({
                'url': '/enterprisefiling/checkfiling',
                'data': {
                    'enterpriseFilingId': me.model.get('enterpriseFilingId'),
                    'checkReason': checkReason,
                    'checkResult': 1
                },
                'success': function( data ){
                    if( data.success ){
                        util.showTip('操作成功');
                        me.trigger('success');
                        me.hide();
                    }
                } 
            })
        },

        //驳回
        rejectEve: function(){
            var me = this;
            var checkReason = me.model.get('checkReason');

            if( checkReason.length <= 0 ){
                util.showToast('请填写审核原因');
                return false;
            }

            util.api({
                'url': '/enterprisefiling/checkfiling',
                'data': {
                    'enterpriseFilingId': me.model.get('enterpriseFilingId'),
                    'checkReason': checkReason,
                    'checkResult': 2
                },
                'success': function( data ){
                    if( data.success ){
                        util.showTip('操作成功');
                        me.trigger('success');
                        me.hide();
                    }
                } 
            })
        },

        init: function(){

            Reject.__super__.init.apply(this,arguments);
        }
    });

    exports.init = function( param ){
    	var $el = exports.$el;

    	var filingList = new FilingList( {'view':$el.find('.m-filinglist'),'id': param && param[0],'name': param && param[1]} );
        var filingInfo = new FilingInfo();
        var filingLog = new FilingLog();
        var reject = new Reject();          //驳回原因

        //查看备案企业详情
        filingList.on('detail',function( id ){
            filingInfo.show( id );
        });

        //查看服务记录
        filingList.on('service',function( id , name ){
            filingLog.show( id , name );
        });
        
        //查看公开申请
        filingList.on('request',function( id , name ){
            location.hash="#filing/requestlist/" + id + '/' + name; 
        });

        //驳回
        filingList.on('check',function( id ){
            reject.show( id );
        });

        //
        reject.on('success',function(){
            filingList.searchEve();
        })

        //备案企业各种操作成功
        filingInfo.on('success',function(){
            filingList.searchEve();
        });
    }
})
