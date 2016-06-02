//产品指令
define(function(require,exports,module){

    angular.module('formApp').directive('products',function(){
        return {
            restrict:'ECMA',
            scope:{},
            template:require('./products-template.html'),
            link:function(scope, iElem, iAttrs){

            }
        }
    });



});