define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var uploader = require('common/widget/upload').uploader;
	var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./template.html');
	var EntDetail = require('module/watchentdetail/watchentdetail');
	
	var shenheMap = {};     //审核状态
    var huifangMap = {};    //回访状态
    var cheatMap = {};      //作弊状态
    var huoyueMap = {       //活跃状态
        '0': '否',            
        '1': '是'            
    }

    /**
     *
     * 导入slider
     */
    var ExportIn = MClass( Slider ).include({
        defaultAttr:{
            'title':'导入',
            'width': 300
        },
        events:{
            'click .exportin': 'exportIn'
        },
        elements:{
            '#filein':'filein',
			'.exportin':'exportin'
        },
        content: contentStr,
        init: function(){
            ExportIn.__super__.init.apply( this, arguments );
			var me = this;
			me.$exportin.attr('disabled','disabled');
			me.$exportin.text('请选择文件...');
			me.$filein.on('change',function(){
				var fileExtension =me.$filein[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension!='xlsx'){
					me.$filein.val('');
					util.showToast('文件格式不正确！(.xlsx)');
					return false;
				}else{
					me.$exportin.removeAttr('disabled');
					me.$exportin.text('导入');
				}
			})
        },
        show: function(){
			var me = this;
			me.$exportin.attr('disabled','disabled');
			me.$exportin.text('请选择文件...');
            ExportIn.__super__.show.apply( this, arguments );
        },
        hide: function(){
			var me = this;
			me.$filein.val('');
            ExportIn.__super__.hide.apply( this, arguments );
        },
        //导入
        exportIn: function(){
			var me = this;
			 uploader.send({
				'url': '/op/api/s/enterprise/importcallbackexcel',
				'files': me.$filein[0].files,
				'success': function( response ){
					console.warn( response );
					if( response.success ){
						util.showTip('文件导入成功');
						me.hide();
					}
                }
				
			})
        }
    });

    /**
     *
     * 企业列表
     */
    var WatchEnt = MClass( M.Center ).include({

        elements:{
			'#eaAccount': 'eaAccount',
            '#eaName': 'eaName',
            '#informationCheckStatus': 'informationCheckStatus',
            '#returnBackStatus': 'returnBackStatus',
            '#agentId': 'agentId',
            '#qcATBegin': 'atBegin',
            '#qcATEnd': 'atEnd',
            '.header-info': 'headerInfo',
            'tbody': 'tbody',
			'.trtabList':'trtabList',
			'.phone-input':'phoneInput',
			'.watchent-assgin':'watchentAssgin'
        },

        events:{
            'click .search': 'searchEve',
			'click .export': 'exportEve',
            'click .exportin': 'exportInEve',
			'click .watchent-assgin':'watchentAssginEve',
            'click .bindall': 'bindEve',
			'click .watchent-detail':'watchentDetailEve',
            'click .selectEntAll': 'selectAllEve'
        },

        init: function(){
            WatchEnt.__super__.init.apply( this,arguments );
            var me = this;
            
            me.pagination = new Pagination( {
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
			
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            }

            
            me.$atBegin.datetimepicker( { timepicker: false, format: 'Y/m/d' } );
            me.$atEnd.datetimepicker( { timepicker: false, format: 'Y/m/d' } );
			
            me.$atBegin.val( util.getDateStr(-30) );
            me.$atEnd.val( util.getDateStr(-1) );

            me.getEnums();
            me.on('empty:list',function(){
                me.$tbody.html("<tr><td colspan='12'><p class='info'>暂无数据</p></td></tr>");
            });

            me.$atBegin.on('focusout',function(){
                console.log('focusout');
            })
            
        },

        //获取枚举列表
        getEnums: function(){
            var me = this;

            var state = {
                'a':false,
                'b':false,
                'c':false
            };

            function check(){
                if( state.a && state.b && state.c ){
                    me.getList();
                }
            };


            me.generateSelect('INFORMATION_CHECK_STATUS', me.$('#informationCheckStatus'),function( items ){
                state.a = true;
                items.forEach(function(item){
                    shenheMap[item.value] = item.text;
                });
                check();
            });

            me.generateSelect('RETURN_VISIT_CHECK', me.$('#returnBackStatus'),function( items ){
                state.b = true;
                items.forEach(function(item){
                    huifangMap[item.value] = item.text;
                });
                check();
            });

            me.generateSelect('ENTERPRISE_CHEAT_TYPE', me.$('#cheatStatus'),function( items ){
                state.c = true;
                items.forEach(function(item){
                    cheatMap[item.value] = item.text;
                });
                check();
            });
        },
        
        generateSelect: function( name , $select , callback ){
            var me = this;
            util.getEnums( name, function( data ) {
                var items = data.model, options = '<option value="">全部</option>';
                items.forEach( function( item ){
                    options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                });
                $select.html( options );
                callback && callback( items );
            });
        },
        selectAllEve: function(e){
            var me = this;

            console.log( $(e.target).prop('checked') )
            if($(e.target).prop('checked')){
                me.$('tbody .selectEnt').prop('checked',true);
            }else{
                me.$('tbody .selectEnt').prop('checked',false);
            }

        },
		// 获取企业列表数据
    	getList: function(){
            var me = this;

            var data = me.model.all();

            //开通时间开始
            if ( me.$atBegin.val() ) {
                data.appStartTimeStart = new Date( me.$atBegin.val() ).getTime();
            }

            //开通时间结束
            if ( me.$atEnd.val() ) {
                data.appStartTimeEnd = new Date( me.$atEnd.val() ).getTime();
            }

            data.pageIndex = me.pagination.attr['pageNumber']; 
            data.pageSize = me.pagination.attr['pageSize'];
            data.activityYn = 1;
            
            me.$tbody.html("<tr><td colspan='12'><p class='info'>努力加载中</p></td></tr>");
			if(IBSS.FUNCTIONS.indexOf('F008004') != -1){
				util.api({
					'url': '/enterprise/querypageforsupervise',
					'data': data,
					'success': function( data ){
						console.warn( data );
						if( data.success ){

							me.pagination.setTotalSize( data.value.model.itemCount );
							me.list.reload( data.value.model.content ,function( item ){
								item.shenheStr = shenheMap[item.informationCheck];
								item.huifangStr = huifangMap[item.returnVisitCheck];
								item.activityYnStr = huoyueMap[item.activityYn];
							});
						}
					}
				})
			}else if(IBSS.FUNCTIONS.indexOf('F008003') != -1){
				util.api({
					'url': '/enterprise/querypagetosuperviseforsupervise',
					'data': data,
					'success': function( data ){
						console.warn( data );
						if( data.success ){

							me.pagination.setTotalSize( data.value.model.itemCount );
							me.list.reload( data.value.model.content ,function( item ){
								item.shenheStr = shenheMap[item.informationCheck];
								item.huifangStr = huifangMap[item.returnVisitCheck];
								item.activityYnStr = huoyueMap[item.activityYn];
							});
						}
					}
				})
			}else{
				util.showToast('没有查看权限！');
                return false;
			}
            
    	},

        searchEve: function(){
            this.pagination.setPage( 0 ,false );
            this.getList();
        },
		
        //单个分配
        watchentAssginEve:function(e){
			 var id = $(e.currentTarget).attr('data-id');
			 this.trigger('assgin',[id]);
		},

        //批量分配
        bindEve:function(){
            var me = this;
            var ids = [];

            me.$('tbody .selectEnt').each(function(){
                ids.push( $(this).val() );
            });

            this.trigger('assgin',ids);
        },

		watchentDetailEve:function(e){
			 var id = $(e.currentTarget).attr('data-id');
			 this.trigger('detailEnt',id);
		},


		//电话回访导出
		phoneOutEve:function(){
			
		},
      
        //导出
        exportEve: function(){
            var me = this;
            var data = me.model.all();

            //开通时间开始
            if ( me.$atBegin.val() ) {
                data.appStartTimeStart = new Date( me.$atBegin.val() ).getTime();
            }

            //开通时间结束
            if ( me.$atEnd.val() ) {
                data.appStartTimeEnd = new Date( me.$atEnd.val() ).getTime();
            }

            if( !data.appStartTimeStart || !data.appStartTimeEnd ){
                util.showToast('请选择开始时间和结束时间');
                return false;
            }

            //me.$('#export').attr('href',IBSS.API_PATH + '/enterprise/exportcallbackexcel?' + $.param(data));
            //me.$('#export').trigger('click');

            //window.open( IBSS.API_PATH + '/enterprise/exportcallbackexcel?' + $.param(data) );
            location.href = IBSS.API_PATH + '/enterprise/exportcallbackexcel?' + $.param(data);
        },

        //导入
        exportInEve: function(){
            this.trigger('exportIn');
        }

    });
	

   /**
    *
    * 监察企业分配
    */
    var WatchEntAssgin = MClass( Slider ).include({

        content: $(contentStr).filter('#tabAssgin').html(),
        
        defaultAttr:{
            'width': 660,
            'title': '分配企业给拜访人员'
        },
		tpassginEntList: _.template( $(contentStr).filter('#trAssignEnt').html() ),
        elements: {
            '#enterpriseId': 'enterpriseId',
			'.assign-ent-Info tbody':'assginList',
			'.search-name':'searchName'
        },
		accountList:[],
        events: {
            'click .ent-bind-person': 'entBindPersonEve'
        },

        init: function(){
			var me =this;
            WatchEntAssgin.__super__.init.apply( this,arguments );
			me.$searchName.on('keyup',function(){
				 var wd = $(this).val();
				if(wd == ''){
					$('.assign-ent-Info tbody tr').show();
				}else{
					$('.assign-ent-Info tbody tr').each(function(){
						var feed = me.getList($(this).attr('data-id'));
						if( feed.name.match(wd)){
							$(this).show();
						}else{
							$(this).hide();
						}
					});
				}
				return false;
			});
			
        },
		
        //显示
        show: function( ids ){
            var me = this;

            me.ents = ids;

			util.api({
                'url': '/enterprise/getaccountssupervise',
                'data': '',
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.model.length > 0 ) {
							me.accountList = data.value.model;
							me.$assginList.html(me.tpassginEntList( { content: data.model } ));
						} else {
							me.accountList = [];
							me.$assginList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })
            WatchEntAssgin.__super__.show.apply( this,arguments );
        },
		entBindPersonEve:function(e){
			var me = this;

			var accountId = $( e.currentTarget ).attr( 'data-id' );
			var enterpriseId =  me.ents.join(',');


			if(confirm("确定要将该企业分配给该拜访人员吗？")){
				util.api({
					url: '/enterprise/assignenterprisetosupervise',
					data: {
						'accountId': accountId,
						'enterpriseIds': enterpriseId
					},
					success: function( data ) {
						if ( data.success ) {
							util.showTip('绑定成功');
							me.trigger('success');
                            me.hide();
						}
					}
				}) ;
			}
			return false;	
		
		},
		getList: function(id){
  			var me = this;
			var list = me.accountList;
  			for(var i=0; i<list.length; i++){
				if(list[i].id == id){
					return list[i];
				}
			}
			return null;
  		},

        hide: function(){
            this.model.clear();

			this.ents = null;
            this.$('.state').hide();
            WatchEntAssgin.__super__.hide.apply( this,arguments );
        }
    });

    
	/**
     *
     * 回访详情
     */
    var EmployeeDetail = MClass( Dialog ).include({
        
        content: $(contentStr).filter('#employeeDetailInfo').html(),
        defaultAttr:{
            'title': '回访员工详情',
            'width': 500
        },
        events: {
            'click .save-info': 'saveInfoEve'
		},
        elements:{
            '.save-info': 'stateSaveInfo'
        },
        
        init: function(){

            EmployeeDetail.__super__.init.apply( this,arguments );
            var me = this;
        
        },

        show: function( ea ,phone ){
            var me = this;

            me.attrs['ea'] = ea || '';
            me.attrs['phone'] = phone||'';

			util.api({
                'url': '/enterprise/getemployeecallbackdetail',
                'data': {
					'ea':ea,
					'mobile':phone
				},
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        
                        me.model.load( data.value.model );

						me.$stateSaveInfo.attr('data-id',data.value.model.id)
                        
						if(data.value.model.admin == '1'){
							me.model.set('admin','是');
						}else{
							me.model.set('admin','否');
						}

                        me.model.set('callbackTimeStr', new Date( data.value.model.callbackTime )._format('yyyy-MM-dd hh:mm') );
						me.model.set('appStartTime', new Date( data.value.model.appStartTime )._format('yyyy-MM-dd hh:mm'));

                        /*
						if(data.value.model.status == '2'){
							me.model.set('reason','无');
						}else if(data.value.model.status == '1'){
							me.model.set('reason',data.value.model.reason);
						}else{
							me.model.set('reason','');
						}
                        */
                    }
                }
            })

 
            EmployeeDetail.__super__.show.apply( this,arguments );
        },

        //提交
		saveInfoEve:function(e){
			var me = this;
			var id = $(e.currentTarget).attr('data-id');
			var dataObj = {};
            
            /*
			if(!me.model.get('status')){
				util.showToast('请选择回访结果是否存疑！');
				return false;
			}
			if(me.model.get('status') == '1' && !me.model.get('reason')){
				util.showToast('请填写存疑原因');
				return false;
			}
            */

			dataObj['id'] = id;
			dataObj['callBackDetail'] = me.model.get('callbackDetail');
			dataObj['visitStatus'] = me.model.get('visitStatus');
			dataObj['suspectStatus'] = me.model.get('suspectStatus');
            dataObj['reason'] = me.model.get('sreason');
			dataObj['storagePath'] = me.model.get('storagePath');

			util.api({
                'url': '/enterprise/updateemployeecallbackdetail',
                'data': dataObj,
				'button': {
						'el': me.$stateSaveInfo,
						'text':'提交中......'
					},
                'success': function( data ){
                    if( data.success ){
                       util.showTip('提交成功！');
					   me.trigger('editSuccess');
					   me.hide();  
                    } 
                }
            })
			
		},

        hide: function(){
            var me = this;
            
            me.model.clear();
           
            EmployeeDetail.__super__.hide.apply( this,arguments );
        }

	});


    exports.init = function( param ) {
        var $el = exports.$el;

		//企业详情
		var entDetail = new EntDetail();
		var watchEnt = new WatchEnt( { 'view':$el.find('.m-vendorEnt') } );
        var exportIn = new ExportIn();
		var watchEntAssgin = new WatchEntAssgin();
		var employeeDetail = new EmployeeDetail();

        watchEnt.on('exportIn',function(){
            exportIn.show();
        });
		watchEnt.on('assgin',function(ids){
            watchEntAssgin.show(ids);
        });
		watchEnt.on('detailEnt',function(id){
            entDetail.show(id);
        });
		watchEntAssgin.on('success',function(id){
            watchEnt.getList();
        });
		entDetail.on('employeeDetail',function(ea,phone){
            employeeDetail.show(ea,phone);
        });
		entDetail.on('changeStatus',function(ea,phone){
            watchEnt.getList();
        });
		employeeDetail.on('editSuccess',function(){
            watchEnt.getList();
        });
    }
} );

