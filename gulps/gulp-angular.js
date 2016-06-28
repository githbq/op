///**
// * Created by hubq on 2016/5/26.
// */
//
//var gulp = require('gulp');
//
//var plugins = require('gulp-load-plugins')();
//
//var _ = plugins.loadUtils(['log', 'colors', 'env']);
//var eventStream = require('event-stream');
//
////read env variable
//var _fileName = _.env['concat-file-name'] || "all.js";
//var _uglify = _.env.uglify || false;
//var _cssmini = _.env.cssmini || false;
//var _moduleName = _.env['template-module-name'] || "cuf.template";
//var _appModuleName = _.env['app-module-name']||"template-all";
//
//
//gulp.task('build.ng.template', function() {
//    _.log('****************构建ng模板');
//    var jsStream = gulp.src("./src/js/*.js"),
//        htmlStream = gulp.src("./src/resources/testng/ang/*.html");
//
//    //_.log(_appModuleName);
//
//    var configObj = {};
//    configObj[_appModuleName] = [
//        _moduleName
//    ];
//
//    //_.log(configObj);
//
//    jsStream.pipe(plugins.if(typeof _appModuleName !== 'undefined', plugins.angularExtender(configObj)));
//
//    htmlStream.pipe(plugins.ngHtml2js({
//        moduleName: _moduleName,
//        prefix: "template/"
//    }));
//
//    return eventStream.merge(jsStream, htmlStream)
//        .pipe(plugins.concat(_fileName))
//        .pipe(plugins.ngAnnotate())
//        .pipe(plugins.if(_uglify, plugins.uglify()))
//        .pipe(gulp.dest("./dist2/js"))
//});
//
//gulp.task('default', ['clean', 'buildjs', 'buildcss']);