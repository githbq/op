define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-act-lst\" js=\"true\" cache=\"false\">\n\t<div class=\"m-list m-act-detail\">\n\t\t<div class=\"u-tablelist\">\n\t\t\t<div class=\"list-header\">\n\t\t\t\t<h3>\n\t\t\t\t企业日活跃详情\n\t\t\t\t<div class=\"header-opts\" style=\"margin-top:10px;\">\n\t\t\t\t\t<button id=\"btnQyrhyExel\" class=\"btn-exel\" data-permissions=\"F009071 F011058 F008092\">日活详情导出</button>\n\t\t\t\t\t<span id=\"downloaddayactive\" style=\"margin-right:75px;display:none;\"><a href=\"\" target=\"_blank\">下载日活详情</a></span>\n\t\t\t\t</div>\n\t\t\t\t</h3>\n\t\t\t</div>\n\t\t\t<div class=\"list-bar\">\n\t\t\t\t<div class=\"list-bar-btns\">\n\t\t\t\t\t<button id=\"btnSearch\" class=\"u-btn-blue\" data-permissions=\"F009072 F008091 F011057\">查询</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"list-bar-input active-list\">\n\t\t\t\t\t\n\t\t\t\t\t<label><span>企业账号</span>\n\t\t\t\t\t\t<input id=\"enterpriseAccount\" type=\"text\" class=\"g-ipt ipt-m enterpriseAccount\" onchange=\"this.value=this.value.toLowerCase( )\"/>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label><span>是否赠送办公版</span>\n\t\t\t\t\t\t<select id=\"enterpriseType\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label><span>销售人员</span>\n\t\t\t\t\t\t<input id=\"alCode\" type=\"text\" class=\"g-ipt ipt-m alName\" />\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"sp\">\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>开通时间</span>\n\t\t\t\t\t\t\t<input id=\"alCST\" type=\"text\" class=\"g-ipt ipt-l\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alCET\" type=\"text\" class=\"g-ipt ipt-l\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"sp\" >\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>活跃日期</span>\n\t\t\t\t\t\t\t<input id=\"alAST\" type=\"text\" class=\"g-ipt ipt-l start-active\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alAET\" type=\"text\" class=\"g-ipt ipt-l end-active\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>\n\t\t\t\t\t<br />\n\t\t\t\t\t<!--\n\t\t\t\t\t<p class=\"fn-list\">\n\t\t\t\t\t\t<button id=\"btnDownExel\" class=\"btn-blue btn-exel\">日活列表导出</button>\n\t\t\t\t\t</p>\n\t\t\t\t\t-->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<!--\n\t\t\t<div class=\"list-content\" style=\"text-align:right;\">\n\t\t\t\t<span id=\"downloaddayactive\" style=\"margin-right:75px;display:none;\"><a href=\"\" target=\"_blank\">下载日活列表</a></span>\n\t\t\t</div>\n\t\t\t-->\n\t\t\t\n\t\t\t<!--<div class=\"list-pager\">\n\t\t\t\t\n\t\t\t</div>-->\n\t\t\t<div class=\"list-exel\">\n\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"list-content\">\n\t\t\t<div class=\"u-tablebox\">\n\t\t\t\t<table>\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">销售员工</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:120px\">企业名称</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">开通时间</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">日期</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">最新开通数量</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">实际开通人数</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">登录人数</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">动作数</th>\n\t\t\t\t\t\t\t<th rowspan=\"2\" style=\"width:100px\">是否日活跃</th>\n\t\t\t\t\t\t\t<th colspan=\"15\" style=\"width:1200px\">日期区间使用功能次数</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th style=\"width:80px\">分享</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">日志</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">话题</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">审批</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">赞</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">回复</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">外勤签到</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">指令</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">考勤签到</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">日程</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">回执</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">新增客户</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">新增联系人</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">新增关注客户</th>\n\t\t\t\t\t\t\t<th style=\"width:80px\">新增共享联系人</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody ce-collection=\"list\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><%=item.salesName%></td>\n\t\t\t\t\t\t\t<td><%=item.eaName%></td>\n\t\t\t\t\t\t\t<td><%=item.openTime%></td>\n\t\t\t\t\t\t\t<td><%=item.day%></td>\n\t\t\t\t\t\t\t<td><%=item.launchCount%></td>\n\t\t\t\t\t\t\t<td><%=item.actualLaunchCount%></td>\n\t\t\t\t\t\t\t<td><%=item.loginCount%></td>\n\t\t\t\t\t\t\t<td><%=item.actionCount%></td>\n\t\t\t\t\t\t\t<td><%=item.isActivity? 'Y':'N' %></td>\n\t\t\t\t\t\t\t<td><%=item.shareCount%></td>\n\t\t\t\t\t\t\t<td><%=item.planCount%></td>\n\t\t\t\t\t\t\t<td><%=item.followTopicCount%></td>\n\t\t\t\t\t\t\t<td><%=item.approveCount%></td>\n\t\t\t\t\t\t\t<td><%=item.praiseCount%></td>\n\t\t\t\t\t\t\t<td><%=item.replyCount%></td>\n\t\t\t\t\t\t\t<td><%=item.waiqinqiandaoCount%></td>\n\t\t\t\t\t\t\t<td><%=item.workCount%></td>\n\t\t\t\t\t\t\t<td><%=item.kaoqinqiandaoCount%></td>\n\t\t\t\t\t\t\t<td><%=item.scheduleCount%></td>\n\t\t\t\t\t\t\t<td><%=item.receiptCount%></td>\n\t\t\t\t\t\t\t<td><%=item.addCustomerCount%></td>\n\t\t\t\t\t\t\t<td><%=item.addContactCount%></td>\n\t\t\t\t\t\t\t<td><%=item.customerFollowCount%></td>\n\t\t\t\t\t\t\t<td><%=item.shareContactCount%></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"act-pager\">\n\t\t\t\n\t\t</div>\n\t</div>\n</div>";
});