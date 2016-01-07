var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	less = require('gulp-less'),
	jshint = require('gulp-jshint'),
	gulpSequence = require('gulp-sequence'),
	htmlmin = require('gulp-htmlmin');

/**
 *
 * 清空文件夹
 */
 //todo 为什么return后就可以顺序执行了 而且不报错了
gulp.task('clean',function(){

	return gulp.src('dest')
	.pipe( clean() )
});

/**
 *
 * less编译
 */
gulp.task('less',function(){

	return gulp.src('src/resources/assets/style/main.less')
	.pipe( less() )
	.pipe( gulp.dest('src/resources/assets/style/'));
});

/**
 *
 * 复制所有文件
 */
gulp.task('copy',function(){
	
	return gulp.src(['src/**/*','!src/**/*.less','!src/*.html'],{'base':'src'})
	.pipe( gulp.dest('dest/') );
});


/**
 *
 * js压缩
 * mangle 设为false 避免重命名模块内的require关键字
 */
gulp.task('jsminify',function(){

	console.log('jsminify');
	return gulp.src(['src/**/*.js','!src/resources/common/widget/echart/**/*.js','!src/resources/common/widget/editor/**/*.js'],{'base':'src'})
	.pipe( uglify({'mangle':false}) )
	.pipe( gulp.dest('dest/') );
});

/**
 *
 * html 压缩
 */
gulp.task('htmlminify',function(){

	console.log('htmlminify');
	return gulp.src(['src/**/*.html','src/*.html'],{'base':'src'})
	.pipe( htmlmin({collapseWhitespace: true}) )
	.pipe( gulp.dest('dest/') );
});

//检测js错误
gulp.task('test',function(){
	return gulp.src('src/resources/**/*.js')
	.pipe( jshint() )
	.pipe( jshint.reporter() ); //输出检查结果
});

/*
 * 默认任务
 */
gulp.task('default',['less']);
gulp.task('release',gulpSequence('clean','less','copy','jsminify'));

