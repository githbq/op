var fs = require('fs'),
	gulp = require('gulp'),
	clean = require('gulp-clean'),
	less = require('gulp-less'),
	jshint = require('gulp-jshint'),
	sequence = require('gulp-sequence'),
	rev = require('gulp-rev'),
	collector = require('gulp-rev-collector'),
	usemin = require('gulp-usemin'),
	htmlmin = require('gulp-htmlmin'),
	minifyHTML = require('gulp-minify-html'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	//rename = require('gulp-rename'),
	//cmdJst = require('gulp-cmd-jst'),
	concat = require('gulp-concat'),
	transport = require('gulp-cmd-transit');

/**
 *
 * 清空文件夹
 */
gulp.task('clean', function() {
	return gulp.src('dest')
		.pipe(clean())
});

/**
 *
 * less编译
 */
gulp.task('less', function() {
	return gulp.src('src/resources/assets/style/main.less')
		.pipe(less())
		.pipe(gulp.dest('src/resources/assets/style/'));
});

/**
 *
 * 复制所有文件
 */
gulp.task('copy', function() {
	return gulp.src(['src/**/*', '!src/**/*.less'], {
			'base': 'src'
		})
		.pipe(gulp.dest('dest/'));
});

/**
 *
 * html 压缩
 */
gulp.task('minify-html', function() {
	return gulp.src([
			'dest/**/*.html',
			'dest/**/*.jsp',
			'!dest/resources/common/widget/editor/**/*.html'
		], {
			'base': 'dest'
		})
		.pipe(htmlmin({
			empty: true,
			minifyCSS: true,
			minifyJS: true,
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dest/'));
});

/**
 * css 压缩
 */
gulp.task('minify-css', function() {
	return gulp.src(['dest/resources/assets/style/*.css'])
		.pipe(minifyCSS({
			keepSpecialComments: false
		}))
		.pipe(gulp.dest('dest/resources/assets/style/'));
});


/*
 * @desc Transport JS
 */
gulp.task("transport", function() {
	return gulp.src([
			'dest/resources/**/*.js',
			'!dest/resources/assets/scripts/config.js',
			'!dest/resources/common/**/*.js',
			'!dest/resources/module/**/*.js'
		], {
			'base': 'dest'
		})
		.pipe(transport({
			dealIdCallback: function(id) {
				return './' + id;
			}
		}))
		.pipe(gulp.dest('dest/'));
});

gulp.task("transport:common", function() {
	return gulp.src([
			'dest/resources/common/**/*.js',
			'!dest/resources/common/scripts/**/*.js',
			'!dest/resources/common/widget/audio-player/audio-player-noswfobject.js',
			'!dest/resources/common/widget/audio-player/dewplayer/*.js',
			'!dest/resources/common/widget/editor/**/*.js',
			'!dest/resources/common/widget/calendar/*.js',
			'!dest/resources/common/widget/chart/*.js',
			'!dest/resources/common/widget/cropper/*.js',
			'!dest/resources/common/widget/swfobject/*.js'
		])
		.pipe(transport({
			dealIdCallback: function(id) {
				return 'common/' + id;
			}
		}))
		.pipe(gulp.dest('dest/resources/common/'));
});

gulp.task("transport:module", function() {
	return gulp.src(['dest/resources/module/**/*.js'])
		.pipe(transport({
			dealIdCallback: function(id) {
				return 'module/' + id;
			}
		}))
		.pipe(gulp.dest('dest/resources/module/'));
});

gulp.task("transport:page",function(){
	return gulp.src(['dest/resources/page/**/*.js'])
		.pipe(transport({
			dealIdCallback: function(id){
				return 'page/' + id;
			}
		}))
		.pipe(gulp.dest('dest/resources/page/'));
});

/**
 *
 * js压缩
 */
gulp.task('minify-js', function() {
	return gulp.src([
			'dest/resources/**/*.js',
			'!dest/resources/common/widget/echart/**/*.js',
			'!dest/resources/common/widget/editor/**/*.js'
		], {
			'base': 'dest'
		})
		.pipe(uglify({
			preserveComments: false,
			mangle: false,
			compress: {
				drop_console: true
			},
			output: {
				comments: false
			}
		}))
		.pipe(gulp.dest('dest/'));
});

/**
 * 合并js
 */
gulp.task('concat', function() {
	return;
});

gulp.task('jst.html', function() {
	var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		meta = { // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		},
		quote = function(string) {
			// If the string contains no control characters, no quote characters, and no
			// backslash characters, then we can safely slap some quotes around it.
			// Otherwise we must also replace the offending characters with safe escape
			// sequences.
			rx_escapable.lastIndex = 0;
			if (rx_escapable.test(string)) {
				return '"' + string.replace(rx_escapable, function(a) {
					var c = meta[a];
					if (typeof c === 'string') {
						return c;
					} else {
						return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					}
				}) + '"';
			} else {
				return '"' + string + '"';
			}
		};

	function unixy(uri) {
		return uri.replace(/\\/g, '/');
	}


	var parser = function(filename, file) {
		var content = [
			'define(function(require, exports, module) {',
			'    module.exports=' + quote(file).replace(/\s+/g, ' ') + ';',
			'});'
		].join('\n');
		fs.writeFileSync(filename + '.js', content, 'utf-8');
	};

	var handle = function(dir) {
		var files = fs.readdirSync(dir);
		if (!files || !files.length) return;

		files.forEach(function(filename) {
			var path = dir + '/' + filename;
			var stats = fs.statSync(path);

			if (stats.isFile()) {
				if (/\.html$/.test(filename)) {
					return parser(path, fs.readFileSync(path, 'utf-8'));
				}
			}

			if (stats.isDirectory()) {
				handle(path);
			}
		});
	};

	handle('src/resources');
});

gulp.task('jst', function() {
	/*var onError = function(err) {
	    plugins.notify.onError({
	        title: "Gulp",
	        subtitle: "Failure!",
	        message: "html error: <%= error.message %>",
	        sound: "Beep"
	    })(err);
	    this.emit('end');
	};*/
	return gulp.src('src/resources/**/*.html')
		/*.pipe(plugins.plumber({
		    errorHandler: onError
		}))*/
		.pipe(cmdJst({
			templateSettings: {
				evaluate: /##([\s\S]+?)##/g,
				interpolate: /\{\{(.+?)\}\}/g,
				escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
			},
			/*processName: function(filename) {
			    var moudle = filename.slice(0, filename.indexOf('/'))
			    return moudle + '-' + filename.slice(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
			},*/
			processContent: function(src) {
				return src.replace(/(^\s+|\s+$)/gm, '');
			},
			prettify: true,
			cmd: true
		}))
		.pipe(rename({
			suffix: '.html'
		}))
		.pipe(gulp.dest('src/resources/'))
});

/**
 * Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
 */
gulp.task('usemin', function() {
	return gulp.src(['dest/*.jsp', 'dest/*.html'])
		.pipe(usemin({
			common: ['concat'],
			app: ['concat']
		}))
		.pipe(gulp.dest('dest/'));
});

/**
 * 文件md5戳处理
 */
gulp.task('md5', function() {

	return gulp.src(['dest/resources/**/*.js','dest/resources/assets/style/main.css','!dest/resources/common/widget/my97datepicker/**/*.*'], {//, 'dest/resources/**/*.html'

			base: 'dest'
		})
		.pipe(rev())
		.pipe(gulp.dest('dest/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dest/rev/module'));
});

gulp.task('collector', function() {
	return gulp.src(['dest/rev/**/*.json', 'dest/*.html', 'dest/*.jsp', 'dest/resources.js'])
		.pipe(collector({
			replaceReved: true
		}))
		.pipe(gulp.dest('dest/'));
});

function rev2map() {
	var map = [];
	var manifest = require('./dest/rev/module/rev-manifest.json');
	if (manifest) {
		for (var key in manifest) {
			map.push([key, manifest[key]]);
		}
	}
	return map;
}

/**
 * 更改seajs的map配置，映射带md5戳的文件
 */
gulp.task('seajs:map', function() {
	var map = rev2map();
	var dir = 'dest/resources/assets/scripts/';
	var files = fs.readdirSync(dir);
	files.forEach(function(file) {
		var filename = dir + '/' + file;
		var data = fs.readFileSync(filename, 'utf-8');
		data = data.replace(/map\:\s*(\[\s*\/\*\$\{gulp\-replace\}\*\/\s*\])/gi, 'map:' + JSON.stringify(map));
		fs.writeFileSync(filename, data, 'utf-8');
	});
});

/**
 * 清理临时文件
 */
gulp.task('clean:temp', function() {
	return gulp.src(['dest/rev', 'dest/*.html'])
		.pipe(clean());
});


//检测js错误
gulp.task('test', function() {
	return gulp.src('src/resources/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter()); //输出检查结果
});


var paths = {
	lesses: ['src/resources/**/**/*.less']

};
//文件监听 第二个参数为触发后会执行的任务
gulp.task('watch', function() {
	gulp.watch(paths.lesses, ['less']);
	gulp.watch(['src/resources/**/*.html'], ['jst.html']);
});


/*
 * 默认任务
 */
gulp.task('default', ['jst.html','less', 'watch']);
gulp.task('release', sequence(
	'clean',
	'jst.html',
	'less',
	'copy', [
		//'transport',
		'transport:common',
		'transport:module',
		'transport:page'
	],
	'usemin',
	'md5',
	'seajs:map',
	'collector',
	/*'minify-html',*/
	'minify-js',
	'minify-css',
	'clean:temp'
));