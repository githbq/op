/**
 * 自注册企业详情
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var Pagination = require('common/widget/pagination/pagination');
    var contentStr = require('./enttrace.html');
    var tem = $( require('./template.html') );

    var EntTrace = MClass( Slider ).include({
        
        content: contentStr,
        traceTem: _.template( tem.filter('#tracesec').html() ),

        //默认状态
        defaultAttr: {
            'title':'企业跟踪记录',
            'width': 600
        },
        
        defaultModel: {
            'enterpriseId': null,
            'pageNumber': 1,
            'pageSize': 6,
            'pageCount': 0
        },

        events:{
            'click .addtrace': 'addTraceEve',
            'click .downloadfile': 'downloadEve',
            'click .content-more': 'moreEve'
        },
        

        elements:{
            '.sendcontent': 'sendcontent',
            '.tracecontent': 'tracecontent',
            '.content-main': 'contentmain',
            '.content-more': 'contentmore'
        },
        

        init: function(){   
            var me = this;

            EntTrace.__super__.init.apply( this, arguments );

            me.entTraceSend = new EntTraceSend( {'wrapper': me.$view.find('.sendcontent')} );
            me.entTraceSend.render();
            me.entTraceSend.on('send',function(){
                me.refresh();
            });

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

        downloadEve: function(e){
            var id = $(e.currentTarget).attr('data-id');
            window.open( '/op/api/enterprise/downloadenterprisetraceattachment?enterpriseTraceAttachmentId='+id );
        },

        show: function( id ){
            var me = this;
            
            me.model.set('enterpriseId',id);
            me.entTraceSend.attrs['enterpriseId'] = id;
            me.refresh();
            EntTrace.__super__.show.apply( this, arguments );
        },

        hide: function( id ){
            var me = this;

            me.model.clear().load( me.defaultModel );
            me.$contentmain.empty();
            me.entTraceSend.clear();
            me.collection.clear();
            EntTrace.__super__.hide.apply( this, arguments );
        },

        //刷新跟踪记录
        refresh: function(){
            var me = this;

            util.api({
                'url':'~/op/api/enterprise/querypageenterprisetrace',
                'data':{
                    'enterpriseId': me.model.get('enterpriseId'),
                    'pageSize': me.model.get('pageSize'),
                    'pageIndex': me.model.get('pageNumber')
                },
                'beforeSend': function(){
                     me.$contentmain.html('<p class="info">加载中......</p>');
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.set('pageCount',data.value.model.pageCount);
                        me.collection.reload( data.value.model.content , function( item ){
                            item.traceDateStr = new Date( item.traceDate )._format('yyyy-MM-dd hh:mm');
                        })
                    }
                }                
            })
        },

        //渲染跟踪记录
        renderList: function(){
            var me = this;
            var content = me.collection.all();

            if( content.length > 0 ){
                me.$contentmain.html( me.traceTem( {'content':content} ) );
            }else{
                me.$contentmain.html('<p class="info">暂无跟踪记录</p>');
            }
        },

        insertList: function( content ){
            var me = this;
            me.$contentmain.append( me.traceTem( {'content':content} ) );
        },

        //根据状态渲染加载更多元素
        renderMore: function(){
            var me = this;

            if( (me.model.get('pageNumber') + 1) > me.model.get('pageCount') ){
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
                'url': '~/op/api/enterprise/querypageenterprisetrace',
                'data': {
                    'enterpriseId': me.model.get('enterpriseId'),
                    'pageSize': me.model.get('pageSize'),
                    'pageIndex': pageNumber
                },
                'success': function( data ){
                    if( data.success ){
                        me.model.set('pageNumber',pageNumber);
                        me.collection.insert( data.value.model.content , function( item ){
                            item.traceDateStr = new Date( item.traceDate )._format('yyyy-MM-dd hh:mm');
                        })
                    }
                }
            })
        }
    })


    /**
    *
    * 添加发送记录
    */
    var EntTraceSend = MClass( M.Center ).include({
        view: tem.filter('#tracesend').html(),
        init: function(){
            var me = this;
            
            EntTraceSend.__super__.init.apply( this,arguments );

            me.filestore = {};
            me.imgstore = {};
            me.$datetime.datetimepicker();



            me.$inputimg.on('change',function(){
                var files = me.$inputimg[0].files;
                for( var i=0; i < files.length ; i++ ){

                    var type = files[i].type.split('/')[1];
                    if( type != 'jpg' && type != 'jpeg' && type !='png'){
                        alert('请选择类型为jpg或png的图片文件');
                        return false;
                    } else {
                        me.addImg( files[i] );
                    }
                }
            });

            me.$inputfile.on('change',function(){
                var files = me.$inputfile[0].files;
                for( var i=0; i < files.length ; i++ ){
                    me.addFile( files[i] );
                }
            });
        },
        elements:{
            '.inputimg': 'inputimg',
            '.inputfile': 'inputfile',
            '.imgdata': 'imgdata',
            '.filedata': 'filedata',
            '.datetime': 'datetime',
            '.remark': 'remark'
        },
        events:{
            'click .send-btn': 'sendEve',
            'click .delete-img': 'deleteImgEve',
            'click .delete-file': 'deleteFileEve'
        },

        addImg: function( file ){
            var me = this;
            me.imgstore[file.name] = file;

            var $span = $( "<span>" + file.name + "<b class='delete-img' data-name='" + file.name + "'> × </b></span>" );
            me.$imgdata.append( $span );
        },
        deleteImgEve: function(e){
            var $target = $(e.currentTarget),
                name = $target.attr('data-name');

            $target.parent().remove();
            delete this.imgstore[name];
        },
        addFile: function( file ){
            var me = this;
            me.filestore[file.name] = file;

            var $span = $( "<span>" + file.name + "<b class='delete-file' data-name='" + file.name + "'> × </b></span>" )
            me.$filedata.append( $span );
        },
        deleteFileEve: function(e){
             var $target = $(e.currentTarget),
                name = $target.attr('data-name');

            $target.parent().remove();
            delete this.filestore[name];
        },
        render: function(){
            this.attrs['wrapper'].html( this.$view );
        },

        //添加跟踪记录
        sendEve: function(){
            var me = this;

            var enterpriseTraceId;

            //var 
            var traceDate = me.$datetime.val();
            if( traceDate.length > 0 ){

                traceDate = new Date( traceDate ).getTime();
            } else {
                util.showToast('请选择记录时间');
                return false;
            }

            util.api({
                'url': '~/op/api/enterprise/addenterprisetrace',
                'data': {
                    'enterpriseId': me.attrs['enterpriseId'],
                    'type': 1,
                    'remark': me.$remark.val(),
                    'traceDate': traceDate
                },
                'success': function( data ){
                    if( data.success ){
                        enterpriseTraceId = data.value.model.id;
                        upload();
                    }
                } 
            });

            function upload(){
                var state = 0;

                //上传图片附件
                if( !util.isEmptyObject( me.imgstore ) ){
                    state = state + 1;

                    uploadFile('/op/api/enterprise/uploadenterprisetraceimage', me.imgstore,function( data ){
                        if( data.success ){
                            state = state - 1;
                            if( state == 0 ){
                                uploadSuccess();
                            }
                        }else{
                            util.showToast('上传失败 请重新上传');
                        }
                    })
                }

                //上传文件附件
                if( !util.isEmptyObject( me.filestore ) ){
                    state = state + 1;
                    uploadFile('/op/api/enterprise/uploadenterprisetraceattachment', me.filestore,function( data ){
                        if( data.success ){
                            state = state - 1;
                            if( state == 0 ){
                                uploadSuccess();
                            }
                        }else{
                            util.showToast('上传失败 请重新上传');
                        }
                    })
                }

                if( state== 0 ){
                    uploadSuccess();
                }
            }

            function uploadSuccess(){
                util.showTip('添加跟踪记录成功');
                me.clear();
                me.trigger('send');
            }

            function uploadFile( url ,files ,callback ){
                var xhr = new XMLHttpRequest();
                var fd = new FormData();

                for(var key in files){
                    fd.append( "upfile",files[key] );
                }
                fd.append("enterpriseTraceId", enterpriseTraceId );

                xhr.onreadystatechange=function(){
                    if( xhr.readyState == 4 ){
                        if( xhr.status == 200 ){
                            callback( JSON.parse( xhr.response ) );
                        }else{
                            util.showToast('网络错误 '+ xhr.response);
                        }
                    }
                };
                xhr.open('post', url ,true);
                xhr.send( fd );
            }
        },

        //清除数据
        clear: function(){
            var me = this;
            me.$imgdata.empty();
            me.$filedata.empty();
            me.$remark.val('');
            me.$datetime.val('');
            me.$inputfile[0].value = '';
            me.$inputimg[0].value = '';

            me.filestore = {};
            me.imgstore = {};
        }
    })

	module.exports = EntTrace;
});
