define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require( 'common/widget/pagination/pagination' );
    var Slider = require( 'common/widget/slider/slider' );


    var tpl = $( require( './template.html' ) );

    var ResetWord = MClass( Slider ).include({
        content: tpl.filter('#resetWord').html(),
        events:{
            'click .btn-blue': 'submit'
        },
        elements:{
            '.password': 'password',
            '.repeatpassword': 'rpassword'
        },
        init: function(){
            ResetWord.__super__.init.apply( this, arguments );
        },
        show: function( id , account ){
            var me = this;
                me.attrs['id'] = id;
                me.attrs['account'] = account;

            ResetWord.__super__.show.apply( this,arguments );
        },
        hide: function(){
            this.$password.val('');
            this.$rpassword.val('');
            ResetWord.__super__.hide.apply( this,arguments );
        },
        submit: function(){
            var me = this;
            
            var reg = /^(?![a-zA-Z0-9]+$)(?![^a-zA-Z\D]+$)(?![^0-9\D]+$).{6,20}$/;

            var password = me.$password.val(),
                rpassword = me.$rpassword.val();

            if( password != rpassword ){

                util.showToast('两次输入的密码不一致 请确认后提交');
                return false;
            }

            if( !reg.test(password) ){

                util.showToast('密码不符合规范 请重新填写');
                return false;
            }

            util.api({
                'url':'/employee/resetemployeepassword',
                'data':{
                    'enterpriseAccount': me.attrs['account'],
                    'employeeID': me.attrs['id'],
                    'newPassword': password
                },
                'success': function( data ){
                    if( data.success ){
                        util.showTip('重置密码成功');
                        me.hide();
                    }
                }
            })
        }    
    });

    
    var AccountDetail = MClass( Slider ).include({
        defaultAttr:{
            'title': '帐号详情',
            'width': 300
        },
        content: tpl.filter('#accountDetail').html(),
        
        init: function(){
            AccountDetail.__super__.init.apply( this, arguments );
            var me = this;
            me.on('empty:trylist',function(){
                me.$('.trybox').html('<b>无</b>');
            })
        },

        show: function( id, account ){
            AccountDetail.__super__.show.apply( this, arguments );
            var me = this;

            util.api({
                'url': '/employee/edition',
                'data': {
                    'eid': account,
                    'uid': id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        
                        var state = 0;

                        if(data.value.model['M3'] == '0'){
                            me.model.set('version','办公版')
                            
                            if( data.value.model['M4'] > new Date().getTime() ){
                                state = 1;
                            }

                        }else if(data.value.model['M3'] == '1'){
                            me.model.set('version','营销版')
                        }

                        if( state == 1 ){

                            me.$('.trytimep').show();
                        }else if( state == 0 ){

                            me.$('.trytimep').hide();
                        }
                        
                        me.model.set('istry',state);
                        me.model.set('endtime', new Date( data.value.model['M4'] )._format('yyyy-MM-dd hh:mm') )
                        me.trylist.reload( data.value.model['M5'] );
                    }
                }
            });
        },
        
        hide: function(){
            var me = this;
            me.model.clear();
            me.$('.trybox').empty();
            AccountDetail.__super__.hide.apply( this, arguments );
        }
    });


    var EmployeeDataTable = MClass( M.Center ).include( {
        tplEme: _.template( tpl.filter( '#trEme' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#elEA': 'ea',
            '#elEN': 'en',
            '#elName': 'name',
            '#elMobile': 'mobile',
            'tbody': 'tbody'
        },
        events: {
            'click #btnSearch': 'search',
            'click .up': 'upEve',
            'click .resetpwd': 'resetPwdEve',
            'click .accountdetail': 'accountDetailEve'
        },
        init: function() {
            EmployeeDataTable.__super__.init.apply( this, arguments );
            var me = this;
            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.load();
            };
            me.collection = new M.Collection;
            //me.load();
        },

        upEve: function( e ){
            var me = this;
            var id = $( e.currentTarget ).attr('data-id'),
                account = $( e.currentTarget ).attr('data-account');

            var bool = confirm('您确认提升此人为管理员么?')

            if( bool ){
                util.api({
                    'url':'/employee/setemployeeassysadmin',
                    'data':{
                        'employeeID': id,
                        'enterpriseAccount': account
                    },
                    'success': function( data ){
                        if( data.success ){
                            util.showTip('操作成功');
                            me.load();
                        }
                    }
                })
            }
        },
        resetPwdEve: function( e ){
            var me = this;

            var id = $( e.currentTarget ).attr('data-id'),
                account = $( e.currentTarget ).attr('data-account');

            me.trigger('reset', id , account);

        },
        //
        accountDetailEve: function( e ){
            var me = this;

            var id = $( e.currentTarget ).attr('data-id'),
                account = $( e.currentTarget ).attr('data-account');

            me.trigger('accountdetail', id , account);
        },
        search: function() {
            this.pagination.attr['pageNumber'] = 0;
            this.load();
        },
        load: function() {
            var me = this;
            util.api({
                url: '/employee/getpage',
                data: {
                    ea: me.$ea.val(),
                    ename: me.$en.val(),
                    name: me.$name.val(),
                    mobile: me.$mobile.val(),
                    pageIndex: me.pagination.attr['pageNumber'],
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="10"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {

                    console.warn( data );

                    if ( data.success ) {
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.init( data.value.model.content );
                        //me.collection.reload( data.value.model.content, function( item ) {
                        //    item.displayCreateTime = new Date( item.createTime )._format( "yyyy-MM-dd hh:mm" );
                        //} );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplEme( {'content':me.collection.all() } ) );
                        } else {
                            me.$tbody.html( '<tr><td colspan="10"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="10"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var employeeDataTable = new EmployeeDataTable( { 'view': $el.find( '.m-eme-lst' ) } );
        var resetWord = new ResetWord( {'title':'重置客户密码'} );
        var accountDetail = new AccountDetail();


        employeeDataTable.on('reset',function( id , account ){
            resetWord.show( id , account );
        });

        employeeDataTable.on('accountdetail',function( id , account ){
            accountDetail.show( id , account );
        });
    }
} );