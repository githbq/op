define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"trEme\">\r\n <% _.each(content,function( value ,index ){ %>\r\n <tr>\r\n <td></td>\r\n <td><input type=\"checkbox\" data-pid=\"<%=value.employeeid%>\" data-eid=\"<%=value.enterpriseaccount%>\" class=\"selectitem\"></td>\r\n <td><%=value.enterpriseaccount%></td>\r\n <td><%=value.enterprisename%></td>\r\n <td><%=value.hasAuth ? '否':'是'%></td>\r\n <td><%=value.employeename%></td>\r\n <td><%=value.mobile%></td>\r\n <td><%=value.email%></td>\r\n <td><%=value.post%></td>\r\n <td><%=value.isadmin ? '是' : '否'%></td>\r\n\t\t<td><%=value.isstop ? '停用' : '启用'%></td>\r\n <td><em class=\"resetpwd\" data-id=\"<%=value.employeeid%>\" \r\n data-account=\"<%=value.enterpriseaccount%>\" data-permissions=\"F008128\">重置密码</em>\r\n <em class=\"accountdetail\" data-id=\"<%=value.employeeid%>\" data-account=\"<%=value.enterpriseId%>\" data-permissions=\"F008007\">查看帐号详情</em>\r\n <% if(!value.isadmin){%>\r\n <em class=\"up\" data-id=\"<%=value.employeeid%>\" data-account=\"<%=value.enterpriseaccount%>\" data-permissions=\"F008127\">提升为管理员</em></td>\r\n <% }%>\r\n <td></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n\r\n<script type=\"text/template\" id=\"resetWord\">\r\n <div class=\"m-resetword\">\r\n <p><label><span>新密码</span><input type=\"password\" class=\"password\" maxlength=\"20\"></label></p>\r\n <p class=\"tip\">（密码应为6-20位半角字符(字母、数字、符号),且必须包含字母、数字和符号）</p>\r\n <p><label><span>确认新密码</span><input type=\"password\" class=\"repeatpassword\" maxlength=\"20\"></label></p>\r\n <p><button class=\"btn-blue\">确定</button></p>\r\n </div>\r\n</script>\r\n\r\n<script type=\"text/template\" id=\"accountDetail\">\r\n <div class=\"m-accountdetail\">\r\n <p><label><span>版本</span><input type=\"text\" disabled=\"disabled\" ce-model=\"version\"></label></p>\r\n <p><label><span>是否试用</span><select disabled=\"disabled\" ce-model=\"istry\"><option value=\"1\">是</option><option value=\"0\">否</option></select></label></p>\r\n <p class=\"trytimep\"><label><span>试用截止时间</span><input type=\"text\" disabled=\"disabled\" ce-model=\"endtime\"></label></p>\r\n <p class=\"tryboxp\"><label><span>试用包</span><span ce-collection=\"trylist\" class=\"trybox\"><b><%=item%>天</b></span></p>\r\n </div>\r\n</script>\r\n\r\n\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"trEme\">\n <% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><input type=\"checkbox\" data-pid=\"<%=value.employeeid%>\" data-eid=\"<%=value.enterpriseaccount%>\" class=\"selectitem\"></td>\n <td><%=value.enterpriseaccount%></td>\n <td><%=value.enterprisename%></td>\n <td><%=value.hasAuth ? '否':'是'%></td>\n <td><%=value.employeename%></td>\n <td><%=value.mobile%></td>\n <td><%=value.email%></td>\n <td><%=value.post%></td>\n <td><%=value.isadmin ? '是' : '否'%></td>\n\t\t<td><%=value.isstop ? '停用' : '启用'%></td>\n <td><em class=\"resetpwd\" data-id=\"<%=value.employeeid%>\" \n data-account=\"<%=value.enterpriseaccount%>\" data-permissions=\"F008128\">重置密码</em>\n <em class=\"accountdetail\" data-id=\"<%=value.employeeid%>\" data-account=\"<%=value.enterpriseId%>\" data-permissions=\"F008007\">查看帐号详情</em>\n <% if(!value.isadmin){%>\n <em class=\"up\" data-id=\"<%=value.employeeid%>\" data-account=\"<%=value.enterpriseaccount%>\" data-permissions=\"F008127\">提升为管理员</em></td>\n <% }%>\n <td></td>\n </tr>\n <% }) %>\n</script>\n\n<script type=\"text/template\" id=\"resetWord\">\n <div class=\"m-resetword\">\n <p><label><span>新密码</span><input type=\"password\" class=\"password\" maxlength=\"20\"></label></p>\n <p class=\"tip\">（密码应为6-20位半角字符(字母、数字、符号),且必须包含字母、数字和符号）</p>\n <p><label><span>确认新密码</span><input type=\"password\" class=\"repeatpassword\" maxlength=\"20\"></label></p>\n <p><button class=\"btn-blue\">确定</button></p>\n </div>\n</script>\n\n<script type=\"text/template\" id=\"accountDetail\">\n <div class=\"m-accountdetail\">\n <p><label><span>版本</span><input type=\"text\" disabled=\"disabled\" ce-model=\"version\"></label></p>\n <p><label><span>是否试用</span><select disabled=\"disabled\" ce-model=\"istry\"><option value=\"1\">是</option><option value=\"0\">否</option></select></label></p>\n <p class=\"trytimep\"><label><span>试用截止时间</span><input type=\"text\" disabled=\"disabled\" ce-model=\"endtime\"></label></p>\n <p class=\"tryboxp\"><label><span>试用包</span><span ce-collection=\"trylist\" class=\"trybox\"><b><%=item%>天</b></span></p>\n </div>\n</script>\n\n\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});