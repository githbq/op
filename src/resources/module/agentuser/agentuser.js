/**
 *
 * 添加或编辑代理商用户
 * 
 * 代理商超级管理员用
 * 代理商内部管理员用
 * 渠道用户用( 渠道用户仅可修改备案企业数量 )
 */

define( function(require, exports, module){

    var contentstr = require('./agentuser.html');
    var Dialog = require('common/widget/dialog/dialog');
	var uploader = require('common/widget/upload').uploader;

    /**
     *
     * 用户详细和新增
     * 根据show的时候 是否传入id 确定是新增还是编辑 
     * 
     */
    var UserInfo = MClass( Dialog ).include({
        content: contentstr,
        
        events: {
            'click .user-sure': 'addEve',
            'click .user-editactive': 'editActiveEve',
            'click .user-editdeactive': 'editDeactiveEve',
            'click .user-change': 'changeEve',
            'click .user-cancel': 'hide',
            'click .user-reset': 'resetEve',
            'click .detect-agree': 'agreeEve',
            'click .detect-abort': 'abortEve'
        },

        elements:{
            '.info-username': 'username',
            '.intime': 'intime',
            '.user-sure': 'usersure',    //添加用户按钮
            '#frontImg': 'frontImg',     //正面照片
            '#backImg': 'backImg',       //反面照片
            '#frontImgInfo': 'frontImgInfo',  //正面照片url
            '#backImgInfo': 'backImgInfo'  ,   //反面照片url
			'.Reaseon-info':'ReaseonInfo',
			'.rejectReaseon':'rejectReaseonInfo'
        },
        
        init: function(){
            UserInfo.__super__.init.apply( this,arguments );
            var me = this;

            me.$intime.datetimepicker( {timepicker: false, format:'Y/m/d'} );

            //状态转换
            me.setStatus();
        },

        /**
         *
         * 进行状态转换
         * 共三种状态
         *  添加状态
         *  修改状态
         *  渠道修改备案企业数量状态
         *  渠道审核状态
         */
        setStatus: function(){
            var me = this;
            
            var state = me.attrs.state;

            me.$('input').removeAttr('disabled');

            //
            if( state ){
                me.$( '.state-'+state ).show();

                //如果是渠道用户 仅可修改备案企业数量
                if( state == 'channel' ){

                    me._setTitle('用户信息');
                    me.$('input').attr('disabled','disabled');
                    me.$('select').attr('disabled','disabled');
                    me.$('input.state-'+state).removeAttr('disabled');

                //渠道审核信息
                } else if( state == "channeldetect" ){

                    me._setTitle('用户信息');
					me.$ReaseonInfo.hide();

                //添加用户
                } else if( state == 'agentadd' ){

                    me._setTitle('添加用户');
                    me.$username.removeAttr('disabled');
                  //  me.$('.content-active').hide();

                //编辑已启用用户
                } else if( state == 'agenteditactive' ){

                    me._setTitle('用户信息');
                    me.$username.attr('disabled','disabled');
                    me.$('.i-important').hide();
                   // me.$view.find('.content-active').show();
                //编辑已停用用户
                }else if( state == 'agenteditdeactive'){

                    me._setTitle('用户信息');
                    me.$username.attr('disabled','disabled');
                    me.$('.i-important').hide();
                //只查看信息
                } else if ( state == 'detail' ){
                    me._setTitle('用户信息');
                    me.$('input').attr('disabled','disabled');
                    me.$('select').attr('disabled','disabled');
                    me.$view.find('.superselect').show();
                
                //编辑自己
                } else if( state == 'editself' ){
                    me._setTitle('用户信息');

                    me.$username.attr('disabled','disabled');
                    me.$view.find('.superselect').show();
                    me.$view.find('.roleselect').attr('disabled','disabled');
                    me.$('.i-important').hide();
                }

            }
        },

        /**
         *
         * id        用户id
         * agentId   代理商Id
         * bool      是否是代理商超级管理员
         *           在代理商超级管理员状态下
         *           可以对用户进行启用 停用设置
         *           select选择的时候 也可以指定为代理商内部管理员
         */
        show: function( id , agentId , bool){
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
                            
                            /*
                            //判断是否为内部管理员
                            if( data.value.model.agentAdmin ){
                                me.model.set('role',1);
                            } else {
                                me.model.set('role',0);
                            }
                            */
                            me.model.set('role', me.model.get('roleEnum'));

                            if( me.model.get('identificationBack') ){
                                var src = '/op/api/file/download?filePath='+me.model.get('identificationBack');
                                me.$backImgInfo.attr('src',src).parent().attr('href',src);
                                me.$('.frontImga').show();
                            }else{
                                me.$('.frontImga').hide();
                                me.$('.frontImgnone').show();
                            }

                            if( me.model.get('identificationFront') ){
                                var src = '/op/api/file/download?filePath='+me.model.get('identificationFront');
                                me.$frontImgInfo.attr('src',src).parent().attr('href',src);
                                me.$('.backImga').show();
                            }else{
                                me.$('.backImga').hide();
                                me.$('.backImgnone').show();
                            }
	
							if(data.value.model.auditStatus=='FAILS' ){
								me.$ReaseonInfo.show();
								me.$rejectReaseonInfo.text(data.value.model.rejectReason)
							}
                        }
                    }
                })
            }
            if( bool ){
                //me.$view.find('.content-active').show();
                me.$view.find('.superselect').show();
            };

            console.log('showshow');
            UserInfo.__super__.show.apply( this,arguments );
        },

        hide: function(){
            var me = this;
            
            me.model.clear();
			me.$rejectReaseonInfo.text('');
            //me.model.set('active',true);
            me.model.set('role',0);
            me.$intime.val('');
            me.$frontImg[0].value='';
            me.$frontImgInfo.attr('src','');
            me.$backImg[0].value='';
            me.$backImgInfo.attr('src','');
            me.$('.frontImga').hide();
            me.$('.frontImgnone').hide();
            me.$('.backImga').hide();
            me.$('.backImgnone').hide();
            UserInfo.__super__.hide.apply( this,arguments );
        },

        /**
         *
         * 添加用户
         */
        addEve: function(){
            var me = this;

           /* var active = 0;
            if( me.model.get('active') ){
                active = 1;
            }*/
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
            }else if( !util.regMap.email.test( me.model.get('email') ) ){
                util.showToast('邮箱格式不正确 请重新填写');
                return false;
            }

            //手机
            if( !me.model.get('mobile') ){
                util.showToast('请填写手机号码');
                return false;
            }else if( !util.regMap.phone.test( me.model.get('mobile') ) ){
                util.showToast('手机格式不正确 请重新填写');
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

            //身份证正面照片
            if( me.$frontImg[0].files.length <=0 ){
                util.showToast('请选择身份证正面照片');
                return false;
            }

            //身份证反面照片
            if( me.$backImg[0].files.length <= 0 ){
                util.showToast('请选择身份证反面照片');
                return false;
            }

            var state = {
                'a': false,
                'b': false
            }

            function check(){
                if( state.a && state.b ){

                    util.api({
                        'url':'/agent/addagentaccount',
                        'data':{
                            'agentId': me.attrs['agentId'],
                            'name': me.model.get('name'),
                            'role': me.model.get('role'),
                            'loginName': me.model.get('username'),
                            'email': me.model.get('email'),
                            'workPhone': me.model.get('phone'),
                            'mobilePhone': me.model.get('mobile'),
                            'idCard': me.model.get('idcard'),
                            'hireDate': hiredate,
                            'post': me.model.get('post'),
                            'camp': me.model.get('camp'),
                            'identificationFront': me.model.get('identificationFront'),
                            'identificationBack': me.model.get('identificationBack')
                        },
                        'success': function( data ){
                            if( data.success ){
								util.showTip('添加成功');
                                me.trigger('update');
                                me.hide();
                            }
                        },
                        'complete': function(){
                            me.$usersure.text('提交').removeAttr('disabled');
                        }
                    });
                }
            }

            me.$usersure.text('提交中...').attr('disabled','disabled');
            uploader.send({
                'url': '/op/api/file/uploadsinglefile',
                'files': me.$frontImg[0].files,
                'success': function( response ){
                    console.warn( response );
                    if( response.success ){
                        me.model.set('identificationFront',response.value.model.path);
                        state.a = true;
                        check();
                    }
                },
                'error': function(){
                    me.$usersure.text('提交').removeAttr('disabled');
                }
            });
            uploader.send({
                'url': '/op/api/file/uploadsinglefile',
                'files': me.$backImg[0].files,
                'success': function( response ){
                    console.warn( response );
                    if( response.success ){
                        me.model.set('identificationBack',response.value.model.path);
                        state.b = true;
                        check();
                    }
                },
                'error': function(){
                    me.$usersure.text('提交').removeAttr('disabled');
                }
            })
        },
            
        /**
         *
         * 修改用户
         */
        editActiveEve: function(){
            var me = this;

            /*var active = 0;
            if( me.model.get('active') ){
                active = 1;
            }*/
            
            //校验手机号
            if( !me.model.get('mobile') ){
                util.showToast('请填写手机号码');
                return false;
            }else if( !util.regMap.phone.test( me.model.get('mobile') ) ){
                util.showToast('手机格式不正确 请重新填写');
                return false;
            }


            /**********
            修改用户时暂无校验
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
            }else if( !util.regMap.email.test( me.model.get('email') ) ){
                util.showToast('邮箱格式不正确 请重新填写');
                return false;
            }
            *******/
            //入职日期
            var hiredate = '';
            if( me.$intime.val().length > 0 ){
                hiredate = new Date( me.$intime.val() ).getTime();
            }

            var state = {
                'a': true,
                'b': true
            }

            /**
             *
             * 只有input file 有值才进行上传
             * 如果没值 则直接提交
             */

            //身份证正面照片
            if( me.$frontImg[0].files.length > 0 ){
                state.a = false;
            }
            //身份证反面照片
            if( me.$backImg[0].files.length > 0 ){
                state.b = false;
            }

            if( !state.a ){
                uploader.send({
                    'url': '/op/api/file/uploadsinglefile',
                    'files': me.$frontImg[0].files,
                    'success': function( response ){
                        console.warn( response );
                        if( response.success ){
                            me.model.set('identificationFront',response.value.model.path);
                            state.a = true;
                            check();
                        }
                    }
                });
            }
            if( !state.b ){
                uploader.send({
                    'url': '/op/api/file/uploadsinglefile',
                    'files': me.$backImg[0].files,
                    'success': function( response ){
                        console.warn( response );
                        if( response.success ){
                            me.model.set('identificationBack',response.value.model.path);
                            state.b = true;
                            check();
                        }
                    }
                })
            }


            if( state.a && state.b ){
                check();
            }
            function check(){
                if( state.a && state.b ){

                    me.$usersure.text('提交中...').attr('disabled','disabled');
                    
                    util.api({
                        'url':'/agent/updateagentaccount',
                        'data':{
                            'id': me.attrs['id'],
                            'name': me.model.get('name'),
                            'email': me.model.get('email'),
                            'role': me.model.get('role'),
                            'mobilePhone': me.model.get('mobile'),
                            'workphone': me.model.get('phone'),
                            'idCard': me.model.get('idcard'),
                            'hireDate': hiredate,
                            'post': me.model.get('post'),
                            'camp': me.model.get('camp'),
                            'identificationFront': me.model.get('identificationFront'),
                            'identificationBack': me.model.get('identificationBack')
                            //'active': active
                        },
                        'success': function( data ){
                            if( data.success ){
								util.showTip('更新成功');
                                me.trigger('update');
                                me.hide();
                            }
                        }
                    });
                }
            }
        },

        editDeactiveEve: function(){
            var me = this;

            //var active = 1;
            /**********
            修改用户时暂无校验
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
            }else if( !util.regMap.email.test( me.model.get('email') ) ){
                util.showToast('邮箱格式不正确 请重新填写');
                return false;
            }
            *******/
            //入职日期
            var hiredate = '';
            if( me.$intime.val().length > 0 ){
                hiredate = new Date( me.$intime.val() ).getTime();
            }

            var state = {
                'a': true,
                'b': true
            }

            /**
             *
             * 只有input file 有值才进行上传
             * 如果没值 则直接提交
             */

            //身份证正面照片
            if( me.$frontImg[0].files.length > 0 ){
                state.a = false;
            }
            //身份证反面照片
            if( me.$backImg[0].files.length > 0 ){
                state.b = false;
            }

            if( !state.a ){
                uploader.send({
                    'url': '/op/api/file/uploadsinglefile',
                    'files': me.$frontImg[0].files,
                    'success': function( response ){
                        console.warn( response );
                        if( response.success ){
                            me.model.set('identificationFront',response.value.model.path);
                            state.a = true;
                            check();
                        }
                    }
                });
            }
            if( !state.b ){
                uploader.send({
                    'url': '/op/api/file/uploadsinglefile',
                    'files': me.$backImg[0].files,
                    'success': function( response ){
                        console.warn( response );
                        if( response.success ){
                            me.model.set('identificationBack',response.value.model.path);
                            state.b = true;
                            check();
                        }
                    }
                })
            }


            if( state.a && state.b ){
                check();
            }
            function check(){
                if( state.a && state.b ){

                    me.$usersure.text('提交中...').attr('disabled','disabled');
                    
                    util.api({
                        'url':'/agent/updateagentaccount',
                        'data':{
                            'id': me.attrs['id'],
                            'name': me.model.get('name'),
                            'email': me.model.get('email'),
                            'role': me.model.get('role'),
                            'mobilePhone': me.model.get('mobile'),
                            'workphone': me.model.get('phone'),
                            'idCard': me.model.get('idcard'),
                            'hireDate': hiredate,
                            'post': me.model.get('post'),
                            'camp': me.model.get('camp'),
                            'identificationFront': me.model.get('identificationFront'),
                            'identificationBack': me.model.get('identificationBack')
                            //'active': active
                        },
                        'success': function( data ){
                            if( data.success ){
								util.showTip('更新成功');
                                me.trigger('update');
                                me.hide();
                            }
                        }
                    });
                }
            }
        },

        //渠道修改代理商用户备案企业数量逻辑
        changeEve: function(){

            var me = this;
            
            util.api({
                'url':'/agent/setenterprisefilingcount',
                'data':{
                    'accountId': me.attrs['id'],
                    'filingCount': me.model.get('enterpriseFilingCount')
                },
                'success': function( data ){

                    if( data.success ){
                        util.showTip('修改成功');
                        me.hide();
                    }
                }
            })
        },

        agreeEve: function(){
            var me = this;

            if( confirm('是否确认通过此条审核') ){
                util.api({
                    url:'/agent/updateauditstatus',
                    'data':{
                        'accountId': me.attrs['id'],
                        'auditStatus':1
                    },
                    success:function( data ){
                        if( data.success ){
                            util.showTip('审核成功');
                            me.trigger('update');
                            me.hide();
                        }
                    }
                })
            }
        },

        abortEve: function(){
            var me = this;
			if(!me.model.get('rejectReaseon')){
				util.showToast('请填写驳回审批意见！');
                return false;
			}
            if( confirm('是否确认驳回此条审核') ){
                util.api({
                    url:'/agent/updateauditstatus',
                    'data':{
                        'accountId': me.attrs['id'],
						'rejectReason':me.model.get('rejectReaseon'),
                        'auditStatus':2
                    },
                    success: function( data ){
                        if( data.success ){
                            util.showTip('审核成功');
                            me.trigger('update');
                            me.hide();
                        }
                    }
                })
            }
        },
        //重置
        resetEve: function(){
            var me = this;
            if( me.attrs['id'] ){
                util.api({
                    'url': '/agent/getaccount',
                    'data': {
                        'id': me.attrs['id']
                    },
                    'success': function( data ){
                        if( data.success ){
                            me.model.load( data.value.model );

                            if( data.value.model.hiredate ){
                                me.$intime.val( new Date( data.value.model.hiredate )._format('yyyy/MM/dd') );
                            }else{
                                me.$intime.val('');
                            }

                            //判断是否为内部管理员
                            if( data.value.model.agentAdmin ){
                                me.model.set('role',1);
                            } else {
                                me.model.set('role',0);
                            }
                        }
                    }
                })
            }else{
                me.model.clear();
                //me.model.set('active',true);
                me.$intime.val('');
            }
        }
    });
    
    module.exports = UserInfo;  
});
