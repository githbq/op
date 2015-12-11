define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');

	var Slider = require('common/widget/slider/slider');
	
	var FilingAssgin = require('module/filingassgin/filingassgin');
    var uploader = require('common/widget/upload').uploader;

    var tem = $( require('./template.html') );


    var pMap = {},           //产品状态
        industryMap = {},    //行业
        stateMap = {};;    //企业状态

    /**
     * 企业列表
     */
    var EntList = MClass( M.Center ).include({


    	init: function(){
    		EntList.__super__.init.apply( this,arguments );
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

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            me.getEnums();

            if( me.attrs['productId'] && me.attrs['productId'].length > 0 ){
                
                //获取产品列表
                util.api({
                    'url': '/product/querypage',
                    'data':{
                        'isPage': 1
                    },
                    'success': function( data ){
                        console.warn( data );
                        if( data.success ){
                            var pStr = "";
                            data.value.model.content.forEach(function(item){
                                if( item.id == me.attrs['productId'] ){
                                    pStr = '(' + item.name + '(' + item.deviceMaxCount + '终端)：' + '终端' + item.deviceMaxCount + '个/一次性赠送短信' + item.textMessageCount + '条/' + item.storage + ')';
                                }
                            });
                            me.$headerInfo.text( pStr );     
                        }
                    }
                });
            }
    	},

        elements:{
            '.productStatus': 'productStatus',
            '.industryStatus': 'industryStatus',
			'.statusStatus': 'statusStatus',
            '.activityStatus': 'activityStatus',
            '.header-info': 'headerInfo',
            'tbody': 'tbody'
        },

        events:{
            'click .search': 'searchEve',
            'click .detail': 'detailEve',
            'click .assgin': 'assginEve',
            'click .renew': 'renewEve'
        },

        trTpl: _.template( tem.filter('#trTpl').html() ),
        
        //获取枚举值
        getEnums: function(){
            var me = this;

            var state = {
                'p': false,
                'i': false,
                'a': false
            };

            function checkReady(){
                if( state.i ){
                    me.getList();
                }
            }

            /*var plist = [{'name':'全部','value':''}];
            //获取产品状态
            util.getEnums('ENT_LST_PSTS',function( data ){

                data.value.model.forEach(function( item ){
                    plist.push( {'name':item.text,'value':item.value} );
                    pMap[item.value] = item.text;
                });
                util.resetSelect( me.$productStatus , plist );
                state.p = true;
                checkReady();
            });*/



            var ilist = [{'name':'全部','value':''}];
            //行业
            util.getEnums('INDUSTRY',function( data ){

                data.value.model.forEach(function( item ){
                    ilist.push( {'name':item.text,'value':item.value} );
                    industryMap[item.value] = item.text;
                });
                util.resetSelect( me.$industryStatus, ilist );
                state.i = true;
                checkReady();
            });

			var slist = [{'name':'全部','value':''}];
            //状态
            util.getEnums('ADDED_VALUE_STATUS',function( data ){

                data.value.model.forEach(function( item ){
                    slist.push( {'name':item.text,'value':item.value} );
                    stateMap[item.value] = item.text;
                });
                util.resetSelect( me.$statusStatus, slist );
                state.s = true;
                checkReady();
            });

            /*var alist = [{'name':'全部','value':''}];
            //活跃度
            util.getEnums('ENT_LST_ACTIVITY',function( data ){

                data.value.model.forEach(function( item ){
                    alist.push( {'name':item.text,'value':item.value} );
                    activityMap[item.value] = item.text;
                });
                util.resetSelect( me.$activityStatus, alist );
                state.a = true;
                checkReady();
            })*/

        },

        searchEve: function(){
            this.pagination.setPage( 0 ,false );
            this.getList();
        },

        //查看企业详情
        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger( 'detail', id );
        },

        //查看企业跟踪记录
        assginEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger( 'assgin', id );
        },

        //增购续费
        renewEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            var obj = this.collection.find('id',id);

            this.trigger( 'renew', obj );
        },

        // 获取企业列表数据
    	getList: function(){
            var me = this;

            util.api({
                'url': '/enterprise/queryeapageforaddedvalue',
                'data': {
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize'],
                    //'productId': me.attrs['productId'],          //产品ID
                    'ea': me.model.get('ea'),                    //企业账号
                    'ename': me.model.get('ename'),              //企业名称
                    //'pstatus': me.model.get('pstatus'),          //产品状态
                    'contact': me.model.get('contact'),          //联系人
                    'mobile': me.model.get('mobile'),            //联系电话
                    'email': me.model.get('email'),              //联系邮箱
                    'industry': me.model.get('industry')        //行业
                    //'activity': me.model.get('activity'),        //活跃度
                    //'fstatus': me.model.get('fstatus')           //付费状态
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){

                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content ,function( item ){
                            item.runStatusStr = pMap[item.runStatus]; 
                            item.industryStr =  industryMap[item.industry];
                            item.filingStatusStr =  stateMap[item.filingStatus];
                        });
                    }
                }
            })
    	},

        //渲染企业列表数据
    	renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var htmlStr = '';

            if( collection.length > 0){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>"
            }
            me.$tbody.html( htmlStr );
            IBSS.tplEvent.setPermissions( me.$tbody );
    	}
    });
	
	/**
     * 增值客户查看
     */
	 var industryMap = {},    //行业MAP
		productMap = {},     //产品MAP
		sourceMap = {},      //来源MAP
		provinceMap = {},    //省市MAP
		groupMap = {};       //团队类型MAP
    var CustomerLook = MClass( Slider ).include({

        content:  tem.filter('#customerLookTem').html(),
        defaultAttr:{
            'width': 750,
            'title': '增值客户详情'
        },
		events:{
			'click .action-add': 'addEve',
			'click .action-cancel': 'cancelEve',
			'click .save-fn': 'saveEve'
		},

		elements: {
			'.enterprise-content h3': 'title',
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.e-province': 'province',
			'.e-group': 'group',
			'.e-knowsource': 'knowsource',
			'.e-motive': 'motive',
			'.contract': 'contract',
			'.content-product': 'product',
			'.companyscale':'companyscale',
			'.saleteamscale':'saleteamscale',
			'.endTime': 'endTime',
			'.yearlimit': 'yearlimit',               //合同年限
			'.contractprice': 'contractprice',       //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
			'.action-add': 'actionAdd',
			'.firm-status':'firmState',
			'.disabled-status':'noStatus',
			'.hide-state':'hideState',
			'.save-fn':'btnSave',
			'.state-info':  'stateInfo',
			'.state-visite': 'stateVisite'
		},
		

        init: function(){
            CustomerLook.__super__.init.apply( this,arguments );
        },
  
        //显示备案企业详情
        show: function( id ){
           var me = this;
			me.getEnums( id );
		
            CustomerLook.__super__.show.apply( this,arguments );
        },
		//获取枚举值
		getEnums: function( id){
			var me = this;
			
			var state = {
				'i': false,
				'e': false,
				'p': false,
				'g': false,
				'k': false,
				'r': false,
				'c': false,
				's': false,
				'pr': false
			};

			//检查是否获取完毕 去掉&& state.pr
			function check(){
				if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.s  ){
					me.getEnterprise( id );
				}
			}

			//获取枚举值 并赋值给select
			function generate( Ename , Map , $select , str ){
				var list = [{'name':'请选择','value':''}];

				util.getEnums( Ename , function( data ){
					data.value.model.forEach( function( item ){
						Map[item.value] = item;
						list.push({'name':item.text,'value':item.value});
					});
					util.resetSelect($select ,list);
					if( str ){
						state[ str ] = true;
					}

					check();
				})
			}

			//获取产品列表
			/*util.api({
				'url': '/product/querypage',
				'data': {
					'isPage':1
				},
				'success': function( data ){
					console.warn( data );
					var list = [{'name':'请选择','value':''}];
					if( data.success ){
						data.value.model.content.forEach( function( item ){
							list.push( {'name':item.name,'value':item.id} );
							productMap[item.id] = item;
						});
						util.resetSelect( me.$product,list );
						state['pr'] = true;

						check();
					}
				}
			});*/

			/**
			 *
			 * 产品变更 相关数量也变更
			 */
			/*me.$product.on('change',function(){

				var id = me.$product.val();
				if( id ){

					var info = productMap[id];
					console.log( info );
					me.model.set('accountTotalAmount', info.deviceMaxCount );
					me.model.set('smsTotalAmount', info.textMessageCount );
					me.model.set('storageTotalSpace', info.storage );
				}
			});*/

			/**
			 *
			 * 动态计算折扣
			 */
			//年限改变
			/*me.$yearlimit.on('change',function(){
				me.getdiscount();
			});

			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.getdiscount();
			});

			//终端数量改变
			me.$deviceamount.on('focusout',function(){
				me.getdiscount();
			});*/


			//获取行业列表
			generate('INDUSTRY', industryMap , me.$industry , 'i');

			//获取来源
			generate('ENT_LST_SOURCE', sourceMap , me.$source , 'e');

			//获取省市
			generate('PROVINCE', provinceMap , me.$province , 'p');

			//获取团队类型
			generate('GROUP_TYPE', groupMap , me.$group , 'g');

			//获取了解渠道
			generate('KNOW_SOURCE', {} , me.$knowsource , 'k');

			//获取注册动机
			generate('REGISTER_MOTIVE', {} , me.$motive , 'r');

			//获取公司规模
			generate('CAMPANY_SCALE', {} , me.$companyscale , 'c');

			//获取销售团队规模
			generate('SALE_TEAM_SCALE', {} , me.$saleteamscale ,'s');
			
			//获取企业状态信息
			//generate('FILING_ADDEDVALUE_STATUS ', {} , me.$firmState ,'pr');

			
		},
		//获取企业详情
		getEnterprise: function( id ){
			var me = this;
			me.$stateInfo.attr({'data-id':id});
			util.api({
				'url':'/enterprise/getenterprise',
				'data':{
					'enterpriseId': id
				},
				'success': function( data ){
					if( data.success ){
						var model = data.value.model;
						//me.getData(data);
						me.model.load( model );
						me.model.set('enterpriseAccount', model.enterpriseAccount);
						me.model.set('isSaleTeam',  (model.isSaleTeam ? '1':'0'));
						me.model.set('isFirstmeetingSign',  (model.isFirstmettingSign ? '1':'0')); 
						me.model.set('isWillPin',  (model.isWillPin ? '1':'0')); 
						me.model.set('isStrangerVisits',  (model.isStrangerVisits ? '1':'0'));
						me.model.set('city', model.city); 
						me.model.set('yearLimit', model.validYearLimit); 
						me.model.set('isFastSign',  (model.isFastSign? '1':'0'));
						me.model.set('dealDays', (model.dealDays? model.dealDays:'0')); 
						me.model.set('isAutoClave',  (model.isAutoclave ? '1':'0'));
						me.model.set('autoclaveDays', (model.autoclaveDays? model.autoclaveDays:'0'));
						me.model.set('isReferral',  (model.isReferral ? '1':'0'));
						me.model.set('contactim', model.contactIM);
						me.model.set('accountTotalAmount',(model.accountTotalAmount ? model.accountTotalAmount:'0') );
					}
				}
			})
		},
			//根据企业id取得企业状态
        /*getData: function(data){
            var me = this;
			var enterpriseId = data.value.model.enterpriseId;
			util.api({
				'url':'/enterprisefiling/getfilingbyenterpriseid',
				'data':{
					'enterpriseId': enterpriseId
				},
				'success': function( data ){
					if( data.success ){
						console.log(data)
						//me.checkState(data);
					}
				}
			});
        }, 
		//根据编辑企业状态显示不同的编辑内容
        checkState: function(data){
            var me = this;
			var clientNum = data.value.model.accountAmount||'',
			kpPhone = data.value.model.representative_phone||'',
			companyNum = data.value.model.employeeNumber||'';
			var visiteTime = new Date( data.value.model.visitTime )._format('yyyy-MM-dd hh:mm')||'';
			var state = data.value.model.status+'';
			me.$firmState.css({'display':'block'});
			me.$noStatus.css({'display':'none'});
            switch( state ){
				case '17':
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone', kpPhone);
					me.model.set('visiteTime', visiteTime);
					me.model.set('companyNum', companyNum);
					break;
				case '18':case '19':case '20':case '21':
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone', kpPhone);
					me.model.set('visiteTime', visiteTime);
					me.model.set('companyNum', companyNum);
					break;
				case '22':
					me.model.set('clientNum',clientNum);
					me.model.set('kpPhone', kpPhone);
					me.model.set('visiteTime', visiteTime);
					me.model.set('companyNum', companyNum);
					break;
				default:
					//me.model.set('clientNum', '0');
					me.$hideState.css({'display':'none'});
					me.$firmState.css({'display':'none'});
					me.$noStatus.css({'display':'block'});
					me.$btnSave.css({'display':'none'});
            }		
        },
		saveEve:function(){
			var me = this;
			var objData ={};
			objData['enterpriseFilingId'] = me.$stateInfo.attr('data-id') ||'';

			if(!me.model.get('firmStatus')){
				util.showToast('请选择状态');
				return false;
			}
			objData['status'] = me.model.get('firmStatus')|| '';
			objData['accountAmount'] = me.model.get('clientNum');
			objData['representativePhone'] = me.model.get('kpPhone'); //(me.$phoneTaggle.css('display')=='block') ? me.$statePhone.val() :'';
			objData['employeeNumber'] = me.model.get('companyNum')||'';
			if(!me.$stateVisite.val()){
				util.showToast('拜访时间不能为空');
				return false;
			}
			objData['visitTime'] = new Date( me.$stateVisite.val() ).getTime() ; 
			console.log(objData)
			me.$btnSave.attr('disabled','disabled');
            me.$btnSave.addClass('disabled');
            me.$btnSave.text('保存中');
			util.api({
				'url':'/enterprisefiling/updatefiling',
				'data':objData,
				'success': function( data ){
					if( data.success ){
						util.showTip( '保存成功' );
						me.trigger('savesuccess');
						me.show(me.$stateInfo.attr('data-id'),{'state':'detail'});
						
					}
				},
				'complete': function(){
					me.$btnSave.removeAttr('disabled');
					me.$btnSave.removeClass('disabled');
					me.$btnSave.text('保存');
				}
				
			});
		},*/
			
        hide: function(){
            this.model.clear();
			
            CustomerLook.__super__.hide.apply( this,arguments );
        }
    });
	
    exports.init = function( param ) {
        var $el = exports.$el;

		var entList = new EntList( { 'view':$el.find('.m-vendorEnt'), 'productId': param && param[0] } );
        var customerLook = new CustomerLook();
        //var entTrace = new EntTrace();
        //var renewApply = new RenewApply();
		//var filingInfo = new FilingInfo();
		var filingassgin = new FilingAssgin();

        entList.on('detail', function( id ){
            customerLook.show( id );
        });

        /*entList.on('renew', function( obj ){
            renewApply.show( obj );
        });*/
		entList.on('assgin',function(id){
    
            filingassgin.showCustomervalue(id,{'state':'customervalue'});
        });
		filingassgin.on('success',function(id){
    
            entList.getList();
        });
		
		/*entList.on('assgin',function(id){
    
            filingInfo.show(id);
        });
		filingInfo.on('success',function(id){
    
            entList.getList();
        });*/
    }
} );

