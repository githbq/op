module.exports = function (grunt) {
	
	// 配置template模块匹配格式
	grunt.template.addDelimiters('handlebars-like-delimiters', '{{', '}}');
	
    grunt.initConfig({

    	pkg: grunt.file.readJSON('package.json'),
    	
	   /* 
		*@A 替换jsp文件中{{}}中值
		*/
        template: {

            main: {
                options: {
                    data: {
                        basePath:  'resources/',
                        token:     '',
                        develop:   true
                    },
                    delimiters: 'handlebars-like-delimiters'
                },
                files: [{
                    expand: true,
                    src:    ['src/*.jsp'],
                    ext:    '.html'
                }]
            }

        },

       /*
        *@A 编译less
        */
        less:{
			main:{
				files:{	"src/resources/assets/style/main.css": "src/resources/assets/style/main.less" }
			}
		},
		
	   /*
		*@A 把underscore文件转换成amd规范文件
		*/
        jst: {
            compile: {
                options: {
                    templateSettings: {
						evaluate: /##([\s\S]+?)##/g,
						interpolate: /\{\{(.+?)\}\}/g,
						escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
                    },
                    processName: function(filename) {
                    	filename = filename.split('/');
                    	filename = filename[2] + '-' + filename[5];
                    	filename = filename.split('.')[0];
						//var index = filename.indexOf('/') + 1;
						//var moudle = filename.slice(index, filename.indexOf('/', index + 1));
						//return moudle + '-' + filename.slice(filename.lastIndexOf('/')+1, filename.lastIndexOf('.'));
						return filename
                    },
					processContent: function(src) {
						return src.replace(/(^\s+|\s+$)/gm, '');
					},
					prettify: true,					
                    amd: true
                },
                files: [{
					expand: true,
					src: ['src/**/*.tpl'],
					filter: function(filepath) {
						return (filepath.indexOf('node_modules') == -1);
					},
					ext: '.js'
                }]
            }
        },


		/* 
		*@A 监听文件变化
		*/		
        watch: {
			main: {
				files: [
					'src/index.jsp',
					'src/login.jsp',
					'src/**/*.less',
					'src/**/*.tpl'
				],
				tasks: ['default']
			}
        },

		/*
		 *@A 清除构建过程中的目录
		 */
        clean: {
        	common:['src/resources/common/'],
            release: ['<%=pkg.output%>/']
        },

		/**
		* 文件拷贝
		*/	
        copy: {

        	//
        	common:{
        		files: [{expand: true, cwd:'<%=pkg.commonPath%>',src:'**',dest:'src/resources/common/'}]
        	},

			/**
			*@A 发布
			*/
			publish:{
				files: [
					{expand: true, cwd:'src/',src:['resources/**','*.jsp'],dest:'<%=pkg.output%>'}
				]
			}
        },

		//压缩并转移所有js文件
        uglify:{
            options:{
                compress: {
                    drop_console: true
                },
                mangle: false
            },
            release:{
                files:[
                    {expand:true,cwd:'src/resources',src:'**/*.js',dest:'release/resources'}
                ]
            }
        },

        usemin: {

           /*
            *@A
            */
            publish: {
            	src:['release/index.html','release/index.jsp']
            }
        },
		
		/*
		 * seajs hash map
		 */		
		hashmap: {
			all: {
				files: [{
					src: [
						'common/plugins/jquery/**/*.js',
						'common/widget/**/*.js',
						'manage/common/widget/**/*.js',
						'manage/*/*.js',
						'bness/common/widget/**/*.js',
						'bness/*/*.js',
					],
					filter: function(filepath) {
						return ((filepath.indexOf('dialog') == -1)
							   && (filepath.indexOf('ztree') == -1)
							   && (filepath.indexOf('slider') == -1));
					},
					dest: 'common/static/js/map-seajs.js'
				}]
			}
		}
		
    });
	
	grunt.registerTask('common',[
		'clean:common',
		'copy:common'
	]);

	grunt.registerTask('default', [
		'less',
		'jst'//,
		//'watch'
	]);

	grunt.registerTask('debug',[
		//'template:main',
		'less',
		'jst'
	]);

    grunt.registerTask('release',[
    	//'template:main',
		'less',
		'jst',
		'clean:release',
		'copy:publish',
		'uglify:release'
    ]);

	//js压缩合并
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//文件合并
	grunt.loadNpmTasks('grunt-contrib-concat');
	//观察
	grunt.loadNpmTasks('grunt-contrib-watch');
	//复制
	grunt.loadNpmTasks('grunt-contrib-copy');
	//css压缩合并
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	//清空文件夹
	grunt.loadNpmTasks('grunt-contrib-clean');
	//js文件检验
	grunt.loadNpmTasks('grunt-contrib-jshint');
	//less编译
	grunt.loadNpmTasks('grunt-contrib-less');
	//template
	grunt.loadNpmTasks('grunt-template');
	//精简标签
	grunt.loadNpmTasks('grunt-usemin');
	//复制命令
	grunt.loadNpmTasks('grunt-contrib-copy');
	//模板预编译
	grunt.loadNpmTasks('grunt-contrib-jst');

};
