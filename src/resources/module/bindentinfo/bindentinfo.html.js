define(function(require, exports, module) {
    module.exports="<div class=\"m-openapproval u-tablelist\" style=\"padding:20px; width:680px;\">\r\n\t<h4 style=\"border-bottom:1px solid #ccc;\">关联自注册</h4>\r\n\t<div class=\"left-info\">\r\n\t\t<h4 >备案企业</h4>\r\n\t\t\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>企业名称 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"enterpriseName\" name=\"enterpriseName\" class=\"status-disabled \" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>地址 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"address\" class=\"status-disabled \" name=\"address\" disabled=\"disabled\" >\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>区域 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"region\" name=\"region\" class=\"status-disabled filing-region \" onkeyup='this.value=\"\"' disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\" >\r\n\t\t\t\t<span>法定代表人</span> \r\n\t\t\t\t<input type=\"text\" ce-model=\"representative\" name=\"representative\" class=\"status-disabled\" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>行业 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<select name=\"\" class=\"status-disabled e-industry \" ce-model=\"industry\" name=\"industry\" disabled=\"disabled\"></select>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>来源 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<select name=\"\" class=\"status-disabled e-source \" ce-model=\"source\" name=\"source\" disabled=\"disabled\"></select>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>联系人<b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"contactName\" name=\"contactName\" class=\"status-disabled \" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>联系人职位<b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"contactPost\" name=\"contactPost\" class=\"status-disabled \" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n <span>联系电话 <b class=\"state state-current\">*</b></span>\r\n <input type=\"text\" ce-model=\"contactPhone\" name=\"contactPhone\" class=\"status-disabled \" onchange=\"this.value=this.value.replace(/\\D/g,'')\" disabled=\"disabled\">\r\n </label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>联系人邮件</span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"contactEmail\" name=\"contactEmail\" class=\"status-disabled checked-email\" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>备注</span>\r\n\t\t\t\t<textarea name=\"\" id=\"\" ce-model=\"remark\" name=\"remark\" class=\"status-disabled\" disabled=\"disabled\"></textarea>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t\r\n\t\t\r\n\t\t<h4>申请信息</h4>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>姓名</span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"creatorName\" name=\"creatorName\" class=\"\" disabled=\"disabled\">\r\n\t\t\t</label>\t\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>登录名</span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"creatorUserName\" name=\"creatorUserName\" class=\"\" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\r\n\t\t<p>\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>状态 </span>\r\n\t\t\t\t<select name=\"\" class=\"firm-status operat-input\" ce-model=\"firmStatus\" disabled=\"disabled\">\r\n\t\t\t\t\t\r\n\t\t\t\t</select>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t\r\n\t\t<h4>企业跟进信息</h4>\r\n\t\t<p>\r\n\t\t\t<label for=\"\" class=\"\" style=\"margin-top:10px;\">\r\n\t\t\t\t<span>公司人数<b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"accountAmount\" name=\"accountAmount\" class=\"status-disabled \" onchange=\"this.value=this.value.replace(/\\D/g,'')\" onafterpaste=\"this.value=this.value.replace(/\\D/g,'')\" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\" class=\"\" style=\"margin-top:10px;\">\r\n\t\t\t\t<span>开通人数<b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"employeeNumber\" name=\"employeeNumber\" class=\"status-disabled \" onchange=\"this.value=this.value.replace(/\\D/g,'')\" onafterpaste=\"this.value=this.value.replace(/\\D/g,'')\" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\" class=\"\" style=\"margin-top:10px;\">\r\n\t\t\t\t<span>法定代表人电话 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"kpPhone\" name=\"kpPhone\" class=\"status-disabled \" onchange=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=\"11\" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p>\r\n\t\t\t<label for=\"\" class=\"\" style=\"margin-top:10px;\">\r\n\t\t\t\t<span>拜访时间 <b class=\"state state-current\">*</b></span>\r\n\t\t\t\t<input type=\"text\" ce-model=\"visitTime\" name=\"visitTime\" class=\"status-disabled visite-time \" disabled=\"disabled\">\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<h4>产品信息</h4>\r\n\t\t\t<p class=\"state-pay\">\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>合同照片<b>*</b></span>\r\n\t\t\t\t\t<input type=\"file\" accept=\"image/*\"/ class=\"contract\">（支持.png,.jpg,.gif格式）\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p class=\"state-pay\">\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>合同副本照片(可选)</span>\r\n\t\t\t\t\t<input type=\"file\" accept=\"image/*\"/ class=\"contractCopy\">（支持.png,.jpg,.gif格式）\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>培训服务费 <b>*</b></span>\r\n\t\t\t\t\t<select name=\"personCount\" ce-model=\"personCount\" class=\"personCount required\">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t</select>\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>收款金额<b>*</b></span>\r\n\t\t\t\t\t<input type=\"text\" ce-model=\"serviceChargeAmount\" maxlength=6 name=\"serviceChargeAmount\" class=\"serviceChargeAmount required\" onchange=\"this.value=this.value.replace(/[^\\.\\d]/g,'')\">\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>发票抬头<b>*</b></span>\r\n\t\t\t\t\t<input type=\"text\" ce-model=\"invoiceHead\" class=\"required\" name=\"invoiceHead\" maxlength=100 style=\"width:500px;\">\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>打款人<b>*</b></span>\r\n\t\t\t\t\t<input type=\"text\" ce-model=\"payerName\" name=\"payerName\" class=\"required\" maxlength=100 style=\"width:500px;\">\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>打款日期<b>*</b></span>\r\n\t\t\t\t\t<input type=\"text\" class=\"money-date \" onkeyup='this.value=\"\"'>\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>合同开始时间<b>*</b></span>\r\n\t\t\t\t\t<input type=\"text\" class=\"startTime\" ce-model=\"startTime\" onkeyup='this.value=\"\"'>\r\n\t\t\t\t\t<span>合同结束时间<b>*</b></span>\r\n\t\t\t\t\t<input type=\"text\" class=\"endTime\" ce-model=\"endTime\" onkeyup='this.value=\"\"'>\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>营业执照照片</span>\r\n\t\t\t\t\t<input name=\"imgfile\" type=\"file\" accept=\"image/*\" class=\"yyzhizhao\">（支持.png,.jpg,.gif格式）\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<div style=\"border:1px solid #ccc; padding:15px;\">\r\n\t\t\t\t<p>\r\n\t\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t\t<span>门头照片</span>\r\n\t\t\t\t\t\t<input name=\"imgfile\" type=\"file\" accept=\"image/*\" class=\"mtzhizhao\">（支持.png,.jpg,.gif格式）\r\n\t\t\t\t\t</label>\r\n\t\t\t\t</p>\r\n\t\t\t\t<p>\r\n\t\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t\t<span>门头照片关键字</span>\r\n\t\t\t\t\t\t<input type=\"text\" ce-model=\"companyGateKeyword\" class=\"companyGateKeyword\">\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t\t<span>门头照片备注</span>\r\n\t\t\t\t\t\t<input type=\"text\" ce-model=\"companyGateRemark\" class=\"companyGateRemark \">\r\n\t\t\t\t\t</label>\r\n\t\t\t\t</p>\r\n\t\t\t</div>\r\n\t\t\t<h4>备注</h4>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<textarea name=\"\" ce-model=\"remark\"></textarea>\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\t\t<div class=\" clearfix\" style=\"text-align:center;\">\r\n\t\t\t<button class=\"action-cancel\">取消</button>\r\n\t\t\t<button class=\"action-add btn-blue\">提交</button>\r\n\t\t</div>\r\n\t\t\r\n\t</div>\r\n\r\n\t\r\n</div>\r\n\r\n";
});