define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"trTpl\">\r\n <% _.each( content, function( item ){ %>\r\n <tr>\r\n <td></td>\r\n <td> <%=item.enterpriseName%> </td>\r\n <td> <%=item.enterpriseAccount%> </td>\r\n <td> <%=item.runStatusStr%> </td>\r\n <td> <%=item.industryStr%> </td>\r\n <td> <%=item.activityStr%> </td>\r\n <td> <%=item.contactName%> , <%=item.contactPhone%> , <%=item.contactEmail%> , <%=item.contactIM%> </td>\r\n <td> \r\n <a data-id=\"<%=item.id%>\" class=\"detail\">查看&nbsp;</a>\r\n <a data-id=\"<%=item.id%>\" class=\"trackrecord\">&nbsp;跟踪记录&nbsp;</a>\r\n\t\t\t\t<a data-permissions=\"F009089\" data-id=\"<%=item.id%>\" class=\"enterpriseAssign\">&nbsp;分配</a>\r\n <!--<a data-id=\"<%=item.id%>\" class=\"renew\">增购续费</a>-->\r\n </td>\r\n <td></td>\r\n </tr>\r\n <% } )%>\r\n</script>\r\n\r\n<script type=\"text/template\" id=\"renewapply\">\r\n<div class=\"m-renewapply u-renewdetail\">\r\n <p>\r\n <label> <span>企业名称</span> <input type=\"text\" ce-model=\"enterpriseName\" disabled> </label>\r\n <label> <span>企业账号</span> <input type=\"text\" ce-model=\"enterpriseAccount\" disabled> </label>\r\n </p>\r\n <p>\r\n <label>\r\n <span>地址</span>\r\n <input type=\"text\" class=\"address\" ce-model=\"address\" disabled>\r\n </label>\r\n </p>\r\n <p>\r\n <label>\r\n <span>产品</span>\r\n <input type=\"text\" ce-model=\"productName\" disabled>\r\n </label>\r\n <label>\r\n <span>到期时间</span>\r\n <input type=\"text\" ce-model=\"endTimeStr\" disabled>\r\n </label>\r\n </p>\r\n <p>\r\n <label>\r\n <span>增购数量</span>\r\n <input type=\"text\" ce-model=\"buyCount\">\r\n </label>\r\n <label>\r\n <span>续费年限(年)</span>\r\n <select ce-model=\"renewYearCount\">\r\n <option value=\"1\">1</option>\r\n <option value=\"2\">2</option>\r\n <option value=\"3\">3</option>\r\n <option value=\"4\">4</option>\r\n <option value=\"5\">5</option>\r\n <option value=\"6\">6</option>\r\n <option value=\"7\">7</option>\r\n <option value=\"8\">8</option>\r\n <option value=\"9\">9</option>\r\n <option value=\"10\">10</option>\r\n </select>\r\n </label>\r\n </p>\r\n <p>\r\n <label>\r\n <span>上传合同</span>\r\n <input type=\"file\" class=\"contract\">\r\n </label>\r\n <label>\r\n <span>合同金额(￥)</span>\r\n <input type=\"text\" ce-model=\"amount\">\r\n </label>\r\n </p>\r\n <p>\r\n <label>\r\n <span>发票抬头</span>\r\n <input type=\"text\" ce-model=\"invoiceTitle\">\r\n </label>\r\n </p>\r\n <div class=\"detail-action\">\r\n <button class=\"getdiscount\">获取折扣</button>\r\n <input type=\"text\" disabled ce-model=\"discount\">\r\n <button class=\"btn-blue submit\">提交</button>\r\n </div>\r\n</div>\r\n</script>\r\n\r\n<script type=\"text/template\" id=\"enterpriseAssignTem\">\r\n\t<div class=\"m-assignEntInfo u-slider u-tablelist\" id=\"entAssgin\" data-enterprise=''>\r\n\t\t<p>\r\n\t\t\t<label>\r\n\t\t\t\t销售姓名 &nbsp;&nbsp;\r\n\t\t\t\t<input type=\"text\" ce-model=\"name\" class=\"search-name\">\r\n\t\t\t</label>\r\n\t\t\t\r\n\t\t</p>\r\n\t\t<table class=\"enterprise-assign-Info\">\r\n\t\t <thead>\r\n\t\t\t<tr>\r\n\t\t\t <th style=\"width:170px;\">销售人员</th>\r\n\t\t\t <th>操作</th>\r\n\t\t\t</tr>\r\n\t\t </thead>\r\n\t\t <tbody>\r\n\t\r\n\t\t </tbody>\r\n\t\t</table>\r\n\t</div>\r\n</script>\r\n\r\n<script type=\"text/template\" id=\"trenterpriseAssign\">\r\n\t<% _.each( content, function( item , index ){%>\r\n\t\t<tr data-id=\"<%=item.id%>\">\r\n\t\t\t<td><%=item.name%></td>\r\n\t\t\t<td>\r\n\t\t\t\t<a data-id=\"<%=item.id%>\" class=\"sale-bind-enterprise\">绑定</a>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t<% }) %>\r\n</script>\r\n\r\n\r\n\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"trTpl\">\n <% _.each( content, function( item ){ %>\n <tr>\n <td></td>\n <td> <%=item.enterpriseName%> </td>\n <td> <%=item.enterpriseAccount%> </td>\n <td> <%=item.runStatusStr%> </td>\n <td> <%=item.industryStr%> </td>\n <td> <%=item.activityStr%> </td>\n <td> <%=item.contactName%> , <%=item.contactPhone%> , <%=item.contactEmail%> , <%=item.contactIM%> </td>\n <td> \n <a data-id=\"<%=item.id%>\" class=\"detail\">查看&nbsp;</a>\n <a data-id=\"<%=item.id%>\" class=\"trackrecord\">&nbsp;跟踪记录&nbsp;</a>\n\t\t\t\t<a data-permissions=\"F009089\" data-id=\"<%=item.id%>\" class=\"enterpriseAssign\">&nbsp;分配</a>\n <!--<a data-id=\"<%=item.id%>\" class=\"renew\">增购续费</a>-->\n </td>\n <td></td>\n </tr>\n <% } )%>\n</script>\n\n<script type=\"text/template\" id=\"renewapply\">\n<div class=\"m-renewapply u-renewdetail\">\n <p>\n <label> <span>企业名称</span> <input type=\"text\" ce-model=\"enterpriseName\" disabled> </label>\n <label> <span>企业账号</span> <input type=\"text\" ce-model=\"enterpriseAccount\" disabled> </label>\n </p>\n <p>\n <label>\n <span>地址</span>\n <input type=\"text\" class=\"address\" ce-model=\"address\" disabled>\n </label>\n </p>\n <p>\n <label>\n <span>产品</span>\n <input type=\"text\" ce-model=\"productName\" disabled>\n </label>\n <label>\n <span>到期时间</span>\n <input type=\"text\" ce-model=\"endTimeStr\" disabled>\n </label>\n </p>\n <p>\n <label>\n <span>增购数量</span>\n <input type=\"text\" ce-model=\"buyCount\">\n </label>\n <label>\n <span>续费年限(年)</span>\n <select ce-model=\"renewYearCount\">\n <option value=\"1\">1</option>\n <option value=\"2\">2</option>\n <option value=\"3\">3</option>\n <option value=\"4\">4</option>\n <option value=\"5\">5</option>\n <option value=\"6\">6</option>\n <option value=\"7\">7</option>\n <option value=\"8\">8</option>\n <option value=\"9\">9</option>\n <option value=\"10\">10</option>\n </select>\n </label>\n </p>\n <p>\n <label>\n <span>上传合同</span>\n <input type=\"file\" class=\"contract\">\n </label>\n <label>\n <span>合同金额(￥)</span>\n <input type=\"text\" ce-model=\"amount\">\n </label>\n </p>\n <p>\n <label>\n <span>发票抬头</span>\n <input type=\"text\" ce-model=\"invoiceTitle\">\n </label>\n </p>\n <div class=\"detail-action\">\n <button class=\"getdiscount\">获取折扣</button>\n <input type=\"text\" disabled ce-model=\"discount\">\n <button class=\"btn-blue submit\">提交</button>\n </div>\n</div>\n</script>\n\n<script type=\"text/template\" id=\"enterpriseAssignTem\">\n\t<div class=\"m-assignEntInfo u-slider u-tablelist\" id=\"entAssgin\" data-enterprise=''>\n\t\t<p>\n\t\t\t<label>\n\t\t\t\t销售姓名 &nbsp;&nbsp;\n\t\t\t\t<input type=\"text\" ce-model=\"name\" class=\"search-name\">\n\t\t\t</label>\n\t\t\t\n\t\t</p>\n\t\t<table class=\"enterprise-assign-Info\">\n\t\t <thead>\n\t\t\t<tr>\n\t\t\t <th style=\"width:170px;\">销售人员</th>\n\t\t\t <th>操作</th>\n\t\t\t</tr>\n\t\t </thead>\n\t\t <tbody>\n\t\n\t\t </tbody>\n\t\t</table>\n\t</div>\n</script>\n\n<script type=\"text/template\" id=\"trenterpriseAssign\">\n\t<% _.each( content, function( item , index ){%>\n\t\t<tr data-id=\"<%=item.id%>\">\n\t\t\t<td><%=item.name%></td>\n\t\t\t<td>\n\t\t\t\t<a data-id=\"<%=item.id%>\" class=\"sale-bind-enterprise\">绑定</a>\n\t\t\t</td>\n\t\t</tr>\n\t<% }) %>\n</script>\n\n\n\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});