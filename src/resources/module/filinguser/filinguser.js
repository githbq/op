/**
 *
 * 渠道管理员 
 * 添加或编辑渠道用户
 */

define( function(require, exports, module){

    var contentstr = require('./filinguser.html');
    var Slider = require('common/widget/slider/slider');
    var AreaTree = require('module/areatree/areatree');
	
    /**
     *
     * 用户详细和新增
     * 根据show的时候 是否传入id 确定是新增还是编辑 
     * 
     */
    var UserInfo = MClass( Slider ).include({
        content: contentstr,
        events: {
            'click .user-sure': 'addEve',
            'click .user-edit': 'editEve',
            'click .user-cancel': 'hide',
            'click .area': 'selectAreaEve'
        },
        elements:{
            '.intime': 'intime',
            '.area': 'area',
			'.hide-status':'hideStatus'
        },
        init: function(){
            UserInfo.__super__.init.apply( this,arguments );
            var me = this;

            me.areaTree = new AreaTree( { 'multiSelect': true } );

            me.areaTree.on('selectarea',function( treenode ){
                var names = '',
                    codes = '';
                treenode.forEach(function(item){
                    names = names + item.name + ',';
                    codes = codes + item.code + ',';
                })
                names = names.slice(0,-1);
                codes = codes.slice(0,-1);

                me.$area.val( names ).attr('data-code',codes );
            });
            
            me.setState();

            me.$intime.datetimepicker( {timepicker: false, format:'Y/m/d'} );
        },

        //状态转换
        setState: function(){
            var me = this;

            me.$("[data-state]").hide();
            if( me.attrs.state ){
                me.$("[data-state='" + me.attrs.state + "']").show();

                if( me.attrs.state == 'add' ){
                    me._setTitle('添加渠道用户');
					me.$hideStatus.show();
                }else if ( me.attrs.state == 'edit' ){
                    me._setTitle('渠道用户详情');
					me.$hideStatus.hide();
                }
            }            
        },

        selectAreaEve: function(){
            var me = this;
            me.areaTree.show();
        },
        show: function( id , agentId){
            var me = this;
			

            me.attrs['id'] = id || '';
            me.attrs['agentId'] = agentId;

            if( id ){

                util.api({
                    'url': '/agent/getaccount',
                    'data': {
                        'id': id
                    },
                    'success': function( data ){
                        if( data.success ){
                            me.model.load( data.value.model );
                            if( data.value.model.hiredate ){

                                me.$intime.val( new Date( data.value.model.hiredate )._format('yyyy/MM/dd') );
                            }
							me.model.set('mobilePhone',data.value.model.mobile?data.value.model.mobile:'');
							me.model.set('workPhone',data.value.model.phone?data.value.model.phone:'');
                            //判断是否为内部管理员
                            /*
                            if( data.value.model.agentAdmin ){
                                me.model.set('role',1);
                            } else {
                                me.model.set('role',0);
                            }
                            */
                        }
                    }
                })
            }
            UserInfo.__super__.show.apply( this,arguments );
        },

        hide: function(){
            var me = this;
            
            me.model.clear();
            me.$intime.val('');

            UserInfo.__super__.hide.apply( this,arguments );
        },

        /**
         *
         * 添加渠道用户
         */
        addEve: function(){
            var me = this;

            //登录名
            if( !me.model.get('username') ){
                util.showToast('请填写登录名');
                return false;
            }

            //姓名
            if( !me.model.get('name') ){
                util.showToast('请填写姓名');
                return false;
            }

            //console.log( me.model );
            //console.log( me.model.get('idcard') );
            //身份证号
            if( !me.model.get('idcard') ){
                util.showToast('请填写身份证编号');
                return false;
            }

            //职位
            if( !me.model.get('post') ){
                util.showToast('请填写职位');
                return false;
            }

            //邮箱
            if( !me.model.get('email') ){
                util.showToast('请填写邮箱');
                return false;
            }

            //手机号码
            if( !me.model.get('mobilePhone') ){
                util.showToast('请填写手机号码');
                return false;
            }else if( !util.regMap.phone.test( me.model.get('mobilePhone') ) ){
                util.showToast('手机号码格式不正确 请重新填写');
                return false;
            }

            //入职日期
            var hiredate = '';
            if( me.$intime.val().length > 0 ){
                hiredate = new Date( me.$intime.val() ).getTime();
            }else{
                util.showToast('请选择入职日期');
                return false;
            }

            //启用
            var active = 0;
            if( me.model.get('active') ){
                active = 1;
            }

            //区域
            /*
            if( !me.$area.attr('data-code') ){
                util.showToast('请选择区域');
                return false;
            }
            */

            util.api({
                'url':'/channel/addchannelaccount',
                'data':{
                    'name': me.model.get('name'),
                    'username': me.model.get('username'),
                    'email': me.model.get('email'),
                    'workPhone': me.model.get('workPhone'),
                    'mobilePhone': me.model.get('mobilePhone'),
                    'idcard': me.model.get('idcard'),
                    'hiredate': hiredate,
                    'post': me.model.get('post'),
                    'camp': me.model.get('camp'),
                    'active': active
                    //'regionCodes': me.$area.attr('data-code')
                },
                'success': function( data ){
                    if( data.success ){
                        me.trigger('update');
                        me.hide();
                    }
                }
            })
        },

        /**
         *
         * 编辑渠道用户
         */
        editEve: function(){
            var me = this;

            //登录名
            if( !me.model.get('username') ){
                util.showToast('请填写登录名');
                return false;
            }

            //姓名
            if( !me.model.get('name') ){
                util.showToast('请填写姓名');
                return false;
            }

            //console.log( me.model );
            //console.log( me.model.get('idcard') );
            //身份证号
            if( !me.model.get('idcard') ){
                util.showToast('请填写身份证编号');
                return false;
            }

            //职位
            if( !me.model.get('post') ){
                util.showToast('请填写职位');
                return false;
            }

            //邮箱
            if( !me.model.get('email') ){
                util.showToast('请填写邮箱');
                return false;
            }


            //入职日期
            var hiredate = '';
            if( me.$intime.val().length > 0 ){
                hiredate = new Date( me.$intime.val() ).getTime();
            }else{
                util.showToast('请选择入职日期');
                return false;
            }

            //启用
            /*var active = 0;
            if( me.model.get('active') ){
                active = 1;
            }*/

            //手机号码
            if( !me.model.get('mobilePhone') ){
                util.showToast('请填写手机号码');
                return false;
            }else if( !util.regMap.phone.test( me.model.get('mobilePhone') ) ){
                util.showToast('手机号码格式不正确 请重新填写');
                return false;
            }
            
            util.api({
                'url':'/channel/updatechannelaccount',
                'data':{
                    'id': me.attrs['id'],
                    'username': me.model.get('username'),
                    'name': me.model.get('name'),
                    'email': me.model.get('email'),
                    'role': me.model.get('role'),
                    'mobilePhone': me.model.get('mobilePhone'),
                    'workPhone': me.model.get('workPhone'),
                    'idcard': me.model.get('idcard'),
                    'hiredate': hiredate,
                    'post': me.model.get('post'),
                    'camp': me.model.get('camp')
                    //'active': active
                },
                'success': function( data ){
                    if( data.success ){
                        me.trigger('update');
                        me.hide();
                    }
                }
            });
        }
    });
    
    module.exports = UserInfo;  
});
