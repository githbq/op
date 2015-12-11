define(function(require, exports, module){
	
	//发送通知基类
	var NoticeModel = MClass( M.Model ).include({

		init: function(){
			NoticeModel.__super__.init.apply(this,arguments);
		},
		
		send: function(){
			var me = this;

			var bool = me.checkInfo();
			if( bool == false ) return;

			//将图片转换为正式图片
			util.api({
				'url':'/upload/uploadfile',
				'data':{
					'fileUrl': me.get('fileUrl'),
					'isPic': true,
					'companyScope': me.get('sendArea'),
					'clientScope': ''
				},
				'success': function(data){

					me.set('picPath',data.value['path']);
					me.set('thumbnailPath',data.value['thumbnailPath']);
					add();
				}
			})
			function add(){
				util.api({
					'url': '/notice/add',
					'data': {
						'noticeType': 0,
						'sendNowFlag': me.get('sendNowFlag'),
						'sendTime': me.get('sendTime'),
						'actionType': me.get('actionType'),
						'content': me.get('content'),
						'title': me.get('title'),
						'digest': me.get('zhaiyao'),
						'picPath': me.get('picPath'),
						'companyScope': me.get('sendArea'),
						'roleScope': '',
						'userScope': '',
						'headPicType':0
					},
					'success': function(info){
						if(info.success){
							util.showTip('发送成功');
							me.trigger('sendSuccess');
						}
					}
				})
			};
		},

		//内容校验
		// bool为true时 
		// 不进行发送范围和发送时间校验
		checkInfo: function(bool){
			var me = this;

			if( !me.attrs.title ){
				alert('请输入标题');
				return false;
			}

			if( !me.attrs.fileUrl ){
				alert('请选择封面图片');
				return false;
			}

			if( me.attrs.actionType == '1'){

				if( !me.attrs.content ){
					alert('请输入正文');
					return false;
				}
				if( me.attrs.content.length > 10000){
					alert('正文内容不得超过10000个字');
					return false;
				}
			}

			if( !bool ){
				if( me.attrs.sendRange != 0 && !me.attrs.sendArea ){
					alert('请输入自定义的企业账户');
					return false;
				}

				if( me.attrs.sendNowFlag != 0 ){
					if( !me.attrs.sendTime ){
						alert('请输入定时发送的时间');
						return false;
					}

					var nowTime = new Date().getTime();
					if( me.attrs.sendTime < nowTime){
						alert('请选择当前时间以后的时间');
						return false;
					}
				}
			}
			return true;
		},

		//保存为模板时进行内容校验
		checkSaveInfo: function(){
			if( !this.attrs.title ){
				alert('请输入标题');
				return false;
			}
			if( !this.attrs.content ){
				alert('请输入正文');
				return false;
			}
			if( this.attrs.content.length > 10000){
				alert('正文内容不得超过10000个字');
				return false;
			}
			if( !this.attrs.fileUrl ){
				alert('请选择封面图片');
				return false;
			}
			return true;
		}
	});

	module.exports = NoticeModel;
});

