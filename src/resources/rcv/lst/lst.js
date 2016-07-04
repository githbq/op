define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    
    var Pagination = require( 'common/widget/pagination/pagination' );
    var Slider = require( 'common/widget/slider/slider' );
    var Dialog = require('common/widget/dialog/dialog');
    var Detail = require('../../order/detailapproval/detailapproval');
    var uploader = require('common/widget/upload').uploader;
    var CustomTree=require('module/customtree/customtree').getDialog();
    var tpl = $( require( './template.html' ) );
    // 新增/编辑
    var CreateReceipt = MClass( Slider ).include({
        content: tpl.filter('#crRcv').html(),
        defaultAttr: {
            width: 600
        },
        events:{
            'click #c-submit': 'submit',
            'click #c-cancel': 'hide',
            'click #c-department':'selectDeptEve',
            'keydown #c-date': 'keydown'
        },
        elements:{
            '#c-rcvNum': 'rcvNum',
            '#c-date': 'date',
            '#c-department': 'department',
            '#departmentText': 'departmentText',
            '.info': 'info',
            '[data-model]':'data'
        },
        init: function(){
            CreateReceipt.__super__.init.apply( this, arguments );
            var me = this;
            me.$date.datetimepicker( {
                format: 'Y/m/d',
                timepicker: false
            });
               
        },
        show: function( id ){
            CreateReceipt.__super__.show.apply( this,arguments );
            var me = this;
            me.id = id;
            if(id){
                util.api({
                    url: '~/op/api/a/odr/receivedpay/detail',
                    data: {
                        id: id
                    },
                    success: function(res){
                        if(res.success){
                            res.value.model.receivedPayDate = new Date(res.value.model.receivedPayDate)._format( "yyyy/MM/dd" );

                            me.$data.each(function(i, item){
                                var data = $(item).attr('data-model');
                                $(item).val(res.value.model[data]);
                            });
                        }
                    }
                });
            }
            
        },
        hide: function(){
            CreateReceipt.__super__.hide.apply( this,arguments );
            this.$data.val('');
            $(".info option[disabled]").each(function(i,item){
                this.selected = true;
            });
            this.id='';
        },
        keydown: function(e) {//只能删除不能输入
            if(e.keyCode == 46||e.keyCode == 8){
                $(e.currentTarget).attr('readOnly',false);
            }else{
                $(e.currentTarget).attr('readOnly','readOnly');
            }
        },

        selectDeptEve:function(){
            var me = this;
            me.deptTree= new CustomTree({ 
                'title': '新建到款信息-选择部门',
                searchOptions:{show:true,title:'部门名称'},
                ztreeOptions:{
                    expandAll:true,
                    check:{chkStyle: "radio",radioType: "all"},
                    checkStyle:"radio"
                },
                ajaxData:{url:'~/op/api/a/odr/receivedpay/getAllDepartment'}
            });
            me.deptTree.on('enter', function (  ) {
                me.deptObj = me.deptTree.getValue() ? me.deptTree.getValue()[0]: null;
                me.deptObjId = [me.deptObj.id];
                me.postObjId = [];
                me.postObj = null;
                me.deptObj ? me.$departmentText.val(me.deptObj.name ):me.$departmentText.val('');
                me.$department.val(me.deptObjId);
            });
            
            me.deptTree.show( [ me.$department.val() ], {});
        },
        
        submit: function() {//提交编辑
            var me = this;
            var bool = false;
            var append = '';
            var data = {};
            me.$info.each(function(i,item){
                if(!$(item).val()){
                    util.showToast('必填项不能为空');
                    $(this).focus();
                    bool = true;
                    return false;
                }
                data[$(item).attr('data-model')] = $(item).val();
            });
            data.receivedPayDate = new Date(data.receivedPayDate).getTime();
            if(me.id){
                append = 'update';
                data.id = me.id;
            }else{
                append = 'add';
            }
            if(bool){
                return;
            }
            util.api({
                url: '~/op/api/a/odr/receivedpay/' + append,
                data: JSON.stringify(data) ,
                contentType: 'application/json',
                success: function( res ){
                    if( res.success ){
                        util.showTip('提交成功');
                        me.trigger('refresh');
                        me.hide();
                    }
                }
            });
        },
        
    });
    // 选择订单
    var SelectOrder = MClass( Dialog ).include({
        content: tpl.filter('#selectOrder').html(),
        defaultAttr: {
            width: 1000
        },
        events:{
            'click #s-query': 'query',
            'click #s-submit': 'submit',
            'click #s-cancel': 'hide',
            'click .check': 'check'
        },
        elements:{
            '#orderId': 'orderId',
            '#contractNo': 'contractNo',
            '#en': 'en',
            '#ea': 'ea',
            '#account': 'account',
            'input': 'input',
            'tbody': 'tbody'
        },
        init: function() {
            SelectOrder.__super__.init.apply( this, arguments );
            var me = this;
            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: 10,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.load();
            };
        },
        show: function( id ) {
            SelectOrder.__super__.show.apply( this,arguments );
            this.id = id;
            this.load();
        },
        hide: function() {
            SelectOrder.__super__.hide.apply( this,arguments );
            var me = this;
            me.$tbody.html( '' );
            me.$input.val('');
        },
        query: function() {//选择订单栏查询按钮
            var me = this;
            this.pagination.setPage( 0, false );
            me.load();           
        },
   
        load: function() {//加载订单列表
            var me = this;
            util.api({
                url: '~/op/api/a/odr/querypage',
                data: {
                    account: me.$account.val(),
                    orderId: me.$orderId.val(),
                    en: me.$en.val(),
                    ea: me.$ea.val(),
                    contractNo: me.$contractNo.val(),
                    approvalNode: 3,
                    pageIndex: me.pagination.attr['pageNumber']+1,
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="2"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    var tr = '';
                    if ( data.success && data.model.content) {
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        var items = data.model.content;
                        $( items ).each( function( i, item ) {
                            item.formatTime = new Date( item.order.createTime )._format( "yyyy-MM-dd" );
                            tr += '<tr>'
                                +'<td><input type="radio" name="select" value="'+item.order.id+'"></td>'
                                +'<td>'+item.order.id+'</td>'
                                +'<td>'+item.order.contractNo+'</td>'
                                +'<td>'+item.order.enterpriseName+'</td>'
                                +'<td>'+item.order.enterpriseAccount+'</td>'
                                +'<td>'+item.account.name+'</td>'
                                +'<td>'+item.formatTime+'</td>'
                                +'<td><a class="check" data-id="'+item.order.id+'">查看</a></td>'
                                +'</tr>'; 
                        });
                    }else{
                        tr = '<tr><td colspan="2"><p class="info">暂无数据</p></td></tr>';
                    }
                    me.$tbody.html( tr );
                },
                error: function(){
                    var tr = '<tr><td colspan="2"><p class="info">数据加载失败</p></td></tr>';
                    me.$tbody.html( tr );
                }
            })
        },
        check: function(e) {
            var id = $(e.currentTarget).attr('data-id');
            this.trigger('checkDetail', id);
        },
        submit: function(data) {
            var me = this;
            var orderId = $("input[type=radio]:checked").val();
            if(!orderId){
                util.showToast('请选择订单');
                return;
            }
            util.api({
                url: '~/op/api/a/odr/receivedpay/matchOrder',
                data: {
                    id: me.id,
                    orderId: orderId
                },
                success: function(data) {
                    if(data.success){
                        util.showTip('订单认领提交成功');
                        me.hide();
                        me.trigger('refresh');
                    }
                }
            });
        }
    });
    // 导入  
    var ImportDialog = MClass( Dialog ).include({
        content: tpl.filter('#importDialog').html(),
        defaultAttr: {
            'title': '导入',
            'width': 800,
        },
        events: {
            'click #i-submit': 'submit',
            'click #i-cancel': 'hide'
        },
        elements: {
            '#file': 'file',
            '#path': 'path'
        },
        
        init: function(){
            ImportDialog.__super__.init.apply( this, arguments );
        },
        show: function(){
            ImportDialog.__super__.show.apply( this,arguments );
        },
        submit: function() {
            var me = this;                   
            if (me.$file[0].files.length <= 0) {
                util.showToast('请选择文件');
                return false;
            }
           
            uploader.send({
                url: '/op/api/a/odr/receivedpay/importReceivedPay',
                files: me.$file[0].files,
                beforeSend: function(){
                    util.showTip('正在上传...');                        
                },
                success: function(res) {
                    if (res.success) {
                        util.showTip('上传成功');
                        me.hide();
                        if(res.model.repeatList.length > 0 ||res.model.errorList.length > 0){
                            var list = res.model.repeatList.concat(res.model.errorList);
                            me.trigger('showDup',list);
                        }
                        me.trigger('refresh');
                        //sendInfo(response.value.model.path, response.value.model.FileName);
                    }
                }
            });
        },
          
        hide: function(){
            ImportDialog.__super__.hide.apply( this,arguments );
            this.$file.val('');
            this.$path.val('');
        },
    });
    // 重复信息
    var Duplication = MClass( Dialog ).include({
        content: tpl.filter('#duplication').html(),
        defaultAttr:{
            'title': '以下信息出错或重复，无法导入',
            'width': 900,
        },
        elements: {
            'tbody': 'tbody',
        },
        init: function(){
            Duplication.__super__.init.apply( this, arguments );
        },

        show: function(data){
            Duplication.__super__.show.apply( this,arguments );
            var me = this;
            var list = '';
            $(data).each(function(i, item) {
                item.payDate = new Date(item.receivedPayDate)._format( "yyyy-MM-dd" );
                item.type = item.property ==1? '到款': '退款';
                list += '<tr><th>'+(item.receivedPayNum||'--')+
                    '</th><th>'+(item.payDate||'--')+
                    '</th><th>'+(item.payerName||'--')+
                    '</th><th>'+(item.type||'--')+
                    '</th><th>'+(item.bankName||'--')+
                    '</th><th>'+(item.departmentName||'--')+'</th></tr>';
            });
            me.$tbody.html(list);
        },
        
        hide: function(){
            Duplication.__super__.hide.apply( this,arguments );
            var me = this;
            me.$tbody.html('');
        },
    });
    // 到款列表
    var ReceivedList = MClass( M.Center ).include( {
        tplCode: _.template( tpl.filter( '#rcvList' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#rcvNum': 'rcvNum',
            '#payer': 'payer',
            '#startTime': 'startTime',
            '#endTime': 'endTime',
            '#type': 'type',
            '#bank': 'bank',
            '#department': 'department',
            '#match': 'match',
            '#audit': 'audit',
            'tbody': 'tbody'
        },
        events: {
            'click #create': 'create',
            'click #import': 'import',
            'click #export': 'export',
            'click #search': 'search',
            'click .delete': 'delete',
            'click .edit': 'edit',
            'click .selectOrder': 'selectOrder',
            'keydown .timepicker': 'keydown'
        },
        init: function() {
            ReceivedList.__super__.init.apply( this, arguments );
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
            me.$startTime.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$endTime.val() ? me.$endTime.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });
            me.$endTime.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$startTime.val() ? me.$startTime.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            });
            me.collection = new M.Collection;
            //me.$startTime.val( me.getDateString( -31 ) ); 
            //me.$endTime.val( me.getDateString( -1 ) );
            me.load();
        },
        //新建
        create: function() {
            this.trigger('modify');
        },
        //修改编辑
        edit:function(e) {
            var id = $(e.currentTarget).attr('data-id');
            var me = this;
            me.trigger('modify', id );    
        },

        //选择订单信息
        selectOrder: function(e){
            var id = $( e.currentTarget ).attr('data-id');
            var me = this;
            me.trigger( 'getOrder', id );
        },
        /*//获取默认初始时间
        getDateString: function( offset, base ) {
            var date = this.getDate( offset, base );
            return util.formatDate( date, 'YYYY/MM/dd' );
        },
        getDate: function( offset, base ) {
            if ( !base ) {
                base = new Date().getTime();
            }
            if ( offset ) {
                return base + offset * 24 * 3600 * 1000;
            }
            return base;
        },*/
        
        search: function() {
            this.pagination.setPage( 0, false);
            this.load();
        },
        export: function() {
            var me = this;
            var data =  me.getData() ;            
            var url = location.protocol + '//' + location.host + '/op/api/a/odr/receivedpay/exportReceivedPay?' + $.param( data );
            window.open( url );
        },
        delete: function(e){
            var id = $( e.currentTarget ).attr('data-id');
            var me = this;
            var con = confirm('要删除该条信息吗？');
            if(!con){
                return;
            }
            util.api({
                url: '~/op/api/a/odr/receivedpay/delete',
                data: {
                    id: id,
                },
                success: function(data){
                    if(data.success){
                        util.showTip('删除成功');
                        me.load();
                    }
                }
            });
        },
        //导入
        import: function() {
            this.trigger('import');
        },
        keydown: function(e) {//只能删除不能输入
            if(e.keyCode == 46||e.keyCode == 8){
                $(e.currentTarget).attr('readOnly',false);
            }else{
                $(e.currentTarget).attr('readOnly','readOnly');
            }
        },
        getData: function(){
            var me = this;
            var startTime = me.$startTime.val();
            var endTime = me.$endTime.val();
            var sticks, eticks;
            if ( startTime ) {
                sticks = new Date( startTime ).getTime();
            }
            if ( endTime ) {
                eticks = new Date( endTime ).getTime();
            }
            if ( sticks > eticks ) {
                alert( '开始时间大于结束时间, 请重新选择.' );
                return false;
            }
            return {
                'receivedPayNum': me.$rcvNum.val()||null,
                'startTime': sticks||null,
                'endTime': eticks||null,
                'payerName': me.$payer.val()||null,
                'property': me.$type.val()||null,
                'bankName': me.$bank.val()||null,
                'departmentName': me.$department.val()||null,
                'claimStatus': me.$match.val()||null
                //pageIndex: me.pagination.attr['pageNumber']+1,
                //pageSize: me.pagination.attr['pageSize']
            }
        },
        load: function() {
            var me = this;
            var data = $.extend(me.getData(), {
                    pageIndex: me.pagination.attr['pageNumber']+1,
                    pageSize: me.pagination.attr['pageSize']
                });
            util.api({
                url: '~/op/api/a/odr/receivedpay/list',
                data: JSON.stringify(data),
                contentType:'application/json',
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="7"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    if ( data.success ) {                    
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content, function( item ) {
                            item.payDate = new Date( item.receivedPayDate)._format( "yyyy-MM-dd" );
                        } );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplCode( {'content':me.collection.all() } ) );
                        } else {
                            me.$tbody.html( '<tr><td colspan="9"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="9"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        }
    });

    exports.init = function() {
        var $el = exports.$el;
        var receivedList = new ReceivedList( { 'view': $el.find( '.m-received-list' ) } );
        var createReceipt = new CreateReceipt({'title':'新增/编辑'});
        var selectOrder = new SelectOrder({'title':'选择订单'});
        var importDialog = new ImportDialog({'title':'导入'});
        var detail = new Detail();
        var duplication = new Duplication();

        function refreshList() {
            receivedList.search();
        }
        // 增加、修改
        receivedList.on('modify', function(id) {
            createReceipt.show(id);
        }); 
        // 选择订单信息
        receivedList.on('getOrder', function(id) {
            selectOrder.show(id);
        });
        // 导入
        receivedList.on('import', function() {
            importDialog.show();
        });
        // 显示重复
        importDialog.on('showDup', function(data) {
            duplication.show(data);
        });
        // 查看订单详情
        selectOrder.on('checkDetail', function( id ){
            detail.show(id, 'd');
        });

        // 更新列表
        importDialog.on('refresh', refreshList);
        createReceipt.on('refresh', refreshList);
        selectOrder.on('refresh', refreshList);

    }
} );