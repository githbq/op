define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trEme\">\n <% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.enterpriseaccount%></td>\n <td><%=value.enterprisename%></td>\n\t\t<td><%=value.payStatus ? '是' : '否'%></td>\n <td><%=value.employeename%></td>\n <td><%=value.mobile%></td>\n <td><%=value.email%></td>\n <td><%=value.post%></td>\n <td><%=value.isadmin ? '是' : '否'%></td>\n <td>\n <em class=\"accountdetail\" data-runStatus=\"<%=value.runStatus%>\" data-paystatus=\"<%=value.payStatus%>\" data-contactPhone=\"<%=value.contactPhone%>\" data-contactName=\"<%=value.contactName%>\" data-id=\"<%=value.employeeid%>\" data-account=\"<%=value.enterpriseId%>\" data-enterpriseaccount=\"<%=value.enterpriseaccount%>\" data-permissions=\"F008110\">查看详情</em>\n\t\t</td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n\n\n<script type=\"text/template\" id=\"accountDetail\">\n <div class=\"m-accountdetail m-enterprisedetail\">\n\t\t<p><label><span>管理员姓名</span><input type=\"text\" disabled=\"disabled\" ce-model=\"contactname\"></label></p>\n\t\t<p><label><span>管理员电话</span><input type=\"text\" disabled=\"disabled\" ce-model=\"contactphone\"></label></p>\n <p><label><span>开通状态</span>\n \t<select disabled=\"disabled\" ce-model=\"runstatus\">\n \t\t<option value=\"1\">待开通</option><option value=\"2\">已开通</option>\n \t\t<option value=\"3\">已作废</option><option value=\"4\">已停用</option>\n \t</select>\n </label></p>\n\t\t<p><label><span>付费状态</span>\n \t<select disabled=\"disabled\" ce-model=\"paystatus\">\n \t\t<option value=true>已付费</option>\n\t\t\t\t<option value=false>未付费</option>\n \t</select>\n </label></p>\n \n\t\t<h3 style=\"font-size:16px;font-weight:bold;\">账号详情</h3>\n <p><label><span>版本</span><input type=\"text\" disabled=\"disabled\" ce-model=\"version\"></label></p>\n <p><label><span>是否试用</span><select disabled=\"disabled\" ce-model=\"istry\"><option value=\"1\">是</option><option value=\"0\">否</option></select></label></p>\n <p class=\"trytimep\"><label><span>试用截止时间</span><input type=\"text\" disabled=\"disabled\" ce-model=\"endtime\"></label></p>\n <p class=\"tryboxp\"><label><span>试用包</span><span ce-collection=\"trylist\" class=\"trybox\"><b><%=item%>天</b></span></p>\n\n \n <div class=\"dtl\">\n\n <section class=\"accordian collapse f1 f2 f3 f4\" data-target=\"product\">\n <h4><span class=\"arraw\"></span>产品信息</h4>\n\n <div class=\"content\" id=\"tbProduct\">\n \n <div class=\"container\">\n \n </div>\n </div>\n </section>\n\n <section class=\"accordian collapse f1 f2 f3 f4\" id=\"operationssection\" data-target=\"operations\">\n <h4><span class=\"arraw\"></span>使用情况</h4>\n <div class=\"content\">\n <p>\n <label class=\"hw\">\n <span>逍客终端总量</span>\n <input id=\"sdXKDC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\">\n </label>\n \n <label class=\"hw\">\n <span>逍客终端<br>已用量/未用量</span>\n <input id=\"sdXKDUC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\n </label>\n \n <label class=\"hw\">\n <span>CRM总量</span>\n <input id=\"yingxiaoSum\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\n </label>\n\n <label class=\"hw\">\n <span>CRM<br>已用量/未用量</span>\n <input id=\"yingxiaoUsed\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\n </label>\n\n <label class=\"hw\">\n <span>空间总量(GB)</span>\n <input id=\"sdSC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\n </label>\n <label class=\"hw\">\n <span>空间已用量(GB)</span>\n <input id=\"sdSUC\" disabled=\"disabled\" class=\"g-ipt ipt-m\" type=\"text\">\n </label>\n <label class=\"hw\">\n <span>存储扩容(GB)</span>\n <input type=\"text\" class=\"g-ipt ipt-m\" disabled=\"disabled\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\" id=\"expandStorageSpace\">\n </label>\n <label class=\"hw\">\n <span>群人数上限(人)</span>\n <input type=\"text\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"groupNumLimit\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\">\n </label>\n <label>\n <span>视频参与人数上限(人)</span>\n <input type=\"text\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"videoNumLimit\" oninput=\"this.value=this.value.replace(/[^\\d]/g,'')\">\n <span style=\"width:130px\">(最多可添加20人)</span>\n </label>\n <label class=\"hw crmvisible\">\n <span>CRM上级可见数据范围</span>\n <select name=\"\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"crmVisibleRange\">\n <option value=\"\">请选择</option>\n <option value=\"1\">所有下级数据</option>\n <option value=\"2\">直属下级数据</option>\n </select>\n </label>\n <label class=\"hw\">\n <span>WEB扫码授权</span>\n <select name=\"\" class=\"g-ipt ipt-m\" disabled=\"disabled\" ce-model=\"webSanCodeAuth\">\n <option value=\"\">请选择</option>\n <option value=\"0\">全部授权</option>\n <option value=\"1\">未授权</option>\n <!--<option value=\"2\">部分授权</option>\n </select>\n </label>\n </p>\n\n <div id=\"tbOperation\" class=\"tb\">\n <p class=\"tr off\">\n <button class=\"btn-blue\" id=\"sBtnChangeStatistics\" data-permissions=\"F008023 F008028 F008029 F008030 F008031 F008032 F008033 F008034 F008035\">保存</button>\n </p>\n <table>\n <thead>\n <tr>\n <th>序号</th>\n <th>扩容时间</th>\n <th>扩容数量</th>\n <th>操作人</th>\n </tr>\n </thead>\n <tbody>\n \n </tbody>\n </table>\n <div class=\"pager\"></div>\n </div>\n\n </div>\n </section>\n\n </div>\n \n </div>\n</script>\n\n";
});