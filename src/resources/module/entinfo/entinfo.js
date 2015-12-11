/**
 * 自注册企业详情
 * 渠道
 * 支持
 * 代理商用户查看自注册企业详情
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var contentStr = require('./entinfo.html');

    var EntInfo = MClass( Slider ).include({
        
        content: contentStr,
        defaultAttr: {
            'title':'企业详情',
            'width': 500
        },
        init: function(){   
            var me = this;

            EntInfo.__super__.init.apply( this, arguments );
        },

        //获取企业详情
        show: function( id , bool){
            var me = this;

            if( bool ){
                me.$('.state-vendor').show();
            }

            util.api({
                'url': '/enterprise/getind',
                'data': {
                    'id': id
                },
                'success': function( data ){
                    console.warn( data );
                    var sMap = IBSS.tpl.sMap || {},     //来源
                        pMap = IBSS.tpl.pMap || {},     //省市
                        uMap = IBSS.tpl.uMap || {};     //状态


                    me.model.load( data.value.model );
                    me.model.set('validateCodeExpirationStr', new Date( me.model.get('validateCodeExpiration') )._format('yyyy-MM-dd hh:mm') );
                    me.model.set('activeTimeStr', new Date( me.model.get('activeTime') )._format('yyyy-MM-dd hh:mm') );
                    me.model.set('registerTimeStr', new Date( me.model.get('registerTime') )._format('yyyy-MM-dd hh:mm') );
                    me.model.set('sourceStr', sMap[ me.model.get('source') ]);
                    me.model.set('statusStr', uMap[ me.model.get('status') ]);
                    me.model.set('provinceStr', pMap[ me.model.get('province') ]);
                }
            })


            EntInfo.__super__.show.apply( this, arguments );
        },

        hide: function(){
            var me = this;
            me.model.clear();
            me.$('.state-vendor').hide();
            EntInfo.__super__.hide.apply( this, arguments );
        }
    })

	module.exports = EntInfo;
});
