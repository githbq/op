define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"opentr\">\n <% _.each(content,function(item){ %>\n \t<tr>\n \t\t<td></td>\n \t\t<td><%=item.enterpriseName%></td>\n \t\t<td style=\"display:none;\"><%=item.address%></td>\n \t\t<td><%=item.createTimeStr%></td>\n \t\t<td>\n <a data-id=\"<%=item.id%>\" data-status=\"<%=item.requestStatus%>\" data-permissions=\"F009052\" class=\"detail\">查看</a>\n </td>\n \t\t<td></td>\n \t</tr>\n <% }) %>\n</script>\n\n<script type=\"text/template\" id=\"opendetail\">\n <div class=\"m-opendetail u-slider\">\n <p>\n <label for=\"\">\n <span>企业名称</span>\n <input type=\"text\" disabled ce-model=\"enterpriseName\">\n </label>\n <label for=\"\" class=\"state reqStatus\">\n <span>申请状态</span>\n <input type=\"text\" disabled ce-model=\"requestStatusStr\">\n </label>\n </p>\n <p>\n <label for=\"\">\n <span>状态</span>\n <input type=\"text\" disabled ce-model=\"statusStr\">\n </label>\n <label for=\"\">\n <span>是否启用</span>\n <input type=\"text\" disabled ce-model=\"activeStr\">\n </label>\n </p>\n <p style=\"display:none;\">\n <label for=\"\">\n <span>地址</span>\n <input type=\"text\" disabled ce-model=\"address\">\n </label>\n </p>\n <!--\n <p>\n\n <label for=\"\">\n <span>联系人</span>\n <input type=\"text\" disabled ce-model=\"contactName\">\n </label>\n <label for=\"\">\n <span>联系人职务</span>\n <input type=\"text\" disabled ce-model=\"contactPost\">\n </label>\n </p>\n <p>\n <label for=\"\">\n <span>联系电话</span>\n <input type=\"text\" disabled ce-model=\"contactPhone\">\n </label>\n <label for=\"\">\n <span>联系邮件</span>\n <input type=\"text\" disabled ce-model=\"contactEmail\">\n </label>\n </p>-->\n <p style=\"display:none;\">\n <label for=\"\">\n <span>名片</span>\n <img src=\"\" class=\"card\" disabled>\n </label>\n </p>\n <p>\n <label for=\"\">\n <span>备注</span>\n <textarea name=\"\" disabled ce-model=\"remark\"></textarea>\n </label>\n </p>\n <!--<p class=\"state action-req\">\n <label>\n <span>申请原因</span>\n <textarea name=\"\" ce-model=\"reqRemark\"></textarea>\n </label> \n </p>-->\n <p class=\"state action-req\">\n <button class=\"btn-blue action-reqbtn\" data-permissions=\"F009047\">申请备案</button>\n <span class=\"tipinfo\"></span>\n </p>\n <div class=\"slider-action\">\n <button class=\"open-return\">返回</button>\n </div>\n </div>\n</script>\n\n\n";
});