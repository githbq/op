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

    }
)
;









