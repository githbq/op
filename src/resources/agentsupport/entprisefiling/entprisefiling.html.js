define(function(require, exports, module) {
    module.exports="<div class=\"p-entprisefiling-lst p-list\" js=\"true\">\n <div class=\"m-filinglist u-tablelist\">\n \t<div class=\"list-header\">\n <div class=\"header-opts\">\n <button class=\"add-filing btn-blue\" data-permissions=\"F009054\">上报备案企业</button>\n </div>\n <h3>备案企业列表</h3>\n \t</div>\n \t<div class=\"list-bar\">\n <div class=\"list-bar-btns\" style=\"width:200px;\">\n <!--<button class=\"export\">导出Excel</button>-->\n <button class=\"search\">查询</button>\n </div>\n \t\t<div class=\"list-bar-input\">\n \t\t\t<label for=\"\">\n \t\t\t\t<span>企业名称</span>\n \t\t\t\t<input type=\"text\" ce-model=\"enterpriseFilingName\">\n \t\t\t</label>\n\t\t\t\t<label for=\"\">\n \t\t\t\t<span>创建人姓名</span>\n \t\t\t\t<input type=\"text\" ce-model=\"creatorName\">\n \t\t\t</label>\n \t\t\t<label for=\"\">\n \t\t\t\t<span>申请时间</span>\n \t\t\t\t<input type=\"text\" class=\"startTime\">\n \t\t\t\t<span>到</span>\n \t\t\t\t<input type=\"text\" class=\"endTime\">\n \t\t\t</label>\n \t\t\t<label for=\"\">\n \t\t\t\t<span>状态</span>\n \t\t\t\t<select name=\"\" class=\"status\" ce-model=\"status\"></select>\n \t\t\t</label>\n <label for=\"\">\n <span>是否启用</span>\n <select name=\"\" ce-model=\"active\">\n <option value=\"\">全部</option>\n <option value=\"1\">已启用</option>\n <option value=\"0\">已停用</option>\n </select>\n </label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>行业</span>\n\t\t\t\t\t<select name=\"\" class=\"industry-data e-industry\" ce-model=\"industryList\" ></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>来源 </span>\n\t\t\t\t\t<select name=\"\" class=\"source-data e-source \" ce-model=\"sourceList\" ></select>\n\t\t\t\t</label>\n \t\t</div>\n \t</div>\n \t<div class=\"list-content\">\n \t\t<table>\n \t\t\t<thead>\n \t\t\t\t<tr>\n \t\t\t\t\t<th></th>\n \t\t\t\t\t<th style=\"width:300px\">企业</th>\n\t\t\t\t\t\t<th style=\"width:100px;\">创建人</th>\n \t\t\t\t\t<th style=\"width:100px;\">状态</th>\n\t\t\t\t\t\t<th style=\"width:200px;\">行业</th>\n\t\t\t\t\t\t<th style=\"width:100px;\">来源</th>\n \t\t\t\t\t<th style=\"width:100px;\">服务时间</th>\n \t\t\t\t\t<th style=\"width:120px;\">地址</th>\n \t\t\t\t\t<th style=\"width:140px;\">申请时间</th>\n \t\t\t\t\t<th style=\"width:153px;\">操作</th>\n \t\t\t\t\t<th></th>\n \t\t\t\t</tr>\n \t\t\t</thead>\n \t\t\t<tbody>\n \t\t\t\t<!-- -->\n \t\t\t</tbody>\n \t\t</table>\n \t</div>\n <div class=\"list-pager\">\n \n </div>\n </div>\n</div>\n";
});