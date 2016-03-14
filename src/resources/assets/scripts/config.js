/**
 *
 * @file /common/static/js/config.js/config.js
 * @desc 全站配置文件
 *
 */
;(function(seajs, _, Backbone) {
	
	var win = this;
	
	
	/**
	 * @type {Object}
     * 全局命名空间	 
	 */
	win.IBSS = win.IBSS || {};
	
	_.extend(IBSS, Backbone.Events);
	
	IBSS.role = null;                                             //当前用户信息
	IBSS.USERS = {};                                              //客服 id->名字 map

	IBSS.ASYNCCSS = true;                                         //是否异步载入css文件

	/**
	* common模块 前端路径
	* 用于common模块内引用前端图片等资源
	*/
	IBSS.COMMON_PATH = IBSS.BASE_PATH + '/common';
	
	/*
	* 后端接口路径
	*/
	IBSS.UPLOAD_PATH = IBSS.API_PATH + '/upload/uploadpic';       //图片上传路径
	IBSS.EDITOR_URL  = IBSS.API_PATH + '/upload/ueditor';         //ueeditor 后端接口路径
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    IBSS.ServiceMap = {
        '1': 2000,
        '2': 3000,
        '3': 6000,
        '4': 8000
    };

    // 审批列表 
    // 付费状态MAP
    IBSS.PayMap = {
    	'1': '全款',
    	'2': '分期',
    	'3': '未付款'
    };

    // 审批列表
    // 订单类型MAP
    IBSS.OrderTypeMap = {
    	"1":"办公版新购-普通",
		"2":"办公版新购-特批",
        "3":"营销版新购-普通",
        "4":"营销版新购-特批",
        "5":"办公版增购-普通",
        "6":"办公版增购-特批",
        "7":"营销版增购-普通",
        "8":"营销版增购-特批",
        "9":"办公版续费-普通",
        "10":"办公版续费-特批",
        "11":"营销版续费-普通",
        "12":"营销版续费-特批",
        "13":"关联自注册办公版-普通",
        "14":"关联自注册办公版-特批",
        "15":"关联自注册营销版-普通",
        "16":"关联自注册营销版-特批",
        "17":"收尾款"
    };

    // 企业列表 企业状态MAP 
    IBSS.EntStatusMap = {
        '1': '待开通',
        '2': '已开通',
        '3': '已作废',
        '4': '已停用',
        '5': '已删除'
    };

	/*
	 *
	 * seajs配置
	 * fetch时增加版本号 防止缓存
	 */
	/*
	seajs.on("fetch", function(data) {
		data.requestUri = data.uri + '?v='+IBSS.VERSION; 
	});
	*/

	/*
	 * seajs配置
	 */
	seajs.config({
		
		map: [
    		[ '.js', '.js?v=' + IBSS.VERSION ]
  		],
		//map: [ /*${gulp-replace}*/ ],
  		
		paths: {
			'common': IBSS.COMMON_PATH,
			'module': IBSS.BASE_PATH + '/module'
		},
		debug : IBSS.IS_DEVELOP							// 开发模式下开启debug
	});
	
	
	/**
	 * Backbone 配置项
	 */
	Backbone.emulateHTTP = true;                 // 通过post伪造put 和 delete
	Backbone.emulateJSON = true;                 // 兼容application/json

}).call(this, seajs, _, Backbone);
