define(function(require, exports, module) {
    module.exports="<div class=\"m-addenterprise\">\n\t<div class=\"enterprise-content\">\n\t\t<h3>免费企业注册</h3>\n\t\t<h4>基本信息</h4>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>企业名称 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"enterpriseName\" class=\"required enterpriseName\" disabled=\"disabled\">\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>区域</span>\n\t\t\t\t<input type=\"text\" class=\"regionName\" disabled=\"disabled\">\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>企业账号 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"enterpriseAccount\" class=\"required\" placeholder=\"不可更改!\">\n\t\t\t\t<span class=\"remind\">企业账号应为字母开头6-20位由字母数字的组合</span>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>地址 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"address\" class=\"required address\">\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>行业 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"e-industry required\" ce-model=\"industry\"></select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>来源 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"e-source required\" ce-model=\"source\"></select>\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>团队类型 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"e-group required\" ce-model=\"groupType\"></select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>省份 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"e-province required\" ce-model=\"province\"></select>\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>城市 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"city\" class=\"required\">\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>了解渠道 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"e-knowsource required\" ce-model=\"knowSource\"></select>\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>注册动机 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"e-motive required\" ce-model=\"registerMotive\"></select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>公司规模 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"companyscale required\" ce-model=\"companyScale\"></select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否有销售团队 <b>*</b></span>\n\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isSaleTeam\" class=\"required\">\n\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>销售团队规模 <b>*</b></span>\n\t\t\t\t<select name=\"\" class=\"saleteamscale required\" ce-model=\"saleTeamScale\"></select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否首面签约</span>\n\t\t\t\t<select name=\"\" ce-model=\"isFirstmeetingSign\">\n\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否会销 <b>*</b></span>\n\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isWillPin\" class=\"required\">\n\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否陌拜 <b>*</b></span>\n\t\t\t\t<select name=\"\" ce-model=\"isStrangerVisits\" class=\"required\">\n\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>成交周期(天)<b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"dealDays\" class=\"required\" placeholder=\"请填写数字\" onchange=\"this.value=this.value.replace(/\\D/g,'')\">\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否转介绍 <b>*</b></span>\n\t\t\t\t<select name=\"\" id=\"\" ce-model=\"isReferral\" class=\"required\">\n\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t</p>\n\t\t<h4>企业负责人</h4>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>企业负责人姓名 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"keyContactName\" class=\"required keyContactName\">\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>企业负责人电话 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"keyContactPhone\" class=\"required\" onchange=\"this.value=this.value.replace(/\\D/g,'')\">\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>企业负责人邮箱 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"keyContactEmail\" class=\"required\">\n\t\t\t</label>\n\t\t</p>\n\t\t<h4>纷享平台管理员</h4>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>平台管理员 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"contactName\" class=\"required\">\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>平台管理员手机 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"contactPhone\" class=\"required\" maxlength=\"11\" onchange=\"this.value=this.value.replace(/\\D/g,'')\">\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>平台管理员邮箱 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"contactEmail\" class=\"required\">\n\t\t\t</label>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>平台管理员QQ</span>\n\t\t\t\t<input type=\"text\" ce-model=\"contactim\">\n\t\t\t</label>\n\t\t</p>\n\t\t<h4>产品信息</h4>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>逍客终端总量(个)<b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"accountTotalAmount\" class=\" deviceamount\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" onafterpaste=\"this.value=this.value.replace(/\\D/g,'')\">\n\t\t\t</label>\n\t\t\t\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否赠送办公版 <b>*</b></span>\n\t\t\t\t<select name=\"\" ce-model=\"presentOfficeEdition\" class=\"required\">\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>空间总量(GB)<b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"storageTotalSpace\" class=\"required\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\">\n\t\t\t</label>\n\t\t\t<!--<label for=\"\">\n\t\t\t\t<span>是否付费 </span>\n\t\t\t\t<select name=\"\" ce-model=\"isPaid\" class=\"isPaid\" disabled='disabled'>\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t</select>\n\t\t\t</label>-->\n\t\t</p>\n\t\t<div>\n\t\t\t<hr/>\n\t\t\t<p >\n\t\t\t\t<label >\n\t\t\t\t\t<span><input type=\"checkbox\" style=\"width:22px;\" class=\"crm-check\"/>CRM</span>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>CRM总量(个)<b class=\"state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"crm-purchaseCount\" class=\" crm-control crm-num\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" onafterpaste=\"this.value=this.value.replace(/\\D/g,'')\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>金额<b class=\"state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"crm-purchaseAmount\" class=\"crm-control crm-money\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\" state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"crm-startTime crm-control\" ce-model=\"crm-startTime\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"crm-endTime crm-control\" ce-model=\"crm-endTime\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<span>捆绑纷享百川</span>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\"state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"baichuan-startTime \" ce-model=\"crm-startTime\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<span></span>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"baichuan-endTime \" ce-model=\"crm-endTime\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<span>捆绑报数系统</span>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\"state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"system-startTime \" ce-model=\"crm-startTime\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<span></span>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"state crm-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"system-endTime \" ce-model=\"crm-endTime\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<hr/>\n\t\t\t<p >\n\t\t\t\t<label >\n\t\t\t\t\t<span><input type=\"checkbox\" style=\"width:22px;\" class=\"pk-check\"/>PK助手</span>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>金额<b class=\"state pk-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"pk-control pk-purchaseAmount\" ce-model=\"pk-purchaseAmount\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\"state pk-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"pk-startTime pk-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"state pk-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"pk-endTime pk-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<hr/>\n\t\t\t<p >\n\t\t\t\t<label >\n\t\t\t\t\t<span><input type=\"checkbox\" style=\"width:22px;\" class=\"meet-check\"/>会议助手</span>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>金额<b class=\"state meet-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"meet-purchaseAmount\" class=\"meet-control meet-purchaseAmount\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\"state meet-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"meet-startTime meet-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"state meet-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"meet-endTime meet-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<hr/>\n\t\t\t<p >\n\t\t\t\t<label >\n\t\t\t\t\t<span><input type=\"checkbox\" style=\"width:22px;\" class=\"hr-check\"/>HR助手</span>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>金额<b class=\"state hr-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"hr-purchaseAmount\" class=\"hr-control hr-purchaseAmount\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\"state hr-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"hr-startTime hr-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"state hr-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"hr-endTime hr-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<hr/>\n\t\t\t<p >\n\t\t\t\t<label >\n\t\t\t\t\t<span><input type=\"checkbox\" style=\"width:22px;\" class=\"pay-check\"/>工资助手</span>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>金额<b class=\"state pay-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"pay-purchaseAmount\" class=\"pay-control pay-purchaseAmount\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>开始时间<b class=\"state pay-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"pay-startTime pay-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>结束时间<b class=\"state pay-show\">*</b></span>\n\t\t\t\t\t<input type=\"text\" class=\"pay-endTime pay-control\" disabled=disabled>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<hr/>\n\t\t</div>\n\t\t<p class=\"state state-pay\">\n\t\t\t<label for=\"\">\n\t\t\t\t<span>合同照片<b>*</b></span>\n\t\t\t\t<input type=\"file\" accept=\"image/*\"/ class=\"contract\">（支持.png,.jpg,.gif格式）\n\t\t\t</label>\n\t\t</p>\n\t\t<p class=\"state-pay\">\n\t\t\t<label for=\"\">\n\t\t\t\t<span>合同副本照片(可选)</span>\n\t\t\t\t<input type=\"file\" accept=\"image/*\"/ class=\"contractCopy\">（支持.png,.jpg,.gif格式）\n\t\t\t</label>\n\t\t</p>\n\t\t<p class=\"state state-pay\">\n\t\t\t<label for=\"\">\n\t\t\t\t<span>合同金额(￥)<b>*</b></span>\n\t\t\t<input type=\"text\" ce-model=\"contractPrice\" class=\"contractprice required\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\">(*包含名片费用)\n\t\t\t</label>\n\t\t</p>\n\t\t<p class=\"state state-pay\">\n\t\t\t<label for=\"\">\n\t\t\t\t<span>发票抬头 <b>*</b></span>\n\t\t\t\t<input type=\"text\" ce-model=\"invoiceTitle\" class=\"required\">\n\t\t\t</label>\n\t\t</p>\n\t\t<!--<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>合同开始时间<b>*</b></span>\n\t\t\t\t<input type=\"text\" class=\"startTime\" ce-model=\"startTime\" onkeyup='this.value=\"\"'>\n\t\t\t\t<span>合同结束时间<b>*</b></span>\n\t\t\t\t<input type=\"text\" class=\"endTime\" ce-model=\"endTime\" onkeyup='this.value=\"\"'>\n \t\t</label>\n\t\t</p>-->\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>是否使用名片 <b>*</b></span>\n\t\t\t\t<select name=\"\" ce-model=\"useBusinessCard\" class=\"required useBusinessCard\" >\n\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t\t<label for=\"\" class=\"card-price\" style=\"display:none;\">\n\t\t\t\t<span>名片金额</span>\n\t\t\t\t<input type=\"text\" ce-model=\"cardPrice\" class=\"\" disabled='disabled'>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>折扣 </span>\n\t\t\t\t<input type=\"text\" ce-model=\"discount\" class=\"\" disabled='disabled'>\n\t\t\t</label>\n\t\t</p>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<span>营业执照照片</span>\n\t\t\t\t<input name=\"imgfile\" type=\"file\" accept=\"image/*\" class=\"businessLicense\">（支持.png,.jpg,.gif格式）\n \t\t</label>\n\t\t</p>\n\t\t<div style=\"border:1px solid #ccc; padding:15px;\">\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>门头照片</span>\n\t\t\t\t\t<input name=\"imgfile\" type=\"file\" accept=\"image/*\" class=\"companyGate\">（支持.png,.jpg,.gif格式）\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>门头照片关键字</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"companyGateKeyword\" class=\"companyGateKeyword\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>门头照片备注</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"companyGateRemark\" class=\"companyGateRemark\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t</div>\n\t\t<h4>备注</h4>\n\t\t<p>\n\t\t\t<label for=\"\">\n\t\t\t\t<textarea name=\"\" ce-model=\"remark\"></textarea>\n\t\t\t</label>\n\t\t\t\n\t\t</p>\n\t</div>\n\t<div class=\"enterprise-action clearfix\">\n\t\t\n\t\t<button class=\"action-add btn-blue\">提交</button>\n\t\t<button class=\"action-cancel\">取消</button>\n\t</div>\n</div>\n\n\n";
});