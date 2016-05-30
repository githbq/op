define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-watch-ent\" js=\"true\">\n <div class=\"m-vendorEnt u-tablelist \">\n \t<div class=\"list-header\">\n \t\t<h3>\n \t\t\t企业监察列表<span class=\"header-info\" style=\"font-weight:normal; font-size:12px; color:#666; padding:0 6px;\"></span>\n \t\t</h3>\n \t</div>\n \t<div class=\"list-bar\">\n <div class=\"list-bar-btns\">\n <button class=\"bindall\" data-permissions=\"F008004 F008126 F008054\" style=\"margin-right:10px;\">批量分配</button>\n <button class=\"export\" data-permissions=\"F008004 F008126 F008062\" style=\"margin-right:10px;\">导出</button>\n <button class=\"btn-blue search\" style=\"margin-right:10px;\" data-permissions=\"F008061 F008060\">查询</button>\n <a href=\"\" style=\"visibility:hidden\" target=\"_blank\" id=\"export\"> </a>\n <!--<button class=\"exportin\">导入</button>-->\n </div>\n \t\t<div class=\"list-bar-input watch-ent\">\n <label>\n <span>企业名称</span>\n <input id=\"eaName\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"enterpriseName\"/>\n </label>\n <label>\n <span>优惠码</span>\n <input id=\"agentId\" ce-model=\"agentId\" type=\"text\" class=\"g-ipt ipt-m\" oninput=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=8 />\n </label>\n <label>\n <span>风险类型</span>\n <select ce-model=\"cheatType\">\n <option value=\"\">全部</option>\n <option value=\"1\">规则1</option>\n <option value=\"2\">规则2</option>\n <option value=\"3\">规则3</option>\n <option value=\"4\">规则4</option>\n <option value=\"5\">规则5</option>\n <option value=\"6\">规则6</option>\n <option value=\"7\">警告1</option>\n <option value=\"8\">警告2</option>\n <option value=\"9\">警告3</option>\n </select>\n <span>———风险天数大于等于</span>\n <input type=\"text\" ce-model=\"cheatDayCount\" oninput=\"this.value=this.value.replace(/\\D/g,'')\" >\n </label>\n <label>\n <span>销售人员</span>\n <input type=\"text\" ce-model=\"creatorName\">\n </label> \n <label>\n <span>作弊情况</span>\n <select id=\"cheatStatus\" ce-model=\"cheatStatus\"></select>\n </label>\n <br>\n <label>\n <span>资料审核状态</span>\n <select id=\"informationCheckStatus\" ce-model=\"informationCheck\">\n </select>\n </label>\n <label>\n <span>电话回访状态</span>\n <select id=\"returnBackStatus\" ce-model=\"returnVisitCheck\">\n </select>\n </label>\n \n <label>\n <span>是否付费</span>\n <select ce-model=\"isPayed\">\n <option value=\"\">全部</option>\n <option value=\"1\">是</option>\n <option value=\"0\">否</option>\n </select>\n </label>\n \n <label data-permissions=\"F008004 F008126\">\n <span>是否分配</span>\n <select ce-model=\"isSupervised\">\n <option value=\"\">全部</option>\n <option value=\"1\">是</option>\n <option value=\"0\">否</option>\n </select>\n </label>\n \n <label>\n <span>是否赠送办公版</span>\n <select ce-model=\"presentOfficeEdition\">\n <option value=\"\">全部</option>\n <option value=\"1\">是</option>\n <option value=\"0\">否</option>\n </select>\n </label>\n \n <br>\n <label>\n <span>企业帐号</span>\n <textarea id=\"ea\" class=\"enttextarea\" type=\"text\" ce-model=\"enterpriseAccount\" placeholder=\"换行批量输入企业帐号\"></textarea>\n </label>\n <label class=\"sp\">\n <label><span>开通时间</span>\n <input id=\"qcATBegin\" type=\"text\" class=\"g-ipt ipt-m\" onkeyup='this.value=\"\"'/>\n </label>\n <label><span>-</span>\n <input id=\"qcATEnd\" type=\"text\" class=\"g-ipt ipt-m\" onkeyup='this.value=\"\"'/>\n </label>\n </label>\n \t\t</div>\n \t</div>\n \t<div class=\"list-content\">\n \t\t<table>\n \t\t\t<thead>\n \t\t\t\t<tr>\n <th></th>\n \t\t\t\t\t<th style=\"width:40px;\"><input type=\"checkbox\" class=\"selectEntAll\" data-permissions=\"F008004 F008126\"></th>\n \t\t\t\t\t<th>企业名称</th>\n \t\t\t\t\t<th style=\"width:110px;\">企业账号</th>\n \t\t\t\t\t<th style=\"width:110px;\">代理商</th>\n\t\t\t\t\t\t<th style=\"width:110px;\">是否付费</th>\n\t\t\t\t\t\t<th style=\"width:110px;\">风险天数</th>\n\t\t\t\t\t\t<th style=\"width:110px;\">监察人员</th>\n <th style=\"width:110px;\">销售人员</th>\n\t\t\t\t\t\t<th style=\"width:110px;\">资料审核状态</th>\n \t\t\t\t\t<th style=\"width:110px;\">电话回访状态</th>\n <th style=\"width:110px;\">操作</th>\n \t\t\t\t\t<th></th>\n \t\t\t\t</tr>\n \t\t\t</thead>\n \t\t\t<tbody ce-collection=\"list\">\n \t\t\t\t<tr>\n <td></td>\n\t\t\t\t\t\t<td><input type=\"checkbox\" class=\"selectEnt\" value=\"<%=item.enterpriseId%>\" data-permissions=\"F008004 F008126\"></td>\n\t\t\t\t\t\t<td> <%=item.enterpriseName%> </td>\n\t\t\t\t\t\t<td> <%=item.enterpriseAccount%> </td>\n\t\t\t\t\t\t<td> <%=item.agentName%></td>\n\t\t\t\t\t\t<td> <%=item.isPayed==1 ? '是':'否'%></td>\n\t\t\t\t\t\t<td> <%=item.cheatDayCount%> </td>\n\t\t\t\t\t\t<td> <%=item.superviseAccountName%> </td>\n <td> <%=item.createrName%></td>\n\t\t\t\t\t\t<td> <%=item.shenheStr%></td>\n <td> <%=item.huifangStr%></td>\n <td>\n\t\t\t\t\t\t\t<a data-permissions=\"F008004 F008126 F008054\" data-id=\"<%=item.enterpriseId%>\" class=\"watchent-assgin\">分配</a>&nbsp;&nbsp;\n\t\t\t\t\t\t\t<a data-id=\"<%=item.enterpriseId%>\" class=\"watchent-detail\">详情</a>&nbsp;&nbsp;\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t</tr>\n \t\t\t</tbody>\n \t\t</table>\n \t</div>\n \t<div class=\"list-pager\">\n \t\t\n \t</div>\n </div>\n</div>\n";
});