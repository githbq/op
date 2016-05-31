define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trEme\">\r\n <% _.each(content,function( value ,index ){ %>\r\n <tr>\r\n <td></td>\r\n <td><%=value.enterpriseaccount%></td>\r\n <td><%=value.enterprisename%></td>\r\n\t\t<td><%=value.payStatus ? '是' : '否'%></td>\r\n <td><%=value.employeename%></td>\r\n <td><%=value.mobile%></td>\r\n <td><%=value.email%></td>\r\n <td><%=value.post%></td>\r\n <td><%=value.isadmin ? '是' : '否'%></td>\r\n <td>\r\n <em class=\"accountdetail\" data-runStatus=\"<%=value.runStatus%>\" data-paystatus=\"<%=value.payStatus%>\" data-contactPhone=\"<%=value.contactPhone%>\" data-contactName=\"<%=value.contactName%>\" data-id=\"<%=value.employeeid%>\" data-account=\"<%=value.enterpriseId%>\" data-enterpriseaccount=\"<%=value.enterpriseaccount%>\" data-permissions=\"F008110\">查看详情</em>\r\n\t\t</td>\r\n <td></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n\r\n\r\n<script type=\"text/template\" id=\"accountDetail\">\r\n <div class=\"m-accountdetail m-enterprisedetail\">\r\n\t\t<p><label><span>管理员姓名</span><input type=\"text\" disabled=\"disabled\" ce-model=\"contactname\"></label></p>\r\n\t\t<p><label><span>管理员电话</span><input type=\"text\" disabled=\"disabled\" ce-model=\"contactphone\"></label></p>\r\n <p><label><span>开通状态</span>\r\n \t<select disabled=\"disabled\" ce-model=\"runstatus\">\r\n \t\t<option value=\"1\">待开通</option><option value=\"2\">已开通</option>\r\n \t\t<option value=\"3\">已作废</option><option value=\"4\">已停用</option>\r\n \t</select>\r\n </label></p>\r\n\t\t<p><label><span>付费状态</span>\r\n \t<select disabled=\"disabled\" ce-model=\"paystatus\">\r\n \t\t<option value=true>已付费</option>\r\n\t\t\t\t<option value=false>未付费</option>\r\n \t</select>\r\n </label></p>\r\n \r\n\t\t<h3 style=\"font-size:16px;font-weight:bold;\">账号详情</h3>\r\n <p><label><span>版本</span><input type=\"text\" disabled=\"disabled\" ce-model=\"version\"></label></p>\r\n <p><label><span>是否试用</span><select disabled=\"disabled\" ce-model=\"istry\"><option value=\"1\">是</option><option value=\"0\">否</option></select></label></p>\r\n <p class=\"trytimep\"><label><span>试用截止时间</span><input type=\"text\" disabled=\"disabled\" ce-model=\"endtime\"></label></p>\r\n <p class=\"tryboxp\"><label><span>试用包</span><span ce-collection=\"trylist\" class=\"trybox\"><b><%=item%>天</b></span></p>\r\n\r\n \r\n <div class=\"dtl\">\r\n\r\n <section class=\"accordian collapse f1 f2 f3 f4\" data-target=\"product\">\r\n <h4><span class=\"arraw\"></span>产品信息</h4>\r\n\r\n <div class=\"content\" id=\"tbProduct\">\r\n \r\n <div class=\"container\">\r\n \r\n </div>\r\n </div>\r\n </section>\r\n\r\n <section class=\"accordian collapse f1 f2 f3 f4\" id=\"operationssection\" data-target=\"operations\">\r\n <h4><span class=\"arraw\"></span>使用情况</h4>\r\n <div class=\"content\">\r\n <p>\r\n <label class=\"hw\">\r\n <span>逍客终端总量</span>\r\n <input id=\"sdXKDC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\">\r\n </label>\r\n \r\n <label class=\"hw\">\r\n <span>逍客终端<br>已用量/未用量</span>\r\n <input id=\"sdXKDUC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\r\n </label>\r\n \r\n <label class=\"hw\">\r\n <span>CRM总量</span>\r\n <input id=\"yingxiaoSum\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\r\n </label>\r\n\r\n <label class=\"hw\">\r\n <span>CRM<br>已用量/未用量</span>\r\n <input id=\"yingxiaoUsed\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\r\n </label>\r\n\r\n <label class=\"hw\">\r\n <span>空间总量(GB)</span>\r\n <input id=\"sdSC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\r\n </label>\r\n <label class=\"hw\">\r\n <span>空间已用量(GB)</span>\r\n <input id=\"sdSUC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\r\n </label>\r\n <label class=\"hw\">\r\n <span>存储扩容(GB)</span>\r\n <input type=\"text\" class=\"g-ipt ipt-m\" disabled=\"disabled\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\" id=\"expandStorageSpace\">\r\n </label>\r\n <label class=\"hw\">\r\n <span>群人数上限(人)</span>\r\n <input type=\"text\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"groupNumLimit\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\">\r\n </label>\r\n <label>\r\n <span>视频参与人数上限(人)</span>\r\n <input type=\"text\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"videoNumLimit\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\">\r\n <span style=\"width:130px\">(最多可添加20人)</span>\r\n </label>\r\n <label class=\"hw crmvisible\">\r\n <span>CRM上级可见数据范围</span>\r\n <select name=\"\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"crmVisibleRange\">\r\n <option value=\"\">请选择</option>\r\n <option value=\"1\">所有下级数据</option>\r\n <option value=\"2\">直属下级数据</option>\r\n </select>\r\n </label>\r\n <label class=\"hw\">\r\n <span>WEB扫码授权</span>\r\n <select name=\"\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"webSanCodeAuth\">\r\n <option value=\"\">请选择</option>\r\n <option value=\"0\">全部授权</option>\r\n <option value=\"1\">未授权</option>\r\n <!--<option value=\"2\">部分授权</option>\r\n </select>\r\n </label>\r\n </p>\r\n\r\n <div id=\"tbOperation\" class=\"tb\">\r\n <p class=\"tr off\">\r\n <button class=\"btn-blue\" id=\"sBtnChangeStatistics\" data-permissions=\"F008023 F008028 F008029 F008030 F008031 F008032 F008033 F008034 F008035\">保存</button>\r\n </p>\r\n <table>\r\n <thead>\r\n <tr>\r\n <th>序号</th>\r\n <th>扩容时间</th>\r\n <th>扩容数量</th>\r\n <th>操作人</th>\r\n </tr>\r\n </thead>\r\n <tbody>\r\n \r\n </tbody>\r\n </table>\r\n <div class=\"pager\"></div>\r\n </div>\r\n\r\n </div>\r\n </section>\r\n\r\n </div>\r\n \r\n </div>\r\n</script>\r\n\r\n";
});