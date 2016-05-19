define(function(require, exports, module) {
    module.exports="<div class=\"p-list\" js=\"true\">\r\n\t<div class=\"m-filinglist u-tablelist\">\r\n\t\t<div class=\"list-header\">\r\n\t\t\t<div class=\"header-opts\">\r\n\t\t\t\t<button class=\"action-openbatch\" data-permissions=\"F011033\">批量公开</button>\r\n\t\t\t\t<!--<button class=\"action-openall\">全部公开</button>-->\r\n\t\t\t</div>\r\n\t\t\t<h3>备案企业列表 <span class=\"header-title\"></span></h3>\r\n\t\t</div>\r\n\t\t<div class=\"list-bar\">\r\n\t\t\t<div class=\"list-bar-btns\">\r\n\t\t\t\t<button class=\"search\">查询</button>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"list-bar-input\">\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>企业名称</span>\r\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseName\">\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n \t\t\t\t<span>创建人姓名</span>\r\n \t\t\t\t<input type=\"text\" ce-model=\"creatorName\">\r\n \t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>申请时间</span>\r\n\t\t\t\t\t<input type=\"text\" class=\"startTime\"> 到 <input type=\"text\" class=\"endTime\">\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>优惠码</span>\r\n\t\t\t\t\t<input type=\"text\" ce-model=\"vendorId\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=8>\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>服务时长</span><input type=\"text\" ce-model=\"serviceTimeBegin\"> -- <input type=\"text\" ce-model=\"serviceTimeEnd\">月\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>企业状态</span>\r\n\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"status\" class=\"status\"></select>\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>是否启用</span>\r\n\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"active\">\r\n\t\t\t\t\t\t<option value=\"\">全部</option>\r\n\t\t\t\t\t\t<option value=\"1\">已启用</option>\r\n\t\t\t\t\t\t<option value=\"0\">已停用</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>行业</span>\r\n\t\t\t\t\t<select name=\"\" class=\"industry-data e-industry\" ce-model=\"industryList\" ></select>\r\n\t\t\t\t</label>\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>来源 </span>\r\n\t\t\t\t\t<select name=\"\" class=\"source-data e-source\" ce-model=\"sourceList\" ></select>\r\n\t\t\t\t</label>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"list-content\">\r\n\t\t\t<table>\r\n\t\t\t\t<thead>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t<th style=\"width:10px;\"></th>\r\n\t\t\t\t\t\t<th style=\"width:110px;\">企业</th>\r\n\t\t\t\t\t\t<th style=\"width:100px;\">创建人</th>\r\n\t\t\t\t\t\t<th style=\"width:110px;\">代理商</th>\r\n\t\t\t\t\t\t<th style=\"width:110px;\">企业状态</th>\r\n\t\t\t\t\t\t<th style=\"width:120px;\">行业</th>\r\n\t\t\t\t\t\t<th style=\"width:80px;\">来源</th>\r\n\t\t\t\t\t\t<th style=\"width:110px;\">服务时间</th>\r\n\t\t\t\t\t\t<th style=\"width:140px;\">地址</th>\r\n\t\t\t\t\t\t<th style=\"width:110px;\">申请时间</th>\r\n\t\t\t\t\t\t<th style=\"width:50px;\">是否启用</th>\r\n\t\t\t\t\t\t<th style=\"width:160px;\"></th>\r\n\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</thead>\r\n\t\t\t\t<tbody>\r\n\t\t\t\t\t<!---->\r\n\t\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div class=\"list-pager\">\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
});