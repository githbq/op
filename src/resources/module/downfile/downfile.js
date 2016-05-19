/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var Pagination = require('common/widget/pagination/pagination');
    var contentStr = require('./downfile.html');
    var Tem = $( require('./template.html') );


    var downState = {'0':'正在队列中','1':'可下载','2':'已过期'}    //下载状态

    /**
     * 文件下载
     */
    var LogList = MClass( Slider ).include({
        content: contentStr,
        trTpl: _.template( Tem.filter('#trTpl').html() ),
        defaultAttr:{
            'width': 760,
            'title': '文件下载'
        },
		  defaultModel: {
            'pageNumber': 1,
            'pageSize': 10,
            'pageCount': 0
        },

        elements:{
           'table tbody': 'contentmain',
		   '.content-more': 'contentmore'
        },

        events: {
			 'click .content-more': 'moreEve',
			 'click .clear-all':'clearAllEve',
			 'click .down-common':'downCommonEve',
			 'click .down-temp':'downTempEve',
			 'click .down-delete':'downDeleteEve'
        },

        //初始化
        init: function(){
            LogList.__super__.init.apply( this, arguments );
            var me = this;
			
			me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });
            me.collection.on('insert',function( content ){
                me.insertList( content );
            });

            me.model.load( me.defaultModel );
            me.model.on('change:pageNumber',function(){
                me.renderMore();
            });
            me.model.on('change:pageCount',function(){
                me.renderMore();
            });

        },

        searchEve: function(){
            this.pagination.setPage(1,false);
            this.getList();
        },

        // 获取企业名称
        show: function( id , name , vendorId ){
            var me = this;
			 me.refresh();
          

            LogList.__super__.show.apply( this, arguments );
        },
		 //刷新跟踪记录
        refresh: function(){
            var me = this;

            util.api({
                'url':'~/storage/queue/querypage',
                'data':{
					'pageSize': me.model.get('pageSize'),
                    'pageIndex': me.model.get('pageNumber')
				},
                'beforeSend': function(){
                     me.$contentmain.html('<tr> <td colspan="5" style="text-align:center;">加载中......</td> </tr>');
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.set('pageCount',data.value.model.pageCount);
                        me.collection.reload( data.value.model.content , function( item ){
                            item.createTimeStr = item.createTime ? new Date( item.createTime )._format('yyyy-MM-dd hh:mm'):'';
							item.storageTypeStr = item.storageType ==1 ?'普通文件':'临时文件';
							item.stateStr = downState[item.status.key];
							if(item.storageType ==1 && item.status.key == 1 ){
								item.dowmStr = 1;//普通文件可下载
							}else if( item.storageType ==0 && item.status.key == 1 ){
								item.dowmStr = 2;//临时文件可下载
							}
                        })
                    }
                },
				'error':function(){
					me.$contentmain.html('<tr> <td colspan="5" style="text-align:center;">加载失败......</td> </tr>');
				}
            })
        },
		//渲染跟踪记录
        renderList: function(){
            var me = this;
            var content = me.collection.all();

            if( content.length > 0 ){
                me.$contentmain.html( me.trTpl( {'content':content} ) );
            }else{
                me.$contentmain.html('<tr> <td colspan="5" style="text-align:center;">暂无数据</td> </tr>');
            }
        },

        insertList: function( content ){
            var me = this;
            me.$contentmain.append( me.trTpl( {'content':content} ) );
        },

        //根据状态渲染加载更多元素
        renderMore: function(){
            var me = this;

            if( (me.model.get('pageNumber') + 1) >= me.model.get('pageCount') ){
                me.$contentmore.hide();
            }else{
                me.$contentmore.show();
            }
        },

        //加载更多
        moreEve: function(){
            var me = this;

            var pageNumber = me.model.get('pageNumber');
            if( pageNumber >= me.model.get('pageCount') ){
                return;
            }
            
            pageNumber = pageNumber + 1;

            util.api({
                'url': '~/storage/queue/querypage',
               'data':{
					'pageSize': me.model.get('pageSize'),
                    'pageIndex': me.model.get('pageNumber')
				},
                'success': function( data ){
                    if( data.success ){
                        me.model.set('pageNumber',pageNumber);
                        me.collection.insert( data.value.model.content , function( item ){
                            item.createTimeStr = item.createTime ? new Date( item.createTime )._format('yyyy-MM-dd hh:mm'):'';
							item.storageTypeStr = item.storageType ==1 ?'普通文件':'临时文件';
							item.stateStr = downState[item.status.key];
							if(item.storageType ==1 && item.status.key == 1 ){
								item.dowmStr = 1;//普通文件可下载
							}else if( item.storageType ==0 && item.status.key == 1 ){
								item.dowmStr = 2;//临时文件可下载
							}
                        })
                    }
                }
            })
        },
		//下载标准文件
		downCommonEve:function( e ){
			var me = this;
			var fileName = $(e.currentTarget).attr('data-fileName');
			var filePath = $(e.currentTarget).attr('data-filePath');
			
			 window.open( '/storage/download?fileName='+fileName+'&path='+filePath );
		},
		//下载临时文件
		downTempEve:function( e ){
			var me = this;
			
			var fileName = $(e.currentTarget).attr('data-fileName');
			var filePath = $(e.currentTarget).attr('data-filePath');
			
			 window.open( '/storage/downloadtemp?fileName='+fileName+'&path='+filePath );
		},
		//删除数据
		downDeleteEve:function( e ){
			var me = this;
			var id = $(e.currentTarget).attr('data-id');
			var $tr = $(e.currentTarget).parent().parent()
			util.api({
				'url': '~/storage/queue/delete',
			   'data':{
				   'downId':id
			   },
				'success': function( data ){
					if( data.success ){
						 $tr.remove();
					}
				}
			})
			
			
		},
		//清空数据
		clearAllEve:function(){
			var me = this;
			var bool = confirm("清空后不再显示，确定要清空数据吗?");
			if(bool){
				util.api({
					'url': '~/storage/queue/clear',
				   'data':{},
					'success': function( data ){
						if( data.success ){
							me.$contentmain.empty();
							me.$contentmore.hide();
							me.$contentmain.html('<tr> <td colspan="5" style="text-align:center;">暂无数据</td> </tr>');
						}
					}
				})
			}
			
		},
        hide: function(){
			var me = this;
			me.model.clear().load( me.defaultModel );
            me.$contentmain.empty();
            me.collection.clear();
            LogList.__super__.hide.apply( this, arguments );
        }
    });

	module.exports = LogList;
});
