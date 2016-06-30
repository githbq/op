//
define( function(require, exports, module){

    //获取审批意见明细
    exports.getRejectReason = function( rejectReason ) {
        var opinionObj = {'support': '小助手开通', 'support2': '小助手确认', 'finance': '数据中心', 'sup': '小助手'};
        var personStr = "support,support2,finance,sup";
        var strDom = '';
        var optionsList = rejectReason ? rejectReason.split('<+>') : [];

        for (var i = 0; i < optionsList.length; i++) {
            var tempAry = optionsList[i].split('<->');

            if( tempAry.length == 5 ){
                if( personStr.indexOf(tempAry[1]) > -1 ){
                    tempAry[1] = opinionObj[tempAry[1]];
                }
                tempAry[1] = tempAry[1] + '-' + tempAry[0];
                tempAry = tempAry.slice(1);
            }else{
                if(personStr.indexOf(tempAry[0]) > -1) {
                    tempAry[0] = opinionObj[tempAry[0]];
                }
            }

            tempAry[2] = (tempAry[2] == 'true') ? '同意' : '驳回';
            strDom += '<tr><td>' + tempAry[0]  + '</td><td>' + tempAry[1] + '</td><td>' + tempAry[2] + '</td><td>' + tempAry[3] + '</td><td></td></tr>'
        }
        return strDom;
    }
});


