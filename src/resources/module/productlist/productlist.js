/**
 *
 * 产品列表
 * type  操作 能添加企业 不能添加企业
 */

define(function( require, exports , module ){
	
    var tpl = $( require( './template.html' ) ),
        viewStr = require('./productlist.html');

    var ProductList = MClass( M.Center ).include( {
        tplPartner: _.template( tpl.filter( '#trPdtLst' ).html() ),
        view: viewStr,

        elements: {
            'tbody': 'tbody'
        },

        events: {
            'click .addEnt': 'addEntEve',
            'click .entList': 'entEve'
        },

        init: function( attrs ) {
            ProductList.__super__.init.apply( this, arguments );
            var me = this;
            
            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            me.getList();
        },
        
        //添加企业
        addEntEve: function( e ){
            var me = this,
                id = $( e.currentTarget ).attr('data-id'),
                info = me.collection.find( 'id',id );

            me.trigger( 'addEnt', info );
        },

        //查看相关企业
        entEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger('ent',id);
        },
        
        search: function() {

            this.getList();
        },
        
        getList: function() {
            var me = this;
            util.api({
                url: '/product/querypage',
                data: {
                    'isPage': 1
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="9"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    console.warn( data );

                    if ( data.success ) {
                        me.collection.reload( data.value.model.content, function( item ) {
                            if(item.free){
                                item.freeStr = "是";
                            }else{
                                item.freeStr = "否";
                            }
                            //item.storage = (item.storage / 1024).toFixed(0);
                        } );
                    }
                }
            });
        },
        renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var dom = me.tplPartner( {'content':collection} );
            //console.log( me.$tbody );
            //console.log( me.$view );
            if ( collection.length > 0 ) {

                me.$tbody.html( dom );
                //显示添加企业选项
                if( me.attrs['showAdd'] == true){
                    me.$('.addEnt').show();
                }
                
            } else {
                me.$tbody.html( '<tr><td colspan="9"><p class="info">暂无数据</p></td></tr>' );
            }
        },
        render: function(){
            this.attrs['wrapper'].html( this.$view );
        }

    } );
    
    module.exports = ProductList;

})
