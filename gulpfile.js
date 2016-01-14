var gulp = require('gulp'),
	clean = require('gulp-clean'),
	less = require('gulp-less'),
	jshint = require('gulp-jshint'),
	sequence = require('gulp-sequence'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
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
//todo 为什么return后就可以顺序执行了 而且不报错了
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
	return gulp.src(['src/**/*', '!src/**/*.less' /*, '!src/*.html'*/ ], {
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
		.pipe(rev())
		.pipe(gulp.dest('dest/resources/assets/style/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dest/rev/css/'));
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
			common: ['concat', rev],
			app: ['concat', rev]
		}))
		.pipe(gulp.dest('dest/'));
});


//检测js错误
gulp.task('test', function() {
	return gulp.src('src/resources/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter()); //输出检查结果
});

/*
 * 默认任务
 */
gulp.task('default', ['less']);
gulp.task('release', sequence('clean', 'less', 'copy', 'minify-css', ['transport', 'transport:common', 'transport:module'], 'minify-js', 'usemin', 'minify-html'));