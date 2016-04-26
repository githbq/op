define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var EntInfo = require('module/entinfo/entinfo');
    var contentStr = require('./template.html');

    var sMap = TPL.sMap = {},     //来源
    	pMap = TPL.pMap = {},     //省市
    	uMap = TPL.uMap = {};     //状态
    
    /**
     *
     * 自注册企业
     */
    var RegList = MClass( M.Center ).include({
    	init: function(){
    		RegList.__super__.init.apply( this, arguments );

    		var me = this;
    		me.pagination = new Pagination({
    			'wrapper': me.$view.find('.list-pager'),
    			'pageSize': 20,
    			'pageNumber': 0
    		});
    		me.pagination.render();
    		me.pagination.onChange = function(){
    			me.getList();
    		}

    		me.$startTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});


    		me.getEnums();
            
            me.on('empty:list',function(){

                me.$tbody.html("<tr><td colspan='10'><p class='info'>暂无信息</p></td></tr>");
            });
    	},

    	elements:{
    		'tbody': 'tbody',
    		'.sourceEnum': 'sourceEnum',
    		'.provinceEnum': 'provinceEnum',
    		'.statusEnum': 'statusEnum',
    		'.startTime': 'startTime',
    		'.endTime': 'endTime'
    	},

    	events:{
    		'click .search': 'searchEve',
            'click .detail': 'detailEve',
            'click .distribute': 'disEve'
    	},

    	//获取枚举值
    	getEnums: function(){
    		var me = this;
    		
    		//来源
    		var sList = [ {'name':'全部','value':''} ];
    		var state = {
    			's': false,
    			'p': false,
    			'u': false
    		}
    		function check(){
    			if( state.s && state.p && state.u ){
    				me.getList();
    			}
    		}

    		util.getEnums('ENT_IND_SOURCE',function( data ){
    			data.value.model.forEach(function( item ){
    				sList.push({ 'name':item.text, 'value':item.value });
    				sMap[item.value] = item.text;
    			});
    			util.resetSelect( me.$sourceEnum , sList );
    			state.s = true;
    			check();
    		});

    		//省市
    		var pList = [ {'name':'全部','value':''} ];

    		util.getEnums('PROVINCE',function( data ){
    			data.value.model.forEach(function( item ){
    				pList.push({ 'name':item.text, 'value':item.value });
    				pMap[item.value] = item.text;
    			});
    			util.resetSelect( me.$provinceEnum, pList );
    			state.p = true;
    			check();
    		});

    		//状态
    		var uList = [{'name':'全部','value':''}];

    		util.getEnums('ENT_IND_PSTS',function( data ){
    			data.value.model.forEach(function( item ){
    				uList.push({ 'name':item.text, 'value':item.value });
    				uMap[item.value] = item.text;
    			});
    			util.resetSelect( me.$statusEnum , uList);
    			state.u = true;
    			check();
    		});
    	},

    	searchEve: function(){
    		this.pagination.setPage( 0,false );
    		this.getList();
    	},

        //详情
        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger('detail',id);
        },

        //分配
        disEve: function( e ){
            var account = $( e.currentTarget ).attr('data-account');

            this.trigger( 'distribute', account );
        },

    	getList: function(){
    		var me = this;

    		var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() + " 00:00:00" ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() + " 23:59:59" ).getTime();
            }

    		util.api({
    			'url':'/enterprise/queryindpage',
    			'data':{
    				'pageIndex': me.pagination.attr['pageNumber']+1,
    				'pageSize': me.pagination.attr['pageSize'],
    				'enterpriseName': me.model.get('enterpriseName'),
    				'enterpriseAccount': me.model.get('enterpriseAccount'),
    				'vendorId': me.model.get('vendorId'),
    				'province': me.model.get('province'),
    				'source': me.model.get('source'),
    				'status': me.model.get('status'),
    				'timeBegin': startTime,
    				'timeEnd': endTime
    			},
    			'success': function( data ){
    				console.warn( data );
    				if( data.success ){
    					me.pagination.setTotalSize( data.value.model.itemCount );
    					me.list.reload( data.value.model.content, function( item ){
    						item.sourceStr = sMap[item.source];
    						item.provinceStr = pMap[item.province];
    						item.statusStr = uMap[item.status];
    						item.registerTimeStr = new Date( item.registerTime )._format('yyyy-MM-dd hh:mm');
    					});
    				}
    			}
    		})
    	}
    });
    
    /**
     *
     * 分配给代理商
     */
    var DisAgent = MClass( Slider ).include({
        content: contentStr,
        defaultAttr:{
            'title':'分配至代理商',
            'width':300
        },
        elements:{
            'tbody': 'tbody'
        },
        events: {
            'click .bindagent': 'bindAgentEve'  //
        },
        init: function(){
            DisAgent.__super__.init.apply(this,arguments);

            var me = this;

            //
            me.model.on('change:keyword',function( key,value ){
                if( value == '' ){
                    me.$tbody.find('tr').show();
                }else{  
                    me.$tbody.find('tr').each(function(){
                        var $this = $( this );
                        if( $this.attr('data-name').match(value) ){
                            $this.show();
                        }else{
                            $this.hide();
                        }
                    });
                }
            });
        },
        getList: function(){
            var me = this;

            util.api({
                'url': '/agent/getassignagentlist',
                'success': function( data ){
                    console.warn( 'lsit' );
                    console.warn( data );
                    if( data.success ){
                        me.list.reload( data.value.model );
                    }
                }
            });
        },

        //绑定代理商事件           
        bindAgentEve: function( e ){
            var me = this,
                id = $(e.currentTarget).attr('data-id');
            
            if( confirm("确定要将企业分配给该代理商吗？") ){
                util.api({
                    'url': '/agent/assignenterpriseregistration',
                    'data':{
                        'vendorId': id,
                        'enterpriseAccount': me.attrs.account
                    },
                    'success': function( data ){
                        if( data.success ){
                            util.showTip('绑定成功');
                            me.hide();
                        }
                    }
                });
            }
        },
        
        show: function( account ){
            var me = this;
            me.getList();
            me.attrs.account = account;

            DisAgent.__super__.show.apply(this,arguments);
        },
        
        hide: function(){
            this.model.clear();
            DisAgent.__super__.hide.apply(this,arguments);
        }
    });

    exports.init = function() {
        var $el = exports.$el;

        
        var regList = new RegList( {'view':$el.find('.m-regent')} );
        
        var entInfo = new EntInfo();
        var disAgent = new DisAgent();

        regList.on('detail',function( id ){
            entInfo.show( id ,true);
        });
        
        regList.on('distribute',function( account ){
            disAgent.show( account );
        })
    }
} );