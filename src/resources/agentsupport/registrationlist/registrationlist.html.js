define(function(require, exports, module) {
    module.exports="<div class=\"p-vendorRegList p-list\" js=\"true\">\n <div class=\"m-vendorReg u-tablelist\">\n \t<div class=\"list-header\">\n \t\t<h3>\n \t\t\t自注册企业列表\n \t\t</h3>\n \t</div>\n \t<div class=\"list-bar\">\n <div class=\"list-bar-btns\">\n <button class=\"search\">查询</button>\n </div>\n \t\t<div class=\"list-bar-input\">\n \t\t\t<label for=\"\">\n \t\t\t\t<span>来源</span>\n \t\t\t\t<select name=\"\" id=\"\" class=\"sourceEnum\" ce-model=\"source\">\n \t\t\t\t</select>\n \t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>账号</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseAccount\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>企业团队</span>\n\t\t\t\t\t<input type=\"text\" ce-model=\"enterpriseName\">\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>省市</span>\n\t\t\t\t\t<select name=\"\" id=\"\" class=\"provinceEnum\" ce-model=\"province\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>状态</span>\n\t\t\t\t\t<select name=\"\" id=\"\" class=\"statusEnum\" ce-model=\"status\"></select>\n\t\t\t\t</label>\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>注册时间</span>\n\t\t\t\t\t<input type=\"text\" class=\"startTime\"> 到 <input type=\"text\" class=\"endTime\">\n\t\t\t\t</label>\n \t\t</div>\n \t</div>\n \t<div class=\"list-content\">\n \t\t<table>\n \t\t\t<thead>\n \t\t\t\t<tr>\n \t\t\t\t\t<th></th>\n \t\t\t\t\t<th>企业</th>\n \t\t\t\t\t<th style=\"width:110px;\">账号</th>\n \t\t\t\t\t<th style=\"width:80px;\">来源</th>\n \t\t\t\t\t<th style=\"width:110px;\">状态</th>\n \t\t\t\t\t<th style=\"width:110px;\">省市</th>\n \t\t\t\t\t<th style=\"width:160px;\">注册时间</th>\n <th style=\"width:80px;\"></th>\n \t\t\t\t\t<th></th>\n \t\t\t\t</tr>\n \t\t\t</thead>\n \t\t\t<tbody>\n \t\t\t\t<!-- -->\n \t\t\t</tbody>\n \t\t</table>\n \t</div>\n \t<div class=\"list-pager\">\n \t\t\n \t</div>\n </div>\n</div>\n";
});