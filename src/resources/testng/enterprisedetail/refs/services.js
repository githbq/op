define(function (require, exports, module) {
    var app = null;
    try {
        app = angular.module('common.services');
    } catch (e) {
        app = angular.module('common.services', []);
    }
    var uploader = require('common/widget/upload').uploader;
    app.factory('fileService', function () {
        var factory = {};
        factory.sendFile = function (e, callback) {
            uploader.send({
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


});