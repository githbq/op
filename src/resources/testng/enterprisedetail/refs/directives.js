define(function(require,exports,module){
    require('./services');
    require('plugin/uploadpreview');
    var app=null;
    //try{
    //    app=angular.module('common.directives');
    //}catch(e){
    //    app=angular.module('common.directives',[]);
    //}
    app=angular.module('common.directives',['common.services']);
    var template=require('./template.html');
    app.directive('inputFile',['fileService', function(fileService){
        return {
            scope:{label:'@',required:'=',ngModel:'=',status:'=',response:'='},
            controller:['$scope', function($scope){
            }],
            link:function(scope, iElem, iAttrs){
                $('input[type=file]',iElem).uploadPreview({ Callback:null,img: $('img',iElem) });
                iElem.find('input[type=file]').on('change',function(e){
                    scope.$apply(function($sope){
                        scope.status='uploading';
                    });
                    fileService.sendFile(e,function(result){
                        scope.$apply(function($scope){
                            scope.response=result;
                            scope.status='uploaded';
                        });
                    });
                });
            },
            restrict:'CA',
            template:$(template,'.uploadFile').html()
        }
    }])




});