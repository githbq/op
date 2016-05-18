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
 * Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
 */
gulp.task('usemin', function() {
	return gulp.src(['dest/*.jsp', 'dest/*.html'])
		.pipe(usemin({
			css: [rev],
			common: ['concat'],
			app: ['concat']
		}))
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

/**
 * Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
 */
gulp.task('usemin', function() {
	return gulp.src(['dest/*.jsp', 'dest/*.html'])
		.pipe(usemin({
			css: [rev],
			common: ['concat'],
			app: ['concat']
		}))
		.pipe(gulp.dest('dest/'));
});

/**
 * 文件md5戳处理
 */
gulp.task('md5', function() {
	return gulp.src(['dest/resources/**/*.js','!dest/resources/common/widget/my97datepicker/**/*.*'], {//, 'dest/resources/**/*.html'
			base: 'dest'
		})
		.pipe(rev())
		.pipe(gulp.dest('dest/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dest/rev/module'));
});

gulp.task('collector', function() {
	return gulp.src(['dest/rev/**/*.json', 'dest/*.html', 'dest/*.jsp'])
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
gulp.task('watch', function () {
	gulp.watch(paths.lesses, ['less']);
});


/*
 * 默认任务
 */
gulp.task('default', ['less','watch']);
gulp.task('release', sequence(
	'clean',
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
