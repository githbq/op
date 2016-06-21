define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var uploader = require('common/widget/upload').uploader;
	var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./template.html');
    /**
     *
     * 回访详情
     */
    var EmployeeDetail = require('module/employeedetail/employeedetail'); 
	
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
                me.model.set('returnVisitCheck',1);
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

            data.pageIndex = me.pagination.attr['pageNumber'] + 1; 
            data.pageSize = me.pagination.attr['pageSize'];
            data.activityYn = 1;
            
            me.$tbody.html("<tr><td colspan='12'><p class='info'>努力加载中</p></td></tr>");
			if(IBSS.FUNCTIONS.join(',').indexOf('M008033010') > 0){
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
			}else {
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

            me.$('tbody .selectEnt:checked').each(function(){
                ids.push( $(this).val() );
            });

            if( ids.length <= 0 ){
                util.showToast('请勾选企业后再分配');
                return;
            }
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

