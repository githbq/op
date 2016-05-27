define(function(require, exports, module) {
    module.exports=" <div class=\"m-userlist u-tablelist\">\n <section>\n \t<h4>代理商</h4>\n \t<p ce-model=\"agentName\"></p>\n </section>\n\t<div class=\"list-header\">\n\t\t<div class=\"header-opts\">\t\n\t\t\t<button class=\"addUser state state-am\" data-permissions=\"F010002\">添加用户</button>\n\t\t</div>\n\t\t<h3>查询条件</h3>\n\t</div>\n\n\t<div class=\"list-bar\">\n\t\t<div class=\"list-bar-btns\">\n\t\t\t<button class=\"btn-blue btn-search\" data-permissions=\"F010003 F011006\">查询</button>\n\t\t</div>\n\t\t<div class=\"list-bar-input\">\n\t\t\t<label for=\"\"> <span>姓名</span> <input type=\"text\" ce-model=\"name\"> </label>\n\t\t\t<label for=\"\"> <span>角色</span> <input type=\"text\" value=\"代理商用户\" disabled> </label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>状态</span>\n\t\t\t\t<select ce-model=\"status\">\n\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t<option value=\"1\">已启用</option>\n\t\t\t\t\t<option value=\"0\">已停用</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t\t<label class=\"\">\n\t\t\t\t<span>审核状态</span>\n\t\t\t\t<select ce-model=\"auditStatus\">\n\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t<option value=\"0\">待审核</option>\n\t\t\t\t\t<option value=\"1\">审核成功</option>\n\t\t\t\t\t<option value=\"2\">审核失败</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t\t<label for=\"\"> <span>登录名</span> <input type=\"text\" ce-model=\"loginName\"></label>\n\t\t\t<label for=\"\"> <span>工作邮箱</span> <input type=\"text\" ce-model=\"email\"></label>\n\t\t\t<br>\n\t\t\t<label for=\"\"> \n\t\t\t\t<span>登录时间</span>\n\t\t\t\t<input type=\"text\" ce-model=\"startTime\" class=\"list-starttime\"> 到 <input type=\"text\" ce-model=\"endTime\" class=\"list-endtime\">\n\t\t\t</label>\n\t\t</div>\n\t</div>\n\n\t<div class=\"list-content\">\n\t\t<table>\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th style=\"width:80px;\">姓名</th>\n\t\t\t\t\t<th>登录账号</th>\n\t\t\t\t\t<th style=\"width:150px;\">工作邮箱</th>\n\t\t\t\t\t<th style=\"width:80px;\">状态</th>\n\t\t\t\t\t<th style=\"width:80px;\">审核状态</th>\n\t\t\t\t\t<th style=\"width:110px;\">登录时间</th>\n\t\t\t\t\t<th style=\"width:85px;text-align:center\">操作</th>\n\t\t\t\t\t<th></th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t\t<tbody ce-collection=\"list\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td></td>\n\t\t\t\t\t<td><%=item.name%></td>\n\t\t\t\t\t<td><%=item.username%></td>\n\t\t\t\t\t<td><%=item.email%></td>\n\t\t\t\t\t<td><%=item.statusStr%></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<%=item.auditStatusStr%>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td><%=item.lastLoginTimeStr%></td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<a data-id=\"<%=item.id%>\" class=\"user-detail\" data-permissions=\"F010009 F011009\">查看</a>\n\t\t\t\t\t\t<% if( item.auditStatus == 'WAIT'){ %>\n\t\t\t\t\t\t<a data-id=\"<%=item.id%>\" data-permissions=\"F011071\" class=\"user-approval state\">审核</a>\n\t\t\t\t\t\t<% } %>\n\t\t\t\t\t\t<a data-id=\"<%=item.id%>\" data-name=\"<%=item.name%>\" class=\"user-reset state state-am\" data-permissions=\"F010005\">重置密码</a>\n\t\t\t\t\t\t<%if(item.auditStatus != \"WAIT\"){%>\n\t\t\t\t\t\t\t<%if(item.active == \"1\"){%>\n\t\t\t\t\t\t\t<a class=\"change-status\" data-permissions=\"F010\" data-id=\"<%=item.id%>\" data-status=\"0\" data-permissions=\"F010006\">&nbsp;&nbsp;停用</a>\n\t\t\t\t\t\t\t<%}else if(item.active == \"0\"){%>\n\t\t\t\t\t\t\t<a class=\"change-status\" data-permissions=\"F010\" data-id=\"<%=item.id%>\" data-status=\"1\" data-permissions=\"F010006\">&nbsp;&nbsp;启用</a>\n\t\t\t\t\t\t\t<%}%>\n\t\t\t\t\t\t<%}%>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td></td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n\t</div>\n\n\t<div class=\"list-pager\">\n\t</div>\n</div>\n";
});