define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trTpl\">\n <% _.each( content, function( item ){ %>\n <tr>\n <td></td>\n <td> <%=item.enterpriseName%> </td>\n <td> <%=item.enterpriseAccount%> </td>\n <td> <%=item.industryStr%> </td>\n\t\t\t<td style=\"display:none;\"> <%=item.filingStatusStr%> </td>\n <td> <%=item.contactName%> , <%=item.contactPhone%> , <%=item.contactEmail%> , <%=item.contactIM%> </td>\n <td> \n <a data-id=\"<%=item.enterpriseId%>\" class=\"detail\">查看</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n <a data-id=\"<%=item.enterpriseId%>\" class=\"assgin\" data-permissions=\"F009089\">分配</a>\n <!--<a data-id=\"<%=item.id%>\" class=\"renew\">增购续费</a>-->\n </td>\n <td></td>\n </tr>\n <% } )%>\n</script>\n<script type=\"text/template\" id=\"customerLookTem\">\n<div class=\"m-addenterprise\">\n\t<div class=\"enterprise-content\">\n\t\t<div class=\"info-box\">\n\t\t\t<h4>基本信息</h4>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业名称 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseName\" class=\"required enterpriseName\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业账号 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseAccount\" class=\"required\" placeholder=\"不可更改!\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业简称 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseShortName\" class=\"required\" placeholder=\"用于手机短消息签名\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>地址 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"address\" class=\"required address\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>行业</span>\n\t\t\t\t\t<select name=\"\" class=\"e-industry required\" ce-model=\"industry\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>来源 </span>\n\t\t\t\t\t<select name=\"\" class=\"e-source required\" ce-model=\"source\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>省市 </span>\n\t\t\t\t\t<select name=\"\" class=\"e-province required\" ce-model=\"province\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>团队类型</span>\n\t\t\t\t\t<select name=\"\" class=\"e-group required\" ce-model=\"groupType\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>了解渠道 </span>\n\t\t\t\t\t<select name=\"\" class=\"e-knowsource required\" ce-model=\"knowSource\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>注册动机</span>\n\t\t\t\t\t<select name=\"\" class=\"e-motive required\" ce-model=\"registerMotive\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>公司规模 </span>\n\t\t\t\t\t<select name=\"\" class=\"companyscale required\" ce-model=\"companyScale\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否有销售团队 </span>\n\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isSaleTeam\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>销售团队规模 </span>\n\t\t\t\t\t<select name=\"\" class=\"saleteamscale required\" ce-model=\"saleTeamScale\" disabled=\"disabled\"></select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否首面签约 </span>\n\t\t\t\t\t<select name=\"\" ce-model=\"isFirstmeetingSign\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否会销 </span>\n\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isWillPin\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否陌拜 </span>\n\t\t\t\t\t<select name=\"\" ce-model=\"isStrangerVisits\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>城市 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"city\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否快速签约 </span>\n\t\t\t\t\t<select name=\"\" ce-model=\"isFastSign\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>成交周期(天) </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"dealDays\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否高压锅 </span>\n\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isAutoClave\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>高压周期(天)</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"autoclaveDays\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>是否转介绍 </span>\n\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isReferral\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<h4>企业负责人</h4>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业负责人姓名 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"keyContactName\" class=\"required keyContactName\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业负责人电话 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"keyContactPhone\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业负责人邮箱 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"keyContactEmail\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<h4>纷享平台管理员</h4>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>平台管理员 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"contactName\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>平台管理员电话 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"contactPhone\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>平台管理员邮箱 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"contactEmail\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>平台管理员QQ</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"contactim\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<h4>产品信息</h4>\n\t\t\t<p style=\"display:none;\">\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>产品 </span>\n\t\t\t\t\t<select name=\"\" class=\"content-product \" disabled=\"disabled\" ce-model=\"productId\">\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>逍客终端总量(个)</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"accountTotalAmount\" class=\"required deviceamount\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>短信总量(条)</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"smsTotalAmount\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>空间总量(GB)</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"storageTotalSpace\" class=\"required\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t\n\t\t\t<p class=\" state-pay\">\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>年限</span>\n\t\t\t\t\t<select ce-model=\"yearLimit\" class=\"yearlimit\" disabled=\"disabled\">\n\t\t\t\t\t\t<option value=\"1\">1</option>\n\t\t\t\t\t\t<option value=\"2\">2</option>\n\t\t\t\t\t\t<option value=\"3\">3</option>\n\t\t\t\t\t\t<option value=\"4\">4</option>\n\t\t\t\t\t\t<option value=\"5\">5</option>\n\t\t\t\t\t\t<option value=\"6\">6</option>\n\t\t\t\t\t\t<option value=\"7\">7</option>\n\t\t\t\t\t\t<option value=\"8\">8</option>\n\t\t\t\t\t\t<option value=\"9\">9</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>合同金额(￥) </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"contractPrice\" class=\"contractprice\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p class=\" state-pay\">\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>折扣 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"discount\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>发票抬头 </span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"invoiceTitle\" disabled=\"disabled\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<!--<h4>备注</h4>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<textarea name=\"\" ce-model=\"remark\"></textarea>\n\t\t\t\t</label>\n\t\t\t</p>-->\n\t\t</div>\n\t\t\n\t</div>\n\t<div class=\"enterprise-action clearfix\" style=\"display:none;\">\n\t\t<button class=\" save-fn btn-blue\">保存</button>\n\t</div>\n</div>\n</script>\n\n<script type=\"text/template\" id=\"assignEntInfo\">\n\t<div class=\"m-assignEntInfo u-slider u-tablelist\" id=\"agentId\" data-agent=''>\n\t\t<table class=\" assign-ent-Info\">\n\t\t <thead>\n\t\t\t<tr>\n\t\t\t <th style=\"width:170px;\">渠道</th>\n\t\t\t <th>操作</th>\n\t\t\t</tr>\n\t\t </thead>\n\t\t <tbody>\n\t\n\t\t </tbody>\n\t\t</table>\n\t</div>\n</script>\n\n\n\n\n\n";
});