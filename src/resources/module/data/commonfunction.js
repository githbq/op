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
            tempAry[3] = tempAry[3] || '';
            tempAry[4] = tempAry[4] || '';
			tempAry[5] = tempAry[5] || '';
            tempAry[6] = tempAry[6] || '';
			if(tempAry[4]){
				 strDom += '<tr><td>' + tempAry[0]  + '</td><td>' + tempAry[1] + '</td><td>' + tempAry[2] + '</td><td>' + tempAry[3] + '</td><td><a href="javascript:" class="img-info" data-imglist="'+tempAry[4]+'">查看</a></td><td>' + tempAry[5] + '</td><td>' + tempAry[6] +'</td></tr>'
			}else{
				 strDom += '<tr><td>' + tempAry[0]  + '</td><td>' + tempAry[1] + '</td><td>' + tempAry[2] + '</td><td>' + tempAry[3] + '</td><td>暂无</td><td>' + tempAry[5] + '</td><td>' + tempAry[6] +'</td></tr>'
			}
           
        }
        return strDom;
    }
});


