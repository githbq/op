/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var contentStr = require('./settinghighter.html');
	var Dialog = require('common/widget/dialog/dialog');
	var tem = require('./template.html');

    /////////////////
    //
    //  设置上级
    /////////////////
	//选择上级
	var SetLeader = MClass( Dialog ).include({
		content: tem,
		defaultAttr:{
			width: 625,
			title: '选择上级'
		},
		events:{
			'click .person-detail': 'selectEve',
			'click .search': 'getlist'
		},
		 elements: {
            '.search': 'search'

        },
		init: function(){
			SetLeader.__super__.init.apply(this,arguments);
			var me = this;
		},
		type:'',
		objId:{},
		showAgentHigher: function(id,type){
			var me = this;
			me.type = type;
			me.objId.agentId= id;
			me.getlist(id);
			SetLeader.__super__.show.apply( this,arguments );
		},
		showChannelHigher: function(id,type){
			var me = this;
			me.type = type;
			me.objId.channelId= id;
			me.getlist(id);
			SetLeader.__super__.show.apply( this,arguments );
		},
		
		hide: function(){
			var me = this;
			me.list.clear();
			me.type = '';
			me.model.set('nameHighter','');
			me.objId = {};
			SetLeader.__super__.hide.apply( this,arguments );
		},
		//获取列表
		getlist: function(id){
			var me = this;
			if( me.type == 'agent' ){
				util.api({
					'url': '/agent/admingetagentaccountlist',
					'data':{
						'name':me.model.get('nameHighter'),
						'accountId':me.objId.agentId
					},
					'button': {
						'el': me.$search,
						'text':'获取信息......'
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							me.list.reload( data.value.model );
						}
					}
				});
			}else if( me.type == 'channel' ){
				util.api({
					'url': '/channel/admingetchannelaccountsuperior',
					'data':{
						'name':me.model.get('nameHighter'),
						'accountId':me.objId.channelId
					},
					'button': {
						'el': me.$search,
						'text':'获取信息......'
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							me.list.reload( data.value.model );
						}
					}
				})
			}
		},

		//选择上级
		selectEve: function( e ){
			var me = this;
			var $target = $(e.currentTarget);
				$target.addClass('active').siblings().removeClass('active');

			var id = $target.attr('data-id'),
				name = $target.attr('data-name');

			var bool = confirm( "是否设置"+name+"为你的上级?" );
			if( bool && me.type == 'agent'){
				util.api({
					'url': '/agent/adminsetsuperior',
					'data': {
						'accountId': me.objId.agentId,
						'superiorId': id
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							util.showTip('设置成功');
							me.trigger('setAgentSuccess',me.objId.agentId);
							me.hide();
						}	
					}
				});
			}else if(bool && me.type == 'channel'){
				util.api({
					'url': '/channel/adminsetsuperior',
					'data': {
						'accountId': me.objId.channelId,
						'superiorId': id
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							util.showTip('设置成功');
							me.trigger('setChannelSuccess',me.objId.channelId);
							me.hide();
						}	
					}
				});
			}
		}
	});
    var SettingHighter = MClass( Slider ).include({

        content: contentStr,
        
        defaultAttr:{
            'width': 550,
            'title': '代理商管理员设置上级'
        },

        elements: {
            '.setleader': 'setleader'

        },
        events: {
            'click .setleader': 'setleaderEve'
        },

        init: function(){
			var me =this;
            SettingHighter.__super__.init.apply( this,arguments );
			var setLeader = new SetLeader();
			me.on('agentSetting',function(id){
				//if( me.attrs && me.attrs.state == 'agent'){
					setLeader.showAgentHigher(id,me.attrs.state);
				//}
				
			});
			me.on('channelSetting',function(id){
				
				setLeader.showChannelHigher(id,me.attrs.state);
			});
			setLeader.on('setAgentSuccess',function(id){
				me.show(id);
			});
			setLeader.on('setChannelSuccess',function(id){
				me.show(id);
			});
			if( me.attrs && me.attrs.state){
                me.changeState( me.attrs.state );
            }
			
        },
		changeState: function( state ){
            var me = this;
            switch( state ){
                case 'agent':
                    me._setTitle('代理商管理员设置上级');
                    break;

                case 'channel':
                    me._setTitle('渠道管理员设置上级');
                    break;
            }
        },
		setleaderEve:function(e){
			var me = this;
			var id = $(e.currentTarget).attr('data-id');
			//var name = $(e.currentTarget).attr('data-name');
			if( me.attrs && me.attrs.state =='agent'){
				me.trigger('agentSetting',id);
			}else if( me.attrs && me.attrs.state =='channel' ){
				me.trigger('channelSetting',id);
			}
            
		},
        show: function( id ){
            var me = this;
			me.$setleader.attr('data-id',id);
			//me.$setleader.attr('data-name',name);
            if( me.attrs && me.attrs.state =='agent'){
				util.api({
					'url': '/agent/admingetsuperior',
					'data':{
						'accountId':id
					},
					'button': {
						'el': me.$setleader,
						'text':'获取信息......'
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							me.model.load(data.value.model);	
						}
					}
				});
			}else if( me.attrs && me.attrs.state =='channel'){
				util.api({
					'url': '/channel/admingetchannelsuperior ',
					'data':{
						'accountId':id
					},
					'button': {
						'el': me.$setleader,
						'text':'获取信息......'
					},
					'success': function( data ){
						console.warn( data );
						if( data.success && data.value.model){
							me.model.load(data.value.model);
						}
					}
				});
			}
			
            SettingHighter.__super__.show.apply( this,arguments );
        },

        hide: function(){
            this.model.clear();
            //this.attrs.state = '';
            SettingHighter.__super__.hide.apply( this,arguments );
        }
    });

	module.exports = SettingHighter;
});
