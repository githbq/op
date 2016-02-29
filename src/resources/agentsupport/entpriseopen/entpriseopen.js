define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var ReqDetail = require('module/reqdetail/reqdetail');
    var Slider = require('common/widget/slider/slider');
    var Dialog = require('common/widget/dialog/dialog');
    var Tem = $( require('./template.html') );


    var statusMap = {};             //申请状态
    var filingStatusMap = {};       //企业状态

    /**
     * 公开企业列表
     *
     */
    var EntpriseOpen = MClass( M.Center ).include({

        trTpl: _.template( Tem.filter('#opentr').html() ),

    	init: function(){
      	    EntpriseOpen.__super__.init.apply( this,arguments );
      	    var me = this;

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
            };

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            me.getEnums()
        },

        elements: {
            'tbody': 'tbody',
            '.startTime': 'startTime',
            '.endTime': 'endTime'
        },

        events: {
            'click .detail': 'detailEve',
            'click .open-search': 'searchEve'
        },

        //获取状态枚举值
        getEnums: function(){
            var me = this;

            util.getEnums('FILING_REQUEST_STATUS',function( data ){
                console.warn( data );

                if( data.success ){
                    data.value.model.forEach(function( item, index){
                       statusMap[ item.value ] = item.text;
                    });
                    me.getList();
                }
            })
        },

        searchEve: function(e){
            var me = this;

            me.pagination.setPage(0,false);
            me.getList();
        },

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
			var enterpriseName =me.model.get('enterpriseName').replace(/^\s+|\s+$/g,"")
			if(me.$startTime.val()||me.$endTime.val()||enterpriseName){
				util.api({
					'url':'/enterprisefiling/queryopenfiling',
					  'data':{
						  'vendorId': IBSS.role_vendorId,
						  'enterpriseName': enterpriseName,
						  'active': 1,
						  'startTime': startTime,
						  'endTime': endTime,
						  'pageIndex': me.pagination.attr['pageNumber'],
						  'pageSize': '10'
					  },
					  'success': function( data ){
							console.warn( data );
							if( data.success ){
								me.collection.reload( data.value.model.content,function( item ){
									item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
								});
								me.pagination.setTotalSize( data.value.model.itemCount );
							}
					  }
				})
			}else{
				var obj = [];
				var itemCount = 0;
				me.collection.reload( {'content':obj});
				me.pagination.setTotalSize( itemCount );
				me.$tbody.html("<tr><td colspan='5'><p class='info'>请输入查询条件</p></td></tr>");
                IBSS.tplEvent.setPermissions( me.$tbody );
			}
      		
      	},

        renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var htmlStr = '';
            
            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='5'><p class='info'>暂无数据</p></td></tr>";
            }

            me.$tbody.html( htmlStr );
        },

        //查看企业详情
        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id'),
                status = $( e.currentTarget ).attr('data-status');

            this.trigger('detail',id,status);
        }
    });
    
    /**
     * 详情
     */
    var OpenDetail = MClass( Slider ).include({
        content: Tem.filter('#opendetail').html(),
        defaultAttr:{
            'width': 600,
            'title': '详情'
        },

        init: function(){
            OpenDetail.__super__.init.apply( this,arguments );
            this.getEnums();
        },

        elements: {
            '.card': 'card',
            '.opendetail-request': 'request',
            '.action-reqbtn': 'reqBtn',
            '.tipinfo': 'tipinfo'
        },

        events: {
            'click .open-return': 'hide',
            'click .action-reqbtn': 'reqEve',
            'click .request-return': 'returnEve'
        },


        //获取枚举值
        getEnums: function(){
            
            util.getEnums('FILING_STATUS',function( data ){

                if( data.success ){
                    data.value.model.forEach(function( item, index){
                       filingStatusMap[ item.value ] = item.text;
                    });
                }
            });
        },

        //显示详情
        show: function( id , status ){
            var me = this;

            me.model.set('enterpriseFilingId',id);
            
            //详情状态
            if( id ){

                util.api({
                    'url': '/enterprisefiling/getfilingopen',
                    'data': {
                        'enterpriseFilingId': id
                    },
                    'success': function( data ){
                        console.warn(data);


                        if( data.success ){
                            me.model.load( data.value.model );
                            
                            //me.model.set('creatorName', data.value.model.creator.name);
                           // me.model.set('creatorUserName', data.value.model.creator.username);
                            me.$card.attr('src', IBSS.API_PATH + '/enterprisefiling/downloadcard' + '?enterpriseFilingId=' + data.value.model.id );
                            me.model.set('statusStr', filingStatusMap[ me.model.get('status') ]);
                            if( me.model.get('active') ){
                                me.model.set('activeStr','已启用');
                            }else{
                                me.model.set('activeStr','已停用');
                            }


                            // 进行状态切换
                            // 未申请的status为空
                            if( status.length <= 0 ){
                                me.$('.action-req').show();
                            }else{
                                me.$('.reqStatus').show();
                                me.model.set('requestStatusStr', statusMap[ status ]);
                            }
                        }
                    }
                })
                
                /**
                 *
                 * 查看是否能申请备案
                 */
                util.api({
                    'url': '/enterprisefiling/applyvalidate',
                    'data': {
                        'enterpriseFilingId': me.model.get('enterpriseFilingId')
                    },
                    'success': function( data ){
                        if( data.success ){
                            if( !data.value.success ){
                                me.$reqBtn.attr('disabled','disabled').addClass('u-btn-gray');
                                me.$tipinfo.show().text('(无法申请原因: '+ data.value.message +')');
                            }
                        }
                    }
                })

            }



            OpenDetail.__super__.show.apply( this,arguments );
        },

        //申请备案
        reqEve: function(e){
            var me = this;

            /*var reason = me.model.get('reqRemark');
            if( reason.length <= 0 ){
                util.showToast('请填写申请原因');
                return false;
            }*/

            util.api({
                'url': '/enterprisefiling/requestfiling',
                'data': {
                    'enterpriseFilingId': me.model.get('enterpriseFilingId')
                    //'reason': me.model.get('reqRemark')
                    //'vendorId': IBSS.role_vendorId
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						util.showTip('申请备案成功');
                        me.trigger('request')
						me.hide();
                    }
                }
            })

        },

        returnEve: function(e){
            var me = this;
            me.$request.hide();
        },

        //隐藏
        hide: function(){
            var me = this;
            me.$('.state').hide();
            me.model.clear();
            me.$reqBtn.removeAttr('disabled').removeClass('u-btn-gray');
            me.$tipinfo.hide();
            OpenDetail.__super__.hide.apply( this,arguments );
        }
    });
    
    

    exports.init = function() {
        var $el = exports.$el;
	    
        var enterpriseOpen = new EntpriseOpen({'view':$el.find('.m-entpriseopen')});
        var openDetail = new OpenDetail();
        var reqDetail = new ReqDetail();


        enterpriseOpen.on('detail',function( id , status ){
            openDetail.show( id , status );
        });

        openDetail.on('request', function(  ){
            //openDetail.hide();
            //reqDetail.show( id );
			enterpriseOpen.getList();
        })

    }
} );

