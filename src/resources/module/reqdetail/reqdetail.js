/**
 * 公开企业申请对象
 * 
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var Pagination = require('common/widget/pagination/pagination');
    var contentStr = require('./reqdetail.html');
    var tem = $( require('./template.html') );

    var ReqDetail = MClass( Slider ).include({

        defaultAttr:{
            'width': 566,
            'title': '公开企业申请备案详情'
        },

        content: contentStr,
        trTpl: _.template( tem.filter('#list').html() ),
        events:{
            'click .searchFujian': 'searchEve',
            'click .uploadfile': 'uploadEve',
            'click .attachement': 'downloadAttacheMentEve'
        },

        elements:{
            '.startTime': 'startTime',
            '.endTime': 'endTime',
            '.upload': 'upload',
            'tbody': 'tbody'
        },
        init: function(){
            ReqDetail.__super__.init.apply( this,arguments );

            var me = this;

            me.$startTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );
            me.$endTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );

            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChage = function(){
                me.getList();
            };

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            })
        },

        show: function( id ){
            var me = this;

            me.getDetail( id );
            ReqDetail.__super__.show.apply( this,arguments );
        },

        hide: function(){
            var me = this;

            me.model.clear();
            me.clearAttachement();
            me.$('[data-state]').hide();
            me.$startTime.val('');
            me.$endTime.val('')

            ReqDetail.__super__.hide.apply( this,arguments );
        },

        //清除附件
        clearAttachement: function(){
            var me = this;
            me.model.set('uploadremark','');
            me.$upload[0].files = null;
        },

        //上传
        uploadEve: function(){
            var me = this;
            var xhr = new XMLHttpRequest();

            var remark = me.model.get('uploadremark'),
                enterpriseFilingRequestId = me.model.get('id');

            /*
            *file 对象是二进制对象
            *继承自Blob
            */
            var file = me.$upload[0].files[0];

            var fd = new FormData();
                fd.append("upfile",file);
                fd.append("remark",remark);
                fd.append("enterpriseFilingRequestId",enterpriseFilingRequestId);

            xhr.onreadystatechange=function(){
                if( xhr.readyState == 4 ){

                    try{
                        if( xhr.status == 200 ){

                            var response = JSON.parse( xhr.response );
                            if( response.success ){
                                me.clearAttachement();
                                me.getList();
                            }
                        }else{
                            util.showToast('网络错误 '+ xhr.response);
                        }
                    } catch ( err ){

                    }
                }
            };

            xhr.open('post', IBSS.API_PATH+'/enterprisefiling/uploadattachment' ,true);
            xhr.send(fd)
        },

        //下载附件
        downloadAttacheMentEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            window.open( IBSS.API_PATH + '/enterprisefiling/downloadattachement?attachementId=' + id );
        },

        //查询附件列表
        searchEve: function(){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        //获取申请详情
        getDetail: function( id ){
            var me = this;

            var requestStatusMap = IBSS.tpl.requestStatusMap || {};

            console.log( requestStatusMap );

            util.api({
                'url': '/enterprisefiling/getrequest',
                'data': {
                    'enterpriseFilingRequestId': id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.load( data.value.model );
                        me.model.set('requestStatusStr', requestStatusMap[ me.model.get('status') ]);

                        //根据申请状态做状态切换
                        if( me.model.get('status') == 1 ){
                            me.$('[data-state="begin"]').show();
                        } else {
                            me.$('[data-state="end"]').show();
                        }

                        //同时查询附件列表
                        me.getList();
                    }
                }
            });
        },

        //获取附件列表
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
                'url':'/enterprisefiling/queryattachment',
                'data':{
                    'enterpriseFilingRequestId': me.model.get('id'),
                    'attachmentName': me.model.get('search-name'),
                    'startTime': startTime,
                    'endTime': endTime,
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize']
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload(data.value.model.content,function(item){
                            item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
                            item.attachmentSizeStr = util.getFileSize( item.attachmentSize );
                        });
                    }
                }
            })
        },

        //
        renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var htmlStr = '';
            
            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='4'><p class='info'>暂无数据</p></td></tr>";
            }

            me.$tbody.html( htmlStr );
        }
    });


	module.exports = ReqDetail;
});
