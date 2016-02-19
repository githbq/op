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
    IBSS.ServiceMap={
        '1': 2000,
        '2': 3000,
        '3': 6000,
        '4': 8000
    }
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
