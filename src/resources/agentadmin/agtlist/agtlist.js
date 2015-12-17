define( function(require, exports, module){

	var template = $( require('./template.html') );

	var Pagination = require('common/widget/pagination/pagination'),
		Dialog = require('common/widget/dialog/dialog'),
		Slider = require('common/widget/slider/slider'),
		DepartmentModel = require('module/departmentmodel/departmentmodel'),

		UserList = require('module/agentuserlist/agentuserlist'),
		UserInfo = require('module/agentuser/agentuser'),
		AgtList = require('module/agentlist/agentlist'),
		AreaTree = require('module/areatree/areatree');

	/**
	 *
	 * 添加代理商 或 编辑代理商
	 * 根据调用时show的参数
	 * 确定是添加代理商 还是 编辑代理商
	 */
	var AddAgent = MClass( Slider ).include({

		content: template.filter('#adddialog').html(),

		elements: {
			'.addagent-selectcity': 'selectCity',
			'.startTime': 'starttime',
			'.endTime': 'endtime',
			'.selectArea': 'selectArea',
			'.companyType':'companyType'
		},
		events:{
			'click .agent-reset': 'reset',
			'click .agent-cancel': 'hide',
			'click .agent-sure': 'addAgent',
			'click .selectArea': 'selectAreaEve',
			'click .perdept-button':'getDerdeptEve'
		},
		init: function(){
			AddAgent.__super__.init.apply( this,arguments );

			var me = this;
			var list = [{'name':'请选择','value':''}];
			
			me.departmentModel = new DepartmentModel({
                'checkStyle':'radio'
            });
			
			me.departmentModel.on('assginSuccess',function(){
                var deptNode =  me.departmentModel.getValue();
				//alert(departmentModel.getValue())
				console.log(deptNode)
				if(deptNode){
					me.model.set('deptId',deptNode[0].id);
					me.$('.depts-box').text(deptNode[0].name);
				}else{
					me.model.set('deptId','');
					me.$('.depts-box').text('');
				}
				
            });
			me.$companyType.on('change',function(){
				if(me.$companyType.val()=='1'){
					me.model.set('deptId','');
					me.$('.add-box').show();
					me.$('.depts-box').text('');
					
				}else{
					me.$('.add-box').hide();
					me.model.set('deptId','');
					me.$('.depts-box').text('');
				}
			});
            
            util.getEnums( 'PROVINCE', function( data ) {
          		data.value.model.forEach(function(item ){
          			list.push({'name':item.text,'value':item.value});
          		});
          		util.resetSelect( me.$selectCity, list );
            });

            me.$starttime.datetimepicker({timepicker: false,format:'Y/m/d'});
            me.$endtime.datetimepicker({timepicker: false,format:'Y/m/d'});
		},
		addAgent: function(){
			var me = this;

			if( !me.model.get('name') ){

				util.showToast('请填写代理商名称');
				return;
			}


			if( !me.model.get('province') ){

				util.showToast('请选择省或直辖市');
				return;
			}

			var starttime = '',
				endtime = '',
				region = me.$selectArea.attr('data-code');

			if( me.$starttime.val().length > 0 ){
				starttime = new Date( me.$starttime.val() ).getTime();
			}
			if( me.$endtime.val().length > 0 ){
				endtime = new Date( me.$endtime.val() ).getTime();
			}


			if( !region ){

				util.showToast('请选择区域');
				return;
			}

			//编辑
			if( me.attrs['id'] ){
				var status = 0,
					permissins = 1;

				//todo
				if( me.model.get('status') ){
					status = 1; 
				}

				//todo
				if( me.model.get('permissions') ){
					permissins = 0;
				}

				util.api({
					'url':'/agent/updateagent',
					'data':{
						'id': me.attrs['id'],
						'name': me.model.get('name'),
						'province': me.model.get('province'),
						'region': region,
						'validTimeStart': starttime,
						'validTimeEnd': endtime,
						'status': status,
						'permissins': permissins
					},
					'success': function(data){
						if( data.success ){
							me.trigger('update');
							me.hide();
						}
					}
				},true)

			//新增
			}else{
				if(!me.model.get('deptId')&& me.model.get('companyType')==1){
					util.showToast('请选择所属部门');
					return;
				}
				util.api({
					'url':'/agent/addagent',
					'data':{
						'name': me.model.get('name'),
						'province': me.model.get('province'),
						'region': region,
						'validTimeStart': starttime ,
						'validTimeEnd': endtime,
						'companyType':me.model.get('companyType'),
						'deptId':me.model.get('deptId')
					},
					'success': function(data){
						if( data.success ){
							me.trigger('update');
							me.hide();
						}
					}
				},true)	
			}
		},
		
		/**
		 *
		 * 选择区域
		 */
		selectAreaEve: function(){
			var me = this;

			me.trigger('selectarea');
		},
		//选择部门
		getDerdeptEve:function(){
			var me = this;
			//me.departmentModel.show([]);
			me.departmentModel.show([],{},'~/op/api/am/agent/queryCanBindDepts')
		},

		//选择区域
		selectarea: function( treenodes ){
			var me = this;

			me.$selectArea.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
		},

		reset: function(){
			var me = this;

			if( me.attrs['id'] ){
				util.api({
					'url': '/agent/getagent',
					'data': {
						'id': me.attrs['id']
					},
					'success': function( data ){
						if(data.success){
							me.model.load( data.value.model );
						}
					}
				})
			}else{
				me.model.clear();
			}
		},
		
		hide: function(){
			var me = this;
			
			me.model.clear();
			me.$starttime.val('');
			me.$endtime.val('');
			me.$selectArea.val('').removeAttr('data-code');
			me.$('.deptName').val('');
			me.attrs['id'] = '';

			AddAgent.__super__.hide.apply(this,arguments);
		},
		setState:function(id){
			var me = this;
			if(id){
				me.$('.m-agentinfo').removeClass('agentadd');
				me._setTitle('编辑');
				me.$('.add-box').hide();
				me.$('.edit-box').show();
				me.$('.companyType').attr('disabled', 'disabled');
			}else{
				me.$('.m-agentinfo').addClass('agentadd');
				me._setTitle('添加代理商');
				me.$('.add-box').show();
				me.$('.edit-box').hide();
				me.$('.depts-box').text('');
				me.$('.companyType')[0].options[0].selected = true;
				me.$('.companyType').removeAttr('disabled');
			}
		},

		/*
		* 
		*/
		show: function( id ){
			var me = this;

			me.attrs['id'] = id || '';

			
			
			me.setState(me.attrs['id']);
			
			if( id ){
				

				util.api({
					'url': '/agent/getagent',
					'data': {
						'id': me.attrs['id']
					},
					'success': function( data ){
						console.warn( data );
						if(data.success){
							me.model.load( data.value.model.agent );
							if( data.value.model.regionName ){
								me.$selectArea.val( data.value.model.regionName + '(' + data.value.model.agent.region + ')' ).attr('data-code',data.value.model.agent.region);
							}
							if( me.model.get('permissions') ){
								me.model.set('permissions', 0 );
							}else{
								me.model.set('permissions', 1 );
							}
							if(!data.value.model.dept){
								me.$('.edit-box').hide();
							}else{
								me.$('.edit-box').show();
								me.$('.deptName').val(data.value.model.dept.name);
							}
						}
					}
				})
			}

			AddAgent.__super__.show.apply(this,arguments);
		}
	});
	
	exports.init = function(){
		var $el = exports.$el;

		var addAgent = new AddAgent( {'title':'添加代理商'} );
		var agtList = new AgtList( {'wrapper':$el} );
		var userList = new UserList( {'state':'am'} );

		var userInfo = new UserInfo( {'state':'agenteditactive'} );
		var userAdd = new UserInfo( {'state':'agentadd'} );

		var areaTree = new AreaTree();

		agtList.render();
		
		//新增代理商
		agtList.on('add',function(){
			addAgent.show();
		});

		//编辑代理商
		agtList.on('editagent',function( id ){
			addAgent.show( id );
		});

		//查看用户列表
		agtList.on('userdetail',function( id , name ){
			userList.show( id , name );
		});

		//新增成功
		addAgent.on('update',function(){
			agtList.searchEve();
		});


		//选择区域
		addAgent.on('selectarea',function(){
			areaTree.show();
		});

		areaTree.on('selectarea',function( treeNodes ){
			addAgent.selectarea( treeNodes );
		});

		//
		userList.on('detail',function( id , agentId ){
			userInfo.show( id , agentId , true);
		});
		userList.on('add',function( agentId ){
			userAdd.show( false, agentId , true);
		});
		userList.on('reset',function( id ){
			console.log( id );
		});

		userInfo.on('update',function(){
			userList.searchEve();
		});
	}
});
