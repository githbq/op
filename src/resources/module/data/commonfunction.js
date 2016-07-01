//
define( function(require, exports, module){

    //===订单1.2  获取审批意见明细
    exports.getRejectReason = function( rejectReason ) {
        
        var opinionObj = {'support': '小助手开通', 'support2': '小助手确认', 'finance': '数据中心', 'sup': '小助手'};
        var personStr = "support,support2,finance,sup";
        
        var strDom = '';
        var optionsList = rejectReason ? rejectReason.split('<+>') : [];

        for (var i = 0; i < optionsList.length; i++) {
            
            var tempAry = optionsList[i].split('<->');

                
            if( personStr.indexOf(tempAry[1]) > -1 ){
                tempAry[1] = opinionObj[tempAry[1]];
            }
            tempAry[1] = tempAry[1] + '-' + tempAry[0];
            tempAry = tempAry.slice(1);

            tempAry[2] = (tempAry[2] == 'true') ? '同意' : '驳回';
            tempAry[5] = tempAry[5] || '';
            strDom += '<tr><td>' + tempAry[0]  + '</td><td>' + tempAry[1] + '</td><td>' + tempAry[2] + '</td><td>' + tempAry[3] + '</td><td>' + tempAry[4] + '</td><td>' + tempAry[5] +'</td></tr>'
        }
        return strDom;
    }
});


