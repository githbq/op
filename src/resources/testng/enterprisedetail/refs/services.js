define(function (require, exports, module) {
    var app = null;
    try {
        app = angular.module('common.services');
    } catch (e) {
        app = angular.module('common.services', []);
    }
    //文件上传服务
    var uploader = require('common/widget/upload').uploader;
    app.factory('fileService', function () {
        var factory = {};
        factory.sendFile = function (e, callback) {
            return uploader.send({
                'url': '/op/api/file/uploadsinglefileandcheck',
                'files': e.target.files,
                'options': {
                    'limittype': 'IMAGE'
                },
                'success': callback
            });
        };
        return factory;
    });

    //

    app.factory('industryService', function () {
        var factory = {};
        factory.sendFile = function (e, callback) {
            return uploader.send({
                'url': '/op/api/file/uploadsinglefileandcheck',
                'files': e.target.files,
                'options': {
                    'limittype': 'IMAGE'
                },
                'success': callback
            });
        };
        return factory;
    });
    app.factory('getEnumService', function () {
        var factory = {};
        //获取枚举值 并赋值给select
        factory.load = function (Ename, needEmpty, cb) {
            var list = [];
            $.isFunction(needEmpty) && (cb = needEmpty);
            needEmpty === true && (list.push({text: '请选择', id: ''}));
            util.getEnums(Ename, function (data) {
                data.value.model.forEach(function (item) {
                    if (item && item.text !== undefined && item.value !== undefined) {
                        list.push({'text': item.text, 'id': item.value + ''});
                    }
                });
                cb && cb(list);
            });
        };
        return factory;
    });
});