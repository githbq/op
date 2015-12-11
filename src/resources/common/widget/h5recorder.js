define(function(require, exports, module){
	

  	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia|| navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

    //////////////////////
    //Class 录音
    //////////////////////
	function Recorder(){
	   this.init.apply( this, arguments);
	}

	Recorder.prototype = {
	    
	    init: function( audioElement ){
	      
	      var me = this;

	      /*录音上下文*/
	      me.context = new AudioContext();
	      
	      me.recorder = null;
	      me.audioInput = null;
	      me.audioElement = audioElement;

	      //存储录音数据
	      me.audioData = {
	        size: 0,      //录音文件长度
	        buffer: [],    //录音缓存
	        inputSampleRate: me.context.sampleRate,   //输入采样率
	        inputSampleBits: 16,                      //输入采样数位 8，16     
	        outputSampleRate: (44100 / 6),            //采样率 (1/6 44100)
	        outputSampleBits: 16                      //采样数位 (8,16)
	      }
	    },

	    /**
	     *@ 开始录音
	     */
	    start: function(){

	      var me = this;
	      me.audioData.size = 0;
	      me.audioData.buffer = [];
	      navigator.getUserMedia({'audio':true},function(stream){
	        
	        me._audioInputStream(stream);
	      },function(e){
	        
	        console.log('error');
	        console.log(e);
	      });
	    },

	    /**
	     *@ 连接整个回路
	     *  recorder会监听音频流事件
	     *  存入到me.audioData的buffer中
	     */
	    _audioInputStream: function(stream){

	      var me = this;
	      
	      me.audioInput = me.context.createMediaStreamSource(stream);

	      /*
	       * recorder 需要每次都start的时候重新生成
	       * 如果不重新生成 声音会叠加失真
	       * 为什么??????
	       */
	      //me.recorder = me.context.createJavaScriptNode(4096,1,1);
	      me.recorder = me.context.createScriptProcessor(4096,1,1);

	      me.audioInput.connect(me.recorder);
	      me.recorder.connect(me.context.destination);
	      me.recorder.onaudioprocess = function(e){

	        var data = e.inputBuffer.getChannelData(0);
	        me.audioData.buffer.push(new Float32Array(data));
	        me.audioData.size += data.length;
	      }

	    },

	    /**
	     *@ 压缩合并
	     */
	    _compress: function(){

	      var me = this;
	      var data = new Float32Array(me.audioData.size);
	      var offset = 0;
	      
	      for(var i = 0; i < me.audioData.buffer.length; i++){
	        data.set(me.audioData.buffer[i], offset);
	        offset += me.audioData.buffer[i].length;
	      }

	      //压缩
	      var compression = parseInt(me.audioData.inputSampleRate / me.audioData.outputSampleRate);
	      var length = data.length / compression;
	      var result = new Float32Array(length);
	      var index = 0, j=0;
	      while( index < length){
	        result[index] = data[j];
	        j += compression;
	        index++;
	      }
	      return result;
	    },

	    /**
	     *@ 导出为wav文件
	     */
	    _encodeWAV: function(){

	      var me = this;
	      var sampleRate = Math.min(me.audioData.inputSampleRate, me.audioData.outputSampleRate);
	      var sampleBits = Math.min(me.audioData.inputSampleBits, me.audioData.outputSampleBits);
	      var bytes = me._compress();
	      var dataLength = bytes.length * (sampleBits / 8);
	      var buffer = new ArrayBuffer(44 + dataLength);
	      /* */
	      var data = new DataView(buffer);

	      var channelCount = 1;//单声道 
	      var offset = 0;

	      var writeString = function (str){
	        for(var i = 0; i < str.length; i++){
	          data.setUint8(offset + i,str.charCodeAt(i));
	        }
	      }

	      //资源交换文件标识符
	      writeString('RIFF'); offset += 4;
	      //下个地址开始到文件尾部总字节数，即文件大小-8
	      data.setUint32(offset, 36 + dataLength, true); offset += 4;
	      // WAV文件标志
	      writeString('WAVE'); offset += 4;
	      // 波形格式标志
	      writeString('fmt '); offset += 4;
	      //过滤字节，一般为 0x10 = 16
	      data.setUint32(offset, 16, true); offset += 4;
	      //格式类别 (PCM形式采样数据)
	      data.setUint16(offset, 1, true); offset += 2;
	      //通道数
	      data.setUint16(offset, channelCount, true); offset += 2;
	      // 采样率，每秒样本数，标识每个通道的播放速度
	      data.setUint32(offset, sampleRate, true); offset += 4;
	      // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
	      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8),true); offset += 4;
	      // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
	      data.setUint16(offset, channelCount * (sampleBits / 8),true); offset +=2;
	      // 每样本数据位数
	      data.setUint16(offset, sampleBits, true); offset += 2;
	      // 数据标识符
	      writeString('data'); offset += 4;
	      //采样数据总数,即数据总大小-44
	      data.setUint32(offset, dataLength, true); offset += 4;

	      //写入采样数据
	     if (sampleBits === 8) {
	          for (var i = 0; i < bytes.length; i++, offset++) {
	              var s = Math.max(-1, Math.min(1, bytes[i]));
	              var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
	              val = parseInt(255 / (65535 / (val + 32768)));
	              data.setInt8(offset, val, true);
	          }
	      } else {
	          for (var i = 0; i < bytes.length; i++, offset += 2) {
	              var s = Math.max(-1, Math.min(1, bytes[i]));
	              data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	          }
	      }

	      return new Blob([data], { type: 'audio/wav' });
	    },

	    /**
	     *@ 停止录音
	     */
	    stop: function(){

	      var me = this;
	      me.recorder.disconnect();
	    },


	    /**
	     *@ 获取音频文件
	     */
	    getBlob: function(){

	      var me = this;
	      me.stop();
	      return me._encodeWAV();
	    },

	    /**
	     *@ 播放
	     */
	    play: function(audio){
	      var me = this;
	      me.audioElement.src = window.URL.createObjectURL( me.getBlob() );
	    },

	    /**
	     *@ 上传文件
	     */
	    upload: function(){
	        var me = this;
	        var data = me.getBlob();

	        /*
	        var fd = new FormData();
	        fd.append("audioData", me.getBlob());
	        */
	        var xhr = new XMLHttpRequest();
	        

	        /*
	        if (callback) {
	            xhr.upload.addEventListener("progress", function (e) {
	                callback('uploading', e);
	            }, false);
	            xhr.addEventListener("load", function (e) {
	                callback('ok', e);
	            }, false);
	            xhr.addEventListener("error", function (e) {
	                callback('error', e);
	            }, false);
	            xhr.addEventListener("abort", function (e) {
	                callback('cancel', e);
	            }, false);
	        }
	        */

	        xhr.open("POST", '/send');
	        xhr.send(data);
	        console.log(data);
	    }

	}

	module.exports = Recorder
});

