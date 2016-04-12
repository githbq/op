define(function (require, exports, module) {

        exports.setCommonData = function (controller,dataItems, type, responseData) {
          if(!responseData){
              return ;
          }
            if(resonseData.readonly){
                $(dataItems).each(function(i,n){
                    n.readonly=true;
                })
            }
            if(resonseData.data){
                for(var i in data){
                    if(data.hasOwnProperty(i)){
                        controller(dataItems, i, function (item) {
                            item.value = data[i];
                        });
                    }
                }
            }
        }
        ;
        exports.hideBackTime=function(controller,dataItems, type, responseData){
            controller(dataItems,'backtime_wrapper',function(item){
                item.visible=false;
            });
        };
        exports.showOriginFile=function(controller,dataItems, type, responseData){
            var files=['invoice_original','reject_proof'];
            $(files).each(function(i,n){
                controller(dataItems,n,function(item){
                    item.visible=true;
                });
            });
        };
        exports.showRedFile=function(controller,dataItems, type, responseData){
            var files=['red_invoice_info','invoice_copy'];
            $(files).each(function(i,n){
                controller(dataItems,n,function(item){
                    item.visible=true;
                });
            });
        }
    }
)
;









