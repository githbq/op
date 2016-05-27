define(function(require, exports, module) {
    module.exports="<div class=\"p-list\" js=\"true\">\n\t<div class=\"m-regent u-tablelist\">\n \t<div class=\"list-header\">\n \t\t<h3>\n \t\t\t企业列表\n \t\t</h3>\n \t</div>\n \t<div class=\"list-bar\">\n <div class=\"list-bar-btns\">\n <button class=\"search\">查询</button>\n </div>\n \t\t<div class=\"list-bar-input\">\n \t\t\t<label for=\"\">\n \t\t\t\t<span>来源</span>\n \t\t\t\t<select name=\"\" id=\"\" class=\"sourceEnum\" ce-model=\"source\">\n \t\t\t\t</select>\n \t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业账号</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseAccount\" onchange=\"this.value=this.value.toLowerCase( )\"> \n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业名称</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseName\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>省市</span>\n\t\t\t\t\t<select name=\"\" id=\"\" class=\"provinceEnum\" ce-model=\"province\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>状态</span>\n\t\t\t\t\t<select name=\"\" id=\"\" class=\"statusEnum\" ce-model=\"status\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>优惠码</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"vendorId\" maxlength=8>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>注册时间</span>\n\t\t\t\t\t<input type=\"text\" class=\"startTime\"> 到 <input type=\"text\" class=\"endTime\">\n\t\t\t\t</label>\n \t\t</div>\n \t</div>\n \t<div class=\"list-content\">\n \t\t<table>\n \t\t\t<thead>\n \t\t\t\t<tr>\n \t\t\t\t\t<th></th>\n \t\t\t\t\t<th>企业</th>\n \t\t\t\t\t<th style=\"width:110px;\">账号</th>\n \t\t\t\t\t<th style=\"width:60px;\">来源</th>\n \t\t\t\t\t<th style=\"width:80px;\">状态</th>\n \t\t\t\t\t<th style=\"width:60px;\">省市</th>\n \t\t\t\t\t<th style=\"width:160px;\">注册时间</th>\n <th style=\"width:160px;\">代理商</th>\n <th style=\"width:80px;\"></th>\n \t\t\t\t\t<th></th>\n \t\t\t\t</tr>\n \t\t\t</thead>\n \t\t\t<tbody ce-collection=\"list\">\n \t\t\t\t <tr data-name=\"<%=item.enterprisename%>\">\n <td></td>\n <td><%=item.enterprisename%></td>\n <td><%=item.enterpriseaccount%></td>\n <td><%=item.sourceStr%></td>\n <td><%=item.statusStr%></td>\n <td><%=item.provinceStr%></td>\n <td><%=item.registerTimeStr%></td>\n <td><%=item.vendorName%></td>\n <td>\n <a data-id=\"<%=item.enterpriseregistrationid%>\" class=\"detail\" data-permissions=\"F011029\">详情</a>\n <% if( item.status == 4 ){%>\n <a data-account=\"<%=item.enterpriseaccount%>\" class=\"distribute\" data-permissions=\"F011014\">分配</a>\n <% } %>\n </td>\n <td></td>\n </tr>\n \t\t\t</tbody>\n \t\t</table>\n \t</div>\n \t<div class=\"list-pager\">\n \t\t\n \t</div>\n </div>\n</div>\n";
});