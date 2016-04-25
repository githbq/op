define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require( 'common/widget/pagination/pagination' );
    var Slider = require( 'common/widget/slider/slider' );


    var tpl = $( require( './template.html' ) );

    
    var AccountDetail = MClass( Slider ).include({

        defaultAttr:{
            'title': '企业详情',
            'width': 610
        },

        content: tpl.filter('#accountDetail').html(),
        
        events: {
            'click .accordian h4': 'showAccordian'
        },  

        //
        showAccordian: function( e ){
            var target = e.currentTarget,
                $parent = $( target ).parent();
                $content = $( target ).next( '.content' );

            //进行显示隐藏切换
            if ( $parent.hasClass( 'collapse' ) ) {
                $parent.removeClass( 'collapse' );
                $content.slideDown( 300 );
            } else {
                $parent.addClass( 'collapse' );
                $content.slideUp( 300 );
                return;
            }

            //var index = $parent.index( '.accordian' );
            var target = $parent.attr('data-target');
            switch( target ){
                case 'product':
                    this.showProductInfo();
                    break;
                case 'operations':
                    this.showOperations();
                    break;
                default:
                    break;
            }
        },

        showProductInfo: function(){
            var me = this;

            console.log('product');
            util.api({
                'url':'/odr/queryProductVOList',
                'data': {
                    'ea': me.model.get('account')
                },
                'beforeSend': function(){
                    me.$('#tbOperation').find('.container').html( '<p class="info">加载中...</p>' );
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ) {
                        if ( data.value.model.length > 0 ) {

                            var strDom = "";
                            _.map( data.value.model, function( obj ){
                                var startTime ="——",
                                    endTime = "——";
                                if( obj['startDate'] ){
                                    startTime = new Date( obj['startDate'] )._format('yyyy/MM/dd');
                                }
                                if( obj['endDate'] ){
                                    endTime = new Date( obj['endDate'] )._format('yyyy/MM/dd');
                                }

                                var enablestatus = "";
                                if( obj["isEnable"] == 1 ){
                                    enablestatus = "已开启";
                                }else if( obj["isEnable"] == 2 ){
                                    enablestatus = "已关闭";
                                }

                                switch( obj["code"] )
                                {
                                    case "FX_Terminal":
                                        strDom += " <p> <span>"+obj['appName']+"(个)："+obj['quota']+"</span>" +
                                        " <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span></p>";
                                        break;
                                    case "CRM":
                                        strDom += " <p> <span>"+obj['appName']+"(个)："+obj['quota']+"</span>" +
                                        " <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span>" + enablestatus + "   <input class='off' type='checkbox' name='product' value='"+obj["appId"]+"'> </p>";
                                        break;
                                    case "Service_Fee":
                                        strDom += " <p> <span>"+obj['appName']+"(人)："+obj['quota']+"</span>" +
                                        " <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span></p>";
                                        break;
                                    case "HR_Helper":
                                        strDom += " <p> <span>"+obj['appName']+"：</span> <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span> </p>";
                                        break;
                                    case "Business_Card":
                                        strDom += " <p> <span>"+obj['appName']+":</span> <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span> </p>";
                                        break;
                                    case "Custom_Helper":
                                        strDom += " <p> <span>"+obj['appName']+":</span> <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span> </p>";
                                        break;
                                    default:
                                        strDom += " <p> <span>"+obj['appName']+":</span> <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span>"+ enablestatus + "   <input class='off' type='checkbox' name='product' value='"+obj["appId"]+"'> </p>";
                                }
                            });

                            me.$('#tbProduct').find('.container').html( strDom );
                        } else {
                            me.$('#tbProduct').find('.container').html( '<p class="info">暂无数据</p>' );
                        }
                    }
                }
            })
        },


        showOperations: function(){
            var me = this;
			
			me.getEnterprise(function(){
				        ///me._usestatus = 0;     //状态值
				me.attrs.freeIncreaseContractRequired = '';
				
				if( me.model.get('marketingAccountAmount') == 0 ){

					me.$('.crmvisible').hide();
				} else {

					me.$('.crmvisible').show();
				}
				/***
				 *
				 * 签约到期时间( 付费版 )   如果是 9999-12-31   则显示永久
				 * 营销版到期时间( 免费版 ) 如果是 小于当前日期 则不显示    
				 * 
				 * 设置的时候
				 * 服务支持人员         可以设置 签约到期时间 也可以设置 营销版到期时间
				 * 代理商内部管理员   只可以设置 签约到期时间
				 */

				/*
				* 代理商用户
				* 根据是否是管理员 显示相关信息
				*/
				/*
				function checkIsAdmin(){

					if( me.attrs.isAgent == true ){
						
						for( var i = 0; i < IBSS.FUNCTIONS.length; i++ ){
							if( 'F009001' == IBSS.FUNCTIONS[i] ){
								return true;
							}
						}
						return false;
					}else{

						return false;
					}
				};

				if( checkIsAdmin() ){
					me.$('#tbOperation .isadmin').removeAttr('disabled');
					//me.$('#tbOperation input').removeAttr('disabled');
				} else {
					me.$('#tbOperation .isadmin').attr('disabled','disabled');
				}
				*/

				/**
				 *
				 * 清空数据
				 */
				///me.$('#tbOperation input').val('');

				me.model.load( me.operations.initialInfo );
				/**
				 *
				 * 加载列表数据
				 */
				if( me.operations.pagination ){

					me.operations.pagination.setPage(0,true);

				} else {
					me.operations.pagination = new Pagination({
						wrapper: me.$view.find('#tbOperation .pager'),
						pageSize: 10,
						pageNumber: 0
					});
					me.operations.pagination.render();
					me.operations.pagination.onChange = function() {
						me.loadOperations();
					};
					me.loadOperations();
				}
			});
           
        },
		//获取企业详情
		getEnterprise: function( id ,callback ){
			var me = this;
			

			util.api({
				'url':'/enterprise/getenterprise',
				'data':{
					'enterpriseId': me.model.get('account')
				},
				'success': function( data ){
					console.warn( 'enterpriseinfo' );
					console.warn( data );
					if( data.success ){
						me.attrs.runStatus = data.value.model.runStatus;
						var model = data.value.model;
						///me.product.isInitialized = false;
						me.model.load( model );
						
						me.$sdXKDC.val( model.accountTotalAmount );
						me.$sdXKDUC.val( model.accountUsedAmount + '/' + model.accountAvailableAmount || '' );
						me.$yingxiaoSum.val( model.marketingAccountAmount );
						me.$yingxiaoUsed.val( model.marketingAccountUsedAmount + '/' + model.marketingAccountAvailableAmount );
						me.$sdSC.val( model.storageTotalSpace );
						me.$sdSUC.val( model.storageUsedSpace );
						
						
						

						//初始化 使用情况的缓存
						me.operations.initialInfo = {
							'accountTotalAmount': model.accountTotalAmount,
							'groupNumLimit': model.groupNumLimit,
							'videoNumLimit': model.videoNumLimit,
							'crmVisibleRange': model.crmVisibleRange,
							'editCustomerName': model.editCustomerName,
							'setPersonalGoal': model.setPersonalGoal,
							'discountAutoCalculated': model.discountAutoCalculated,
							'webSanCodeAuth': model.webSanCodeAuth
						};

				
						//调用回调
						callback && callback();
						
					}
				}
			})
		},

        /*
         *
         * 加载使用情况列表
         */
        loadOperations: function(){
            var me = this;
            var data = {
                pageIndex: me.operations.pagination.attr['pageNumber'],
                pageSize: me.operations.pagination.attr['pageSize'],
                enterpriseId: me.model.attrs.enterpriseId
            };

            util.api({
                url: '/enterprise/querypageenterpriseaccountincrement',
                data: data,
                success: function( data ) {

                    if ( data.success ) {
                        me.operations.pagination.setTotalSize( data.model.page.itemCount );
                        data.model.page && $( data.model.page.content ).each( function ( i, item ) {
                            item.ncreaseTime = new Date( item.ncreased )._format( 'yyyy-MM-dd hh:mm' );
                        } );
                        me.attrs.freeIncreaseContractRequired = data.model.freeIncreaseContractRequired;

                        if(me.attrs.isPay == 1 && me.attrs.freeIncreaseContractRequired){

                            me.$('.check-hide').show();
                        }else{
                            me.$('.check-hide').hide();
                        }
                        if ( data.model.page && data.model.page.content && data.model.page.content.length > 0 ) {
                            me.$tbOperation.html( me.tplOperation( { content: data.model.page.content } ) );
                        } else {
                            me.$tbOperation.html( '<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>' );
                        }
                        me.operations.isInitialized = true;
                    }
                }
            })

        },

        init: function(){
            AccountDetail.__super__.init.apply( this, arguments );
            var me = this;
            me.on('empty:trylist',function(){
                me.$('.trybox').html('<b>无</b>');
            })

            me.operations = {
                isInitialized: false,
                initialInfo: {},
                pagination: null
            };
        },

        show: function( id , account , runstatus , contactphone , contactname , paystatus ){
            AccountDetail.__super__.show.apply( this, arguments );
            var me = this;
            
            me.model.set('account',account);
            me.model.set('runstatus',runstatus);
            me.model.set('contactphone',contactphone);
            me.model.set('contactname',contactname);
			me.model.set('paystatus',paystatus);

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
			me.$( '.accordian' ).addClass( 'collapse' );
			me.$( '.accordian .content' ).removeAttr( 'style' );

			me.$('.sectiona input').val('');
			me.$('.sectiona select').val('');
			me.$('.sectiona textarea').val('');

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


        accountDetailEve: function( e ){
            var me = this;

            var id = $( e.currentTarget ).attr('data-id'),
                account = $( e.currentTarget ).attr('data-account'),
                runstatus = $( e.currentTarget ).attr('data-runstatus'),
                contactphone = $( e.currentTarget ).attr('data-contactphone'),
                contactname = $( e.currentTarget ).attr('data-contactname'),
				paystatus = $( e.currentTarget ).attr('data-paystatus');

            me.trigger('accountdetail', id , account,runstatus,contactphone,contactname,paystatus);
        },
        search: function() {
            this.pagination.attr['pageNumber'] = 0;
            this.load();
        },
        load: function() {
            var me = this;
			if(!me.$mobile.val()){
				util.showToast('请输入查询条件！');
                return false;
			}
            util.api({
                url: '/employee/getpage',
                data: {
                    ea:'',
                    ename: '',
                    name: '',
                    mobile: me.$mobile.val(),
                    pageIndex: me.pagination.attr['pageNumber'] + 1,
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
                            IBSS.tplEvent.setPermissions( me.$tbody );
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
 
        var accountDetail = new AccountDetail();

        employeeDataTable.on('accountdetail',function( id , account,runstatus,contactphone,contactname,paystatus ){
            accountDetail.show( id , account,runstatus,contactphone,contactname ,paystatus);
        });
    }
} );