define(function(require, exports, module){
	

	/**
	 *@上传图片组件
	 */
	function ImgUploader(){
		this.init.apply(this,arguments);
	}
	ImgUploader.prototype={
		


		/*
		* inputElement
		*
		*/
		'init': function( inputElement , previewElement ){
			var me = this;

			me.ele = inputElement;
			me.previewElement = previewElement || null;
			me.xhr = new XMLHttpRequest();


			me.reader = new FileReader();
			me.reader.onload = function(){
				me.previewElement.src = me.reader.result;
				me.onLoad();
			};
			

			me.ele.addEventListener('change', function(){

				//ie11下清空也会触发change事件
				//此时直接返回
				if(!me.ele.value) return;
				
				var bool = me.onChange(me.ele.files[0]);
				if(bool == false){ 
					me.empty();
					return; 
				} else if( me.previewElement ){
					me.preview()
				}
			});

		    // 上传成功的回调
			me.onSendSuccess = function( info ){};

			//上传有问题的回调
			me.onSendError = function( info ){};

			//上传进度事件
			me.onSendProgress = function( position, totalSize ){};

		    // 文件变化的回调
		    // 如果返回值为false 则不会真正获取
		    // 默认返回true
			me.onChange = function(file){
				return true;
			}

			//预览图片时图片加载完毕触发此事件
			me.onLoad = function(){}
		},

		//////////
		//
		// 清空input[file]暂存的文件
		// 同时清空input 保留的 value值
		// 确保下次选中相同文件时 可以选中
		/////////
		'empty': function(){
			this.ele.value = '';
			if(this.ele.files.length > 0) this.ele.files = null;
			if(this.previewElement) this.previewElement.src = '';
		},

		//预览
		'preview': function(){
			var file = this.ele.files[0];
			this.reader.readAsDataURL(file);
		},

		// 发送文件
		// 每次发送生成一个新的xhr对象 
		'send': function( options ){
			var me = this;

			me.xhr && me.xhr.abort();
			me.xhr = new XMLHttpRequest();
			var	xhr = me.xhr;

			options = options || {};

			/*
			*file 对象是二进制对象
			*继承自Blob
			*/
			var file = me.ele.files[0];

			var fd = new FormData();
            	fd.append("upfile",file);

            for(var key in options){
            	if( options.hasOwnProperty( key ) ){
            		fd.append( key,options[key] );
            	}
            }

			xhr.onreadystatechange=function(){
				if( xhr.readyState == 4 ){

					try{
						if( xhr.status == 200 ){
							me.onSendSuccess( xhr.response );
						}else{
							//超时时会同样触发此处
							util.showToast('网络错误 '+ xhr.response);
							me.onSendError( xhr.response );
						}
					} catch ( err ){
						//超时事件 错误处理
					}
				}
			};
			
			//超时设置 30秒
			//ie11不支持 todo
			//xhr.timeout = 30000;
			//xhr.ontimeout = function(){}

			//progress 进度事件
			xhr.onprogress = function( event ){
				if( event.lengthComputable ){
					me.onSendProgress( event.position, event.totalSize);
				}
			}

			xhr.open('post', IBSS.UPLOAD_PATH ,true);
			xhr.send(fd)
		},

		//中止上传
		'abort': function(){
			this.xhr && this.xhr.abort();
		}
	}


	//上传对象
	var uploader = {
		
		/**
		 * 上传函数
		 *  
		 * @param data
		 *    url   	请求地址
		 *    files 	文件数组
		 *    options 	其他参数
		 *    success   成功后的回调
		 */
		send: function( data ){
			
			var url = data.url,
				files = data.files,
				options = data.options || {};
			
			var xhr = new XMLHttpRequest;
			var fd = new FormData();
			
			for( var i=0; i < files.length; i++ ){
				fd.append('upfile', files[i]);
			}

			for( var key in options ){
				if( options.hasOwnProperty( key ) ){
					fd.append( key, options[key] );
				}
			}

			xhr.onreadystatechange = function( ){
				if( xhr.readyState == 4 ){

					if( xhr.status == 200 ){
						var response = JSON.parse( xhr.response );

						if( response.success ){
							data.success && data.success( response, xhr );
						}else{
							data.error && data.error( response, xhr );
							util.showToast('请求错误  ' + response.message);
						}
					}else{
						data.error && data.error( response, xhr );
						util.showToast('网络错误'+'('+xhr.status+')!');
					}
				}
			};

			xhr.open('post', url , true)
			xhr.send( fd );
		}
	}

	module.exports = {
		'ImgUploader' : ImgUploader,
		'uploader': uploader
	}
});

